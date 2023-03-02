import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { File360TourHotSpotModel, File360ViewModel, FormInfoModel } from 'ntk-cms-api';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import 'pannellum-next/src/js/libpannellum';
import 'pannellum-next/src/js/pannellum';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
declare var pannellum: any;
export class PostionViewModel {
  viewerGetYaw: 0;
  viewerGetPitch: 0;
  clickGetYaw: 0;
  clickGetPitch: 0;
}
@Component({
  selector: 'app-cms-file-360-view-list',
  templateUrl: './cms-file-360-view-list.component.html'
})
export class CmsFile360ViewListComponent implements OnInit {
  static nextId = 0;
  id = ++CmsFile360ViewListComponent.nextId;
  constructor(private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
  ) {
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
    this.sceneId = Math.floor(Math.random() * 1000);
  }
  public fileView360List: File360ViewModel[] = [];
  public dataDetailModel: File360ViewModel = new File360ViewModel();
  @Output() dataModelChange: EventEmitter<File360ViewModel[]> = new EventEmitter<File360ViewModel[]>();
  @Input() set dataModel(model: File360ViewModel[]) {
    if (!model) {
      model = [];
    }
    this.fileView360List = model;
    this.tabledataSource.data = this.fileView360List;
    this.tableHotSpotdataSource.data = [];
  }
  get dataModel(): File360ViewModel[] {
    return this.fileView360List;
  }

  formInfo: FormInfoModel = new FormInfoModel();
  loading = new ProgressSpinnerModel();
  loadingOption = new ProgressSpinnerModel();
  tabledataSource = new MatTableDataSource<File360ViewModel>();
  tableHotSpotdataSource = new MatTableDataSource<File360TourHotSpotModel>();
  tabledisplayedColumns = ['LinkFileIdThumbnailSrc', 'Title', 'Description', 'Action'];
  tableHotspotDisplayedColumns = ['sceneId', 'type', 'text', 'url', 'pitch', 'yaw', 'Action'];

  selectFileTypeReport = ['jpeg', 'jpg'];

  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  showAddView360 = false;
  fileManagerOpenFormReport = false;

  ngOnInit(): void {
    this.formInfo.formTitle = this.translate.instant('TITLE.Edit');

  }

  @ViewChild('container') container: ElementRef;
  viewer: any;
  options: any;
  postionView: PostionViewModel;


  ngAfterViewInit(): void {

    //this.actionPannellumLoad('https://apifile.ir/images/91188/5d8310e9e57046e4ba4e672db0b47cb7.jpg');

    // this.viewer.on('mouseup', function (event) {
    //   this.viewerGetYaw = this.viewer.getYaw();
    //   this.viewerGetPitch = this.viewer.getPitch();
    // });
    //this.viewer.on('mouseup', this.onActionPannellumClick);
  }
  actionPannellumLoad(str: string): void {
    const defaultOptions = {
      "type": "equirectangular",
      "panorama": str,
      "autoLoad": true,
      "autoRotate": 1.5,
      "crossOrigin": "anonymous"
    };
    const combinedOptions = Object.assign({}, defaultOptions, this.options);
    this.viewer = pannellum.viewer(this.container.nativeElement, combinedOptions);
    // this.viewer.on('mouseup', (e, a) => {
    //   //console.log(window);
    //   //console.log(e)
    // })
  }

