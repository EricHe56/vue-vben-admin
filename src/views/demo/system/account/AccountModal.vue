<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { accountFormSchema } from './account.data';

  import { insertAccount, replaceAccount, getDeptList } from '/@/api/demo/system';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { notification, createErrorModal } = useMessage();
  const { t } = useI18n();

  const roleList: any[] = [];

  export const setAccountModalRoleList = (newRoleList: any[]) => {
    while (roleList.length > 0) {
      roleList.pop();
    }
    newRoleList.forEach((r: any) => {
      roleList.push(r);
    });
  };

  export default defineComponent({
    name: 'AccountModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      let record: any = {};

      const [registerForm, { setFieldsValue, replaceSchema, resetFields, validate }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: accountFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          record = data.record;
          rowId.value = data.record.id;
          setFieldsValue({
            ...data.record,
          });
        }

        const treeData = await getDeptList();
        // updateSchema([
        //   {
        //     field: 'pwd',
        //     show: !unref(isUpdate),
        //   },
        //   {
        //     field: 'dept',
        //     componentProps: { treeData },
        //   },
        // ]);
        replaceSchema([
          {
            field: 'pwd',
            show: !unref(isUpdate),
          },
          {
            field: 'dept',
            componentProps: { treeData },
          },
        ]);
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增账号' : '编辑账号'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          // TODO custom api
          console.log(values);

          // convert roleValues to roles
          values.roles = [];
          if (unref(values.roleValues).length > 0) {
            unref(values.roleValues).forEach((r: string) => {
              if (roleList.filter((a) => a.roleValue === r).length > 0) {
                const role = roleList.filter((a) => a.roleValue === r)[0];
                values.roles.push({
                  roleName: role.roleName,
                  value: role.roleValue,
                });
              }
            });
          }

          let apiFunc = insertAccount;
          let postData: any = {};
          if (unref(isUpdate)) {
            apiFunc = replaceAccount;
            record.userId = values.userId;
            record.password = values.password;
            record.homePath = values.homePath;
            record.roles = values.roles;
            record.dept = values.dept;
            record.avatar = values.avatar;
            record.username = values.username;
            record.realName = values.realName;
            record.desc = values.desc;
            record.mobile = values.mobile;
            record.email = values.email;

            record.status = values.status;
            record.remark = values.remark;
            postData = JSON.parse(JSON.stringify(record));
            postData.children = [];
          } else {
            postData = JSON.parse(JSON.stringify(values));
          }
          const adminAccount = await apiFunc(
            postData,
            'none', //不要默认的错误提示
          );

          if (adminAccount) {
            notification.success({
              message: t('sys.api.successTip'),
              description: `${t('sys.api.operationSuccess')}: ${adminAccount.username}`,
              duration: 3,
            });
          }
          closeModal();
          emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
        } catch (error) {
          if (typeof error.errorFields !== 'undefined') {
            // 表单验证 不需要对话框提示
            // createErrorModal({
            //   title: t('sys.api.errorTip'),
            //   // content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
            //   content:
            //     error.errorFields[0].errors.toLocaleString() || t('sys.api.networkExceptionMsg'),
            // });
          } else {
            createErrorModal({
              title: t('sys.api.errorTip'),
              content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
            });
          }
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit };
    },
  });
</script>
