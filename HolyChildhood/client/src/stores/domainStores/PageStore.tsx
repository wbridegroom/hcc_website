import {action, observable} from "mobx";
import axios from 'axios';
import {Page} from "../../models/Page";

export class PageStore {

    @observable
    page: Page = {} as Page;

    @action
    loadPage = async (id: number | string) => {
        const config = {headers: { 'Content-Type': 'application/json' }};
        const url = `/api/page/${id}`;
        const response = await axios.get(url, config);
        this.page = response.data;
    };
}
