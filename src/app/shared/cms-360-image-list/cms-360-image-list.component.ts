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
// eslint-disable-next-line no-var
declare var pannellum: any;
export class PostionViewModel {
  viewerGetYaw: 0;
  viewerGetPitch: 0;
  clickGetYaw: 0;
  clickGetPitch: 0;
}
@Component({
  selector: 'app-cms-360-image-list',
  templateUrl: './cms-360-image-list.component.html'
})
export class Cms360ImageListComponent implements OnInit {
  static nextId = 0;
  id = ++Cms360ImageListComponent.nextId;
  constructor(private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
  ) {
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();

  }
  public privateDataModel: File360ViewModel[] = [];
  public dataDetailModel: File360ViewModel = new File360ViewModel();
  @Output() dataModelChange: EventEmitter<File360ViewModel[]> = new EventEmitter<File360ViewModel[]>();
  @Input() set dataModel(model: File360ViewModel[]) {
    if (!model) {
      model = [];
    }
    this.privateDataModel = model;
    this.privateDataModel.forEach(element => {
      if (!element.hotSpots)
        element.hotSpots = [];
      element.hotSpots.forEach(h => {
        h.guid = this.getGuid();
      });
    });
    this.tabledataSource.data = this.privateDataModel;
    this.tableHotSpotdataSource.data = [];
  }
  get dataModel(): File360ViewModel[] {
    return this.privateDataModel;
  }

