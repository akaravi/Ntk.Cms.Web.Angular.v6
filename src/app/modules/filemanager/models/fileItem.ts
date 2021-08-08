
export class FileItem {
    id?: string;
    name: string;
    type: string;
    path?: string;
    subItems?: FileItem[];
    isOpen?: boolean;
    isSelected?: boolean;
    parent?: FileItem;
    isLoadingsubItems?: boolean = false;
}

