<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #menu="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="treeData"
          :fieldNames="{ title: 'menuName', key: 'id' }"
          checkable
          toolbar
          title="菜单分配"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './role.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeItem } from '/@/components/Tree';

  import { insertRole, replaceRole, getMenuList } from '/@/api/demo/system';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { notification, createErrorModal } = useMessage();
  const { t } = useI18n();

  export default defineComponent({
    name: 'RoleDrawer',
    components: { BasicDrawer, BasicForm, BasicTree },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const treeData: any = ref<TreeItem[]>([]);
      let record: any = {};

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        baseColProps: { span: 24 },
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
        if (unref(treeData).length === 0) {
          treeData.value = (await getMenuList()) as any as TreeItem[];
        }
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          record = data.record;
          setFieldsValue({
            ...data.record,
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          // TODO custom api

          let apiFunc = insertRole;
          let postData: any = {};
          if (unref(isUpdate)) {
            apiFunc = replaceRole;
            record.id = values.id;
            record.roleName = values.roleName;
            record.roleValue = values.roleValue;
            record.orderNo = values.orderNo;
            record.menu = values.menu;
            record.status = values.status;
            record.remark = values.remark;
            postData = JSON.parse(JSON.stringify(record));
            // postData.children = [];
          } else {
            postData = JSON.parse(JSON.stringify(values));
          }

          // check menu data exist
          if (typeof postData.menu === 'undefined' || postData.menu === null) {
            postData.menu = [];
          }

          // check checked tree data
          if (typeof postData.menu.checked !== 'undefined') {
            const checked = JSON.parse(JSON.stringify(postData.menu.checked));
            postData.menu = checked;
          }

          const adminRole = await apiFunc(
            postData,
            'none', //不要默认的错误提示
          );
          console.log(values);
          if (adminRole) {
            notification.success({
              message: t('sys.api.successTip'),
              description: `${t('sys.api.operationSuccess')}: ${adminRole.roleName}`,
              duration: 3,
            });
          }
          closeDrawer();
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
          setDrawerProps({ confirmLoading: false });
        }
      }

      return {
        registerDrawer,
        registerForm,
        getTitle,
        handleSubmit,
        treeData,
      };
    },
  });
</script>
