import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModuleService } from 'ntk-cms-api';
import { CoreComponent } from './core.component';
import { CoreRoutes } from './core.routing';

@NgModule({
  imports: [
    CoreRoutes,
    CommonModule,
    // FormsModule,
    // ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    // SharedModule.forRoot(),
    // AngularEditorModule,
  ],
  declarations: [
    CoreComponent,
  ],
  exports: [

  ],
  providers: [
    CoreModuleService
  ]
})
export class CoreModule { }
