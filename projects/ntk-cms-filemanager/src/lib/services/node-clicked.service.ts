import { Injectable } from '@angular/core';
import { NodeInterface } from '../interfaces/node.interface';
import { NodeService } from './node.service';
import { TreeModel } from '../models/tree.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NtkSmartModalService } from 'ngx-ntk-smart-module';
import { first, map } from 'rxjs/operators';
import { FileCategoryModel, FileCategoryService, FileContentService } from 'ntk-cms-api';
import { FileManagerStoreService, SET_LOADING_STATE } from './file-manager-store.service';

@Injectable({
  providedIn: 'root'
})
export class NodeClickedService {
  public tree: TreeModel;

  constructor(
    public ngxSmartModalService: NtkSmartModalService,
    private nodeService: NodeService,
    private store: FileManagerStoreService,
    private http: HttpClient,
    private fileContentService: FileContentService,
    private fileCategoryService: FileCategoryService,
  ) {
  }

  public startDownload(node: NodeInterface): void {
    const parameters = new HttpParams().append('path', node.id + '');
    this.reachServer('download', this.tree.config.api.downloadFile, parameters);
  }
  public initDelete_orginal(node: NodeInterface): void {
    this.sideEffectHelper(
      'Delete',
      new HttpParams().append('path', node.id + ''),
      'delete',
      this.tree.config.api.deleteFile,
      () => this.successWithSideViewClose()
    );
  }
  public initDelete(node: NodeInterface): void {
    this.store.dispatch({ type: SET_LOADING_STATE, payload: true });
    if (node.isFolder) {
      this.fileCategoryService.ServiceDelete(node.id).subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.successWithSideViewClose();
          }
          else {
            this.actionFailed('Delete Folder Error', next.ErrorMessage);
          }
          this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
        }
        , (error) => {
          this.actionFailed('Delete Folder Error', error);
          this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
        }
      );
    } else {
      this.fileContentService.ServiceDelete(node.id).subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.successWithSideViewClose();
          }
          else {
            this.actionFailed('Delete File Error', next.ErrorMessage);
          }
          this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
        }
        , (error) => {
          this.actionFailed('Delete File Error', error);
          this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
        }
      );
    }
  }

  public searchForString(input: string): void {
    this.sideEffectHelper(
      'Search',
      new HttpParams().append('query', input),
      'get',
      this.tree.config.api.searchFiles,
      (res) => this.searchSuccess(input, res)
    );
  }

  public createFolder_orginal(currentParent: number, newDirName: string): void {
    this.sideEffectHelper(
      'Create Folder',
      (() => {
        let httpParams = new HttpParams().append('dirName', newDirName);
        if (currentParent !== 0) {
          httpParams = httpParams.append('parentPath', currentParent + '');
        }

        console.log(currentParent, httpParams.get('dirName'), httpParams.get('parentPath'));
        return httpParams;
      })(),
      'post',
      this.tree.config.api.createFolder
    );
  }
  public createFolder(currentParent: number, newDirName: string): void {
    const model = new FileCategoryModel();
    model.Title = newDirName;
    if (currentParent > 0) {
      model.LinkParentId = currentParent;
    }
    this.store.dispatch({ type: SET_LOADING_STATE, payload: true });
    this.fileCategoryService.ServiceAdd(model).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.successWithSideViewClose();
        }
        else {
          this.actionFailed('Create Folder Error', next.ErrorMessage);
        }
        this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
      }
      , (error) => {
        this.actionFailed('Create Folder Error', error);
        this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
      }
    );
  }
  public rename_orginal(node: NodeInterface, newName: string): void {
    this.sideEffectHelper(
      'Rename',
      new HttpParams().append('path', node.id + '').append('newName', newName),
      'post',
      this.tree.config.api.renameFile,
      () => this.successWithSideViewClose()
    );
  }
  public rename(node: NodeInterface, newName: string): void {
    this.store.dispatch({ type: SET_LOADING_STATE, payload: true });
    if (node.isFolder) {
      this.fileCategoryService.ServiceGetOneById(node.id).subscribe((next) => {
        if (next.IsSuccess) {
          next.Item.Title = newName;
          /** update */
          this.fileCategoryService.ServiceEdit(next.Item).subscribe(
            (next) => {
              if (next.IsSuccess) {
                this.successWithSideViewClose();
              }
              else {
                this.actionFailed('rename Folder Error', next.ErrorMessage);
              }
              this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
            }
            , (error) => {
              this.actionFailed('rename Folder Error', error);
              this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
            }
          );
          /** update */
        } else {
          this.actionFailed('rename Folder Error', next.ErrorMessage);
          this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
        }
      }
        , (error) => {
          this.actionFailed('rename Folder Error', error);
          this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
        });

    } else {
      this.fileContentService.ServiceGetOneById(node.id).subscribe((next) => {
        if (next.IsSuccess) {
          next.Item.FileName = newName;
          /** update */
          this.fileContentService.ServiceEdit(next.Item).subscribe(
            (next) => {
              if (next.IsSuccess) {
                this.successWithSideViewClose();
              }
              else {
                this.actionFailed('rename File Error', next.ErrorMessage);
              }
              this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
            }
            , (error) => {
              this.actionFailed('rename File Error', error);
              this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
            }
          );
          /** update */
        } else {
          this.actionFailed('rename File Error', next.ErrorMessage);
          this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
        }
      }
        , (error) => {
          this.actionFailed('rename File Error', error);
          this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
        });
    }
  }

  private sideEffectHelper(name: string, parameters: HttpParams, httpMethod: string, apiURL: string,
    successMethod = (a) => this.actionSuccess(a),
    failMethod = (a, b) => this.actionFailed(a, b)
  ): void {
    this.ngxSmartModalService.getModal('waitModal').open();

    this.reachServer(httpMethod, apiURL, parameters)
      .subscribe(
        (a) => successMethod(a),
        (err) => failMethod(name, err)
      );
  }

  private reachServer(method: string, apiUrl: string, parameters: HttpParams, data: any = {}): Observable<any> {
    switch (method.toLowerCase()) {
      case 'get':
        return this.http.get(this.tree.config.baseURL + apiUrl, { params: parameters });
      case 'post':
        return this.http.post(this.tree.config.baseURL + apiUrl, data, { params: parameters });
      case 'delete':
        return this.http.delete(this.tree.config.baseURL + apiUrl, { params: parameters });
      case 'download':
        window.open(this.tree.config.baseURL + apiUrl + '?path=' + parameters.get('path'), '_blank');
        return null;
      default:
        console.warn('[NodeClickedService] Incorrect params for this side-effect');
        return null;
    }
  }

  private successWithSideViewClose(): void {
    this.actionSuccess();
    document.getElementById('side-view').classList.remove('selected');
  }

  private searchSuccess(input: string, data: any): void {
    const obj = {
      searchString: input,
      response: data
    };

    this.actionSuccess();

    this.ngxSmartModalService.setModalData(obj, 'searchModal', true);
    this.ngxSmartModalService.getModal('searchModal').open();
  }

  private actionSuccess(response: string = ''): void {
    document.body.classList.remove('dialog-open');

    this.nodeService.refreshCurrentPath();

    const modal = this.ngxSmartModalService.getModal('waitModal');
    modal.onOpenFinished.pipe(first()).subscribe(() => modal.close());
    modal.close();
  }

  private actionFailed(name: string, error: any): void {
    document.body.classList.remove('dialog-open');

    this.ngxSmartModalService.getModal('waitModal').close();
    this.ngxSmartModalService.getModal('errorModal').open();
    console.warn('[NodeClickedService] Action "' + name + '" failed', error);
  }

}
