import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { isAccountExist } from '/@/api/demo/system';
import { BasicColumn, FormSchema } from '/@/components/Table';

const roleList: any[] = [];

export const setAccountFormSchemaRoleList = (newRoleList: any[]) => {
  while (roleList.length > 0) {
    roleList.pop();
  }
  newRoleList.forEach((r: any) => {
    roleList.push({
      label: r.roleName,
      value: r.roleValue,
    });
  });
};

export const columns: BasicColumn[] = [
  // {
  //   title: '数据ID',
  //   dataIndex: 'dbId',
  //   width: 120,
  // },
  // {
  //   title: '用户ID',
  //   dataIndex: 'userId',
  //   width: 120,
  // },
  {
    title: '用户名称',
    dataIndex: 'username',
    sorter: true,
    width: 120,
  },
  {
    title: '所属部门',
    dataIndex: 'deptDisplay',
    sorter: true,
    width: 120,
  },
  // {
  //   title: '手机号',
  //   dataIndex: 'mobile',
  //   width: 120,
  // },
  // {
  //   title: '邮箱',
  //   dataIndex: 'email',
  //   width: 120,
  // },
  {
    title: '角色',
    dataIndex: 'roles',
    width: 200,
    customRender: ({ record }) => {
      const roles = record.roles;
      const color = 'black';
      const text = roles.map((a) => a.roleName) + '';
      return h('span', { color: color }, text);
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true,
    width: 150,
  },
  {
    title: '状态',
    dataIndex: 'status',
    sorter: true,
    width: 80,
    customRender: ({ record }) => {
      const status = record.status;
      const enable = ~~status === 1;
      const color = enable ? 'green' : 'red';
      const text = enable ? '启用' : '停用';
      return h(Tag, { color: color }, () => text);
    },
  },
  // {
  //   title: '备注',
  //   dataIndex: 'remark',
  // },
];

export const searchFormSchema: FormSchema[] = [
  // {
  //   field: 'userId',
  //   label: '用户ID',
  //   component: 'Input',
  //   colProps: { span: 8 },
  // },
  {
    field: 'username',
    label: '用户名称',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const accountFormSchema: FormSchema[] = [
  {
    field: 'userId',
    label: '用户ID',
    component: 'Input',
    helpMessage: ['本字段演示异步验证', '不能输入带有admin的用户名'],
    rules: [
      {
        required: true,
        message: '请输入用户名',
      },
      {
        validator(_, value) {
          return new Promise((resolve, reject) => {
            isAccountExist(value)
              .then(() => resolve())
              .catch((err) => {
                reject(err.message || '验证失败');
              });
          });
        },
      },
    ],
    ifShow: false,
  },
  {
    field: 'username',
    label: '用户名称',
    component: 'Input',
    required: true,
  },
  // {
  //   field: 'password',
  //   label: '密码',
  //   component: 'InputPassword',
  //   required: false,
  //   // ifShow: false,
  // },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '停用', value: 0 },
      ],
    },
    required: true,
  },
  {
    field: 'homePath',
    label: '落地页',
    defaultValue: '/dashboard/workbench',
    component: 'Input',
    required: true,
  },
  {
    label: '角色',
    field: 'roleValues',
    component: 'Select',
    componentProps: {
      options: roleList,
      mode: 'multiple',
    },
    required: true,
  },
  {
    field: 'dept',
    label: '所属部门',
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        label: 'deptName',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    required: true,
  },
  {
    field: 'realName',
    label: '显示名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'avatar',
    label: '头像',
    component: 'SingleImageUpload',
    componentProps: {
      type: 'oss',
    },
    required: false,
  },
  {
    field: 'desc',
    label: '描述',
    component: 'InputTextArea',
    required: false,
  },
  {
    label: '手机号',
    field: 'mobile',
    component: 'Input',
    required: false,
  },
  {
    label: '邮箱',
    field: 'email',
    component: 'Input',
    required: false,
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];
