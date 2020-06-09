import {DomainStore} from "../DomainStore";
import {action} from "mobx";
import axios from 'axios';
import { PageContent, TextContent } from "../../models/PageContent";

const baseUrl = 'http://localhost:57084';

export class ContentStore {
    domainStore: DomainStore;

    constructor(domainStore: DomainStore) {
        this.domainStore = domainStore;
    }

    @action
    getTextContent = async (id: number | string) => {
        const config = {headers: { 'Content-Type': 'application/json'}};
        const url = `${baseUrl}/api/textcontent/${id}`;
        const response = await axios.get(url, config);
        return response.data as TextContent;
    };

    @action
    addContent = async (pageId: number | string, content: PageContent) => {
        const token = this.domainStore.authStore.auth.token;
        const config = {headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }};
        const url = `${baseUrl}/api/pagecontent`;

        await axios.post(url, content, config);
        await this.domainStore.pageStore.loadPage(pageId);
    };

    @action
    deleteContent = async (pageId: number | string, id: number | string) => {
        const token = this.domainStore.authStore.auth.token;
        const config = {headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }};
        const url = `${baseUrl}/api/pagecontent/${id}`;

        await axios.delete(url, config);
        await this.domainStore.pageStore.loadPage(pageId);
    };

    @action
    updateTextContent = async (pageId: number | string, textContent: TextContent) => {
        const token = this.domainStore.authStore.auth.token;
        const config = {headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }};
        const url = `${baseUrl}/api/textcontent/${textContent.id}`;

        await axios.put(url, textContent, config);
        await this.domainStore.pageStore.loadPage(pageId);
    };

    @action
    moveContentUp = async (pageId: number | string, id: number | string) => {
        const token = this.domainStore.authStore.auth.token;
        const config = {headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }};
        const url = `${baseUrl}/api/pagecontent/moveup/${id}`;

        await axios.post(url, {}, config);
        await this.domainStore.pageStore.loadPage(pageId);
    };

    @action
    moveContentDown = async (pageId: number | string, id: number | string) => {
        const token = this.domainStore.authStore.auth.token;
        const config = {headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }};
        const url = `${baseUrl}/api/pagecontent/movedown/${id}`;

        await axios.post(url, {}, config);
        await this.domainStore.pageStore.loadPage(pageId);
    };
}