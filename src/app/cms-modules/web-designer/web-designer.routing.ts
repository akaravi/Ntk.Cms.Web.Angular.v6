import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebDesignerMainIntroAddComponent } from './intro/add/add.component';
import { WebDesignerMainIntroEditComponent } from './intro/edit/edit.component';
import { WebDesignerMainIntroListComponent } from './intro/list/list.component';
import { WebDesignerLogMemberInfoListComponent } from './log-member-info/list/list.component';
import { WebDesignerMainMenuListComponent } from './menu/list/list.component';
import { WebDesignerMainPageDependencyListComponent } from './page-dependency/list/list.component';
import { WebDesignerMainPageTemplateListComponent } from './page-template/list/list.component';
import { WebDesignerMainPageListGridComponent } from './page/list-grid/list-grid.component';
import { WebDesignerMainPageListComponent } from './page/list/list.component';
import { WebDesignerComponent } from './web-designer.component';
const routes: Routes = [
  {
    path: '',
    component: WebDesignerComponent,
    children: [
      /* Config */
      {
        path: 'config',
        loadChildren: () =>
          import('./config/web-designer-config.module').then((m) => m.WebDesignerConfigModule),
      },
      /* Config */
      /** */
      {
        path: 'intro',
        component: WebDesignerMainIntroListComponent
      },
      {
        path: 'intro/LinkPageId/:LinkPageId',
        component: WebDesignerMainIntroListComponent
      },
      {
        path: 'intro/add',
        component: WebDesignerMainIntroAddComponent
      },
      {
        path: 'intro/add/:LinkPageId',
        component: WebDesignerMainIntroAddComponent
      },
      {
        path: 'intro/edit/:Id',
        component: WebDesignerMainIntroEditComponent
      },
      /** */
      /** */
      {
        path: 'menu',
        component: WebDesignerMainMenuListComponent
      },
      /** */
      {
        path: 'logmemberinfo',
        component: WebDesignerLogMemberInfoListComponent
      },
      /** */
      {
        path: 'pagetemplate',
        component: WebDesignerMainPageTemplateListComponent
      },
      /** */
      /** */
      {
        path: 'pagedependency',
        component: WebDesignerMainPageDependencyListComponent
      },
      /** */
      {
        path: 'page',
        component: WebDesignerMainPageListComponent
      },
      {
        path: 'page/LinkPageTemplateGuId/:LinkPageTemplateGuId',
        component: WebDesignerMainPageListComponent
      },
      {
        path: 'page/LinkPageParentGuId/:LinkPageParentGuId',
        component: WebDesignerMainPageListComponent
      },
      {
        path: 'page/LinkPageDependencyGuId/:LinkPageDependencyGuId',
        component: WebDesignerMainPageListComponent
      },
      /** */
      {
        path: 'page/list-grid',
        component: WebDesignerMainPageListGridComponent
      },
      {
        path: 'page/list-grid/LinkPageTemplateGuId/:LinkPageTemplateGuId',
        component: WebDesignerMainPageListGridComponent
      },
      {
        path: 'page/list-grid/LinkPageParentGuId/:LinkPageParentGuId',
        component: WebDesignerMainPageListGridComponent
      },
      {
        path: 'page/list-grid/LinkPageDependencyGuId/:LinkPageDependencyGuId',
        component: WebDesignerMainPageListGridComponent
      },
      /** */
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebDesignerRoutes {
}
