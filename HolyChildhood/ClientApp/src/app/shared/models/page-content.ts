export interface PageContent {
    id: number;
    content: string;
    contentType: string;
    editing: boolean;
    x: number;
    y: number;
    height: number;
    width: number;
}

export interface PageContentBackup {
    id: number;
    creationDate: Date;
    displayDate: string;
    content: string;
}
