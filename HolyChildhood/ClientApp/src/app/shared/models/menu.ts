import {Page} from './page';

export interface Menu {
    id: number;
    name: string;
    pages: Array<Page>;
}
