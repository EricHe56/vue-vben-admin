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
} from './model/systemModel';
import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  AccountList = '/system/getAccountList',
  IsAccountExist = '/system/accountExist',
  DeptInsert = '/admin_dept/insert',
  DeptReplace = '/admin_dept/replace',
  DeptDelete = '/admin_dept/delete',
  DeptList = '/admin_dept/list',
  setRoleStatus = '/system/setRoleStatus',
  MenuList = '/system/getMenuList',
  RolePageList = '/system/getRoleListByPage',
  GetAllRoleList = '/system/getAllRoleList',
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

export const getMenuList = (params?: MenuParams) =>
  defHttp.get<MenuListGetResultModel>({ url: Api.MenuList, params });

export const getRoleListByPage = (params?: RolePageParams) =>
  defHttp.get<RolePageListGetResultModel>({ url: Api.RolePageList, params });

export const getAllRoleList = (params?: RoleParams) =>
  defHttp.get<RoleListGetResultModel>({ url: Api.GetAllRoleList, params });

export const setRoleStatus = (id: number, status: string) =>
  defHttp.post({ url: Api.setRoleStatus, params: { id, status } });

export const isAccountExist = (account: string) =>
  defHttp.post({ url: Api.IsAccountExist, params: { account } }, { errorMessageMode: 'none' });
