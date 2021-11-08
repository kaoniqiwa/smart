import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { StoreService } from 'src/app/global/service/store.service';
import { DeviceStateBusiness } from './device_state.business';

// 按需引入 Echarts
import * as echarts from 'echarts/core';
import { GaugeChart, GaugeSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { DeviceStateCountModule } from 'src/app/view-model/device_state_count.model';
import { DivisionNumberStatistic } from 'src/app/network/model/division_number_statistic.model';
import { ResizedEvent } from 'angular-resize-event';
import { UniversalTransition } from 'echarts/features';
import { DeviceStateRatioType } from 'src/app/enum/device_state_count.enum';

echarts.use([GaugeChart, UniversalTransition, CanvasRenderer]);

type ECOption = echarts.ComposeOption<GaugeSeriesOption>;

@Component({
  selector: 'app-device-state',
  templateUrl: './device_state.component.html',
  styleUrls: ['./device_state.component.less'],
  providers: [DeviceStateBusiness],
})
export class DeviceStateComponent implements OnInit, OnDestroy, AfterViewInit {
  public title: string = '设备运行状态';
  public deviceStateCountModel: DeviceStateCountModule =
    new DeviceStateCountModule();

  public get stateRatioColor() {
    return this.stateColor.get(this.deviceStateCountModel.state);
  }

  // 在销毁组件时，取消订阅
  private subscription: Subscription | null = null;

  // 当前区划id
  private divisionId: string = '';

  private myChart?: echarts.ECharts;
  private option: ECOption = {};

  // 服务器数据
  private rawData: DivisionNumberStatistic[] = [];

  private stateColor = new Map([
    [DeviceStateRatioType.bad, '#ef6464'],
    [DeviceStateRatioType.mild, '#ffba00'],
    [DeviceStateRatioType.good, '#21e452'],
  ]);

  @ViewChild('chartContainer') chartContainer!: ElementRef<HTMLDivElement>;

  constructor(
    private storeService: StoreService,
    private business: DeviceStateBusiness
  ) {}

  ngOnInit(): void {
    // 区划改变时触发
    this.subscription = this.storeService.statusChange.subscribe(() => {
      this.changeStatus();
    });
    this.changeStatus();

    this.option = {
      series: [
        {
          type: 'gauge',
          radius: '70%',
          center: ['50%', '50%'],
          progress: {
            show: true,
            width: 10,
            itemStyle: {},
          },
          axisLine: {
            show: true,
            lineStyle: {
              width: 10,
              color: [[1, '#6b7199']],
            },
          },
          axisLabel: {
            show: false,
            distance: 5,
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          title: {
            offsetCenter: ['0%', '0%'],
            color: 'auto',
            fontSize: 18,
            fontWeight: 400,
          },
          detail: {
            show: false,
          },
          pointer: {
            show: false,
          },
          data: [],
        },
      ],
    };
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
  ngAfterViewInit() {
    console.log('chartContainers', this.chartContainer);
    if (this.chartContainer) {
      this.myChart = echarts.init(this.chartContainer.nativeElement);
      this.myChart.setOption(this.option);
    }
  }
  changeStatus() {
    this.divisionId = this.storeService.divisionId;

    this.loadData();
  }
  async loadData() {
    let data = await this.business.statistic(this.divisionId);
    if (data) {
      this.rawData = data;
    }
    console.log('rawData', this.rawData);
    this.deviceStateCountModel = this.business.toDeviceState(
      this.rawData
    ) as DeviceStateCountModule;

    this.myChart?.setOption({
      series: [
        {
          type: 'gauge',
          axisLabel: {
            color: this.stateRatioColor,
          },
          data: [
            {
              name: this.deviceStateCountModel.stateDes,
              value: this.deviceStateCountModel.onLineRatio,
              itemStyle: {
                color: this.stateRatioColor,
              },
              title: {
                color: this.stateRatioColor,
              },
            },
          ],
        },
      ],
    });
  }

  onResized(e: ResizedEvent) {
    if (this.myChart) {
      this.myChart.resize();
      let w = e.newRect.width;
      if (w < 101) {
        this.myChart.setOption({
          series: [
            {
              type: 'gauge',
              title: {
                show: false,
              },
            },
          ],
        });
      } else {
        this.myChart.setOption({
          series: [
            {
              type: 'gauge',
              title: {
                show: true,
              },
            },
          ],
        });
      }
    }
    // this.myCharts.forEach((myChart) => myChart.resize());
  }
}