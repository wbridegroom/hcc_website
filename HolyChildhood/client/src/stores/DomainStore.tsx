import {AppState} from "./AppState";
import {AuthStore} from "./domainStores/AuthStore";

export class DomainStore {
    appState: AppState;
    authStore: AuthStore;

    constructor(appState: AppState) {
        this.appState = appState;
        this.authStore = new AuthStore();
    }
}
