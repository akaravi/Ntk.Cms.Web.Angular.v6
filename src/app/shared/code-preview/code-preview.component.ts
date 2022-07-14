import {
  Component,
  OnInit,
  Input,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import KTLayoutExamples from '../../../assets/js/layout/extended/examples';

@Component({
  selector: 'app-code-preview',
  templateUrl: './code-preview.component.html',
})
export class CodePreviewComponent implements OnInit, AfterViewInit {
  static nextId = 0;
  id = ++CodePreviewComponent.nextId;
  // Public properties
  @Input() viewItem: any;
  constructor(private el: ElementRef) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    const elements = this.el.nativeElement.querySelectorAll(
      '.example.example-compact'
    );
    KTLayoutExamples.init(elements);
  }
}
