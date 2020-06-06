import {AppState} from "./AppState";
import {action, observable} from "mobx";
import {Menu} from "../models/Menu";

export class UiState {
    appState: AppState;

    @observable
    selectedMenu: null | Menu = null;

    constructor(appState: AppState) {
        this.appState = appState;
    }

    @action
    setSelectedMenu = (menu: null | Menu) => {
        this.selectedMenu = menu;
    };

}
