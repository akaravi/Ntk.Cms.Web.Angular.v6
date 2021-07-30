// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { EnumDeviceType, EnumOperatingSystemType } from 'ntk-cms-api';

export const environment = {
  production: false,
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: true,
  apiUrl: 'https://your-domain.com/api',
  developing: false,
  loadDemoMenu: true,
  appVersion: '1.05.011',
  leafletUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  cmsServerConfig: {
    configApiRetry: 1,
    configApiServerPath: 'https://apicms.ir/api/v1/',
    // configApiServerPath: 'http://localhost:2390/api/v1/', // Test Api
    configMvcServerPath: 'https://oco.ir',
    configCpanelImages: '/cpanelv1/images/',
    configPathFileByIdAndName: 'https://oco.ir/files/',
    configRouteThumbnails: 'https://oco.ir/imageThumbnails/',
    configHtmlBuilderServerPath: 'https://htmlbuilder.ntkcms.com/',
    // configHtmlBuilderServerPath: 'http://localhost:5000/', // Test Api
    configHtmlViewServerPath: 'https://ntkcms.com/',
    // configHtmlViewServerPath: 'https://localhost:2391/', // Test Api
    configRouteUploadFileContent: 'https://apifile.ir/api/v1/upload/',
    // configRouteUploadFileContent: 'https://apicms.ir/api/v1/upload/', // Test Api
    // configRouteUploadFileContent: 'http://localhost:2392/api/v1/upload/' // Test Api
  },
  cmsUiConfig: {
    Pathlogin: '/auth/singin',
    Pathlogout: '/auth/singout',
    PathRegistery: '/auth/singup',
    PathSelectSite: '/core/site/select',
    Pathdashboard: '/dashboard/',
  },
  cmsTokenConfig: {
    SecurityKey: '123456789',
    ClientMACAddress: '',
    OSType: EnumOperatingSystemType.Windows,
    DeviceType: EnumDeviceType.WebSite,
    PackageName: '',
  }
};
