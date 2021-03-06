import { Injectable } from "@angular/core";
import { DivisionTreeConverter } from "src/app/converter/division-tree.converter";
import { DistrictTreeEnum } from "src/app/enum/district-tree.enum";
import { DivisionType } from "src/app/enum/division-type.enum";
import { EnumHelper } from "src/app/enum/enum-helper";
import { UserResourceType } from "src/app/enum/user-resource-type.enum";
import { DivisionTree } from "src/app/network/model/division-tree.model";
import { Division } from "src/app/network/model/division.model";
import { GarbageStation } from "src/app/network/model/garbage-station.model";
import { GetDivisionsParams, GetDivisionTreeParams } from "src/app/network/request/division/division-request.params";
import { DivisionRequestService } from "src/app/network/request/division/division-request.service";
import { GetGarbageStationsParams } from "src/app/network/request/garbage-station/garbage-station-request.params";
import { GarbageStationRequestService } from "src/app/network/request/garbage-station/garbage-station-request.service";
import { CommonFlatNode } from "src/app/view-model/common-flat-node.model";
import { CommonNestNode } from "src/app/view-model/common-nest-node.model";
import { LocaleCompare } from "../../tools/locale-compare";

@Injectable()
export class DivisionTreeBusiness {

  public showStation = false;
  public depthIsEnd = false;

  public nestedNodeMap = new Map<string, CommonNestNode<Division>>();


  constructor(private _divisionRequest: DivisionRequestService,
    private _stationRequest: GarbageStationRequestService,
    private _converter: DivisionTreeConverter) { }

  // 相当于默认请求 condition==''的区划
  init(type: UserResourceType = UserResourceType.City,
    depth: number = 0) {

    this.nestedNodeMap.clear()
    return this._getDataRecursively(type, depth)
  }


  async loadChildren(flat: CommonFlatNode<Division>) {

    let node = this.nestedNodeMap.get(flat.Id);
    if (!node) return;
    if (node.ChildrenLoaded) return

    let children: CommonNestNode[] = [];
    try {
      let type = EnumHelper.ConvertDivisionToUserResource(node.RawData.DivisionType)
      let data = await this._loadData(
        EnumHelper.GetResourceChildType(type),
        node.Id
      );
      children = this._converter.iterateToNestNode(data);
      children.forEach(child => child.ParentNode = node!);
      this._register(children);
      node.childrenChange.next(children);
      node.ChildrenLoaded = true;
      // 如果当前是请求街道下层的居委会信息，而且需要展示厢房，则居委会节点要能loadChildren
      if (type == UserResourceType.County && this.showStation) {
        children.forEach(child => child.HasChildren = true)
      }
    } catch (e) {

    }
    // console.log('子节点', node)
    return node;
  }

  async searchNode(condition: string, type: UserResourceType = UserResourceType.City,
    depth: number = 0) {
    this.nestedNodeMap.clear();
    let nodes: CommonNestNode[] = [];
    if (condition == '') {
      nodes = await this.init(type, depth);
    } else {
      let data = await this._searchDivisionData(condition);
      let divisionNodes = this._converter.recurseToNestNode(data);
      nodes = divisionNodes;
      if (this.showStation) {
        let stations = await this._searchStationData(condition);
        // 所有祖先区划
        let allDivisions: Division[] = [];
        let allStations: GarbageStation[] = [];
        let stationNodes: CommonNestNode[] = [];

        for (let i = 0; i < stations.length; i++) {
          let station = stations[i];
          if (station.DivisionId) {
            allStations.push(station);
            let division = await this._getDivision(
              station.DivisionId
            );
            allDivisions.push(division);
            let ancestors = await this._getAncestorDivision(
              division
            );
            allDivisions.push(...ancestors);
          }
        }
        // Division 去重
        let divisions: Division[] = [];
        allDivisions.reduce(function (prev, cur) {
          if (!prev.find((item) => item.Id == cur.Id)) {
            prev.push(cur);
          }
          return prev;
        }, divisions);
        // 合并 Division 和 Station
        let result = [...divisions, ...allStations];

        stationNodes = this._converter.buildNestTree(result);

        // console.log(stationNodes);

        // 将 stationNodes 和  divisionNodes 合并

        let merged = this._converter.mergeNestedTree(divisionNodes, stationNodes);
        // console.log(merged);

        nodes = merged;
      }
    }
    this._updateNestedMap(nodes)
    return nodes;
  }

  private async _getDataRecursively(type: UserResourceType = UserResourceType.City,
    depth: number = 0,) {
    if (depth < 0) return [];
    let data = await this._loadData(type);

    let nodes = this._converter.iterateToNestNode(data);
    this._register(nodes);

    if (type == UserResourceType.Committees && this.showStation) {
      nodes.forEach(node => node.HasChildren = true)
    }
    if (depth == 0 && this.depthIsEnd) {
      nodes.forEach((node) => {
        node.HasChildren = false;

      });
    }
    try {
      let children = await this._getDataRecursively(
        EnumHelper.GetResourceChildType(type),
        depth - 1
      );

      children.forEach((child) => {
        let parentId = child.ParentId;
        if (parentId) {
          let parentNode = this.nestedNodeMap.get(parentId);
          if (parentNode) {
            // console.log(parentNode.name)
            child.ParentNode = parentNode;
            parentNode.ChildrenLoaded = true;
            parentNode.childrenChange.value.push(child);
          }
        }
      });
    } catch (e) {
      // 当 GetResourceChildType 没有下一级时报错，自动退出
      // console.log(e)
    }
    return nodes;
  }

  private async _loadData(type: UserResourceType, divisionId?: string) {
    switch (type) {
      case UserResourceType.City:
      case UserResourceType.County:
      case UserResourceType.Committees:
        return this._loadDivision(type, divisionId);
        break;
      case UserResourceType.Station:
        return this._loadStation(divisionId);
      default:
        throw new TypeError('类型错误');
    }
  }

  private async _loadDivision(type: UserResourceType, parentId?: string) {
    let divisionType = EnumHelper.ConvertUserResourceToDivision(type);
    let params = new GetDivisionsParams();
    params.DivisionType = divisionType;
    if (parentId) params.ParentId = parentId;
    let res = await this._divisionRequest.list(params);
    return res.Data;
  }

  private async _loadStation(divisionId?: string) {
    let params = new GetGarbageStationsParams();
    if (divisionId) params.DivisionId = divisionId;
    let res = await this._stationRequest.list(params);
    return res.Data;
  }


  private async _getDivision(id: string) {
    return await this._divisionRequest.get(id);
  }
  private async _getAncestorDivision(division: Division) {
    let res: Division[] = [];

    while (division.ParentId) {
      let d = await this._getDivision(division.ParentId);
      res.push(d);
      division = d;
    }

    return res;
  }


  private async _searchDivisionData(condition: string) {
    let params = new GetDivisionTreeParams();
    params.Name = condition;
    let res: DivisionTree = await this._divisionRequest.tree(params);
    return res.Nodes;
  }
  private async _searchStationData(condition: string) {
    let params = new GetGarbageStationsParams();
    params.Name = condition;
    let res = await this._stationRequest.list(params);

    return res.Data;
  }



  private _register(nodes: CommonNestNode[]) {
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i];
      // 一定要直接覆盖，保证 node 为最新
      this.nestedNodeMap.set(node.Id, node);
    }
  }
  private _updateNestedMap(nodes: CommonNestNode[]) {
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i];
      this.nestedNodeMap.set(node.Id, node);
      if (node.childrenChange.value.length > 0) {
        this._updateNestedMap(node.childrenChange.value)
      }
    }

  }

}