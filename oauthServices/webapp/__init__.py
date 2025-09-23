# python standard libraries
import os
import sqlite3

# 3rd party libs
from flask import Flask
from dotenv import load_dotenv

# local imports

load_dotenv()


def create_app():
    """
    main function that sets up the application
    """
    app = Flask(__name__)
    # Interesting way to put it:
    # https://realpython.com/flask-database/#hide-your-secrets
    app.config.from_prefixed_env()

    # import and initialize the db
    from . import db

    try:
        db.init_app(app)
    except sqlite3.OperationalError as e:
        print(f"An error occurred while creating the database: {e}")

    # register app blueprints
    from .oauth import oauth

    app.register_blueprint(oauth, url_prefix="/oauth")

    print(f"Current Environment: {os.getenv('ENVIRONMENT')}")
    print(f"Using database: {app.config.get('DATABASE')}")

    return app