  onActionPannellumClick(e): void {
    this.postionView = new PostionViewModel();
    this.postionView.viewerGetYaw = this.viewer.getYaw();
    this.postionView.viewerGetPitch = this.viewer.getPitch();
    const coords = this.viewer.mouseEventToCoords(e);
    this.postionView.clickGetYaw = coords[1];
    this.postionView.clickGetPitch = coords[0];
  }
  onActionPannellumClickLastPoint(): void {
    if (this.postionView && (this.postionView.clickGetYaw != 0 || this.postionView.clickGetPitch != 0)) {
      this.editHotspot.yaw = this.postionView.clickGetYaw;
      this.editHotspot.pitch = this.postionView.clickGetPitch;
    }
  }
  onActionFileSelect(model: NodeInterface): void {
    if (!model || !model.id || model.id === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.dataDetailModel.linkFileId = model.id;
    this.dataDetailModel.linkFileIdThumbnailSrc = model.downloadLinksrc;
    this.actionPannellumLoad(this.dataDetailModel.linkFileIdSrc);
  }

  onActionSubmitView360(): void {

    if (!this.dataDetailModel.linkFileId || this.dataDetailModel.linkFileId <= 0) {
      this.cmsToastrService.typeErrorMessage('فایل انتخاب نشده');
    }
    if (!this.fileView360List) {
      this.fileView360List = [];
    }
    if (this.selectIndex >= 0) {
      this.fileView360List[this.selectIndex] = this.dataDetailModel;
    }
    else {
      this.fileView360List.push(this.dataDetailModel);
    }
    this.dataModel = this.fileView360List;
    this.dataModelChange.emit(this.fileView360List);
    this.showAddView360 = !this.showAddView360;
    this.selectIndex = -1;
  }

  onActionShowView360Add(): void {
    this.dataDetailModel = new File360ViewModel();
    this.showAddView360 = !this.showAddView360;
  }
  sceneId = 0;
  onActionShowHotspotAdd(): void {

    if (!this.dataDetailModel)
      this.dataDetailModel = new File360ViewModel();
    if (!this.dataDetailModel.hotSpots)
      this.dataDetailModel.hotSpots = [];
    this.editHotspot = new File360TourHotSpotModel();
    const sceneNew = new File360TourHotSpotModel();
    this.sceneId++;
    sceneNew.sceneId = this.sceneId + "1";
    this.dataDetailModel.hotSpots.push(sceneNew);
    this.tableHotSpotdataSource.data = this.dataDetailModel.hotSpots;
  }
  onActionOptionRemoveView360(index: number): void {

    if (index < 0) {
      return;
    }
    if (!this.fileView360List || this.fileView360List.length === 0) {
      return;
    }
    this.fileView360List.splice(index, 1);
    this.dataModel = this.fileView360List;
    this.dataModelChange.emit(this.fileView360List);
  }
  selectIndex = -1;
  onActionOptionEditView360(index: number): void {
    if (index < 0) {
      return;
    }
    if (!this.fileView360List || this.fileView360List.length === 0) {
      return;
    }
    this.dataDetailModel = this.fileView360List[index];
    if (!this.dataDetailModel.hotSpots)
      this.dataDetailModel.hotSpots = [];

    this.actionPannellumLoad(this.dataDetailModel.linkFileIdSrc);
    this.oldHotspot = new File360TourHotSpotModel();
    this.editHotspot = new File360TourHotSpotModel();
    this.tableHotSpotdataSource.data = this.dataDetailModel.hotSpots;
    this.selectIndex = index;
    this.showAddView360 = !this.showAddView360;
  }
  editHotspot: File360TourHotSpotModel; oldHotspot: File360TourHotSpotModel; editdisabled: boolean

  editROw(usr: File360TourHotSpotModel) {
    //console.log(usr)
    this.editHotspot = usr && usr.sceneId ? usr : new File360TourHotSpotModel();
    this.oldHotspot = { ...this.editHotspot };
  }
  removeROw(usr: File360TourHotSpotModel) {
    const indexId = this.dataDetailModel.hotSpots.findIndex(x => x.sceneId == usr.sceneId);
    if (indexId >= 0) {
      this.dataDetailModel.hotSpots.splice(indexId, 1);
      this.tableHotSpotdataSource.data = this.dataDetailModel.hotSpots;
    }
  }
  updateEdit() {
    //updateEdit
    this.editdisabled = true;
    const indexId = this.dataDetailModel.hotSpots.findIndex(x => x.sceneId == this.oldHotspot.sceneId);
    if (indexId >= 0)
      this.dataDetailModel.hotSpots[indexId] = this.editHotspot;
    this.editdisabled = false;
    this.oldHotspot = new File360TourHotSpotModel();
    this.editHotspot = new File360TourHotSpotModel();
  }
  cancelEdit() {
    //cancel
    this.editHotspot = new File360TourHotSpotModel();
    if (this.oldHotspot && this.oldHotspot.sceneId) {
      if (!this.dataDetailModel.hotSpots)
        this.dataDetailModel.hotSpots = [];
      this.tableHotSpotdataSource.data = this.dataDetailModel.hotSpots;
    }
  }
}

