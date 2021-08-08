import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileManager2Component } from './filemanager.component';
import { CommonModule } from '@angular/common';
import { FileManagerExplorerComponent } from './explorer/explorer.component';
import { FileManagerApiService } from './filemanagerApi.Service';
import { FileManagerService } from './filemanager.service';

@NgModule({
    imports: [
        CommonModule,
        //  ContextMenuModule.forRoot(), 
        FormsModule,
        //  BrowserAnimationsModule, 
        //  ToastrModule.forRoot(),
        //   NgUploaderModule
    ],
    exports: [
        FileManager2Component,
        FileManagerExplorerComponent,
    ],
    declarations: [
        FileManager2Component,
        FileManagerExplorerComponent,
        // TreeNodeComponent,
        // FileManagerDirTreeComponent,
        // TreeFolderFilterPipe,
        // FilemanagerHeaderComponent, ModelPopupsComponent, FileSizePipe, FileUploadModalComponent
    ],
    providers: [
        FileManagerApiService,
        FileManagerService
        // FileManagerService, FileManagerApiService
    ],
    entryComponents: [
        // FileUploadModalComponent
    ]
})
export class CmsFileManager2Module { }
