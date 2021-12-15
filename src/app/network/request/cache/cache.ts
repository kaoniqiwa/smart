import { ClassConstructor } from 'class-transformer';
import { Division } from '../../model/division.model';
import { GarbageStation } from '../../model/garbage-station.model';
import { DivisionServiceCache } from './division-service.cache';
import { GarbageStationServiceCache } from './garbage-station-service.cache';
import { ServiceCache } from './service.cache';

export function Cache<T>(key: string, type?: ClassConstructor<T>) {
  return function (this: any, target: Function) {
    if (!target.prototype.cache) {
      // new ServiceCache(key, this);
      console.log('Cache', this);
      Object.defineProperty(target.prototype, 'cache', {
        get() {
          if (!this._cache) {
            if (type) {
              switch (type.name) {
                case Division.name:
                  this._cache = new DivisionServiceCache(key, this);
                  break;
                case GarbageStation.name:
                  this._cache = new GarbageStationServiceCache(key, this);
                  break;
                default:
                  this._cache = new ServiceCache(key, this);
                  break;
              }
            } else {
              this._cache = new ServiceCache(key, this);
            }
          }
          return this._cache;
        },
        set() {},
      });
      // target.prototype.cache = function () {
      //   console.log('cache', this);
      //   return;
      // };
    }
  };
}
