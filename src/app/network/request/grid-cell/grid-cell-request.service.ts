import { Injectable } from '@angular/core';
import { classToPlain } from 'class-transformer';
import { IService } from 'src/app/business/Ibusiness';
import { BatchRequest } from '../../model/batch-request.model';
import { BatchResult } from '../../model/batch-result.model';
import { EventNumberStatistic } from '../../model/event-number-statistic.model';
import { GridCellNumberStatisticComparison } from '../../model/grid-cell-number-statistic-comparison.model';
import { GridCellNumberStatisticV2 } from '../../model/grid-cell-number-statistic-v2.model';
import { GridCellNumberStatistic } from '../../model/grid-cell-number-statistic.model';
import { GridCell } from '../../model/grid-cell.model';
import { PagedList } from '../../model/page_list.model';
import { GridCellUrl } from '../../url/garbage/grid-cells.url';
import {
  BaseRequestService,
  BaseTypeRequestService,
} from '../base-request.service';
import { HowellAuthHttpService } from '../howell-auth-http.service';
import { IParams } from '../IParams.interface';
import {
  GetGridCellEventNumbersParams,
  GetGridCellsParams,
  GetGridCellStatisticComparisonParams,
  GetGridCellStatisticNumbersParams,
  GetGridCellStatisticNumbersParamsV2,
} from './grid-cell-request.params';

@Injectable({
  providedIn: 'root',
})
export class GridCellRequestService {
  basic: BaseRequestService;
  type: BaseTypeRequestService<GridCell>;
  constructor(private _http: HowellAuthHttpService) {
    this.basic = new BaseRequestService(_http);
    this.type = this.basic.type(GridCell);
  }
  delete(id: string): Promise<GridCell> {
    let url = GridCellUrl.item(id);
    return this.type.delete(url);
  }
  get(id: string): Promise<GridCell> {
    let url = GridCellUrl.item(id);
    return this.type.get(url);
  }
  update(data: GridCell): Promise<GridCell> {
    let url = GridCellUrl.item(data.Id);
    return this.type.put(url, data);
  }
  create(data: GridCell): Promise<GridCell> {
    let url = GridCellUrl.basic();
    return this.type.post(url, data);
  }
  list(params: GetGridCellsParams): Promise<PagedList<GridCell>> {
    let url = GridCellUrl.list();
    let data = classToPlain(params);
    return this.type.paged(url, data);
  }

  garbageStations(id: string, request: BatchRequest): Promise<BatchResult> {
    let url = GridCellUrl.garbagestations(id);
    return this.basic.post(url, BatchResult, request);
  }

  private _eventNumber?: EventNumbersService;
  public get eventNumber(): EventNumbersService {
    if (!this._eventNumber) {
      this._eventNumber = new EventNumbersService(this.basic);
    }
    return this._eventNumber;
  }
  private _statistic?: StatisticService;
  public get statistic(): StatisticService {
    if (!this._statistic) {
      this._statistic = new StatisticService(this.basic);
    }
    return this._statistic;
  }
}

class EventNumbersService {
  constructor(private basic: BaseRequestService) { }
  private _history?: EventNumbersHistoryService;
  public get history(): EventNumbersHistoryService {
    if (!this._history) {
      this._history = new EventNumbersHistoryService(this.basic);
    }
    return this._history;
  }
}
class EventNumbersHistoryService {
  constructor(private basic: BaseRequestService) { }
  list(
    gridCellId: string,
    params: GetGridCellEventNumbersParams
  ): Promise<PagedList<EventNumberStatistic>> {
    let url = GridCellUrl.eventNumber(gridCellId).history.list();
    let data = classToPlain(params);
    return this.basic.paged(url, EventNumberStatistic, data);
  }
}
class StatisticService {
  constructor(private basic: BaseRequestService) { }
  private _number?: StatisticNumberService;
  public get number(): StatisticNumberService {
    if (!this._number) {
      this._number = new StatisticNumberService(this.basic);
    }
    return this._number;
  }
}
class StatisticNumberService {
  constructor(private basic: BaseRequestService) { }

  list(
    params: GetGridCellStatisticNumbersParams
  ): Promise<PagedList<GridCellNumberStatistic>> {
    let url = GridCellUrl.statistic.number.list();
    let data = classToPlain(params);
    return this.basic.paged(url, GridCellNumberStatistic, data);
  }

  comparison(
    params: GetGridCellStatisticComparisonParams
  ): Promise<GridCellNumberStatisticComparison[]> {
    let url = GridCellUrl.statistic.number.comparison();
    let data = classToPlain(params);
    return this.basic.postArray(url, GridCellNumberStatisticComparison, data);
  }

  private _history?: StatisticNumberHistoryService;
  public get history(): StatisticNumberHistoryService {
    if (!this._history) {
      this._history = new StatisticNumberHistoryService(this.basic);
    }
    return this._history;
  }
}
class StatisticNumberHistoryService {
  constructor(private basic: BaseRequestService) { }
  list(
    params: GetGridCellStatisticNumbersParamsV2
  ): Promise<GridCellNumberStatisticV2[]> {
    let url = GridCellUrl.statistic.number.history.list();
    let data = classToPlain(params);
    return this.basic.postArray(url, GridCellNumberStatisticV2, data);
  }
}
