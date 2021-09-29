/*
 * @Author: pmx
 * @Date: 2021-09-28 13:20:43
 * @Last Modified by: pmx
 * @Last Modified time: 2021-09-28 15:38:47
 */
import { Injectable } from '@angular/core';
import { DivisionType } from 'src/app/enum/division-type.enum';
import { UserResource } from 'src/app/network/model/user.model';
import { DigestResponse } from 'src/app/network/request/auth/digest-response.class';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  set userId(userId: string) {
    sessionStorage.setItem('userId', userId);
  }
  get userId() {
    return sessionStorage.getItem('userId') ?? '';
  }

  set userResource(userResource: Array<UserResource>) {
    sessionStorage.setItem('userResouce', JSON.stringify(userResource));
  }
  get userResource() {
    let userResource_str = sessionStorage.getItem('userResouce');

    return userResource_str == null ? null : JSON.parse(userResource_str);
  }

  set userResourceType(divisionType: DivisionType) {
    sessionStorage.setItem('divisionType', JSON.stringify(divisionType));
  }
  get userResourceType(): DivisionType {
    let divisionTypeStr = sessionStorage.getItem('divisionType');

    return divisionTypeStr == null ? null : JSON.parse(divisionTypeStr);
  }

  set challenge(challenge: DigestResponse) {
    sessionStorage.setItem('challenge', JSON.stringify(challenge));
  }
  get challenge() {
    let challenge_str = sessionStorage.getItem('challenge');

    return challenge_str == null ? null : JSON.parse(challenge_str);
  }

  clear(name?: string) {
    if (name) {
      sessionStorage.removeItem(name);
    } else {
      sessionStorage.clear();
    }
  }
}