import { Component, OnInit } from '@angular/core';
import { TreeModel } from 'projects/ntk-cms-filemanager/src/public-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-file-content-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class FileContentExplorerComponent implements OnInit {

  constructor(public publicHelper: PublicHelper  ) {
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  appLanguage = 'fa';
  fileManagerOpenForm = true;
  fileManagerTree: TreeModel;
  selectFileType = [];
  ngOnInit(): void {
  }
}
