import { Camera } from 'src/app/network/model/camera.model';
import { Division } from 'src/app/network/model/division.model';
import { GarbageStation } from 'src/app/network/model/garbage-station.model';
import { Page } from 'src/app/network/model/page_list.model';
import { CameraImageUrl } from 'src/app/network/model/url.model';
import { DurationParams } from 'src/app/network/request/IParams.interface';
import { ImageControlModel } from '../../../../view-model/image-control.model';
import { SelectItem } from '../../select-control/select-control.model';
import { GarbageStationModel } from '../../../../view-model/garbage-station.model';
import {
  SearchOptionKey,
  SearchOptions,
} from 'src/app/view-model/search-options.model';

export class EventRecordFilter extends DurationParams {
  constructor() {
    super();
    let interval = DurationParams.allDay(new Date());
    this.BeginTime = interval.BeginTime;
    this.EndTime = interval.EndTime;
  }

  divisionId?: string;
  stationId?: string;
  cameraId?: string;

  private _division?: SelectItem;
  public get division(): SelectItem | undefined {
    return this._division;
  }
  public set division(v: SelectItem | undefined) {
    this._division = v;
    if (v) {
      this.divisionId = v.key;
    } else {
      this.divisionId = v;
    }
  }
  private _station?: SelectItem;
  public get station(): SelectItem | undefined {
    return this._station;
  }
  public set station(v: SelectItem | undefined) {
    this._station = v;
    if (v) {
      this.stationId = v.key;
    } else {
      this.stationId = v;
    }
  }
  private _camera?: SelectItem;
  public get camera(): SelectItem | undefined {
    return this._camera;
  }
  public set camera(v: SelectItem | undefined) {
    this._camera = v;
    if (v) {
      this.cameraId = v.key;
    } else {
      this.cameraId = v;
    }
  }

  opts: SearchOptions = {
    text: '',
    propertyName: SearchOptionKey.name,
  };
  community?: SelectItem;
}

export class CameraImageUrlModel extends CameraImageUrl {
  constructor(url: CameraImageUrl, stationId: string) {
    super();
    this.CameraId = url.CameraId;
    this.CameraName = url.CameraName;
    this.ImageUrl = url.ImageUrl;
    this.StationId = stationId;
  }
  StationId: string;
  Camera!: Camera;
}
