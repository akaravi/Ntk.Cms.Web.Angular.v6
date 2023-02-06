import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoreGuideService } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-cms-guide-info',
  templateUrl: './cms-guide-info.component.html',
})
export class CmsGuideinfoComponent implements OnInit, OnDestroy {
  static nextId = 0;
  id = ++CmsGuideinfoComponent.nextId;
  @Input() Identity: number;
  @Input() Key: string;
  @Input() title: string;
  description: string;
  body: string;
  @Input() btnOkText: string;
  show = true;
  constructor(
    // private activeModal: NgbActiveModal,
    private tokenHelper: TokenHelper,
    private modalService: NgbModal,
    private coreGuideService: CoreGuideService,
    private cmsToastrService: CmsToastrService,
  ) { }
  closeResult = '';
  cmsApiStoreSubscribe: Subscription;
  lang = '';
  ngOnInit(): void {

    this.tokenHelper.getCurrentToken().then((value) => {
      this.lang = value.language;

    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.lang = next.language;
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  onActionGuideClick(content): void {
    if (this.Identity > 0) {
      this.coreGuideService.ServiceGetOneById(this.Identity).pipe(
        map(
          (next) => {
            if (next.isSuccess) {
              switch (this.lang) {
                case 'fa': {
                  this.title = next.item.titleFa;
                  this.description = next.item.descriptionFa;
                  this.body = next.item.bodyFa;
                  break;
                }
                case 'en': {
                  this.title = next.item.titleEn;
                  this.description = next.item.descriptionEn;
                  this.body = next.item.bodyEn;
                  break;
                }
                case 'ar': {
                  this.title = next.item.titleAr;
                  this.description = next.item.descriptionAr;
                  this.body = next.item.bodyAr;
                  break;
                }
                case 'de': {
                  this.title = next.item.titleDe;
                  this.description = next.item.descriptionDe;
                  this.body = next.item.bodyDe;
                  break;
                }
                default: {
                  this.title = next.item.titleFa;
                  this.description = next.item.descriptionFa;
                  this.body = next.item.bodyFa;
                  break;
                }
              }
              this.open(content);
            } else {
              this.cmsToastrService.typeErrorMessage(next.errorMessage);
            }
          },
          (error) => {
            this.cmsToastrService.typeError(error);
          })
      ).toPromise();
    } else if (this.Key && this.Key.length > 0) {
      this.coreGuideService.ServiceGetOneByKey(this.Key).pipe(
        map(
          (next) => {
            if (next.isSuccess) {
              switch (this.lang) {
                case 'fa': {
                  this.title = next.item.titleFa;
                  this.description = next.item.descriptionFa;
                  this.body = next.item.bodyFa;
                  break;
                }
                case 'en': {
                  this.title = next.item.titleEn;
                  this.description = next.item.descriptionEn;
                  this.body = next.item.bodyEn;
                  break;
                }
                case 'ar': {
                  this.title = next.item.titleAr;
                  this.description = next.item.descriptionAr;
                  this.body = next.item.bodyAr;
                  break;
                }
                case 'de': {
                  this.title = next.item.titleDe;
                  this.description = next.item.descriptionDe;
                  this.body = next.item.bodyDe;
                  break;
                }
                default: {
                  this.title = next.item.titleFa;
                  this.description = next.item.descriptionFa;
                  this.body = next.item.bodyFa;
                  break;
                }
              }
              this.open(content);
            } else {
              this.cmsToastrService.typeErrorMessage(next.errorMessage);
            }
          },
          (error) => {
            this.cmsToastrService.typeError(error);
          })
      ).toPromise();

    } else if (this.description && this.description.length > 0) {
      this.open(content);
    }
  }
  open(content): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
