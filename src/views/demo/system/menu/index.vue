<template>
  <div style="padding: 16px">
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增菜单 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { type Recordable } from '@vben/types';
  import { defineComponent, nextTick } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getMenuList, deleteMenu } from '/@/api/demo/system';
  // import { AdminMenu } from '/@/api/demo/model/systemModel';

  import { useDrawer } from '/@/components/Drawer';
  import MenuDrawer from './MenuDrawer.vue';

  import { columns, searchFormSchema } from './menu.data';

  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { createErrorModal } = useMessage();
  const { t } = useI18n();

  export default defineComponent({
    name: 'MenuManagement',
    components: { BasicTable, MenuDrawer, TableAction },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload, expandAll }] = useTable({
        title: '菜单列表',
        api: getMenuList,
        afterFetch: afterFetch,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        isTreeTable: true,
        indentSize: 20,
        pagination: false,
        striped: false,
        // useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        canResize: false,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          // slots: { customRender: 'action' },
          fixed: undefined,
        },
      });

      const typeList = [
        { label: '目录', value: '0' },
        { label: '菜单', value: '1' },
        { label: '按钮', value: '2' },
      ];
      function afterFetch(dataList: any[]) {
        // console.log('1. dataList: ', dataList);
        dataList.forEach((data: any) => {
          data.typeDisplay = typeList.filter((a) => a.value === data.type).map((b) => b.label) + '';
          if (
            typeof data.children !== 'undefined' &&
            data.children !== null &&
            data.children.length > 0
          ) {
            afterFetch(data.children);
          }
        });
        // console.log('2. dataList: ', dataList);
        return dataList;
      }

      function handleCreate() {
        openDrawer(true, {
          record: {
            type: 0,
            id: '',
            menuName: '',
            name: '',
            routePath: '',
            path: '',
            redirect: '',
            component: '',
            permission: '',
            isExt: false,
            keepalive: false,
            show: false,
            orderNo: 1,
            icon: '',
            parentMenu: '',
            status: 0,
            meta: {
              orderNo: 1,
              title: '',
              dynamicLevel: 0,
              realPath: '',
              ignoreAuth: false,
              roles: [],
              ignoreKeepAlive: false,
              affix: false,
              icon: '',
              frameSrc: '',
              transitionName: '',
              hideBreadcrumb: false,
              hideChildrenInMenu: false,
              carryParam: false,
              single: false,
              currentActiveMenu: '',
              hideTab: false,
              hideMenu: false,
              isLink: false,
              ignoreRoute: false,
              hidePathForChildren: false,
              validated: true,
            },
          },
          isUpdate: false,
        });
      }

      function handleEdit(recordRaw: Recordable<any>) {
        const record: Recordable<any> = JSON.parse(JSON.stringify(recordRaw));
        if (typeof record.meta === 'undefined') {
          record.meta = {
            orderNo: 1,
            title: '',
            dynamicLevel: 0,
            realPath: '',
            ignoreAuth: false,
            roles: [],
            ignoreKeepAlive: false,
            affix: false,
            icon: '',
            frameSrc: '',
            transitionName: '',
            hideBreadcrumb: false,
            hideChildrenInMenu: false,
            carryParam: false,
            single: false,
            currentActiveMenu: '',
            hideTab: false,
            hideMenu: false,
            isLink: false,
            ignoreRoute: false,
            hidePathForChildren: false,
            validated: true,
          };
        } else {
          record.meta.validated = true;
        }
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      async function handleDelete(record: Recordable<any>) {
        console.log(record);
        try {
          const postData: any = record;
          await deleteMenu(
            postData,
            'none', //不要默认的错误提示
          );
          reload();
        } catch (error) {
          createErrorModal({
            title: t('sys.api.errorTip'),
            content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
          });
        }
      }

      function handleSuccess() {
        reload();
      }

      function onFetchSuccess() {
        // 演示默认展开所有表项
        nextTick(expandAll);
      }

      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        onFetchSuccess,
      };
    },
  });
</script>
