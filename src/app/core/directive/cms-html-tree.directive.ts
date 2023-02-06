import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[cmsHtmlTreeHeader]'
})
export class CmsHtmlTreeHeaderDirective {
  constructor(
    private el: ElementRef,
  ) { }
  host: {
    '[style.background-color]': '"yellow"',
  }
}
@Directive({
  selector: '[cmsHtmlTreeAction]'
})
export class CmsHtmlTreeActionDirective {
  constructor(
    private el: ElementRef,
  ) { }
  host: {
    '[style.background-color]': '"yellow"',
  }
}
@Directive({
  selector: '[cmsHtmlTreeBody]'
})
export class CmsHtmlTreeBodyDirective {
  constructor(
    private el: ElementRef,
  ) { }
  host: {
    '[style.background-color]': '"yellow"',
  }
}
@Directive({
  selector: '[cmsHtmlTreeFooter]'
})
export class CmsHtmlTreeFooterDirective {
  constructor(
    private el: ElementRef,
  ) { }
  host: {
    '[style.background-color]': '"yellow"',
  }
}
