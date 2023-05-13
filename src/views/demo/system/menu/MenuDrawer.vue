<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="30%"
    @ok="handleSubmit"
    @close="handleCancel"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './menu.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { insertMenu, replaceMenu, getMenuList } from '/@/api/demo/system';

  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { notification, createErrorModal } = useMessage();
  const { t } = useI18n();

  export default defineComponent({
    name: 'MenuDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      let record: any = {};

      const [registerForm, { resetFields, setFieldsValue, replaceSchema, validate }] = useForm({
        layout: 'inline',
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 24, md: 24 },
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          record = data.record;
          setFieldsValue({
            ...data.record,
          });
        } else {
          record = data.record;
          setFieldsValue({
            ...data.record,
          });
        }
        const treeData = await getMenuList();
        // updateSchema({ // this function is merge not replace
        //   field: 'parentMenu',
        //   componentProps: { treeData },
        // });
        replaceSchema({
          field: 'parentMenu',
          componentProps: { treeData },
        });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'));

      async function handleSubmit() {
        try {
          const values = await validate();
          const isNotButton = values.type !== '2';
          const hasMeta = typeof values.meta !== 'undefined';

          if (isNotButton) {
            if (!values.meta.validated) {
              throw new Error(t('sys.menu.metaInvalid'));
            }
          }

          setDrawerProps({ confirmLoading: true });
          // TODO custom api

          // auto fill
          if (typeof values.parentMenu === 'undefined') {
            values.parentMenu = '';
          }

          switch (values.type) {
            case '0':
              values.component = 'LAYOUT';
              break;
            case '1': // menu
              // values.component = 'LAYOUT';
              break;
            case '2': // button
              // values.component = 'LAYOUT';
              break;
          }

          // check path before assign id
          if (unref(isUpdate)) {
            if (('$' + values.parentMenu).includes('$' + record.id)) {
              throw new Error(t('sys.menu.parentCanNotBeSelfOrChild'));
            }
          }

          // fill id
          if (values.parentMenu === '') {
            values.id = '' + (values.orderNo - 1);
          } else {
            values.id = values.parentMenu + '-' + (values.orderNo - 1);
          }

          // fill meta orderNo
          if (hasMeta) {
            values.meta.orderNo = values.orderNo;
            values.meta.icon = values.icon;
          }

          // update props by string
          if (typeof values.propsInString === 'undefined' || values.propsInString === null) {
            values.propsInString = '{}';
          }
          values.props = JSON.parse(values.propsInString);

          let apiFunc = insertMenu;
          let postData: any = {};
          if (unref(isUpdate)) {
            apiFunc = replaceMenu;
            record.type = values.type;
            record.id = values.id;
            record.menuName = values.menuName;
            record.name = values.name;
            record.routePath = values.routePath;
            record.path = values.path;
            record.redirect = values.redirect;
            record.component = values.component;
            record.permission = values.permission;
            record.isExt = values.isExt;
            record.keepalive = values.keepalive;
            record.show = values.show;
            record.orderNo = values.orderNo;
            record.icon = values.icon;
            record.parentMenu = values.parentMenu;
            record.status = values.status;
            if (hasMeta) {
              record.meta = values.meta;
            }
            record.props = values.props;
            record.propsInString = values.propsInString;

            postData = JSON.parse(JSON.stringify(record));
            postData.children = [];
          } else {
            postData = JSON.parse(JSON.stringify(values));
          }
          const adminMenu = await apiFunc(
            postData,
            'none', //不要默认的错误提示
          );
          console.log(values);
          if (adminMenu) {
            notification.success({
              message: t('sys.api.successTip'),
              description: `${t('sys.api.operationSuccess')}: ${adminMenu.menuName}`,
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

      function handleCancel() {
        console.log('menu form closed!');
      }

      return { registerDrawer, registerForm, getTitle, handleSubmit, handleCancel };
    },
  });
</script>
