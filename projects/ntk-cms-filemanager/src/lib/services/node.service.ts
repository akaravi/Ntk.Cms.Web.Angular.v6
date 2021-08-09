import { Injectable } from '@angular/core';
import { NodeInterface } from '../interfaces/node.interface';
import { Observable } from 'rxjs';
import { TreeModel } from '../models/tree.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FileManagerStoreService, SET_LOADING_STATE, SET_PATH, SET_SELECTED_NODE } from './file-manager-store.service';
import { flatMap, map } from 'rxjs/operators';
import { FileCategoryService, FileContentService } from 'ntk-cms-api';

@Injectable({
  providedIn: 'root'
})
export class NodeService {
  public tree: TreeModel;
  private _path: string;

  constructor(
    private http: HttpClient,
    private store: FileManagerStoreService,
    private fileContentService: FileContentService,
    private fileCategoryService: FileCategoryService,
  ) {
  }

  // todo ask server to get parent structure
  public startManagerAt(path: string): void {
    this.currentPath = path;
    this.refreshCurrentPath();
  }

  public refreshCurrentPath(): void {
    this.findNodeByPath(this.currentPath).children = [];
    this.getNodes(this.currentPath).then(() => {
      this.store.dispatch({ type: SET_SELECTED_NODE, payload: this.tree.nodes });
      this.store.dispatch({ type: SET_PATH, payload: this.currentPath });
    });
  }

  getNodes(path: string): Promise<Array<NodeInterface>> {
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
  private getParentPath_orginal(path: string): string {
    let parentPath = path.split('/');
    parentPath = parentPath.slice(0, parentPath.length - 1);
    return parentPath.join('/');
  }
  private getParentPath(path: string): string {
    let parentPath = path.split('/');
    parentPath = parentPath.slice(0, parentPath.length - 1);
    return parentPath.join('/');
  }
  private parseNodes_orginal(path: string): Observable<NodeInterface[]> {
    return new Observable(observer => {
      this.getNodesFromServer(path).subscribe((data: Array<any>) => {
        observer.next(data.map(node => this.createNode_orginal(path, node)));
        this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
      });
    });
  }
  private parseNodes(path: string): Observable<NodeInterface[]> {
    return new Observable(observer => {
      this.getNodesFromServerNtk(path).subscribe((data: Array<any>) => {
        debugger;
        observer.next(data.map(node => this.createNode(path, node)));
        this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
      });
    });
  }

  private createNode_orginal(path, node): NodeInterface {
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
  private createNode(path: string, node: NodeInterface): NodeInterface {
    debugger
    if (node.parentId && node.parentId > 0) {
      console.warn('[Node Service] Server should return initial path with "/"');
      node.pathToNode = '/' + node.pathToNode;
    }

    const ids = node.pathToNode.split('/');
    if (ids.length > 2 && ids[ids.length - 1] === '') {
      ids.splice(-1, 1);
      node.pathToNode = ids.join('/');
    }

    const cachedNode = this.findNodeByPath(node.pathToNode);

    return <NodeInterface>{
      id: node.id,
      isFolder: node.isFolder,
      isExpanded: cachedNode ? cachedNode.isExpanded : false,
      pathToNode: node.pathToNode,
      pathToParent: this.getParentPath(node.pathToNode),
      name: node.name || node.id,
      children: cachedNode ? cachedNode.children : {},
    };
  }

  private getNodesFromServer(path: string): Observable<any> {
    let folderId: any = this.findNodeByPath(path).id;
    folderId = folderId === 0 ? '' : folderId;

    return this.http.get(
      this.tree.config.baseURL + this.tree.config.api.listFile,
      { params: new HttpParams().set('parentPath', folderId) }
    );

  }
  private getNodesFromServerNtk(path: string): Observable<Array<NodeInterface>> {
    let folderId: any = this.findNodeByPath(path).id;
    folderId = folderId === 0 ? '' : folderId;
    const retOut = new Observable<Array<NodeInterface>>(observer => {
      return this.getCategoryList(path).subscribe(
        xCat => {
          // return xCat;
          return this.getFileList(path).subscribe(
            (
              xfile => {
                xfile = xfile.concat(xCat);
                observer.next(xfile);
                //return ;
              })
          );
        })
    });
    // const retOut = this.getCategoryList(path).subscribe(
    //   (xCat => {
    //     // return xCat;
    //     return this.getFileList(path).subscribe(
    //       (
    //         xfile => {
    //           xfile = xfile.concat(xCat)
    //           return xfile;
    //         })
    //     );
    //   })
    // );
    return retOut;

    // let listCat:Array<NodeInterface> = [];
    // let listFile:Array<NodeInterface> = [];
    // const aaa = new Observable(observer => {
    //   observer.next(this.getCategoryList(path).subscribe(next => { listCat = next }));
    //   observer.next(this.getFileList(path).subscribe(next => { listFile = next }));
    //   observer.complete();
    //   listCat = listCat.concat(listCat);
    // });

    // return aaa.subscribe(()=>{ return listCat});
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

  public foldRecursively(node: NodeInterface): void {
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

  public foldAll(): void {
    this.foldRecursively(this.tree.nodes);
  }

  get currentPath(): string {
    return this._path;
  }

  set currentPath(value: string) {
    this._path = value;
  }
  getCategoryList(path: string): Observable<Array<NodeInterface>> {
    const folderId = +path | 0;

    return this.fileCategoryService.ServiceGetSubCategoryFromCategory(folderId).pipe(
      map((x) => {
        const retList: NodeInterface[] = [];

        x.ListItems.forEach(element => {
          const item: NodeInterface = {
            name: element.Title,
            isRoot: true,
            id: element.Id,
            parentId: element.LinkParentId,
            pathToNode: '',
            pathToParent: element.LinkParentId + '',
            isFolder: true,
            isExpanded: false
          };
          if (retList.length < 3) {
            retList.push(item);
          }
        });
        return retList;
      })
    );

  }
  getFileList(path: string): Observable<Array<NodeInterface>> {
    const folderId = +path | 0;
    return this.fileContentService.ServiceGetFilesInCategoryId(folderId).pipe(
      map((x) => {
        const retList: NodeInterface[] = [];
        x.ListItems.forEach(element => {
          const item: NodeInterface = {
            name: element.FileName,
            isRoot: false,
            id: element.Id,
            parentId: element.LinkCategoryId,
            pathToNode: '',
            pathToParent: element.LinkCategoryId + '',
            isFolder: false,
            isExpanded: false
          };

          if (retList.length < 3) {
            retList.push(item);
          }
        });
        return retList;
      })
    );
  }
}

