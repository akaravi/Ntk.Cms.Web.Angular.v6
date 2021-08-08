import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileManager2Component } from './filemanager.component';
import { CommonModule } from '@angular/common';
import { FileManagerExplorerComponent } from './explorer/explorer.component';
import { FileManagerApiService } from './filemanagerApi.Service';
import { FileManagerService } from './filemanager.service';
import { ContextMenuModule } from 'ngx-contextmenu';
import { FileSizePipe } from './pipes/file-size.pipe';
import { FileManagerDirTreeComponent } from './side/side.component';
import { FileManagerTreeNodeComponent } from './side/tree.component';
import { TreeFolderFilterPipe } from './pipes/tree-folder-filter.pipe';
import { FilemanagerHeaderComponent } from './header/header.component';

@NgModule({
    imports: [
        CommonModule,
        ContextMenuModule.forRoot(),
        FormsModule,
        //  BrowserAnimationsModule, 
        //  ToastrModule.forRoot(),
        //   NgUploaderModule
    ],
    declarations: [
        FileManager2Component,
        FileManagerExplorerComponent,
        // TreeNodeComponent,
        FileManagerDirTreeComponent,
        FileManagerTreeNodeComponent,
        FilemanagerHeaderComponent,
        // ModelPopupsComponent,
        FileSizePipe,
        TreeFolderFilterPipe,
        // FileUploadModalComponent
    ],
    exports: [
        FileManager2Component,
        FileManagerExplorerComponent,
        FileManagerDirTreeComponent,
        FileManagerTreeNodeComponent,
        FilemanagerHeaderComponent,
    ],
    providers: [
        FileManagerApiService,
        FileManagerService
    ],
    entryComponents: [
        // FileUploadModalComponent
    ]
})
export class CmsFileManager2Module { }
