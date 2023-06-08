import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type AccountParams = BasicPageParams & {
  username?: string;
  deptId?: string;
  status?: string;
};

export type RoleParams = {
  roleName?: string;
  status?: string;
};

export type LogParams = {
  keyword?: string;
  code?: string;
  result?: string;
};

export type RolePageParams = BasicPageParams & RoleParams;
export type LogPageParams = BasicPageParams & LogParams;

export type DeptParams = {
  deptName?: string;
  status?: string;
};

export type MenuParams = {
  menuName?: string;
  status?: string;
};

export interface AccountListItem {
  id: string;
  account: string;
  email: string;
  nickname: string;
  role: number;
  createTime: string;
  remark: string;
  status: number;
}

export interface AdminAccount {
  dbId: string;
  ctime: number;
  mtime: number;
  userId: string;
  username: string;
  realName: string;
  dept: string;
  mobile: string;
  email: string;
  avatar: string;
  desc: string;
  password: string;
  token: string;
  homePath: string;
  roles: {
    roleName: string;
    value: string;
  }[];
  permissions: string[];
  createTime: string;
  remark: string;
  status: string;
}

export interface AdminDept {
  dbId: string;
  ctime: number;
  mtime: number;
  status: number;
  id: string;
  deptName: string;
  orderNo: number;
  createTime: string;
  remark: string;
  children: AdminDept[];
  parentDept: string;
}

export interface AdminRouteMeta {
  orderNo?: number;
  title: string;
  dynamicLevel?: number;
  realPath?: string;
  ignoreAuth?: boolean;
  roles?: string[];
  ignoreKeepAlive?: boolean;
  affix?: boolean;
  icon?: string;
  frameSrc?: string;
  transitionName?: string;
  hideBreadcrumb?: boolean;
  hideChildrenInMenu?: boolean;
  carryParam?: boolean;
  single?: boolean;
  currentActiveMenu?: string;
  hideTab?: boolean;
  hideMenu?: boolean;
  isLink?: boolean;
  ignoreRoute?: boolean;
  hidePathForChildren?: boolean;
}

export interface AdminMenuTag {
  type?: string;
  content?: string;
  dot?: boolean;
}

export interface AdminMenu {
  dbId: string;
  ctime: number;
  mtime: number;
  status: number;
  id: string;
  component?: string;
  type: string;
  menuName: string;
  permission: string;
  orderNo: number;
  createTime: string;
  parentMenu: string;
  name: string;
  icon?: string;
  routePath: string;
  path: string;
  paramPath?: string;
  isExt: number;
  keepAlive: number;
  show: number;
  disabled?: boolean;
  children?: AdminMenu[];
  roles?: string[];
  meta?: AdminRouteMeta;
  tag?: AdminMenuTag;
  hideMenu?: boolean;
  redirect?: string;
  props?: { [key: string]: any };
  instances?: { [key: string]: any };
  leaveGuards?: { [key: string]: any };
  updateGuards?: { [key: string]: any };
  enterCallbacks?: { [key: string]: any };
  components?: { [key: string]: any };
}

export interface AdminRole {
  dbId: string;
  ctime: number;
  mtime: number;
  status: number;
  id: string;
  orderNo: number;
  createTime: string;
  roleName: string;
  roleValue: string;
  menu: string[];
  remark: string;
}

export interface DeptListItem {
  id: string;
  orderNo: string;
  createTime: string;
  remark: string;
  status: number;
}

export interface MenuListItem {
  id: string;
  orderNo: string;
  createTime: string;
  status: number;
  icon: string;
  component: string;
  permission: string;
}

export interface RoleListItem {
  id: string;
  roleName: string;
  roleValue: string;
  status: number;
  orderNo: string;
  createTime: string;
}

export interface ActionLogListItem {
  dbId: string;
  ctime: number;
  mtime: number;
  createTime: string;
  adminDBId: string;
  username: string;
  action: string;
  sourceIP: string;
  URI: string;
  body: string;
  description: string;
  result: string;
  code: number;
  error: string;
}

export interface ActionLog {
  dbId: string;
  ctime: number;
  mtime: number;
  createTime: string;
  adminDBId: string;
  username: string;
  action: string;
  sourceIP: string;
  URI: string;
  body: string;
  description: string;
  result: string;
  code: number;
  error: string;
}

/**
 * @description: Request list return value
 */
export type AccountListGetResultModel = BasicFetchResult<AccountListItem>;

export type DeptListGetResultModel = BasicFetchResult<DeptListItem>;

export type MenuListGetResultModel = BasicFetchResult<MenuListItem>;

export type RolePageListGetResultModel = BasicFetchResult<RoleListItem>;
export type LogPageListGetResultModel = BasicFetchResult<ActionLogListItem>;

export type RoleListGetResultModel = RoleListItem[];
