import { EnumDeviceType, EnumOperatingSystemType } from 'ntk-cms-api';

export const environment = {
  production: true,
  checkAccess:false,
  appVersion: '14.1.0820.2',
  authKey: 'authf649fc9a5f55',
  loadDemoDashboard: false,
  ProgressConsoleLog: false,
  leafletUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  cmsServerConfig: {
    configApiRetry: 1,
    configApiServerPath: 'https://apicms.ir/api/v2/',
    configMvcServerPath: 'https://ntkcms.ir/',
    configHtmlBuilderServerPath: 'https://htmlbuilder.ntkcms.ir/',
    configFileServerPath: 'https://apifile.ir/api/v2/',
    configQDocServerPath: 'https://qdoc.ir/api/chat',
    configCompanyWebSite: 'https://ntk.ir',
    modules:['']
  },

  cmsTokenConfig: {
    SecurityKey: '123456789',
    ClientMACAddress: '',
    OSType: EnumOperatingSystemType.Windows,
    DeviceType: EnumDeviceType.WebSite,
    PackageName: '',
  }
};

