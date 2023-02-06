import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  Renderer2
} from '@angular/core';
import { Observable } from 'rxjs';

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
  selector: '[cmsSelfSave]'
})
export class SelfSaveDirective {
  @Input('observableFn')
  observableFn!: () => Observable<any>;
  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) { }
  @HostListener('change')
  onChange() {
    if (this.observableFn instanceof Function) {
      const element: HTMLElement = this.elRef.nativeElement;

      this.addLoader(element);
      const changeObservable: Observable<unknown> = this.observableFn();
      changeObservable.subscribe(
        _ => {
          this.handleSuccessCase(element);
        },
        _ => {
          this.handleErrorCase(element);
        }
      );
    }
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
}
// <select selfSave [observableFn]="post()">
//   <option value="One">One</option>
//   <option value="Two">Two</option>
// </select>
