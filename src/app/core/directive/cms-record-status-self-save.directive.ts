import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  Renderer2
} from '@angular/core';
import { EnumRecordStatus } from 'ntk-cms-api';
import { PublicHelper } from '../helpers/publicHelper';
import { CmsToastrService } from '../services/cmsToastr.service';

const SUCCESS_ICON = 'https://i.pinimg.com/originals/7b/dd/1b/7bdd1bc7db7fd48025d4e39a0e2f0fd8.jpg';
const ERROR_ICON = 'https://www.seekpng.com/png/detail/334-3345964_error-icon-download-attention-symbol.png';
const LOADING_ICON = 'https://replit.com/public/images/loading_dots.gif';
/**
 * `persistOnChange` directive takes an Input - @param observableFn which @returns an Observable ideally returned by an http request.
 * and shows loader when the request is in-flight and  shows a tick mark on API success.
 * In API failure cases, shows the error message below the host.
 * Ideally to be used with the Select element(not limitted to)
 */
@Directive({
  selector: '[cmsRecordStatusSelfSave]'
})
export class CmsRecordStatusSelfSaveDirective {
  @Input('row')
  row: any;
  @Input('contentService')
  contentService: any;
  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    public publicHelper: PublicHelper,
    public cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document,
    // @Optional() @Host() select: SelectControlValueAccessor
  ) {

    this.getEnumRecordStatus();
  }
  async getEnumRecordStatus(): Promise<void> {
    const dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
    dataModelEnumRecordStatusResult.ListItems.forEach(co => {
      const option = document.createElement('option');
      option.innerHTML = ' '+co.Title + ' ' + '<i Class="' + this.iconStatus(co.Value) + '"></i>';
      option.value = co.Value.toString();
      this.elRef.nativeElement.add(option);
    });

    if (this.elRef.nativeElement.options.length > 0 && this.row && this.row.RecordStatus) {
      this.renderer.setProperty(this.elRef.nativeElement, 'value', this.row.RecordStatus);
    }
  }

  @HostListener('change')
  onChange() {
    const element: HTMLElement = this.elRef.nativeElement;
    const recordStatus = element['value'] as EnumRecordStatus;
    this.addLoader(element);
    this.contentService.ServiceSetStatus(this.row.Id, recordStatus).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.handleSuccessCase(element);
          this.cmsToastrService.typeSuccessSetStatus(next.ErrorMessage);
          this.row.RecordStatus = recordStatus|0;
          this.cdr.markForCheck();
        }
        else {
          this.renderer.setProperty(this.elRef.nativeElement, 'value', this.row.RecordStatus);
          this.cmsToastrService.typeErrorSetStatus(next.ErrorMessage);
          this.handleErrorCase(element);
        }
      },
      (error) => {
        this.renderer.setProperty(this.elRef.nativeElement, 'value', this.row.RecordStatus);
        this.cmsToastrService.typeError(error);
        this.handleErrorCase(element);
      }

    );
  }

  handleSuccessCase(element: HTMLElement) {
    this.removeBackground(element);
    this.addSuccess(element);
    setTimeout(() => {
      this.removeBackground(element);
    }, 1000);
  }

  handleErrorCase(element) {
    this.removeBackground(element);
    const child = this.document.createElement('img');
    child.style.width = '20px';
    child.src = ERROR_ICON;
    const parent = this.renderer.parentNode(this.elRef.nativeElement);
    this.renderer.appendChild(parent, child);
    setTimeout(() => {
      this.renderer.removeChild(parent, child);
    }, 1000);
  }

  addLoader(element: HTMLElement) {
    this.addBackground(element, LOADING_ICON, 20);
  }
  addSuccess(element: HTMLElement) {
    this.addBackground(element, SUCCESS_ICON, 20);
  }

  addBackground(
    element: HTMLElement,
    backgroundImg: string,
    backgroundSize: number
  ) {
    element.style.background = `#fff url("${backgroundImg}") no-repeat right 20px center`;
    element.style.backgroundSize = `${backgroundSize}px`;
  }

  removeBackground(element: HTMLElement) {
    element.style.background = 'none';
  }
  iconStatus(value: EnumRecordStatus): string {
    let ret = '';
    switch (value) {
      case 1:
        ret = 'fa fa-check';
        break;
      case 2:
        ret = 'fa fa-eye-slash';
        break;
      case 3:
        ret = 'fa fa-times';
        break;
      case 4:
        ret = 'fa fa-hourglass-half';
        break;
      case 5:
        ret = 'far fa-thumbs-down';
        break;
      case 6:
        ret = 'fa fa-archive';
        break;
      default:
        ret = 'fa fa-check';
    }
    return ret;
  }
}
// <select selfSave [observableFn]="post()">
//   <option value="One">One</option>
//   <option value="Two">Two</option>
// </select>