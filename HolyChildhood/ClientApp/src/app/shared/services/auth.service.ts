import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

    authKey = 'auth';
    editKey = 'edit';
    clientId = 'hcweb';

    constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any, private router: Router) { }

    login(username: string, password: string): Observable<any> {
        const url = 'api/token/auth';
        const data = {
            username: username,
            password: password,
            clientId: this.clientId,
            grantType: 'password',
            scope: 'offline_access profile email'
        };
        return this.http.post<TokenResponse>(url, data);
    }

    logout(): boolean {
        this.setAuth(null);
        this.setEdit(false);
        this.router.navigateByUrl('/home').then(() => {
            return true;
        });
        return false;
    }

    isLoggedIn(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem(this.authKey) != null;
        }
        return false;
    }

    getAuth(): TokenResponse | null {
        if (isPlatformBrowser(this.platformId)) {
            const i = localStorage.getItem(this.authKey);
            if (i) {
                return JSON.parse(i);
            }
        }
    }

    setAuth(auth: TokenResponse | null): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (auth) {
                localStorage.setItem(this.authKey, JSON.stringify(auth));
            } else {
                localStorage.removeItem(this.authKey);
            }
        }
        return true;
    }

    isInRole(role: string): boolean {
        const auth = this.getAuth();
        return auth.roles.indexOf(role) >= 0;
    }

    isAdministrator(): boolean {
        return this.isInRole('Administrator');
    }

    isEditor(): boolean {
        return this.isInRole('Editor');
    }

    setEdit(editOn: boolean) {
        if (editOn) {
            localStorage.setItem(this.editKey, JSON.stringify(editOn));
        } else {
            localStorage.removeItem(this.editKey);
        }

    }

    isEdit(): boolean {
        return localStorage.getItem(this.editKey) != null;
    }
}
