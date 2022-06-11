import { EnumDeviceType, EnumOperatingSystemType } from 'ntk-cms-api';
export const environment = {
  production: false,
  appVersion: '14.0.0000.0',
  USERDATA_KEY: 'authf649fc9a5f55',
  loadDemoDashboard: false,
  ProgressConsoleLog: false,
  leafletUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  cmsServerConfig: {
    configApiRetry: 1,
      // configApiServerPath: 'https://apicms.ir/api/v2/',
    //configApiServerPath: 'http://localhost:2390/api/v1/', // Test Api
     // configApiServerPath: 'https://localhost:49155/api/v2/', // Test Api Docer
     configApiServerPath: 'https://localhost:7128/api/v2/', // Test Api 

    configMvcServerPath: 'https://ntkcms.ir/',
    // configMvcServerPath: 'http://localhost:2391/', // Test Api

    // configHtmlBuilderServerPath: 'https://htmlbuilder.ntkcms.ir/',
    configHtmlBuilderServerPath: 'http://localhost:5000/', // Test Api

    configFileServerPath: 'https://apifile.ir/api/v2/',
    // configFileServerPath: 'http://localhost:2392/api/v1/' // Test Api
    configQDocServerPath: 'https://qdoc.ir/api/chat',
    configCompanyWebSite: 'https://ntk.ir'
  },
  cmsTokenConfig: {
    SecurityKey: '123456789',
    ClientMACAddress: '',
    OSType: EnumOperatingSystemType.Windows,
    DeviceType: EnumDeviceType.WebSite,
    PackageName: '',
  }
};
