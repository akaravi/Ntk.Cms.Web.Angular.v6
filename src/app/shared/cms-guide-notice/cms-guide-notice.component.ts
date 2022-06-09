import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
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
      this.lang = value.language;
      this.onGetOne();
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.lang = next.language;
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

            } else {
              this.cmsToastrService.typeErrorMessage(next.errorMessage);
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
