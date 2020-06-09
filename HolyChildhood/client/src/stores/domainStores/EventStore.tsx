import {DomainStore} from "../DomainStore";
import {action} from "mobx";
import axios from 'axios';
import {Event} from '../../models/Calendar';

const baseUrl = 'http://localhost:57084';

export class EventStore {
    domainStore: DomainStore;

    constructor(domainStore: DomainStore) {
        this.domainStore = domainStore;
    }

    @action
    getEvents = async () => {
        const config = DomainStore.getConfig();
        const url = `${baseUrl}/api/event`
        const response = await axios.get(url, config);
        return response.data as Event[];
    }

    @action
    getUpcomingEvents = async (count: number) => {
        const config = DomainStore.getConfig();
        const url = `${baseUrl}/api/event/upcoming/${count}`;
        const response = await axios.get(url, config);
        return response.data as Event[];
    };
}
