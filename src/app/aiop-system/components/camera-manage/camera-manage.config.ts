import { AICameraManageModel } from 'src/app/view-model/ai-camera-manage.model';
import { TableColumnModel } from 'src/app/view-model/table.model';

export const CameraManageConf: TableColumnModel[] = [
  {
    columnDef: 'CameraName',
    header: '名称',
    cell: (element: AICameraManageModel) => `${element.Name}`,
    flexBasis: "12%"
  },
  {
    columnDef: 'CameraType',
    header: '类型',
    cell: (element: AICameraManageModel) => `${element.CameraType}`,
  },
  {
    columnDef: 'CameraState',
    header: '状态',
    cell: (element: AICameraManageModel) => `${element.CameraState}`,
  },
  {
    columnDef: 'DeciveName',
    header: '编码设备',
    cell: (element: AICameraManageModel) => `${element.DeciveName}`,
  },
  {
    columnDef: 'Labels',
    header: '标签',
    cell: (element: AICameraManageModel) => `【${element.Labels.length}】`,
  }

];
