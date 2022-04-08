import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'src/app/common/components/select-control/select-control.model';
import {
  DateTimePickerConfig,
  DateTimePickerView,
} from 'src/app/common/directives/date-time-picker.directive';
import { TimeUnit } from 'src/app/enum/time-unit.enum';

@Component({
  selector: 'howell-garbage-station-window-general',
  templateUrl: './garbage-station-window-general.component.html',
  styleUrls: ['./garbage-station-window-general.component.less'],
})
export class GarbageStationWindowGeneralComponent implements OnInit {
  DateTimePickerView = DateTimePickerView;
  dateTimePickerConfig: DateTimePickerConfig = new DateTimePickerConfig();
  TimeUnit = TimeUnit;

  units: SelectItem[] = [];
  unit: TimeUnit = TimeUnit.Day;
  date: Date = new Date();
  constructor() {
    this.initUnits();
  }

  initUnits() {
    this.units.push(
      new SelectItem(
        TimeUnit.Hour.toString(),
        TimeUnit.Hour,
        '日报表',
      )
    );
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

  ngOnInit(): void { }

  changeDate(date: Date) {
    this.date = date;
  }

  ontimeunit(unit: SelectItem) {
    this.unit = unit.value;
    switch (this.unit) {
      case TimeUnit.Week:
        this.dateTimePickerConfig.view = DateTimePickerView.month;
        this.dateTimePickerConfig.format = 'yyyy-MM-dd';
        this.dateTimePickerConfig.week = true;
        break;
      case TimeUnit.Day:
        this.dateTimePickerConfig.view = DateTimePickerView.month;
        this.dateTimePickerConfig.format = 'yyyy-MM-dd';
        this.dateTimePickerConfig.week = false;
        break;
      case TimeUnit.Month:
        this.dateTimePickerConfig.view = DateTimePickerView.year;
        this.dateTimePickerConfig.format = 'yyyy-MM';
        this.dateTimePickerConfig.week = false;
        break;
      default:
        break;
    }
  }
}
