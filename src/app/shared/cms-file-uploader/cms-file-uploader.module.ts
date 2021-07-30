import { CmsFileUploaderComponent } from './cms-file-uploader.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FilePickerModule } from 'ngx-awesome-uploader';


@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    FilePickerModule
  ],
  declarations: [
    CmsFileUploaderComponent,

  ],
  exports: [
    CmsFileUploaderComponent
  ],
  providers: [

  ]

})
export class CmsFileUploaderModule {

}
