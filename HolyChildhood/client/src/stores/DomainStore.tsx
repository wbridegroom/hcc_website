import {AppState} from "./AppState";
import {AuthStore} from "./domainStores/AuthStore";
import {PageStore} from "./domainStores/PageStore";

export class DomainStore {
    appState: AppState;
    authStore: AuthStore;
    pageStore: PageStore;

    constructor(appState: AppState) {
        this.appState = appState;
        this.authStore = new AuthStore();
        this.pageStore = new PageStore();
    }
}
