import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { Error404Component } from './components/error-404/error-404.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';

export const routes: Routes = [
    {path:'', component:DashboardComponent},
    {path:'auth', children:
        [
            {path:'register', component:RegisterComponent},
            {path:'login', component:LoginComponent},
        ]
    },
    {path:'contact-us', component:ContactUsComponent},
    {path:'**',component:Error404Component}
];
