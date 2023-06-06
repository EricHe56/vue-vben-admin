import { BasicColumn, FormSchema } from '/@/components/Table';
// import { /*Component,*/ h } from 'vue';
// import { Switch } from 'ant-design-vue';
// import { setRoleStatus } from '/@/api/demo/system';
// import { useMessage } from '/@/hooks/web/useMessage';
// import { Tag } from 'ant-design-vue';

// let reload = () => {};

// export const setReloadFunc = (reloadFunc: () => void) => {
//   reload = reloadFunc;
// };

export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'adminDBId',
    sorter: true,
    width: 100,
  },
  {
    title: '名称',
    dataIndex: 'username',
    sorter: true,
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true,
    width: 100,
  },
  {
    // title: '行为', // if use method 2 or 3 need to disable this line
    dataIndex: 'action',
    width: 100,
    // // method 2: for ant design vue 2.x
    slots: { title: 'actionTitle', customRender: 'actionValue' },
    // method 1: body cell render by column config
    // customRender: ({ record }) => {
    //   const text = record.action;
    //   return h(
    //     'span',
    //     {
    //       color: 'blue',
    //       style: 'display: block; text-align: left; width:100%; margin-left: 10px;',
    //     },
    //     text,
    //   );
    // },
  },
  {
    title: '结果',
    dataIndex: 'result',
    width: 100,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: '名称',
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
    field: 'adminDBId',
    label: 'ID',
    required: true,
    component: 'Input',
    componentProps: {
      readonly: true,
    },
  },
  {
    field: 'username',
    label: '名称',
    required: true,
    component: 'Input',
    componentProps: {
      readonly: true,
    },
  },
  {
    field: 'action',
    label: '行为',
    required: true,
    component: 'Input',
    componentProps: {
      readonly: true,
    },
  },
  {
    field: 'createTime',
    label: '创建时间',
    required: true,
    component: 'Input',
    componentProps: {
      readonly: true,
    },
  },
  {
    field: 'result',
    label: '结果',
    required: true,
    component: 'Input',
    componentProps: {
      readonly: true,
    },
  },
  {
    field: 'code',
    label: 'Code',
    required: true,
    component: 'Input',
    componentProps: {
      readonly: true,
    },
  },
  {
    field: 'error',
    label: 'Error',
    required: true,
    component: 'Input',
    componentProps: {
      readonly: true,
    },
  },
];
