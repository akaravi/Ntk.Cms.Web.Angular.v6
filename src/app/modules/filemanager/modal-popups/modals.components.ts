
import { Component, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'rename-modal',
  template: `
  <div class="modal-header">
 
</div>        
  `
})
export class ModelPopupsComponent {
  newName: string
  constructor() { }

  openModal(template: TemplateRef<any>) {
    // return this.modalService.show(template);
  }
}