import { EnumDeviceType, EnumOperatingSystemType } from 'ntk-cms-api';
export const environment = {
  production: false,
  appVersion: '13.0.0000.0',
  USERDATA_KEY: 'authf649fc9a5f55',
  loadDemoMenu: false,
  loadDemoDashboard: false,
  ProgressConsoleLog: false,
  leafletUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  cmsServerConfig: {
    configApiRetry: 1,
     configApiServerPath: 'https://apicms.ir/api/v1/',
     // configApiServerPath: 'http://localhost:2390/api/v1/', // Test Api
    // configApiServerPath: 'http://localhost:49155/api/v1/', // Test Api Docer

    configMvcServerPath: 'https://ntkcms.ir/',
    // configMvcServerPath: 'http://localhost:2391/', // Test Api

    // configHtmlBuilderServerPath: 'https://htmlbuilder.ntkcms.ir/',
    configHtmlBuilderServerPath: 'http://localhost:5000/', // Test Api

    configFileServerPath: 'https://apifile.ir/api/v1/',
    // configFileServerPath: 'http://localhost:2392/api/v1/' // Test Api
    configQDocServerPath: 'https://qdoc.ir/api/chat',
  },
  cmsUiConfig: {
    Pathlogin: '/auth/singin',
    Pathlogout: '/auth/singout',
    PathRegistery: '/auth/singup',
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
