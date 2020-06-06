import {AppState} from "./AppState";
import {AuthStore} from "./domainStores/AuthStore";
import {PageStore} from "./domainStores/PageStore";
import {NavStore} from "./domainStores/NavStore";
import {ContentStore} from "./domainStores/ContentStore";
import {EventStore} from "./domainStores/EventStore";

export class DomainStore {
    appState: AppState;
    authStore: AuthStore;
    pageStore: PageStore;
    navStore: NavStore;
    contentStore: ContentStore;
    eventStore: EventStore;

    constructor(appState: AppState) {
        this.appState = appState;
        this.authStore = new AuthStore();
        this.pageStore = new PageStore(this);
        this.navStore = new NavStore(this);
        this.contentStore = new ContentStore(this);
        this.eventStore = new EventStore(this);
    }

    static getConfig() {
        return { headers: {'Content-Type': 'application/json'}};
    }

    static getConfigWithAuth(token: string) {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    }
}
