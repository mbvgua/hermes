import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { pool } from './db.config';
import { IUsers, UserRoles } from '../api/models/users.models';
import { logger } from './winston.config';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/v1/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id: googleId, displayName: username, emails } = profile;
        const email = emails?.[0]?.value;

        if (!email) {
          return done(new Error('No email provided by Google'));
        }

        // Check if user exists
        const [rows] = await pool.query(
          'SELECT * FROM users WHERE google_id = ? OR email = ?',
          [googleId, email]
        );
        let user = (rows as IUsers[])[0];

        if (user) {
          // Update google_id if not set
          if (!user.google_id) {
            await pool.query('UPDATE users SET google_id = ? WHERE id = ?', [googleId, user.id]);
          }
        } else {
          // Create new user
          const role = UserRoles.Customer;
          const [result] = await pool.query(
            'INSERT INTO users (username, email, google_id, role) VALUES (?, ?, ?, ?)',
            [username, email, googleId, role]
          );
          const [newUserRows] = await pool.query('SELECT * FROM users WHERE id = ?', [(result as any).insertId]);
          user = (newUserRows as IUsers[])[0];
        }

        logger.log({
          level: 'info',
          message: `${user.username} logged in via Google OAuth`,
        });

        return done(null, user);
      } catch (error) {
        logger.log({
          level: 'error',
          message: 'Google OAuth error',
          data: { error },
        });
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    const user = (rows as IUsers[])[0];
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;