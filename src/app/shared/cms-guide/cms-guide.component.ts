import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoreGuideService } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-cms-guide',
  templateUrl: './cms-guide.component.html',
  styleUrls: ['./cms-guide.component.scss']
})
export class CmsGuideComponent implements OnInit ,OnDestroy {

  @Input() Identity: number;
  @Input() Key: string;
  @Input() title: string;
  @Input() message: string;
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
      this.lang = value.Language;

    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.lang = next.Language;
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
            if (next.IsSuccess) {
              switch (this.lang) {
                case 'fa': {
                  this.title = next.Item.TitleFa;
                  this.message = next.Item.BodyFa;
                  break;
                }
                case 'en': {
                  this.title = next.Item.TitleEn;
                  this.message = next.Item.BodyEn;
                  break;
                }
                case 'ar': {
                  this.title = next.Item.TitleAr;
                  this.message = next.Item.BodyAr;
                  break;
                }
                case 'de': {
                  this.title = next.Item.TitleDe;
                  this.message = next.Item.BodyDe;
                  break;
                }
                default: {
                  this.title = next.Item.TitleFa;
                  this.message = next.Item.BodyFa;
                  break;
                }
              }
              this.open(content);
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
              // this.title = next.Item.Title;
              // this.message = next.Item.BodyFa;
              this.open(content);
            } else {
              this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
            }
          },
          (error) => {
            this.cmsToastrService.typeError(error);
          })
      ).toPromise();

    } else if (this.message && this.message.length > 0) {
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
