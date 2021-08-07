export interface NodeInterface {
  isRoot: boolean;
  id: number;
  pathToNode: string;
  pathToParent: string;
  isFolder: boolean;
  isExpanded: boolean;
  stayOpen?: boolean;
  name?: string;
  children?: any;

  /** karavi add */
  parentId?: number;
  CreatedDate?: Date;
  UpdatedDate?: Date;
  type?: string;
  size?: number;
  downloadLinksrc?: string;
  // children: NodeInterface[];
  /** karavi add */
}
