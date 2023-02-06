import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CoreSiteService, FilterModel } from 'ntk-cms-api';
import { Observable } from 'rxjs';

@Injectable()
export class CoreSiteResolver implements Resolve<any> {

    filterModel = new FilterModel();

    constructor(private coreSiteService: CoreSiteService) {
    }

    resolve(): Observable<any> {
        return this.coreSiteService.ServiceGetAll(this.filterModel);
    }
}
