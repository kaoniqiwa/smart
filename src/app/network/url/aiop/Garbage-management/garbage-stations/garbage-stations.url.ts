import { GarbageManagementURL } from "../garbage-management.url";

export abstract class GarbageStationsUrls extends GarbageManagementURL {
  protected static get basic(): string {
    return `${super.basic}/GarbageStations`;
  }

  static item(id: string) {
    return `${this.basic}/${id}`;
  }
  static list() {
    return `${this.basic}/List`;
  }
  static Cameras(id: string) {
    return `${this.basic}/${id}/Cameras`;
  }

}