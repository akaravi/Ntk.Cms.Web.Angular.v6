export interface NodeInterface {
  isRoot: boolean;
  id: number;
  pathToNode: string;
  pathToParent: string;
  isFolder: boolean;
  isExpanded: boolean;
  stayOpen?: boolean;
  name?: string;
  children?: NodeInterface[];

  type?: string;
  size?: number;
  parentId?: number;
  CreatedDate?: Date;
  UpdatedDate?: Date;
  downloadLinksrc?: string;
}
