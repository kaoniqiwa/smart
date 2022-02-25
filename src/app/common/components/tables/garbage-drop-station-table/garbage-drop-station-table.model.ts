import { KeyValue } from '@angular/common';
import { DivisionType } from 'src/app/enum/division-type.enum';
import { Division } from 'src/app/network/model/division.model';
import { GarbageStation } from 'src/app/network/model/garbage-station.model';
import { Member } from 'src/app/network/model/member.model';
import { ImageControlModel } from '../../image-control/image-control.model';
import { GarbageStationModel } from '../garbage-station-table/garbage-station.model';

export class GarbageDropStationTableModel {
  GarbageStation?: GarbageStationModel;
  GarbageDuration?: Date;
  MaxGarbageDuration?: Date;
  GarbageCount = 0;
  images: ImageControlModel[] = [];
  members: Member[] = [];
}