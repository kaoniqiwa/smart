import { Component, Input, OnInit } from '@angular/core';
import { LegendComponentOption } from 'echarts';
import { CallbackDataParams } from 'echarts/types/dist/shared';
import { ITimeDataGroup } from 'src/app/common/components/charts/chart.model';
import { SelectItem } from 'src/app/common/components/select-control/select-control.model';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { IComponent } from 'src/app/common/interfaces/component.interfact';
import { ChartType } from 'src/app/enum/chart-type.enum';
import { Enum } from 'src/app/enum/enum-helper';
import { StatisticType } from 'src/app/enum/statistic-type.enum';
import { TimeUnit } from 'src/app/enum/time-unit.enum';
import { UserResourceType } from 'src/app/enum/user-resource-type.enum';
import { Language } from 'src/app/global/tool/language';
import { IModel } from 'src/app/network/model/model.interface';
import { IntervalParams } from 'src/app/network/request/IParams.interface';
import { ChartConfig, EChartOptions } from '../../../charts/details-chart/details-chart.option';
import { GarbageStationWindowDetailsBusiness } from './garbage-station-window-details.business';
import { GarbageStationDetailsChartOptions } from './garbage-station-window-details.model';

@Component({
  selector: 'howell-garbage-station-window-details',
  templateUrl: './garbage-station-window-details.component.html',
  styleUrls: ['./garbage-station-window-details.component.less'],
  providers: [GarbageStationWindowDetailsBusiness]
})
export class GarbageStationWindowDetailsComponent
  implements OnInit, IComponent<IModel, ITimeDataGroup<number>[]> {

  @Input()
  business: IBusiness<IModel, ITimeDataGroup<number>[]>;
  constructor(business: GarbageStationWindowDetailsBusiness) {
    this.business = business;
  }


  date: Date = new Date()
  type: StatisticType = StatisticType.garde
  types: SelectItem[] = [];
  unit: TimeUnit = TimeUnit.Week;
  units: SelectItem[] = [];
  chartType: ChartType = ChartType.bar;
  chartTypes: SelectItem[] = [];

  selectIds: string[] = [];
  config: GarbageStationWindowDetailsComponentConfig = {}

  UserResourceType = UserResourceType;
  ChartType = ChartType;
  dateFormat: string = "yyyy年MM月dd日";
  datas: ITimeDataGroup<number>[] = [];
  echartsLegend: LegendComponentOption = {
    show: true,
    right: "50px",
    top: "30px",
    icon: "",
    orient: "vertical",
    textStyle: {
      fontSize: 16
    }
  }

  ngOnInit(): void {
    this.initType();
    this.initUnits();
    this.initChartTypes();
  }
  async loadData() {
    let interval = IntervalParams.TimeUnit(this.unit, this.date, 1);
    let opts: GarbageStationDetailsChartOptions = {
      stationIds: this.selectIds,
      unit: TimeUnit.Day,
      type: this.type,
      begin: interval.BeginTime,
      end: interval.EndTime
    }
    this.datas = await this.business.load(opts)
    this.loadChart();
  }

  loadChart() {
    let merge: EChartOptions = this.getEChartsMerge(this.chartType, this.datas);
    this.config.line = undefined;
    this.config.bar = undefined;
    switch (this.chartType) {
      case ChartType.line:
        this.config.line = new ChartConfig(this.unit, this.date, this.echartsLegend, merge);
        break;
      case ChartType.bar:
        this.config.bar = new ChartConfig(this.unit, this.date, this.echartsLegend, merge);
        break;
      default:
        break;
    }
  }

  getEChartsFormatter(value = "value") {
    let formatter = `{${value}} `
    switch (this.type) {
      case StatisticType.garde:
        formatter += "分";
        break;
      case StatisticType.garbageDuration:
      case StatisticType.avgGarbageTime:
      case StatisticType.maxGarbageTime:
        formatter += "分钟"
        break;
      case StatisticType.illegalDrop:
      case StatisticType.mixedInto:
        formatter += "起"
        break;
      default:
        break;
    }
    return formatter;
  }

  getEChartsMerge(type: ChartType, datas: ITimeDataGroup<number>[]): EChartOptions {
    switch (type) {
      case ChartType.line:
        return {
          yAxis: {
            axisLabel: {
              show: true,
              formatter: this.getEChartsFormatter(),
            },
          },
          series: datas.map((data, i) => {
            return {
              type: 'line',
              name: data.Name,
              data: data.datas.map((x) => x.value),
              areaStyle: {},
              label: {
                formatter: ""
              },
            }
          })
        };
      case ChartType.bar:
      default:
        return {
          grid: {
            top: "120px"
          },
          yAxis: {
            axisLabel: {
              show: true,
              formatter: this.getEChartsFormatter(),
            },
          },
          series: datas.map((data, i) => {
            return {
              type: 'bar',
              name: data.Name,
              data: data.datas.map((x) => x.value),
              barWidth: "15px",
              barMinHeight: 5,
              label: {
                show: true,
                position: 'top',
                color: ChartConfig.color[i],
                fontSize: "16px",
                textBorderWidth: 0,
                formatter: ""
              },
            }
          }),
        }
    }
  }

  initType() {
    let _enum = new Enum(StatisticType);
    let array = _enum.toArray();
    for (let i = 0; i < array.length; i++) {

      let language = Language.StatisticType(array[i])
      let type = new SelectItem(array[i], array[i], language)
      this.types.push(type)
    }
  }
  initUnits() {
    this.units.push(
      new SelectItem(
        TimeUnit.Week.toString(),
        TimeUnit.Week,
        '周报表',
      )
    );
    this.units.push(
      new SelectItem(
        TimeUnit.Month.toString(),
        TimeUnit.Month,
        '月报表',
      )
    );
  }
  initChartTypes() {
    this.chartTypes.push(
      new SelectItem(
        ChartType.bar.toString(),
        ChartType.bar,
        Language.ChartType(ChartType.bar)
      )
    )
    this.chartTypes.push(
      new SelectItem(
        ChartType.line.toString(),
        ChartType.line,
        Language.ChartType(ChartType.line)
      )
    )
  }

  changeDate(date: Date) {
    this.date = date;
  }
  ontype(item: SelectItem) {
    this.type = item.value;
  }
  ontimeunit(item: SelectItem) {
    this.unit = item.value;
    this.loadChart();
  }
  oncharttype(item: SelectItem) {
    this.chartType = item.value;
    this.loadChart();
  }
  onTreeSelect(ids: string[]) {
    this.selectIds = ids;
  }
  search() {
    this.loadData();
  }
  exportExcel() { 
    
  }
  exportCSV() { }
}

interface GarbageStationWindowDetailsComponentConfig {
  line?: ChartConfig,
  bar?: ChartConfig
}