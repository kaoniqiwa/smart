import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { CallbackDataParams } from 'echarts/types/dist/shared';
import { IModel } from 'src/app/network/model/model.interface';
import { IComponent } from 'src/app/common/interfaces/component.interfact';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { TimeUnit } from 'src/app/enum/time-unit.enum';
import {
  DateTimePickerConfig,
  DateTimePickerView,
} from 'src/app/common/directives/date-time-picker.directive';
import { SelectItem } from 'src/app/common/components/select-control/select-control.model';
import { DivisionType } from 'src/app/enum/division-type.enum';
import { Division } from 'src/app/network/model/division.model';
import { GarbageStation } from 'src/app/network/model/garbage-station.model';
import { LocalStorageService } from 'src/app/global/service/local-storage.service';
import { UserResourceType } from 'src/app/enum/user-resource-type.enum';
import { EventType } from 'src/app/enum/event-type.enum';
import { ChartType } from 'src/app/enum/chart-type.enum';
import { IntervalParams } from 'src/app/network/request/IParams.interface';
import { TimeData } from 'src/app/common/components/charts/chart.model';
import { Language } from 'src/app/global/tool/language';
import { ChartConfig } from './details-chart.option';
import { DetailsChartLoadOptions } from './details-chart.model';
import { wait } from 'src/app/common/tools/tool';
import { HowellExcel, IExcelValue } from 'src/app/common/tools/hw-excel';
import { formatDate } from '@angular/common';
import { HorizontalAlign } from 'src/app/enum/direction.enum';


