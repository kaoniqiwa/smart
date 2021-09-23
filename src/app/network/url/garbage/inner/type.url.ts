import { IInnerUrl } from '../../base.url';

export class TypeUrl implements IInnerUrl {
  constructor(private base: string) {}
  basic() {
    return `${this.base}/Types`;
  }
  item(type: string | number) {
    return `${this.basic()}/${type}`;
  }
}
