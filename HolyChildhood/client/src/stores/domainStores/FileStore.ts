import {DomainStore} from "../DomainStore";
import {action} from "mobx";
import axios from 'axios';

const baseUrl = 'http://localhost:57084';

export class FileStore {
    domainStore: DomainStore;

    constructor(domainStore: DomainStore) {
        this.domainStore = domainStore;
    }

    @action
    getFiles = async (id: number | string) => {
        const config = DomainStore.getConfig();
        const url = `${baseUrl}/api/file/${id}`;
        const response = await axios.get(url, config);
        return response.data;
    }
}