@Component({
  selector: 'howell-details-chart',
  templateUrl: './details-chart.component.html',
  styleUrls: ['./details-chart.component.less'],
})
export class DetailsChartComponent
  implements OnInit, IComponent<IModel, TimeData<IModel>[]>, OnChanges {
  @Input()
  business!: IBusiness<IModel, TimeData<IModel>[]>;
  @Input()
  eventType: EventType = EventType.IllegalDrop;
  @Input()
  station?: GarbageStation;
  

  treeAlign = HorizontalAlign.left

  @Input()
  division?:Division


  // private _division?: Division;
  // public get division(): Division | undefined {
  //   if (this._division) {
  //     return this._division;
  //   }
  //   if (this.committees) {
  //     return this.committees
  //   }
  //   else if (this.county) {
  //     return this.county;
  //   }
  //   else {
  //     return undefined;
  //   }
  // }

  // @Input()
  // public set division(v: Division | undefined) {
  //   this._division = v;
  // }



  options?: DetailsChartLoadOptions

  date: Date = new Date();

  unit: TimeUnit = TimeUnit.Hour;
  units: SelectItem[] = [];

  ChartType = ChartType;
  chartType: ChartType = ChartType.bar;
  charts: SelectItem[] = [];

  config = {
    line: new ChartConfig(this.unit, this.date),
    bar: new ChartConfig(this.unit, this.date),
    dateTimePicker: new DateTimePickerConfig(),
  };

  data: TimeData<IModel>[] = [];

  userResourceType: UserResourceType = UserResourceType.None;
  UserResourceType = UserResourceType;

  DivisionType = DivisionType;

  constructor(public local: LocalStorageService) {
    if (local.user.Resources && local.user.Resources.length > 0) {
      this.userResourceType = local.user.Resources[0].ResourceType;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.loadData();
  }

  async ngOnInit() {
    this.initUnits();
    this.initCharts();
    wait(() => {
      return !!this.station || !!this.division
    }, () => {
      this.loadData();
    })

  }



  async loadData() {
    let interval = this.getInterval();
    this.options = {
      stationId: this.station?.Id,
      unit: this.unit,
      begin: interval.params.BeginTime,
      end: interval.params.EndTime,
      divisionId: this.station ? undefined : this.division?.Id,
      type: this.eventType
    };
    console.log(this.options)
    this.data = await this.business.load(this.options);
    // if (this.unit === TimeUnit.Hour) {
    //   let first: TimeData<IModel> = {
    //     time: new Date(
    //       this.date.getFullYear(),
    //       this.date.getMonth(),
    //       this.date.getDate()
    //     ),
    //     value: 0,
    //   };
    //   this.data.unshift(first);
    // }
    // console.log(this.data);
    switch (this.chartType) {
      case ChartType.line:
        this.config.line.options = this.config.line.getOption(this.unit, this.date);
        this.config.line.merge = {
          series: [
            {
              type: 'line',
              name: '单位(起)',
              data: this.data.map((x) => x.value),
              areaStyle: {},
              label: {
                formatter: (params: CallbackDataParams) => {
                  return params.value.toString();
                },
              },
            },
          ],
        };
        break;
      case ChartType.bar:
        this.config.bar.options = this.config.bar.getOption(this.unit, this.date);
        this.config.bar.merge = {
          series: [
            {
              type: 'bar',
              name: '单位(起)',
              data: this.data.map((x) => x.value),
              barWidth: "32px",
              label: {
                show: true,
                position: 'top',
                color: "#7d90bc",
                fontSize: "16px",
                textBorderWidth: 0,
                formatter: (params: CallbackDataParams) => {
                  return params.value.toString();
                },
              },
            },
          ],
        };
        break;
      default:
        break;
    }

  }

  changeDate(date: Date) {
    this.date = date;
    this.loadData();
  }

  ontimeunit(unit: SelectItem) {
    this.unit = unit.value;
    switch (this.unit) {
      case TimeUnit.Week:
        this.config.dateTimePicker.view = DateTimePickerView.month;
        this.config.dateTimePicker.format = 'yyyy-MM-dd';
        this.config.dateTimePicker.week = true;
        break;
      case TimeUnit.Hour:
        this.config.dateTimePicker.view = DateTimePickerView.month;
        this.config.dateTimePicker.format = 'yyyy-MM-dd';
        this.config.dateTimePicker.week = false;
        break;
      case TimeUnit.Month:
        this.config.dateTimePicker.view = DateTimePickerView.year;
        this.config.dateTimePicker.format = 'yyyy-MM';
        this.config.dateTimePicker.week = false;
        break;
      default:
        break;
    }
    this.loadData();
  }

  initUnits() {
    this.units.push(
      new SelectItem({
        key: TimeUnit.Hour.toString(),
        value: TimeUnit.Hour,
        language: '日报表',
      })
    );
    this.units.push(
      new SelectItem({
        key: TimeUnit.Week.toString(),
        value: TimeUnit.Week,
        language: '周报表',
      })
    );
    this.units.push(
      new SelectItem({
        key: TimeUnit.Month.toString(),
        value: TimeUnit.Month,
        language: '月报表',
      })
    );
  }
  initCharts() {

    this.charts.push(
      new SelectItem({
        key: ChartType.bar.toString(),
        value: ChartType.bar,
        language: '柱状图',
      })
    );
    this.charts.push(
      new SelectItem({
        key: ChartType.line.toString(),
        value: ChartType.line,
        language: '折线图',
      })
    );
  }


  onStationSelected(station?: GarbageStation) {
    this.station = station;
  }

  onchartselected(item: SelectItem) {
    this.chartType = item.value;
    this.loadData()
  }

  search() {
    this.loadData();
  }

  private getTitle() {
    debugger;
    let type = Language.EventType(this.eventType);
    let name = this.getName();

    let interval = this.getInterval();


    return `${interval.language} ${name} ${type}`
  }
  private getName() {
    return this.station ? this.station.Name : this.division ? this.division.Name : "";
  }
  private getInterval() {
    let interval = {
      params: new IntervalParams(),
      language: ""
    }
    switch (this.unit) {
      case TimeUnit.Hour:
      case TimeUnit.Day:
        interval.params = IntervalParams.allDay(this.date);
        interval.language = Language.Date(this.date);
        break;
      case TimeUnit.Week:
        interval.params = IntervalParams.allWeek(this.date);
        interval.language = Language.Duration(interval.params.BeginTime, interval.params.EndTime)
        break;
      case TimeUnit.Month:
        interval.params = IntervalParams.allMonth(this.date);
        interval.language = Language.Duration(interval.params.BeginTime, interval.params.EndTime)
        break;
      default:
        break;
    }
    return interval;
  }

  exportExcel() {
    let excel = new HowellExcel();
    let title = this.getTitle();

    let datas = this.convert(title, this.data)

    excel.setData(datas)
    excel.save(title);
  }
  convert<T>(title: string, datas: TimeData<T>[]) {
    let offset = 0
    let array: IExcelValue[] = [{
      row: 1,
      column: 2,
      value: title
    }];
    offset++;
    let titles = ["序号", "日期", "时间", this.getName()]

    array.push(...this.convertTitles(titles))
    offset++;
    let index = 0
    let count = 0;
    let columnDatas = datas.map(x => {
      count += x.value as unknown as number
      return [
        {
          column: 1,
          value: ++index
        },
        {
          column: 2,
          value: formatDate(x.time, "yyyy年MM月dd日", "en")
        },
        {
          column: 3,
          value: formatDate(x.time, "HH:mm", "en")
        },
        {
          column: 4,
          value: x.value as unknown as number
        }]
    })
    let row = offset;
    for (let i = 0; i < columnDatas.length; i++) {
      const columns = columnDatas[i];
      row = i + 1 + offset
      columns.forEach(column => {
        array.push({
          ...column,
          row: row
        })
      })
    }
    row++;
    array.push(...[{
      column: 1,
      row: row,
      value: "合计"
    }, {
      column: 4,
      row: row,
      value: count
    }])
    return array;
  }
  convertTitles(titles: string[]) {
    let array: IExcelValue[] = [];
    for (let i = 0; i < titles.length; i++) {
      const title = titles[i];
      array.push({
        row: 2,
        column: i + 1,
        value: title
      })
    }
    return array;
  }


  ondivisionselect(division: Division) {
    this.division = division;
    this.loadData()
  }

}





