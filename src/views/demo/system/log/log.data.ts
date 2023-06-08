import { nextTick } from 'vue';
import { FormActionType } from '/@/components/Form';
import { BasicColumn, FormSchema } from '/@/components/Table';
// import { /*Component,*/ h } from 'vue';
// import { Switch } from 'ant-design-vue';
// import { setRoleStatus } from '/@/api/demo/system';
// import { useMessage } from '/@/hooks/web/useMessage';
// import { Tag } from 'ant-design-vue';

// let reload = () => {};
let actionForm: FormActionType;

// export const setReloadFunc = (reloadFunc: () => void) => {
//   reload = reloadFunc;
// };
export const setActionForm = (tblActionForm: FormActionType) => {
  actionForm = tblActionForm;
};

const actionFormInputKeyup = (keyEvent) => {
  window.console.log('code filter onKeyup: ', keyEvent);
  if (keyEvent.code === 'Enter') {
    nextTick(() => {
      actionForm.submit();
    });
  }
};

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
    width: 50,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true,
    width: 100,
  },
  {
    title: '行为', // if use method 2 need to disable this line
    dataIndex: 'action',
    width: 100,
    // // method 2: for ant design vue 2.x
    // slots: { title: 'actionTitle', customRender: 'actionValue' },
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
    width: 50,
  },
  {
    title: 'Code',
    dataIndex: 'code',
    width: 50,
  },
  {
    title: '错误信息',
    dataIndex: 'error',
    width: 100,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'keyword',
    label: '关键字',
    component: 'Input',
    colProps: { span: 8 },
    componentProps: {
      onKeyup: actionFormInputKeyup,
    },
  },
  {
    field: 'code',
    label: 'Code',
    defaultValue: '',
    component: 'Input',
    colProps: { span: 4 },
    componentProps: {
      onKeyup: actionFormInputKeyup,
    },
  },
  {
    field: 'result',
    label: '结果',
    defaultValue: '',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: '' },
        { label: '成功', value: '成功' },
        { label: '失败', value: '失败' },
      ],
      onChange: (val) => {
        window.console.log('result filter onChange: ', val);
        nextTick(() => {
          actionForm.submit();
        });
      },
    },
    colProps: { span: 4 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'createTime',
    label: '时间',
    required: true,
    component: 'Input',
    componentProps: {
      readonly: true,
    },
  },
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
    // required: true,
    component: 'Input',
    componentProps: {
      readonly: true,
    },
  },
  {
    field: 'error',
    label: 'Error',
    // required: true,
    component: 'Input',
    componentProps: {
      readonly: true,
    },
  },
  {
    field: 'sourceIP',
    label: 'sourceIP',
    // required: true,
    component: 'Input',
    componentProps: {
      readonly: true,
    },
  },
  {
    field: 'URI',
    label: 'URI',
    // required: true,
    component: 'Input',
    componentProps: {
      readonly: true,
    },
  },
  {
    field: 'body',
    label: 'body',
    // required: true,
    component: 'InputTextArea',
    componentProps: {
      readonly: true,
    },
  },
  {
    field: 'description',
    label: 'description',
    // required: true,
    component: 'InputTextArea',
    componentProps: {
      readonly: true,
    },
  },
];
