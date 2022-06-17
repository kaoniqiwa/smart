export declare class HowellExportChart {
  constructor(data: ExcelData);

  read(opts: any, cb?: any): void;
  //generate(data: any, opt: any, bc:(bolb:any)=>void):void;

  loadZip(fileData: any): void;

  writeStrings(strs: string[]): void;

  getStr(str: string): string;

  writeRows(area: string, rows: { $: any; c: any }[]): void;

  setRowCells(
    row: { num: number; spans: string },
    col: { num: string; t: boolean; val: string }[]
  ): { $: any; c: any };
  /**
   *
   * @param fileData 数据buffer
   * @param writeName 导出的文件名
   * @param col 统计 第几了列（A,B）
   */
  generate(
    fileData: any,
    writeName: string,
    row: number,
    col: number,
    v2: boolean,
    replaceWorksheetAttr?: { $: any; sheetViews: any; drawing: any }
  ): void;
}

export class ExcelData {
  chart?: string;
  chartTitle?: string;
  titles?: Array<string>;
  dataKey?: Array<string>;
  fields?: Array<string>;
  fieldName?: Array<string>;
  chartCatStrRef?: string;
  data: any;
  dataLen: number;
  constructor() {
    this.dataLen = 9;
  }
}
