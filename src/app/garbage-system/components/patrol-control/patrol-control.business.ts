import { Injectable } from '@angular/core';
import { url } from 'inspector';
import { ImageVideoControlModel } from 'src/app/common/components/image-video-control/image-video-control.model';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { IConverter } from 'src/app/common/interfaces/converter.interface';
import { ImageControlConverter } from 'src/app/converter/image-control.converter';
import { OnlineStatus } from 'src/app/enum/online-status.enum';
import { StoreService } from 'src/app/global/service/store.service';
import { Camera } from 'src/app/network/model/camera.model';
import { GarbageStation } from 'src/app/network/model/garbage-station.model';
import { VideoUrl } from 'src/app/network/model/url.model';

import { GetGarbageStationsParams } from 'src/app/network/request/garbage-station/garbage-station-request.params';
import { GarbageStationRequestService } from 'src/app/network/request/garbage-station/garbage-station-request.service';
import { SRRequestService } from 'src/app/network/request/sr/sr-request.service';

import { PatrolControlModel } from './patrol-control.model';

@Injectable()
export class PatrolControlBusiness
  implements IBusiness<GarbageStation[], PatrolControlModel[]>
{
  constructor(
    private storeService: StoreService,
    private stationService: GarbageStationRequestService,
    private srService: SRRequestService
  ) {
    storeService.statusChange.subscribe((x) => {
      this.load();
    });
  }
  Converter: IConverter<GarbageStation[], PatrolControlModel[]> =
    new PatrolArrayControlConverter();

  async load(): Promise<PatrolControlModel[]> {
    let stations = await this.getData(this.storeService.divisionId);

    let model = this.Converter.Convert(stations);
    this.model = model[0];
    return model;
  }

  getVideoUrl(camera: Camera) {
    return this.srService.preview(camera.Id);
  }

  async getData(divisionId: string): Promise<GarbageStation[]> {
    let params = new GetGarbageStationsParams();
    params.DivisionId = divisionId;

    let paged = await this.stationService.list(params);
    return paged.Data;
  }

  model?: PatrolControlModel;
}

class PatrolArrayControlConverter
  implements IConverter<GarbageStation[], PatrolControlModel[]>
{
  converter = {
    item: new PatrolControlConverter(),
  };
  Convert(source: GarbageStation[]): PatrolControlModel[] {
    let array: PatrolControlModel[] = [];
    for (let i = 0; i < source.length; i++) {
      let item = this.converter.item.Convert(source[i]);
      array.push(item);
    }
    return array;
  }
}

class PatrolControlConverter
  implements IConverter<GarbageStation, PatrolControlModel>
{
  private converter = {
    image: new ImageControlConverter(),
  };

  Convert(source: GarbageStation): PatrolControlModel {
    let model = new PatrolControlModel();
    model.title = source.Name;

    model.media = [];
    if (source.Cameras) {
      for (let i = 0; i < source.Cameras.length; i++) {
        const camera = source.Cameras[i];
        model.status = camera.OnlineStatus ?? OnlineStatus.Offline;
        let img = this.converter.image.Convert(camera, false);
        let media = new ImageVideoControlModel(camera.Id);
        media.image = img;
        model.media.push(media);
      }
    }

    return model;
  }
}
