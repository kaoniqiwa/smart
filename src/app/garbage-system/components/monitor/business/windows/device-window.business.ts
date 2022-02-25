import { Injectable } from '@angular/core';
import {
  ImageControlModel,
  ImageControlModelArray,
} from 'src/app/common/components/image-control/image-control.model';
import { DeviceViewModel } from 'src/app/common/components/tables/device-list-table/device.model';
import { WindowViewModel } from 'src/app/common/components/window-control/window.model';
import { OnlineStatus } from 'src/app/enum/online-status.enum';
import { Camera } from 'src/app/network/model/camera.model';
import { MediaWindowBusiness } from './media-window.business';
import { VideoControlWindowBusiness } from './video-control-window.business';

@Injectable()
export class DeviceWindowBusiness extends WindowViewModel {
  constructor(private media: MediaWindowBusiness) {
    super();
  }
  style = {
    height: '83%',
    width: '90%',
    transform: 'translate(-50%, -45%)',
  };
  status?: OnlineStatus;
  onimage(model: ImageControlModelArray) {
    this.media.camera = model.models;
    this.media.index = model.index;
    this.media.autoplay = model.autoplay;
    this.media.show = true;
  }
}