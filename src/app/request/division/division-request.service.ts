import { Injectable } from '@angular/core';
import { Division } from 'src/app/network/model/division.model';
import { HowellResponse } from 'src/app/network/model/howell-response.model';
import { PagedList } from 'src/app/network/model/page-list.model';

import { DivisionsParams } from './division-request.params';

import { IBusiness } from 'src/app/business/Ibusiness';
import { HowellAuthHttpService } from 'src/app/network/request/howell-auth-http.service';
import { DivisionUrl } from 'src/app/network/url/garbage/division.url';
import { ServiceHelper } from 'src/app/network/request/service-helper';

@Injectable({
  providedIn: 'root',
})
export class DivisionRequestService implements IBusiness<Division> {
  constructor(private _howellHttpService: HowellAuthHttpService) {}
  create(data: Division): Promise<Division> {
    throw new Error('Method not implemented.');
  }

  async list(
    params: DivisionsParams = new DivisionsParams()
  ): Promise<PagedList<Division>> {
    params.AncestorId = '310109011000';
    params.DivisionType = 4;
    let response = await this._howellHttpService
      .post<DivisionsParams, HowellResponse<PagedList<Division>>>(
        DivisionUrl.list(),
        params
      )
      .toPromise();
    console.log('response', response);
    return ServiceHelper.ResponseProcess(response, Division);
  }
  get(): Promise<Division> {
    throw new Error('Method not implemented.');
  }
  update(data: Division): Promise<Division> {
    throw new Error('Method not implemented.');
  }
}
