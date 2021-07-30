import { EnumModel, ErrorExceptionResult, TokenInfoModel } from 'ntk-cms-api';

export interface ReducerCmsStore {
    tokenInfoModelState: TokenInfoModel;
    EnumRecordStatus: ErrorExceptionResult<EnumModel> ;
  }
