import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { PaginatorComponent } from 'src/app/common/components/paginator/paginator.component';
import { TableComponent } from 'src/app/common/components/table/table.component';
import { ConfirmDialogEnum } from 'src/app/enum/confim-dialog.enum';
import { FormState } from 'src/app/enum/form-state.enum';
import { SelectEnum } from 'src/app/enum/select.enum';
import { TableSelectStateEnum } from 'src/app/enum/table-select-state.enum';
import { Page } from 'src/app/network/model/page_list.model';
import { ConfirmDialogModel } from 'src/app/view-model/confirm-dialog.model';
import { SRServerManageModel } from 'src/app/view-model/sr-server-manage.model';
import { TableCellEvent, TableColumnModel, TableOperateModel } from 'src/app/view-model/table.model';
import { SRServerManageConf } from './sr-server-manage..config';
import { SRServerManageBusiness } from './sr-server-manage.business';

@Component({
  selector: 'howell-sr-server-manage',
  templateUrl: './sr-server-manage.component.html',
  styleUrls: ['./sr-server-manage.component.less'],
  providers: [
    SRServerManageBusiness
  ]
})
export class SRServerManageComponent implements OnInit {
  /**private */
  private _pageSize = 9;
  private _condition = '';


  dataSource: SRServerManageModel[] = [];
  dataSubject = new BehaviorSubject<SRServerManageModel[]>([]);
  tableSelectModel = SelectEnum.Multiple;
  columnModel: TableColumnModel[] = [...SRServerManageConf]; // 表格列配置详情
  displayedColumns: string[] = this.columnModel.map((model) => model.columnDef); // 表格列 id
  page: Page | null = null;
  pagerCount: number = 4;
  pageIndex = 1;
  selectedRows: SRServerManageModel[] = [];//table选中项
  willBeDeleted: SRServerManageModel[] = [];
  showDialog = false;
  showConfirm = false;
  dialogModel = new ConfirmDialogModel('确认删除', '删除该项');
  state = FormState.none;
  tableOperates: TableOperateModel[] = []
  serverId: string = '';

  get enableDelBtn() {
    return !!this.selectedRows.length
  }


  @ViewChild(TableComponent) table?: TableComponent;
  @ViewChild(PaginatorComponent) paginator?: PaginatorComponent;

  constructor(private _business: SRServerManageBusiness, private _toastrService: ToastrService) {
    this.tableOperates.push(
      new TableOperateModel(
        'sync',
        ['fa', 'fa-retweet', 'operate-icon'],
        '同步',
        this._clickSyncBtn.bind(this)
      )
    )
    this.tableOperates.push(
      new TableOperateModel(
        'edit',
        ['howell-icon-modification', 'operate-icon'],
        '编辑',
        this._clickEditBtn.bind(this)
      )
    )
    this.tableOperates.push(
      new TableOperateModel(
        'delete',
        ['howell-icon-delete-bin', 'operate-icon'],
        '删除',
        this._clickDelBtn.bind(this)
      )
    )
  }

  ngOnInit(): void {
    this.init();
  }
  async init() {
    let res = await this._business.loadData();
    this.dataSubject.next(res)
  }

  selectTableRow(rows: SRServerManageModel[]) {
    this.selectedRows = rows;
  }

  tableSelect(type: TableSelectStateEnum) {
    if (this.table) {
      switch (type) {
        case TableSelectStateEnum.All:
          this.table.selectAll();
          break;
        case TableSelectStateEnum.Reverse:
          this.table.selectReverse();
          break;
        case TableSelectStateEnum.Cancel:
          this.table.selectCancel();
          break;
        default:
          throw new TypeError('类型错误');
      }
    }
  }

  closeForm(update: boolean) {
    this.showDialog = false
    this.state = FormState.none;
    if (update) this.init();
  }

  addBtnClick() {
    this.state = FormState.add;
    this.showDialog = true;
  }
  deleteBtnClick() {
    this.willBeDeleted = [...this.selectedRows]
    this.showConfirm = true;
    this.dialogModel.content = `删除${this.willBeDeleted.length}个选项?`
  }

  async dialogMsgEvent(status: ConfirmDialogEnum) {
    this.showConfirm = false;
    if (status == ConfirmDialogEnum.confirm) {
      this._deleteRows(this.willBeDeleted)
    } else if (status == ConfirmDialogEnum.cancel) {

    }
  }
  private async _deleteRows(rows: SRServerManageModel[]) {
    for (let i = 0; i < rows.length; i++) {
      let id = rows[i].Id;
      await this._business.delete(id)
      this._toastrService.success('删除成功');

    }
    if (this.table) {
      this.table.deleteRows(rows);
      this.init();
    }
  }

  private async _clickSyncBtn(row: SRServerManageModel, event: Event) {
    console.log('sync', row)
    let res = await this._business.sync(row.Id)
    if (res) {
      this._toastrService.success('同步成功');
    }
  }
  private _clickEditBtn(row: SRServerManageModel, event: Event) {
    console.log('edit')
    this.showDialog = true;
    this.state = FormState.edit;
    this.serverId = row.Id;
  }
  private _clickDelBtn(row: SRServerManageModel, event: Event) {
    console.log('delete')
    this.willBeDeleted = [row];
    this.showConfirm = true;
    this.dialogModel.content = `删除${this.willBeDeleted.length}个选项?`
  }
}
