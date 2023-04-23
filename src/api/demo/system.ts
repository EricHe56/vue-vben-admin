import {
  AccountParams,
  DeptListItem,
  MenuParams,
  RoleParams,
  RolePageParams,
  MenuListGetResultModel,
  DeptListGetResultModel,
  AccountListGetResultModel,
  RolePageListGetResultModel,
  RoleListGetResultModel,
  AdminDept,
  AdminMenu,
  AdminRole,
} from './model/systemModel';
import { defHttp } from '/@/utils/http/axios';
import { getValue } from '/@/utils/index';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  AccountList = '/system/getAccountList',
  IsAccountExist = '/system/accountExist',

  DeptInsert = '/admin_dept/insert?ty=dept',
  DeptReplace = '/admin_dept/replace?ty=dept',
  DeptDelete = '/admin_dept/delete?ty=dept',
  DeptList = '/admin_dept/list?ty=dept',

  MenuInsert = '/admin_menu/insert?ty=menu',
  MenuReplace = '/admin_menu/replace?ty=menu',
  MenuDelete = '/admin_menu/delete?ty=menu',
  MenuList = '/admin_menu/list?ty=menu',

  RoleInsert = '/admin_role/insert?ty=role',
  RoleReplace = '/admin_role/replace?ty=role',
  RoleDelete = '/admin_role/delete?ty=role',
  RolePageList = '/admin_role/page?ty=role',

  SetRoleStatus = '/admin_role/set_status?ty=role',
  RoleList = '/admin_role/list?ty=role',
  // GetAllRoleList = '/system/getAllRoleList',
}

export const getAccountList = (params: AccountParams) =>
  defHttp.get<AccountListGetResultModel>({ url: Api.AccountList, params });

export const insertDept = (params: AdminDept, mode: ErrorMessageMode = 'modal') =>
  defHttp.post<AdminDept>(
    {
      url: Api.DeptInsert,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );

export const replaceDept = (params: AdminDept, mode: ErrorMessageMode = 'modal') =>
  defHttp.post<AdminDept>(
    {
      url: Api.DeptReplace,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );

export const deleteDept = (params: AdminDept, mode: ErrorMessageMode = 'modal') =>
  defHttp.post<AdminDept>(
    {
      url: Api.DeptDelete,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );

export const getDeptList = (params?: DeptListItem) =>
  defHttp.get<DeptListGetResultModel>({ url: Api.DeptList, params });

export const insertMenu = (params: AdminMenu, mode: ErrorMessageMode = 'modal') =>
  defHttp.post<AdminMenu>(
    {
      url: Api.MenuInsert,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );

export const replaceMenu = (params: AdminMenu, mode: ErrorMessageMode = 'modal') =>
  defHttp.post<AdminMenu>(
    {
      url: Api.MenuReplace,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );

export const deleteMenu = (params: AdminMenu, mode: ErrorMessageMode = 'modal') =>
  defHttp.post<AdminMenu>(
    {
      url: Api.MenuDelete,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );

export const getMenuList = (params?: MenuParams) =>
  defHttp.get<MenuListGetResultModel>({ url: Api.MenuList, params });

export const insertRole = (params: AdminRole, mode: ErrorMessageMode = 'modal') =>
  defHttp.post<AdminRole>(
    {
      url: Api.RoleInsert,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );

export const replaceRole = (params: AdminRole, mode: ErrorMessageMode = 'modal') =>
  defHttp.post<AdminRole>(
    {
      url: Api.RoleReplace,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );

export const deleteRole = (params: AdminRole, mode: ErrorMessageMode = 'modal') =>
  defHttp.post<AdminRole>(
    {
      url: Api.RoleDelete,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );

export const getRoleListByPage = (params?: RolePageParams) => {
  const size: number = getValue(params?.pageSize, 10);
  const offset: number = (getValue(params?.page, 1) - 1) * size;
  const data: any = {
    offset: offset,
    size: size,
  };
  const roleName = getValue(params?.roleName, '');
  if (roleName !== '') {
    data.keyword = roleName;
    data.keywordFields = ['roleName'];
  }
  const status = getValue(params?.status, -1);
  if (status !== -1) {
    data.filter = {
      status: status,
    };
  }
  return defHttp.post<RolePageListGetResultModel>(
    { url: Api.RolePageList, data },
    {
      errorMessageMode: 'modal',
    },
  );
};

export const getAllRoleList = (params?: RoleParams) =>
  defHttp.get<RoleListGetResultModel>({ url: Api.RoleList, params });

export const setRoleStatus = (dbId: string, status: number) =>
  defHttp.post(
    { url: Api.SetRoleStatus, data: { dbId, status } },
    {
      errorMessageMode: 'modal',
    },
  );

export const isAccountExist = (account: string) =>
  defHttp.post({ url: Api.IsAccountExist, params: { account } }, { errorMessageMode: 'none' });
