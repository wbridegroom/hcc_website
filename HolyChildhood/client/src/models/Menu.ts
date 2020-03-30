import {Page} from "./Page";

export interface Menu {
    id: number;
    name: string;
    pages: Array<Page>;
}
