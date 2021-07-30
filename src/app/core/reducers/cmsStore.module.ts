import { ModuleWithProviders, NgModule } from '@angular/core';
import { CmsStoreService } from './cmsStore.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [CmsStoreService]
})
export class CmsStoreModule {
  // **karavi:need This For Singelton Stor */
  public static forRoot(): ModuleWithProviders<CmsStoreModule> {
    return {
      ngModule: CmsStoreModule,
      providers: [CmsStoreService]
    };
  }
}
