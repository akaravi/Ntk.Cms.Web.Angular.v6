import { Component, Input, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoreGuideService } from 'ntk-cms-api';
import { map } from 'rxjs/operators';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-cms-guide',
  templateUrl: './cms-guide.component.html',
  styleUrls: ['./cms-guide.component.scss']
})
export class CmsGuideComponent implements OnInit {

  @Input() Identity: number;
  @Input() Key: string;
  @Input() title: string;
  @Input() message: string;
  @Input() btnOkText: string;
  show = true;
  constructor(
    // private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private coreGuideService: CoreGuideService,
    private cmsToastrService: CmsToastrService,
  ) { }
  closeResult = '';
  ngOnInit(): void {

  }
  onActionGuideClick(content): void {
    if (this.Identity > 0) {
      this.coreGuideService.ServiceGetOneById(this.Identity).pipe(
        map(
          (next) => {
            if (next.IsSuccess) {
              this.title = next.Item.Title;
              this.message = next.Item.BodyFa;
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
