<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './dept.data';
  import { insertDept, replaceDept, getDeptList } from '/@/api/demo/system';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { notification, createErrorModal } = useMessage();
  const { t } = useI18n();

  export default defineComponent({
    name: 'DeptModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      let record: any = {};

      const [registerForm, { resetFields, setFieldsValue, replaceSchema, validate }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          record = data.record;
          setFieldsValue({
            ...data.record,
          });
        }
        const treeData = await getDeptList();
        // updateSchema({
        //   field: 'parentDept',
        //   componentProps: { treeData },
        // });
        replaceSchema({
          field: 'parentDept',
          componentProps: { treeData },
        });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增部门' : '编辑部门'));

      async function handleSubmit() {
        try {
          const values = await validate();

          setModalProps({ confirmLoading: true });
          // TODO custom api

          if (typeof values.parentDept === 'undefined') {
            values.parentDept = '';
          }

          // check path before assign id
          if (unref(isUpdate)) {
            if (('$' + values.parentDept).includes('$' + record.id)) {
              throw new Error(t('sys.dept.parentCanNotBeSelfOrChild'));
            }
          }

          if (values.parentDept === '') {
            values.id = '' + (values.orderNo - 1);
          } else {
            values.id = values.parentDept + '-' + (values.orderNo - 1);
          }

          let apiFunc = insertDept;
          let postData: any = {};
          if (unref(isUpdate)) {
            apiFunc = replaceDept;
            record.id = values.id;
            record.deptName = values.deptName;
            record.orderNo = values.orderNo;
            record.parentDept = values.parentDept;
            record.status = values.status;
            record.remark = values.remark;
            postData = JSON.parse(JSON.stringify(record));
            postData.children = [];
          } else {
            postData = JSON.parse(JSON.stringify(values));
          }
          const adminDept = await apiFunc(
            postData,
            'none', //不要默认的错误提示
          );
          console.log(values);
          if (adminDept) {
            notification.success({
              message: t('sys.api.successTip'),
              description: `${t('sys.api.operationSuccess')}: ${adminDept.deptName}`,
              duration: 3,
            });
          }
          closeModal();
          emit('success');
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
