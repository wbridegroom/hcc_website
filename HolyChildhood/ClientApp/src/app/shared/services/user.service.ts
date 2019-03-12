import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { User } from '../models/user';
import {Observable} from 'rxjs';


const options = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) { }

    getUsers(): Observable<User[]> {
        const url = '/api/account';
        return this.http.get<User[]>(url);
    }

    getUser(username: string): Observable<User> {
        const url = `/api/account/${username}`;
        return this.http.get<User>(url);
    }

    createUser(user: User) {
        const url = '/api/account';
        return this.http.post<User>(url, user, options);
    }

    saveUser(user: User) {
        const url = `/api/account`;
        return this.http.put(url, user, options);
    }

    deleteUser(user: User) {
        const url = `/api/account/${user.userName}`;
        return this.http.delete(url);
    }

    changePassword(userName, passwordModel) {
        const url = `/api/account/changepassword/${userName}`;
        return this.http.post(url, passwordModel, options);
    }

    resetPassword(userName, passwordModel) {
        const url = `/api/account/resetpassword/${userName}`;
        return this.http.post(url, passwordModel, options);
    }
}
