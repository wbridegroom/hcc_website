import { Injectable, Injector } from '@angular/core';
import { HttpHandler, HttpEvent, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor (private injector: Injector) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const auth = this.injector.get(AuthService);
        if (auth.isLoggedIn) {
            const token = auth.getAuth();
            if (token) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token.token}`
                    }
                });
            }
            return next.handle(request);
        }
    }
}
