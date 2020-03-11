import {createContext} from "react";
import {UiState} from "./UiState";
import {DomainStore} from "./DomainStore";

export class AppState {
    uiState: UiState;
    domainStore: DomainStore;

    constructor() {
        this.uiState = new UiState(this);
        this.domainStore = new DomainStore(this);
    }
}

export default createContext(new AppState());
