import { Component, OnInit } from '@angular/core';
import { TreeModel } from 'ntk-cms-filemanager';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';

@Component({
  selector: 'app-file-content-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class FileContentExplorerComponent implements OnInit {

  constructor(public publicHelper: PublicHelper) {
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  appLanguage = 'fa';
  fileManagerOpenForm = true;
  fileManagerTree: TreeModel;
  selectFileType = [];
  ngOnInit(): void {
  }
}
