import { Injectable } from '@angular/core';
import { CmsStore, CoreCurrencyModel, CoreModuleModel, CoreSiteModel, EnumInfoModel, ErrorExceptionResult } from 'ntk-cms-api';
import { ProcessInfoModel } from '../models/progressSpinnerModel';
import { ReducerCmsStore } from './reducer.factory';
const initialState: ReducerCmsStore = {
    CoreSiteResultStore: new ErrorExceptionResult<CoreSiteModel>(),
    CoreModuleResultStore: new ErrorExceptionResult<CoreModuleModel>(),
    EnumRecordStatusResultStore: new ErrorExceptionResult<EnumInfoModel>(),
    CurrencyResultStore: new ErrorExceptionResult<CoreCurrencyModel>(),
    processInfo: new Map<string, ProcessInfoModel>()
};
@Injectable({
    providedIn: 'root',
})
export class CmsStoreService extends CmsStore<ReducerCmsStore> {
    constructor() {
        super(initialState)
    }
}
