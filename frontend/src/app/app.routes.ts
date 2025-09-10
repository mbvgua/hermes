import { Routes } from '@angular/router';
import { Homepage } from './components/homepage/homepage';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: Homepage,
    title: 'Homepage',
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./components/login/login').then((m) => m.Login),
        title: 'Login',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./components/register/register').then((m) => m.Register),
        title: 'Register',
      },
    ],
  },
  {
    path: 'dashboard',
    //canActivate: [authGuard],
    loadComponent: () =>
      import('./components/dashboard/dashboard').then((m) => m.Dashboard),
    title: 'Dashboard',
    children: [
      {
        path: 'panel/:id',
        loadComponent: () =>
          import('./components/dashboard/panel/panel.component').then(
            (m) => m.PanelComponent,
          ),
        title: 'Main Panel',
      },
      {
        path: 'profile/:id',
        loadComponent: () =>
          import('./components/dashboard/profile/profile').then(
            (m) => m.Profile,
          ),
        title: 'Profile',
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import(
            './components/dashboard/notifications/notifications.component'
          ).then((m) => m.NotificationsComponent),
        title: 'Notifications',
      },
    ],
  },
  {
    path: 'contact-us',
    loadComponent: () =>
      import('./components/contact-us/contact-us').then((m) => m.ContactUs),
    title: 'Contact Us',
  },
  // app redirects
  { path: 'index', redirectTo: '' },
  { path: 'home', redirectTo: '' },
  { path: 'login', redirectTo: 'auth/login' },
  { path: 'register', redirectTo: 'auth/register' },
  { path: 'signup', redirectTo: 'auth/register' },
  { path: 'signin', redirectTo: 'auth/login' },

  //errors in the app
  {
    path: 'error-500',
    loadComponent: () =>
      import('./components/errors/error-500/error-500').then((m) => m.Error500),
    title: 'Internal Server Error',
  },
  // wildcard to catch non-existent routes
  {
    path: '**',
    loadComponent: () =>
      import('./components/errors/error-404/error-404').then((m) => m.Error404),
    title: 'Not Found',
  },
];
