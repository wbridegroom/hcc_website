import {DomainStore} from "../DomainStore";
import {action} from "mobx";
import axios from 'axios';
import {TextContent} from "../../models/PageContent";

const baseUrl = 'https://www.holychildhoodchurch.com';

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

}