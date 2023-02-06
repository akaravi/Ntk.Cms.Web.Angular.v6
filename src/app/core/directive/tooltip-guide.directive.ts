import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { CoreGuideService } from 'ntk-cms-api';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PublicHelper } from '../helpers/publicHelper';
import { TokenHelper } from '../helpers/tokenHelper';
import { CmsToastrService } from '../services/cmsToastr.service';

@Directive({
  selector: '[cmsTooltipGuide]'
})
export class TooltipGuideDirective {
  @Input() tooltipGuide: string;
  @Input() cmsTooltipGuide: number;
  @Input() placement: string;
  @Input() delay: number;
  tooltip: HTMLElement;

  // 호스트 요소와 tooltip 요소 간의 거리
  offset = 10;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private tokenHelper: TokenHelper,
    private publicHelper: PublicHelper,
    private coreGuideService: CoreGuideService,
    private cmsToastrService: CmsToastrService,
  ) {
    this.tokenHelper.getCurrentToken().then((value) => {
      this.lang = value.language;

    });

  }

  lang = '';
  statusIsRun = false;

  @HostListener('mouseenter') onMouseEnter(): void {
    if (!this.tooltip) {
      this.tokenHelper.getCurrentToken().then((value) => {
        this.lang = value.language;
      });
      this.show();
    }
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.statusIsRun = false;

    if (this.tooltip) { this.hide(); }
  }

  show(): void {
    if (this.cmsTooltipGuide && this.cmsTooltipGuide > 0) {
      this.statusIsRun = true;
      this.coreGuideService.ServiceGetOneById(this.cmsTooltipGuide).pipe(
        map(
          (next) => {
            if (this.statusIsRun == false) {
              if (this.tooltip) { this.hide(); }
              return;
            }
            if (next.isSuccess) {
              /*run */
              switch (this.lang) {
                case 'fa': {
                  this.create(next.item.descriptionFa);
                  break;
                }
                case 'en': {
                  this.create(next.item.descriptionEn);
                  break;
                }
                case 'ar': {
                  this.create(next.item.descriptionAr);
                  break;
                }
                case 'de': {
                  this.create(next.item.descriptionDe);
                  break;
                }
                default: {
                  this.create(next.item.descriptionFa);
                  break;
                }
              }

              this.setPosition();
              this.renderer.addClass(this.tooltip, 'ng-tooltip-show');
              /*run */
            } else {
              if (!environment.production) {
                //console.log('tooltip',next.errorMessage);
                this.cmsToastrService.typeErrorMessage("kay:" + this.cmsTooltipGuide + "-" + next.errorMessage);
              }
              /*run */
              this.create('Identity :' + this.cmsTooltipGuide);
              this.setPosition();
              this.renderer.addClass(this.tooltip, 'ng-tooltip-show');
              /*run */
            }
          },
          (error) => {
            if (!environment.production) {
              this.cmsToastrService.typeError("kay:" + this.cmsTooltipGuide + "-" + error);
            }
          })
      ).toPromise();
    } else if (this.tooltipGuide && this.tooltipGuide.length > 0) {
      this.statusIsRun = true;
      this.coreGuideService.ServiceGetOneByKey(this.tooltipGuide).pipe(
        map(
          (next) => {
            if (this.statusIsRun == false) {
              if (this.tooltip) { this.hide(); }
              return;
            }
            if (next.isSuccess) {
              /*run */
              switch (this.lang) {
                case 'fa': {
                  this.create(next.item.descriptionFa);
                  break;
                }
                case 'en': {
                  this.create(next.item.descriptionEn);
                  break;
                }
                case 'ar': {
                  this.create(next.item.descriptionAr);
                  break;
                }
                case 'de': {
                  this.create(next.item.descriptionDe);
                  break;
                }
                default: {
                  this.create(next.item.descriptionFa);
                  break;
                }
              }
              this.setPosition();
              this.renderer.addClass(this.tooltip, 'ng-tooltip-show');
              /*run */
            } else {
              if (!environment.production) {
                // console.log('tooltip',next.errorMessage);
                this.cmsToastrService.typeErrorMessage("kay:" + this.cmsTooltipGuide + "-" + next.errorMessage);
              }
              /*run */
              this.create('Key :' + this.tooltipGuide);
              this.setPosition();
              this.renderer.addClass(this.tooltip, 'ng-tooltip-show');
              /*run */
            }
          },
          (error) => {
            if (!environment.production) {
              this.cmsToastrService.typeError("kay:" + this.cmsTooltipGuide + "-" + error);
            }
          })
      ).toPromise();
    }
  }

  hide(): void {

    this.renderer.removeClass(this.tooltip, 'ng-tooltip-show');
    window.setTimeout(() => {
      this.renderer.removeChild(document.body, this.tooltip);
      this.tooltip = null;
    }, this.delay);
  }

  create(text: string): void {
    this.tooltip = this.renderer.createElement('span');
    text = text + '';
    if (text.indexOf('</') > 0 || text.indexOf('/>') > 0 || this.publicHelper.checkIsHTML(text)) {
      this.tooltip.insertAdjacentHTML('beforeend', text);
    } else {
      this.renderer.appendChild(
        this.tooltip,
        this.renderer.createText(text) // textNode
      );
    }



    this.renderer.appendChild(document.body, this.tooltip);
    // this.renderer.appendChild(this.el.nativeElement, this.tooltip);

    this.renderer.addClass(this.tooltip, 'ng-tooltip');
    this.renderer.addClass(this.tooltip, `ng-tooltip-${this.placement}`);

    // delay 설정
    this.renderer.setStyle(this.tooltip, '-webkit-transition', `opacity ${this.delay}ms`);
    this.renderer.setStyle(this.tooltip, '-moz-transition', `opacity ${this.delay}ms`);
    this.renderer.setStyle(this.tooltip, '-o-transition', `opacity ${this.delay}ms`);
    this.renderer.setStyle(this.tooltip, 'transition', `opacity ${this.delay}ms`);
  }

  setPosition(): void {
    // 호스트 요소의 사이즈와 위치 정보
    const hostPos = this.el.nativeElement.getBoundingClientRect();

    // tooltip 요소의 사이즈와 위치 정보
    const tooltipPos = this.tooltip.getBoundingClientRect();

    // window의 scroll top
    // getBoundingClientRect 메소드는 viewport에서의 상대적인 위치를 반환한다.
    // 스크롤이 발생한 경우, tooltip 요소의 top에 세로 스크롤 좌표값을 반영하여야 한다.
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    let top = 0;
    let left = 0;

    if (this.placement === 'top') {
      top = hostPos.top - tooltipPos.height - this.offset;
      left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
    }

    if (this.placement === 'bottom') {
      top = hostPos.bottom + this.offset;
      left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
    }

    if (this.placement === 'left') {
      top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
      left = hostPos.left - tooltipPos.width - this.offset;
    }

    if (this.placement === 'right') {
      top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
      left = hostPos.right + this.offset;
    }

    // 스크롤이 발생한 경우, tooltip 요소의 top에 세로 스크롤 좌표값을 반영하여야 한다.
    this.renderer.setStyle(this.tooltip, 'top', `${top + scrollPos}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
  }
}
