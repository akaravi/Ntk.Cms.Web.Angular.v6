import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApiTelegramComponent } from './api-telegram.component';
import { ApiTelegramBotConfigListComponent } from './bot-config/list/list.component';

const routes: Routes = [
  {
    path: '',
    component: ApiTelegramComponent,
     children: [
      /*Config*/
      {
        path: 'config',
        loadChildren: () =>
          import('./config/api-telegram-config.module').then((m) => m.ApiTelegramConfigModule),
      },
      /*Config*/
      {
        path: 'bot-config',
        component: ApiTelegramBotConfigListComponent
      },
    //   {
    //     path: 'source/edit/:Id',
    //     component: ApiTelegramSourceEditComponent
    //   },
    //   {
    //     path: 'app',
    //     component: ApiTelegramAppListComponent
    //   },
    //   {
    //     path: 'app/:SourceId',
    //     component: ApiTelegramAppListComponent
    //   },
    //   {
    //     path: 'app/add/:SourceId',
    //     component: ApiTelegramAppAddComponent
    //   },
    //   {
    //     path: 'app/edit/:Id',
    //     component: ApiTelegramAppEditComponent
    //   },
    //   {
    //     path: 'intro',
    //     component: ApiTelegramIntroListComponent
    //   },
    //   {
    //     path: 'intro/add/:ApiTelegramId',
    //     component: ApiTelegramIntroListComponent
    //   },
    //   {
    //     path: 'intro/edit/:Id',
    //     component: ApiTelegramIntroListComponent
    //   },
    //   {
    //     path: 'memberinfo',
    //     component: ApiTelegramMemberInfoListComponent
    //   },
    //   {
    //     path: 'notification',
    //     component: ApiTelegramNotificationListComponent
    //   },

    //   {
    //     path: 'themeconfig',
    //     component: ApiTelegramThemeConfigListComponent
    //   },
     ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApiTelegramRoutes {
}
