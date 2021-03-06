import { BaseAiopUrl } from '../../base.url';

export abstract class RegionsURL {
  protected static get basic(): string {
    return `${BaseAiopUrl}/Regions`;
  }

  static create() {
    return this.basic;
  }
  static item(id: string) {
    return `${this.basic}/${id}`;
  }
  static list() {
    return `${this.basic}/List`;
  }
  static trees() {
    return `${this.basic}/Trees`;
  }

}
