import {Menu} from './menu';

export interface Page {
    id: number;
    title: string;
    children: Array<Page>;
    parent: Page;
    pageContents: PageContent[];
    menuItem: Menu;
    menuItemId: number;
}

export interface PageContent {
    id: number;
    contentType: string;
    editing: boolean;
    index: number;
    page: Page;
    textContent: TextContent;
}

export interface TextContent {
    id: number;
    content: string;
}
