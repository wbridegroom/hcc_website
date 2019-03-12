import { RouterModule, Routes } from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './ui/login/login.component';
import {PageComponent} from './pages/page/page.component';
import {SettingsComponent} from './settings/settings.component';
import {ProfileComponent} from './profile/profile.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full'},
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'pages/:id', component: PageComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'profile', component: ProfileComponent }
];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);
