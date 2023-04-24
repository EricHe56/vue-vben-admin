import { BasicColumn, FormSchema } from '/@/components/Table';
import { Component, h } from 'vue';
import { Switch } from 'ant-design-vue';
import { setRoleStatus } from '/@/api/demo/system';
import { useMessage } from '/@/hooks/web/useMessage';

let reload = () => {};

export const setReloadFunc = (reloadFunc: () => void) => {
  reload = reloadFunc;
};

export const columns: BasicColumn[] = [
  {
    title: '角色名称',
    dataIndex: 'roleName',
    sorter: true,
    width: 200,
  },
  {
    title: '角色值',
    dataIndex: 'roleValue',
    sorter: true,
    width: 180,
  },
  {
    title: '排序',
    dataIndex: 'orderNo',
    sorter: true,
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'status',
    sorter: true,
    width: 120,
    filters: [
      { text: 'On', value: 1 },
      { text: 'Off', value: 0 },
    ],
    customRender: (tbl) => {
      console.log(tbl);
      const { record } = tbl;
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      return h(Switch as Component, {
        size: 'small',
        checked: record.status === 1,
        checkedChildren: '', // on
        unCheckedChildren: '', // off
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? 1 : 0;
          const { createMessage } = useMessage();
          setRoleStatus(record.dbId, newStatus)
            .then(() => {
              record.status = newStatus;
              createMessage.success(`已成功修改角色状态`);
              reload();
            })
            .catch(() => {
              createMessage.error('修改角色状态失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true,
    width: 180,
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'roleName',
    label: '角色名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  // {
  //   field: 'status',
  //   label: '状态',
  //   component: 'Select',
  //   componentProps: {
  //     options: [
  //       { label: '启用', value: 1 },
  //       { label: '停用', value: 0 },
  //     ],
  //   },
  //   colProps: { span: 8 },
  // },
];

export const formSchema: FormSchema[] = [
  {
    field: 'roleName',
    label: '角色名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'roleValue',
    label: '角色值',
    required: true,
    component: 'Input',
  },
  {
    field: 'orderNo',
    label: '排序',
    component: 'InputNumber',
    required: true,
    defaultValue: 1,
    componentProps: {
      min: 1,
    },
    colProps: {
      span: 10,
    },
  },
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
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
  {
    label: ' ',
    field: 'menu',
    slot: 'menu',
    component: 'TreeSelect',
    componentProps: {
      autoExpandParent: true,
      defaultExpandAll: true,
    },
    ifShow: ({ values }) => {
      return typeof values.menu !== 'undefined' || values.menu !== null;
    },
  },
];
