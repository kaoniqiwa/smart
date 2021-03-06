import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ImageControlModel,
  ImageControlModelArray,
} from 'src/app/view-model/image-control.model';
import { GarbageDropStationTableModel } from 'src/app/common/components/tables/garbage-drop-station-table/garbage-drop-station-table.model';
import { WindowComponent } from 'src/app/common/components/window-control/window.component';
import { WindowViewModel } from 'src/app/common/components/window-control/window.model';
import { EventType } from 'src/app/enum/event-type.enum';
import { EventRecordWindowDetailsBusiness } from '../event-record-window/business/event-record-window-details/event-record-window-details.business';
import { SearchOptions } from 'src/app/view-model/search-options.model';
import { GarbageStation } from 'src/app/network/model/garbage-station.model';

@Component({
  selector: 'howell-garbage-drop-station-window',
  templateUrl: './garbage-drop-station-window.component.html',
  styleUrls: ['./garbage-drop-station-window.component.less'],
  providers: [EventRecordWindowDetailsBusiness],
})
export class GarbageDropStationWindowComponent
  extends WindowComponent
  implements OnInit
{
  @Input()
  index = GarbageDropStationWindowIndex.list;
  @Output()
  image: EventEmitter<ImageControlModelArray> = new EventEmitter();
  @Output()
  position: EventEmitter<GarbageStation> = new EventEmitter();
  @Input()
  divisionId?: string;

  constructor(public details: EventRecordWindowDetailsBusiness) {
    super();
  }

  Index = GarbageDropStationWindowIndex;
  load: EventEmitter<SearchOptions> = new EventEmitter();

  type: EventType[] = [EventType.GarbageDrop, EventType.GarbageDropTimeout];

  ngOnInit(): void {}

  onsearch(text: SearchOptions) {
    this.load.emit(text);
  }
  onimage(item: ImageControlModelArray) {
    this.image.emit(item);
  }

  indexChange(index: number) {
    this.index = index;
  }

  onposition(station: GarbageStation) {
    this.position.emit(station);
  }
}
export enum GarbageDropStationWindowIndex {
  list = 0,
  count = 1,
  details = 2,
}
