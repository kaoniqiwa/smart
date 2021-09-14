/*
 * @Author: pmx
 * @Date: 2021-09-13 15:05:27
 * @Last Modified by: pmx
 * @Last Modified time: 2021-09-13 15:41:54
 */
import { BaseUser } from './base.url';

export class UsersUrl {
  static basic() {
    return `${BaseUser}/Users`;
  }
  static login(): string {
    return this.basic() + '/Login';
  }
}
