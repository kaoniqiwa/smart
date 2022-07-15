import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SelectStrategy } from 'src/app/enum/select-strategy.enum';
import { CommonFlatNode } from 'src/app/view-model/common-flat-node.model';
import { CommonTree } from '../common-tree/common-tree';
import { CommonTreeComponent } from '../common-tree/common-tree.component';
import { LabelListBusiness as LabelTreeBusiness } from './label-tree.business';

@Component({
  selector: 'howell-label-tree',
  templateUrl: './label-tree.component.html',
  styleUrls: ['./label-tree.component.less'],
  providers: [
    LabelTreeBusiness
  ]
})
export class LabelTreeComponent extends CommonTree implements OnInit {


  private _condition: string = '';


  @Input()
  selectStrategy = SelectStrategy.Multiple;

  // 默认选中列表
  private _defaultIds: string[] = []
  @Input()
  set defaultIds(ids: string[]) {
    // 排除空字符串
    this._defaultIds = ids.filter(id => id);
  }
  get defaultIds() {
    return this._defaultIds;
  }


  @Input() showSearchBar = true;

  @Output() selectTreeNode: EventEmitter<CommonFlatNode[]> = new EventEmitter<CommonFlatNode[]>();

  @ViewChild(CommonTreeComponent) tree?: CommonTreeComponent;

  constructor(private _business: LabelTreeBusiness, private _toastrService: ToastrService) {
    super();
  }

  ngOnInit(): void {
    this._init();
  }
  private async _init() {
    this._nestedNodeMap = this._business.nestedNodeMap;

    let res = await this._business.init(this._condition);
    console.log(res);
    this.dataSubject.next(res)
  }
  async searchEventHandler(condition: string) {
    console.log('搜索字段', condition);
    if (this._condition == condition && this._condition != '') {
      this._toastrService.warning('重复搜索相同字段');
      return;
    }

    this._condition = condition;

    let res = await this._business.searchNode(condition);
    // console.log(res)
    if (res && res.length) {
      this._toastrService.success('操作成功');
      if (res.length)
        this.defaultIds = [res[0].Id]
      this.dataSubject.next(res);
      if (condition != '') {
        this.tree?.expandAll()
      } else {
        this.tree?.reset();
        this.tree?.collapseAll()
      }
    } else {
      this._toastrService.warning('无匹配结果');
    }
  }

}
