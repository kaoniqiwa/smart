import { Injectable } from "@angular/core";
import { ResourceLabel } from "../../model/resource-label.model";
import { LabelsUrl } from "../../url/aiop/resources/labels/labels.url";
import { BaseRequestService, BaseTypeRequestService } from "../base-request.service";
import { HowellAuthHttpService } from "../howell-auth-http.service";
import { BatchRequest } from "../resources/resources-params";
import { GetResourceLabelsParams } from "./label.params";

@Injectable({
  providedIn: "root",
})
export class LabelRequestService {
  private basic: BaseRequestService;
  private type: BaseTypeRequestService<ResourceLabel>;

  constructor(_http: HowellAuthHttpService) {
    this.basic = new BaseRequestService(_http);
    this.type = this.basic.type(ResourceLabel);
  }

  create(item: ResourceLabel) {
    return this.type.post(LabelsUrl.create(), item)
  }

  get(id: string) {
    return this.type.get(LabelsUrl.item(id));
  }


  update(item: ResourceLabel) {
    return this.type.put(LabelsUrl.item(item.Id), item)
  }

  delete(id: string) {
    return this.type.delete(LabelsUrl.item(id))
  }

  list(params: GetResourceLabelsParams = new GetResourceLabelsParams()) {
    return this.type.paged(LabelsUrl.list(), params);
  }

  // 将当前Label添加到一组 Resource中
  batch(id: string, params: BatchRequest) {
    return this.type.post(LabelsUrl.batch(id), params)
  }

}

