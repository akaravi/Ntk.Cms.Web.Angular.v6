import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GeneralModule } from '../../_metronic/partials/content/general/general.module';
import { BuilderComponent } from './builder.component';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslationModule } from 'src/app/core/i18n/translation.module';

@NgModule({
  declarations: [BuilderComponent],
  imports: [
    CommonModule,
    FormsModule,
    GeneralModule,
    NgbNavModule,
    NgbTooltipModule,
    TranslationModule,
    RouterModule.forChild([
      {
        path: '',
        component: BuilderComponent,
      },
    ]),
  ],
})
export class BuilderModule {}
