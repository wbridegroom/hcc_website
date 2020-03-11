import {action, observable} from "mobx";
import axios from 'axios';

export class AuthStore {
    @observable
    auth: Auth = {} as Auth;

    @action
    login = async (username: string, password: string) => {
        const url = "/api/token/auth";
        const data = {
            username: username,
            password: password,
            clientId: 'hcweb',
            grantType: 'password',
            scope: 'offline_access profile email'
        };
        const response = await axios.post<Auth>(url, data);
        this.auth = response.data;
    };

    @action
    logout = () => {
        this.auth = {} as Auth;
    }

}

export interface Auth {
    token: string;
    expiration: number;
    userName: string;
    fullName: string;
    roles: string[];
}
