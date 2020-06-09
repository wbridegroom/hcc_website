import {action, observable} from "mobx";
import axios from 'axios';
import {Menu} from "../../models/Menu";
import {DomainStore} from "../DomainStore";

const baseUrl = 'http://localhost:57084';

export class NavStore {

    domainStore: DomainStore;

    constructor(domainStore: DomainStore) {
        this.domainStore = domainStore;
    }

    @observable
    menus: Menu[] = [];

    @action
    loadMenu = async () => {
        const response = await axios.get(`${baseUrl}/api/menu`);
        this.menus = response.data;
    };

    @action
    addMenu = async(name: string) => {
        const token = this.domainStore.authStore.auth.token;
        const config = {headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }};
        const url = `${baseUrl}/api/menu`;
        const data = {
            name: name
        } as Menu;
        await axios.post<Menu>(url, data, config);
        await this.loadMenu();
    };

    @action
    deleteMenu = async(id: number) => {
        const token = this.domainStore.authStore.auth.token;
        const config = {headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }};
        const url = `${baseUrl}/api/menu/${id}`;
        await axios.delete(url, config);
        await this.loadMenu();
    }

    @action
    saveMenu = async(menu: Menu) => {
        const token = this.domainStore.authStore.auth.token;
        const config = {headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }};
        const url = `${baseUrl}/api/menu/${menu.id}`;
        await axios.put<Menu>(url, menu, config);
        await this.loadMenu();
    }
}
