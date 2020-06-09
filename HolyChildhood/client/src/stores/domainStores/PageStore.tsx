import {action, observable} from "mobx";
import axios from 'axios';
import {Page} from "../../models/Page";
import {DomainStore} from "../DomainStore";
import {Menu} from "../../models/Menu";

const baseUrl = 'http://localhost:57084';

export class PageStore {

    domainStore: DomainStore;

    constructor(domainStore: DomainStore) {
        this.domainStore = domainStore;
    }

    @observable
    page: Page = {} as Page;

    @action
    loadPage = async (id: number | string) => {
        const config = {headers: { 'Content-Type': 'application/json' }};
        const url = `${baseUrl}/api/page/${id}`;
        const response = await axios.get(url, config);
        this.page = response.data;
    };


    @action
    addPage = async (title: string, menu: null | Menu) => {
        const token = this.domainStore.authStore.auth.token;
        const config = {headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }};
        const url = `${baseUrl}/api/page`;
        const data = {
            title: title,
            menuItemId: menu ? menu.id : 0,
            index: menu ? menu.pages.length : 0
        }

        const response = await axios.post(url, data, config);
        const page = response.data as Page;
        await this.domainStore.navStore.loadMenu();
        return page;
    }

    @action
    addSubPage = async (page: Page, title: string) => {
        const token = this.domainStore.authStore.auth.token;
        const config = {headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }};
        const url = `${baseUrl}/api/page`;
        const data = {
            title: title,
            parent: page,
        }
        await axios.post(url, data, config);
        await this.loadPage(page.id);
    }

    @action
    updatePage = async (page: Page) => {
        const token = this.domainStore.authStore.auth.token;
        const config = {headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }};
        const url = `${baseUrl}/api/page/${page.id}`;

        await axios.put(url, page, config);
        await this.domainStore.navStore.loadMenu();
        await this.loadPage(page.id);
    }

    @action
    deletePage = async (page: Page) => {
        const token = this.domainStore.authStore.auth.token;
        const config = {headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }};
        const url = `${baseUrl}/api/page/${page.id}`;
        await axios.delete(url, config);
        if (page.parent === null) {
            await this.domainStore.navStore.loadMenu();
        }
    };
}
