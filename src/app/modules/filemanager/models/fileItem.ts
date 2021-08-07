export enum ItemType {
    dir =2,
    file = 1
}
export class FileItem {
    id?: string;
    name: string;
    type: string;
    path?: string;
    subItems?: FileItem[];
    isOpen?:boolean
    isSelected?:boolean
    parent?:FileItem
    isLoadingsubItems?:boolean=false;
}

