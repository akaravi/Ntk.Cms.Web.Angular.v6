import { EnumModel, ErrorExceptionResult, TokenInfoModel } from 'ntk-cms-api';

export interface ReducerCmsStore {
    // tokenInfoModelStore: TokenInfoModel;
    EnumRecordStatusModelStore: ErrorExceptionResult<EnumModel> ;
  }
