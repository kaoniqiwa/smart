import { Injectable } from '@angular/core';
import { DivisionNode } from '../network/model/division-tree.model';
import { Division } from '../network/model/division.model';
import { DivisionManageModel } from '../view-model/division-manange.model';
import { NestedTreeNode } from '../view-model/nested-tree-node.model';

@Injectable({
  providedIn: 'root',
})
export class TreeConverter {
  fromDivisionNode(item: DivisionNode, parentId: string | null = null) {
    const node = new NestedTreeNode(
      item.Id,
      item.Name,
      item.Description,
      item.DivisionType,
      item.Nodes.length > 0,
      parentId
    );
    return node;
  }

  fromDivision(division: Division) {
    const node = new NestedTreeNode(
      division.Id,
      division.Name,
      division.Description,
      division.DivisionType,
      !division.IsLeaf,
      division.ParentId
    );
    return node;
  }
  fromDivisionManage(model: DivisionManageModel) {
    const node = new NestedTreeNode(model.id, model.name, model.description);
    return node;
  }
}
