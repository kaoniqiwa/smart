import { EventEmitter, Injectable } from '@angular/core';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import {
  IConverter,
  IPromiseConverter,
} from 'src/app/common/interfaces/converter.interface';
import { ISubscription } from 'src/app/common/interfaces/subscribe.interface';
import { OrderType } from 'src/app/enum/order-type.enum';
import { TimeUnit } from 'src/app/enum/time-unit.enum';
import { StoreService } from 'src/app/global/service/store.service';
import { GarbageStationNumberStatisticV2 } from 'src/app/network/model/garbage-station-number-statistic-v2.model';
import { GarbageStationNumberStatistic } from 'src/app/network/model/garbage-station-number-statistic.model';
import {
  GetGarbageStationsParams,
  GetGarbageStationStatisticNumbersParamsV2,
} from 'src/app/network/request/garbage-station/garbage-station-request.params';
import { GarbageStationRequestService } from 'src/app/network/request/garbage-station/garbage-station-request.service';
import { IntervalParams } from 'src/app/network/request/IParams.interface';
import { OrderModel } from 'src/app/view-model/order.model';
import { GarbageStationModel } from '../garbage-station-table/garbage-station.model';
import { GarbageStationStatisticArrayConverter } from './garbage-station-statistic.converter';
import {
  GarbageStationStatisticModel,
  GarbageStationStatisticTableSource,
} from './garbage-station-statistic.model';

@Injectable()
export class GarbageStationStatisticTableBusiness
  implements
    IBusiness<
      GarbageStationStatisticTableSource,
      GarbageStationStatisticModel[]
    >
{
  constructor(
    private storeService: StoreService,
    private stationService: GarbageStationRequestService
  ) {}

  Converter: IConverter<
    GarbageStationStatisticTableSource,
    GarbageStationStatisticModel[]
  > = new GarbageStationStatisticArrayConverter();
  subscription?: ISubscription | undefined;
  loading?: EventEmitter<void> | undefined;
  async load(
    date: Date,
    unit: TimeUnit
  ): Promise<GarbageStationStatisticModel[]> {
    let data = await this.getData(this.storeService.divisionId, date, unit);
    let model = this.Converter.Convert(data);
    return model;
  }
  async getData(
    divisionId: string,
    date: Date,
    unit: TimeUnit
  ): Promise<GarbageStationStatisticTableSource> {
    switch (unit) {
      case TimeUnit.Month:
        return this.getDataByMonth(divisionId, date);
      case TimeUnit.Week:
        return this.getDataByWeek(divisionId, date);
      case TimeUnit.Day:
      default:
        return this.getDataByDay(divisionId, date);
    }
  }

  async getDataByDay(divisionId: string, date: Date) {
    let source = new GarbageStationStatisticTableSource();
    let duration: IntervalParams = IntervalParams.allDay(date);
    let unit = TimeUnit.Day;
    source.current = await this.getHistory(divisionId, duration, unit);
    let end = new Date(duration.BeginTime.getTime());
    end.setMilliseconds(-1);
    let begin = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    let yesterday: IntervalParams = {
      BeginTime: begin,
      EndTime: end,
    };
    source.before = await this.getHistory(divisionId, yesterday, unit);
    return source;
  }

  async getDataByWeek(divisionId: string, date: Date) {
    let source = new GarbageStationStatisticTableSource();
    let duration: IntervalParams = IntervalParams.allWeek(date);
    let unit = TimeUnit.Week;
    source.current = await this.getHistory(divisionId, duration, unit);
    let end = new Date(duration.BeginTime.getTime());
    end.setMilliseconds(-1);
    let begin = new Date(duration.BeginTime.getTime());
    begin.setDate(begin.getDate() - 7);

    let beofre: IntervalParams = {
      BeginTime: begin,
      EndTime: end,
    };
    source.before = await this.getHistory(divisionId, beofre, unit);
    return source;
  }
  async getDataByMonth(divisionId: string, date: Date) {
    let source = new GarbageStationStatisticTableSource();
    let duration: IntervalParams = IntervalParams.allMonth(date);
    let unit = TimeUnit.Month;
    source.current = await this.getHistory(divisionId, duration, unit);
    let end = new Date(duration.BeginTime.getTime());
    end.setMilliseconds(-1);
    let begin = new Date(end.getFullYear(), end.getMonth(), 1);
    let before: IntervalParams = {
      BeginTime: begin,
      EndTime: end,
    };
    source.before = await this.getHistory(divisionId, before, unit);
    return source;
  }

  async getHistory(
    divisionId: string,
    duration: IntervalParams,
    unit: TimeUnit
  ): Promise<GarbageStationNumberStatisticV2[]> {
    let stations = await this.getStations(divisionId);
    let params = new GetGarbageStationStatisticNumbersParamsV2();
    params = Object.assign(params, duration);
    params.TimeUnit = unit;
    params.GarbageStationIds = stations.map((x) => x.Id);
    return this.stationService.statistic.number.history.list(params);
  }

  async getStations(divisionId: string) {
    let params = new GetGarbageStationsParams();
    params.DivisionId = divisionId;
    let paged = await this.stationService.list(params);
    return paged.Data;
  }
}