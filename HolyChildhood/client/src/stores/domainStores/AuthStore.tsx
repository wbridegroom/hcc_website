import {action, computed, observable, reaction} from "mobx";
import axios from 'axios';
import {Auth} from "../../models/Auth";

const baseUrl = 'https://www.holychildhoodchurch.com';

export class AuthStore {
    @observable
    auth: Auth = {} as Auth;

    @observable
    edit: boolean = false;

    constructor() {
        const auth = window.localStorage.getItem('auth');
        if (auth) {
            this.auth = JSON.parse(auth);
        }

        reaction(
            () => this.auth, auth => {
                if (auth && auth.token) {
                    window.localStorage.setItem('auth', JSON.stringify(auth));
                } else {
                    window.localStorage.removeItem('auth');
                }
            }
        );
    }

    @action
    login = async (username: string, password: string) => {
        const url = `${baseUrl}/api/token/auth`;
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
        this.edit = false;
    };

    @action
    setEdit = (edit: boolean) => {
        this.edit = edit;
    };

    isInRole(role: string) : boolean {
        return this.auth.roles && this.auth.roles.indexOf(role) >= 0;
    }

    @computed
    get isAdministrator(): boolean {
        return this.isInRole('Administrator');
    }

    @computed
    get isEditor(): boolean {
        return this.isInRole('Editor');
    }
}


