import { Injectable } from '@angular/core';
import { classToPlain } from 'class-transformer';
import { AbstractService } from 'src/app/business/Ibusiness';
import { UserConfigType } from 'src/app/enum/user-config-type.enum';
import { UserLabelType } from 'src/app/enum/user-label-type.enum';
import { Fault } from '../../model/howell-response.model';
import { PagedList } from '../../model/page_list.model';
import { Role } from '../../model/role.model';
import { UserLabel } from '../../model/user-label.model';
import { User } from '../../model/user.model';
import { PasswordUrl } from '../../url/garbage/password.url';
import { UserUrl } from '../../url/garbage/user.url';
import {
  BaseRequestService,
  BaseTypeRequestService,
} from '../base-request.service';
import { HowellAuthHttpService } from '../howell-auth-http.service';
import { PagedParams } from '../IParams.interface';
import { ServiceHelper } from '../service-helper';
import {
  ChangeUserPasswordParams,
  CheckCodeParams,
  GetUserLabelsParams,
  GetUsersParams,
  PasswordCheckCodeResult,
  RandomUserPaswordParams,
} from './user-request.params';

@Injectable({
  providedIn: 'root',
})
export class UserRequestService {
  constructor(_http: HowellAuthHttpService) {
    this.basic = new BaseRequestService(_http);
    this.type = this.basic.type(User);
  }

  private basic: BaseRequestService;
  private type: BaseTypeRequestService<User>;

  get(id: string): Promise<User> {
    let url = UserUrl.item(id);
    return this.type.get(url);
  }
  update(data: User): Promise<Fault> {
    let url = UserUrl.basic();
    return this.basic.put(url, Fault, data);
  }
  create(data: User): Promise<Fault> {
    let url = UserUrl.basic();
    return this.basic.post(url, Fault, data);
  }
  delete(id: string): Promise<Fault> {
    let url = UserUrl.item(id);
    return this.basic.delete(url, Fault);
  }

  list(
    params: GetUsersParams = new GetUsersParams()
  ): Promise<PagedList<User>> {
    let url = UserUrl.list();
    let data = classToPlain(params);
    return this.type.paged(url, data);
  }

  private _config?: ConfigService;
  public get config(): ConfigService {
    if (!this._config) {
      this._config = new ConfigService(this.basic);
    }
    return this._config;
  }

  private _role?: RolesService;
  public get role(): RolesService {
    if (!this._role) {
      this._role = new RolesService(this.basic);
    }
    return this._role;
  }

  private _label?: LabelsService;
  public get label(): LabelsService {
    if (!this._label) {
      this._label = new LabelsService(this.basic);
    }
    return this._label;
  }

  private _password?: PasswordsService;
  public get password(): PasswordsService {
    if (!this._password) {
      this._password = new PasswordsService(this.basic);
    }
    return this._password;
  }
}

class ConfigService {
  constructor(private basic: BaseRequestService) {}

  get(userId: string, type: UserConfigType): Promise<string> {
    let url = UserUrl.config(userId).item(type);
    return this.basic.http.getBase64String(url).toPromise();
  }

  update(userId: string, type: UserConfigType, base64: string): Promise<Fault> {
    let url = UserUrl.config(userId).item(type);
    return this.basic.http.putBase64String<Fault>(url, base64).toPromise();
  }
}

class RolesService {
  constructor(private basic: BaseRequestService) {
    this.basicType = basic.type(Role);
  }
  private basicType: BaseTypeRequestService<Role>;

  list(userId: string, params?: PagedParams): Promise<PagedList<Role>> {
    let url = UserUrl.role(userId).basic(params);
    return this.basic.get(url, PagedList);
  }

  get(userId: string, id: string): Promise<Role> {
    let url = UserUrl.role(userId).item(id);
    return this.basicType.get(url);
  }
}

class LabelsService {
  constructor(private basic: BaseRequestService) {}

  list(params: GetUserLabelsParams): Promise<PagedList<UserLabel>> {
    let url = UserUrl.label().list();
    let data = classToPlain(params);
    return this.basic.post<PagedList<UserLabel>>(url, PagedList, data);
  }

  get(id: string, type: UserLabelType): Promise<UserLabel> {
    let url = UserUrl.label().type(id, type);
    return this.basic.get(url, UserLabel);
  }
  create(label: UserLabel): Promise<Fault> {
    let url = UserUrl.label().type(label.LabelId, label.LabelType);
    return this.basic.post(url, Fault, label);
  }
  update(label: UserLabel): Promise<Fault> {
    let url = UserUrl.label().type(label.LabelId, label.LabelType);
    return this.basic.put(url, Fault, label);
  }
  delete(id: string, type: UserLabelType) {
    let url = UserUrl.label().type(id, type);
    return this.basic.delete(url, Fault);
  }
}

class PasswordsService {
  constructor(private basic: BaseRequestService) {}

  random(userId: string, params: RandomUserPaswordParams): Promise<string> {
    let url = UserUrl.password(userId).random();
    let data = classToPlain(params);
    return this.basic.http.postReturnString(url, data).toPromise();
  }

  change(userId: string, params: ChangeUserPasswordParams) {
    let url = UserUrl.password(userId).change();
    let data = classToPlain(params);
    return this.basic.post(url, User, data);
  }

  private _check?: PasswordCheckService;
  public get check(): PasswordCheckService {
    if (!this._check) {
      this._check = new PasswordCheckService(this.basic);
    }
    return this._check;
  }
}

class PasswordCheckService {
  constructor(private basic: BaseRequestService) {}

  mobileNo(mobileNo: string): Promise<Fault> {
    let url = PasswordUrl.checkMobileNo(mobileNo);
    return this.basic.get(url, Fault);
  }

  code(mobileNo?: string) {
    let url = PasswordUrl.checkCode(mobileNo);
    return this.basic.http.getBase64String(url).toPromise();
  }

  check(params: CheckCodeParams): Promise<PasswordCheckCodeResult> {
    let data = classToPlain(params);
    let url = PasswordUrl.checkCode();
    return this.basic.post(url, PasswordCheckCodeResult, data);
  }
}
