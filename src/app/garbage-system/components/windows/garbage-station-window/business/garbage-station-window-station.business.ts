import { EventEmitter, Injectable } from '@angular/core';
import { EventRecordOperationFilterBusiness } from '../../event-record-operation-filter.business';

@Injectable()
export class GarbageStationWindowStationBusiness {
  constructor() {}

  load: EventEmitter<string> = new EventEmitter();

  onsearch(text: string) {
    this.load.emit(text);
  }
}
