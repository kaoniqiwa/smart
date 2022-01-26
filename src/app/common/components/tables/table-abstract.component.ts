import { Language } from 'src/app/global/tool/language';
import { Page } from 'src/app/network/model/page_list.model';

export abstract class TableAbstractComponent<T> {
  abstract width: Array<string>;
  Language = Language;
  datas: T[] = [];
  page?: Page;

  loading = false;
  pageSize = 9;

  getPaged(count: number, size: number): Page {
    let current = size % count;
    if (current === 0) {
      current = size;
    }

    let page = {
      PageSize: size,
      PageCount: Math.ceil(count / size),
      PageIndex: Math.ceil(count / size),
      RecordCount: current,
      TotalRecordCount: count,
    };
    return page;
  }
}
