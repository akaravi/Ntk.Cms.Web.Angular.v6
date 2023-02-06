import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[cmsTooltip]'
})
export class TooltipDirective {
  @Input('cmsTooltip')
  tooltipTitle: string;
  @Input() placement: string;
  @Input() delay: number;
  cmsTooltip: HTMLElement;
  // 호스트 요소와 cmsTooltip 요소 간의 거리
  offset = 10;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) { }

  @HostListener('mouseenter') onMouseEnter(): void {

    if (!this.cmsTooltip) { this.show(); }
  }

  @HostListener('mouseleave') onMouseLeave(): void {

    if (this.cmsTooltip) { this.hide(); }
  }

  show(): void {

    this.create();
    this.setPosition();
    this.renderer.addClass(this.cmsTooltip, 'ng-cmsTooltip-show');
  }

  hide(): void {

    this.renderer.removeClass(this.cmsTooltip, 'ng-cmsTooltip-show');
    window.setTimeout(() => {
      this.renderer.removeChild(document.body, this.cmsTooltip);
      this.cmsTooltip = null;
    }, this.delay);
  }

  create(): void {
    this.cmsTooltip = this.renderer.createElement('span');

    this.renderer.appendChild(
      this.cmsTooltip,
      this.renderer.createText(this.tooltipTitle) // textNode
    );

    this.renderer.appendChild(document.body, this.cmsTooltip);
    // this.renderer.appendChild(this.el.nativeElement, this.cmsTooltip);

    this.renderer.addClass(this.cmsTooltip, 'ng-cmsTooltip');
    this.renderer.addClass(this.cmsTooltip, `ng-cmsTooltip-${this.placement}`);

    // delay 설정
    this.renderer.setStyle(this.cmsTooltip, '-webkit-transition', `opacity ${this.delay}ms`);
    this.renderer.setStyle(this.cmsTooltip, '-moz-transition', `opacity ${this.delay}ms`);
    this.renderer.setStyle(this.cmsTooltip, '-o-transition', `opacity ${this.delay}ms`);
    this.renderer.setStyle(this.cmsTooltip, 'transition', `opacity ${this.delay}ms`);
  }

  setPosition(): void {
    // 호스트 요소의 사이즈와 위치 정보
    const hostPos = this.el.nativeElement.getBoundingClientRect();

    // cmsTooltip 요소의 사이즈와 위치 정보
    const tooltipPos = this.cmsTooltip.getBoundingClientRect();

    // window의 scroll top
    // getBoundingClientRect 메소드는 viewport에서의 상대적인 위치를 반환한다.
    // 스크롤이 발생한 경우, cmsTooltip 요소의 top에 세로 스크롤 좌표값을 반영하여야 한다.
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    let top, left;

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

    // 스크롤이 발생한 경우, cmsTooltip 요소의 top에 세로 스크롤 좌표값을 반영하여야 한다.
    this.renderer.setStyle(this.cmsTooltip, 'top', `${top + scrollPos}px`);
    this.renderer.setStyle(this.cmsTooltip, 'left', `${left}px`);
  }
}
