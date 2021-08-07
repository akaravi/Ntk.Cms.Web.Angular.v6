import { Injectable } from '@angular/core';
import { NodeInterface } from '../interfaces/node.interface';
import { Observable } from 'rxjs';
import { TreeModel } from '../models/tree.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FileManagerStoreService, SET_LOADING_STATE, SET_PATH, SET_SELECTED_NODE } from './file-manager-store.service';
import { ErrorExceptionResult, FileCategoryModel, FilterDataModel, FilterModel } from 'ntk-cms-api';

@Injectable({
  providedIn: 'root'
})
export class NodeService {
  public tree: TreeModel;
  private _path: string;

  constructor(private http: HttpClient, private store: FileManagerStoreService) {
  }
  /** karavi base */
  deviceToken = '';
  userToken = '';
  keyUserToken = 'userToken';
  keyDeviceToken = 'deviceToken';

  getHeaders(): any {
    const headers = { Authorization: this.getUserToken(), DeviceToken: this.getDeviceToken() };

    return headers;
  }

  getUserToken(): string | null {
    if (this.userToken && this.userToken.length > 0) {
      return this.userToken;
    }
    const token = localStorage.getItem(this.keyUserToken);
    if (token && token.length > 0) {
      return token;
    }
    const title = 'تایید توکن';
    const message = 'لطفا مجددا وارد حساب کاربری خود شوید';

    return '';
  }
  getDeviceToken(): string | null {
    if (this.deviceToken && this.deviceToken.length > 0) {
      return this.deviceToken;
    }
    const token = localStorage.getItem(this.keyDeviceToken);
    if (token && token.length > 0) {
      return token;
    }
    return '';
  }
  errorExceptionResultCheck<TOut>(model: ErrorExceptionResult<TOut> | any): ErrorExceptionResult<TOut> {
    if (model) {
      if (!model.IsSuccess) {
        const title = 'خطا در دریافت اطلاعات از سرور';
        const message = model.ErrorMessage;
      }
    }
    return model;
  }
  /** karavi base */
  // todo ask server to get parent structure
  public startManagerAt(path: string) {
    this.currentPath = path;
    this.refreshCurrentPath();
  }

  public refreshCurrentPath() {
    this.findNodeByPath(this.currentPath).children = {};
    this.getNodes(this.currentPath).then(() => {
      this.store.dispatch({ type: SET_SELECTED_NODE, payload: this.tree.nodes });
      this.store.dispatch({ type: SET_PATH, payload: this.currentPath });
    });
  }

  getNodes(path: string) {
    return new Promise((resolve => {
      this.parseNodes(path).subscribe((data: Array<NodeInterface>) => {
        for (let i = 0; i < data.length; i++) {
          const parentPath = this.getParentPath(data[i].pathToNode);
          this.findNodeByPath(parentPath).children[data[i].name] = data[i];
        }

        resolve(null);
      });
    }));
  }

  private getParentPath(path: string): string {
    let parentPath = path.split('/');
    parentPath = parentPath.slice(0, parentPath.length - 1);
    return parentPath.join('/');
  }

  private parseNodes(path: string): Observable<NodeInterface[]> {
    return new Observable(observer => {
      this.getNodesFromServer(path).subscribe((data: Array<any>) => {
        observer.next(data.map(
          node => this.createNode(path, node)
        ));
        this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
      });
    });
  }

  private createNode(path, node): NodeInterface {
    if (node.path[0] !== '/') {
      console.warn('[Node Service] Server should return initial path with "/"');
      node.path = '/' + node.path;
    }

    const ids = node.path.split('/');
    if (ids.length > 2 && ids[ids.length - 1] === '') {
      ids.splice(-1, 1);
      node.path = ids.join('/');
    }

    const cachedNode = this.findNodeByPath(node.path);

    return <NodeInterface>{
      id: node.id,
      isFolder: node.dir,
      isExpanded: cachedNode ? cachedNode.isExpanded : false,
      pathToNode: node.path,
      pathToParent: this.getParentPath(node.path),
      name: node.name || node.id,
      children: cachedNode ? cachedNode.children : {}
    };
  }

  private getNodesFromServer = (path: string) => {
    debugger;

    let folderId: any = this.findNodeByPath(path).id;
    folderId = (folderId === 0 || folderId === '') ? 0 : folderId;

    // return this.http.post(this.tree.config.baseURL + this.tree.config.api.listFile, { params: new HttpParams().set('parentPath', folderId) }
    // );
    const filterModel = new FilterModel();
    filterModel.RowPerPage = 100;
    filterModel.SortColumn = 'FileName';
    filterModel.Filters = [];
    const filter = new FilterDataModel();
    filter.PropertyName = 'LinkCategoryId';
    if (folderId > 0) {
      filter.Value = folderId;
    }
    filterModel.Filters.push(filter);

    return this.http.post(this.tree.config.baseURL + this.tree.config.api.listFile, filterModel, { headers: this.getHeaders() }
    );

  }

  public findNodeByPath(nodePath: string): NodeInterface {
    const ids = nodePath.split('/');
    ids.splice(0, 1);

    return ids.length === 0 ? this.tree.nodes : ids.reduce((value, index) => value['children'][index], this.tree.nodes);
  }

  public findNodeById(id: number): NodeInterface {
    const result = this.findNodeByIdHelper(id);

    if (result === null) {
      console.warn('[Node Service] Cannot find node by id. Id not existing or not fetched. Returning root.');
      return this.tree.nodes;
    }

    return result;
  }

  public findNodeByIdHelper(id: number, node: NodeInterface = this.tree.nodes): NodeInterface {
    if (node.id === id) {
      return node;
    }

    const keys = Object.keys(node.children);

    for (let i = 0; i < keys.length; i++) {
      if (typeof node.children[keys[i]] === 'object') {
        const obj = this.findNodeByIdHelper(id, node.children[keys[i]]);
        if (obj != null) {
          return obj;
        }
      }
    }

    return null;
  }

  public foldRecursively(node: NodeInterface) {
    // console.log('folding ', node);
    const children = node.children;

    Object.keys(children).map((child: string) => {
      if (!children.hasOwnProperty(child) || !children[child].isExpanded) {
        return null;
      }

      this.foldRecursively(children[child]);
      //todo put this getElById into one func (curr inside node.component.ts + fm.component.ts) - this won't be maintainable
      document.getElementById('tree_' + children[child].pathToNode).classList.add('deselected');
      children[child].isExpanded = false;
    });
  }

  public foldAll() {
    this.foldRecursively(this.tree.nodes);
  }

  get currentPath(): string {
    return this._path;
  }

  set currentPath(value: string) {
    this._path = value;
  }
}
