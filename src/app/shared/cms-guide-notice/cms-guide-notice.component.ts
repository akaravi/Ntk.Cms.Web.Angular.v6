import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoreGuideService } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-cms-guide-notice',
  templateUrl: './cms-guide-notice.component.html',
  styleUrls: ['./cms-guide-notice.component.scss']
})
export class CmsGuideNoticeComponent implements OnInit, OnDestroy {

  @Input() Identity: number;
  @Input() Key: string;
  @Input() title: string;
  description: string;
  body: string;
  @Input() classes: string;
  @Input() icon: string;
  @Input() svg: string;

  show = true;
  constructor(
    // private activeModal: NgbActiveModal,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    private coreGuideService: CoreGuideService,
    private cmsToastrService: CmsToastrService,
  ) { }
  closeResult = '';
  cmsApiStoreSubscribe: Subscription;
  lang = '';
  ngOnInit(): void {

    this.tokenHelper.getCurrentToken().then((value) => {
      this.lang = value.Language;
      this.onGetOne();
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.lang = next.Language;
      this.onGetOne();
    });

  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  bodyShow = false;
  onGetOne(): void {
    if (this.Identity > 0) {
      this.coreGuideService.ServiceGetOneById(this.Identity).pipe(
        map(
          (next) => {
            if (next.IsSuccess) {
              
              switch (this.lang) {
                case 'fa': {
                  this.title = next.Item.TitleFa;
                  this.description = next.Item.DescriptionFa;
                  this.body = next.Item.BodyFa;
                  break;
                }
                case 'en': {
                  this.title = next.Item.TitleEn;
                  this.description = next.Item.DescriptionEn;
                  this.body = next.Item.BodyEn;
                  break;
                }
                case 'ar': {
                  this.title = next.Item.TitleAr;
                  this.description = next.Item.DescriptionAr;
                  this.body = next.Item.BodyAr;
                  break;
                }
                case 'de': {
                  this.title = next.Item.TitleDe;
                  this.description = next.Item.DescriptionDe;
                  this.body = next.Item.BodyDe;
                  break;
                }
                default: {
                  this.title = next.Item.TitleFa;
                  this.description = next.Item.DescriptionFa;
                  this.body = next.Item.BodyFa;
                  break;
                }
              }

            } else {
              this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
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
            if (next.IsSuccess) {
             
              switch (this.lang) {
                case 'fa': {
                  this.title = next.Item.TitleFa;
                  this.description = next.Item.DescriptionFa;
                  this.body = next.Item.BodyFa;
                  break;
                }
                case 'en': {
                  this.title = next.Item.TitleEn;
                  this.description = next.Item.DescriptionEn;
                  this.body = next.Item.BodyEn;
                  break;
                }
                case 'ar': {
                  this.title = next.Item.TitleAr;
                  this.description = next.Item.DescriptionAr;
                  this.body = next.Item.BodyAr;
                  break;
                }
                case 'de': {
                  this.title = next.Item.TitleDe;
                  this.description = next.Item.DescriptionDe;
                  this.body = next.Item.BodyDe;
                  break;
                }
                default: {
                  this.title = next.Item.TitleFa;
                  this.description = next.Item.DescriptionFa;
                  this.body = next.Item.BodyFa;
                  break;
                }
              }

            } else {
              this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
            }
          },
          (error) => {
            this.cmsToastrService.typeError(error);
          })
      ).toPromise();

    }
  }

  onActionBottunClick() {
      this.bodyShow = true;
      this.cdr.detectChanges();
  }
  onActionCloseBottunClick() {
    this.bodyShow = false;
    this.cdr.detectChanges();
  }
}
