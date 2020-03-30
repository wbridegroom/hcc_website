import {PageContent} from "./PageContent";
import {Menu} from "./Menu";

export interface Page {
    id: number;
    index: number;
    title: string;
    children: Array<Page>;
    parent: Page;
    pageContents: PageContent[];
    menuItem: Menu;
    menuItemId: number;
}
