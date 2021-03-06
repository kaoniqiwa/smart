import { Injectable } from "@angular/core";
import { ResourceLabel } from "../network/model/resource-label.model";
import { CommonNestNode } from "../view-model/common-nest-node.model";
import { CommonTreeConverter } from "./common-tree.converter";


export type RegionTreeSource = ResourceLabel

@Injectable({
  providedIn: 'root'
})
export class LabelTreeConverter extends CommonTreeConverter {

  Convert(source: RegionTreeSource, ...res: any[]): CommonNestNode {
    if (source instanceof ResourceLabel) {
      return this._fromResourceLabel(source)
    }
    throw new Error('Method not implemented.');
  }


  private _fromResourceLabel(item: ResourceLabel): CommonNestNode<ResourceLabel> {
    const node = new CommonNestNode();
    node.Id = item.Id;
    node.Name = item.Name;
    node.HasChildren = false;
    node.ParentId = null;
    node.ChildrenLoaded = true;
    node.ParentNode = null;
    node.IconClass = '';
    node.RawData = item;
    node.hideArrow = true;
    return node;
  }

}
