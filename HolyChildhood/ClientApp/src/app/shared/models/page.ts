import {Menu} from './menu';
import {PageContent} from './page-content';

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
