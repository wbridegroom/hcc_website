import { RouterModule, Routes } from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {HomeComponent} from './home/home.module';
import {LoginComponent} from './ui/login/login.component';
import {PageComponent} from './pages/page/page.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full'},
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'pages/:id', component: PageComponent }
];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);
