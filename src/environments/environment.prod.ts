import { EnumDeviceType, EnumOperatingSystemType } from 'ntk-cms-api';

export const environment = {
  production: true,
  appVersion: '1.06.041',
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: true,
  apiUrl: 'https://your-domain.com/api',
  developing: false,
  loadDemoMenu: false,
  loadDemoDashboard: false,
  leafletUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  cmsServerConfig: {
    configApiRetry: 1,
    configApiServerPath: 'https://apicms.ir/api/v1/',
    configMvcServerPath: 'https://oco.ir',
    configFileServerPath: 'https://apifile.ir/api/v1/',
    configCpanelImages: '/cpanelv1/images/',
    configPathFileByIdAndName: 'https://oco.ir/files/',
    configRouteThumbnails: 'https://oco.ir/imageThumbnails/',
    configHtmlBuilderServerPath: 'https://htmlbuilder.ntkcms.com/',
    configHtmlViewServerPath: 'https://ntkcms.com/',
    configRouteUploadFileContent: 'upload/',
  },
  cmsUiConfig: {
    Pathlogin: '/auth/singin',
    Pathlogout: '/auth/singout',
    PathRegistery: '/auth/registery',
    PathSelectSite: '/core/site/select',
    Pathdashboard: '/dashboard/',
    ToolbarLinkUrlPath: 'https://ntk.ir',
  },
  cmsTokenConfig: {
    SecurityKey: '123456789',
    ClientMACAddress: '',
    OSType: EnumOperatingSystemType.Windows,
    DeviceType: EnumDeviceType.WebSite,
    PackageName: '',
  }
};