  formInfo: FormInfoModel = new FormInfoModel();
  loading = new ProgressSpinnerModel();
  loadingOption = new ProgressSpinnerModel();
  tabledataSource = new MatTableDataSource<File360ViewModel>();
  tableHotSpotdataSource = new MatTableDataSource<File360TourHotSpotModel>();
  tabledisplayedColumns = ['panorama', 'Title', 'Description', 'Action'];
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
    this.container.nativeElement.style.display = 'none';
  }
  getGuid(): string {
    return Math.floor(Math.random() * 1000) + "";
  }
  actionPannellumImageLoad(str: string, hotSpots: File360TourHotSpotModel[]): void {
    const defaultOptions = {
      "type": "equirectangular",//equirectangular, cubemap, or multires.
      "panorama": str,
      "autoLoad": true,
      "autoRotate": 1.5,
      "crossOrigin": "anonymous"
    };
    if (hotSpots && hotSpots.length > 0) {
      defaultOptions['hotSpots'] = hotSpots;
    }
    const combinedOptions = Object.assign({}, defaultOptions, this.options);
    if (this.viewer)
      this.onActionPannellumDestroy();
    this.viewer = pannellum.viewer(this.container.nativeElement, combinedOptions);
    this.container.nativeElement.style.display = 'block';
  }
  actionPrivateDataModelOptimaze() {
    const hotSpots: File360TourHotSpotModel[] = [];
    this.privateDataModel.forEach(element => {

      element.hotSpots.forEach(elementHotspot => {
        if (elementHotspot.type && elementHotspot.type.length > 0)
          hotSpots.push(elementHotspot);
      });
      element.hotSpots = hotSpots;

    });


  }
  onActionPannellumClick(e): void {
    if (!this.viewer)
      return;
    this.postionView = new PostionViewModel();
    this.postionView.viewerGetYaw = this.viewer.getYaw();
    this.postionView.viewerGetPitch = this.viewer.getPitch();
    const coords = this.viewer.mouseEventToCoords(e);
    if (!coords || coords.length == 0)
      return;
    this.postionView.clickGetYaw = coords[1];
    this.postionView.clickGetPitch = coords[0];
  }

  onActionPannellumDestroy(): void {
    this.container.nativeElement.style.display = 'none';
    this.postionView = null;
    if (this.viewer)
      this.viewer.destroy();
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
    this.dataDetailModel.panorama = model.downloadLinksrc;
    this.dataDetailModel.preview = model.downloadLinksrc;
    this.actionPannellumImageLoad(this.dataDetailModel.panorama, []);
  }

  onActionSubmitView360(): void {

    if (!this.dataDetailModel.linkFileId || this.dataDetailModel.linkFileId <= 0) {
      this.cmsToastrService.typeErrorMessage('فایل انتخاب نشده');
    }
    if (!this.privateDataModel) {
      this.privateDataModel = [];
    }
    if (this.selectIndex >= 0) {
      this.privateDataModel[this.selectIndex] = this.dataDetailModel;
    }
    else {
      this.privateDataModel.push(this.dataDetailModel);
    }
    this.actionPrivateDataModelOptimaze()
    this.dataModel = this.privateDataModel;
    this.dataModelChange.emit(this.privateDataModel);
    this.showAddView360 = !this.showAddView360;
    this.selectIndex = -1;
    this.onActionPannellumDestroy();
  }
  onActionCancellView360(): void {
    this.showAddView360 = false;
    this.onActionPannellumDestroy();
  }
  onActionShowView360Add(): void {
    this.dataDetailModel = new File360ViewModel();

    this.showAddView360 = !this.showAddView360;
  }

  onActionShowHotspotAdd(): void {

    if (!this.dataDetailModel)
      this.dataDetailModel = new File360ViewModel();
    if (!this.dataDetailModel.hotSpots)
      this.dataDetailModel.hotSpots = [];
    this.editHotspot = new File360TourHotSpotModel();
    const hotspot = new File360TourHotSpotModel();
    hotspot.type = "info";
    hotspot.guid = this.getGuid();
    this.dataDetailModel.hotSpots.push(hotspot);
    this.tableHotSpotdataSource.data = this.dataDetailModel.hotSpots;
  }
  onActionOptionRemoveView360(index: number): void {

    if (index < 0) {
      return;
    }
    if (!this.privateDataModel || this.privateDataModel.length === 0) {
      return;
    }
    this.privateDataModel.splice(index, 1);
    this.actionPrivateDataModelOptimaze()
    this.dataModel = this.privateDataModel;
    this.dataModelChange.emit(this.privateDataModel);
    this.onActionPannellumDestroy();
  }
  selectIndex = -1;
  onActionOptionEditView360(index: number): void {
    if (index < 0) {
      return;
    }
    if (!this.privateDataModel || this.privateDataModel.length === 0) {
      return;
    }
    this.dataDetailModel = this.privateDataModel[index];
    if (!this.dataDetailModel.hotSpots)
      this.dataDetailModel.hotSpots = [];

    this.actionPannellumImageLoad(this.dataDetailModel.panorama, this.dataDetailModel.hotSpots);
    this.oldHotspot = new File360TourHotSpotModel();
    this.editHotspot = new File360TourHotSpotModel();
    this.tableHotSpotdataSource.data = this.dataDetailModel.hotSpots;
    this.selectIndex = index;
    this.showAddView360 = !this.showAddView360;
  }
  editHotspot: File360TourHotSpotModel; oldHotspot: File360TourHotSpotModel; editdisabled: boolean

  editROw(usr: File360TourHotSpotModel) {
    //console.log(usr)
    this.editHotspot = usr && usr.guid ? usr : new File360TourHotSpotModel();
    this.oldHotspot = { ...this.editHotspot };
  }
  removeROw(usr: File360TourHotSpotModel) {
    const indexId = this.dataDetailModel.hotSpots.findIndex(x => x.guid == usr.guid);
    if (indexId >= 0) {
      this.dataDetailModel.hotSpots.splice(indexId, 1);
      this.tableHotSpotdataSource.data = this.dataDetailModel.hotSpots;
    }
  }
  updateEdit() {
    //updateEdit
    this.editdisabled = true;
    const indexId = this.dataDetailModel.hotSpots.findIndex(x => x.guid == this.oldHotspot.guid);
    if (indexId >= 0)
      this.dataDetailModel.hotSpots[indexId] = this.editHotspot;
    this.editdisabled = false;
    this.oldHotspot = new File360TourHotSpotModel();
    this.editHotspot = new File360TourHotSpotModel();
  }
  cancelEdit() {
    //cancel
    this.editHotspot = new File360TourHotSpotModel();
    if (this.oldHotspot && this.oldHotspot.guid) {
      if (!this.dataDetailModel.hotSpots)
        this.dataDetailModel.hotSpots = [];
      this.tableHotSpotdataSource.data = this.dataDetailModel.hotSpots;
    }
  }
}

