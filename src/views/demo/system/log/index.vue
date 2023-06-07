<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button v-if="false" type="primary" @click="handleCreate"> 新增 </a-button>
      </template>
      <!-- ant design vue 2.x -->
      <!-- <template #actionTitle>
        <span style="color: #096dd9">
          <SmileOutlined />
          行为
        </span>
      </template>
      <template #actionValue="{ text }">
        <span
          style="display: block; width: 100%; margin-left: 10px; color: #096dd9; text-align: left"
          >{{ text }}</span
        >
      </template> -->

      <!-- ant design vue 3.0+ -->
      <template #headerCell="{ column }">
        <template v-if="column.key === 'action'">
          <span style=""> {{ column.customTitle }} </span>
        </template>
        <template v-else>
          <span style=""> {{ column.customTitle }} </span>
        </template>
      </template>
      <template #bodyCell="{ column, record }">
        <!-- for ant design vue 3.0+ -->
        <template v-if="column.key === 'action'">
          <span
            style="display: block; width: 100%; margin-left: 10px; color: #096dd9; text-align: left"
            >{{ record.action }}</span
          >
        </template>
        <template v-if="column.key === 'operations'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:info-standard-line', // 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
              },
              // {
              //   icon: 'ant-design:delete-outlined',
              //   color: 'error',
              //   popConfirm: {
              //     title: '是否确认删除',
              //     placement: 'left',
              //     confirm: handleDelete.bind(null, record),
              //   },
              // },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <RoleDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  // import { SmileOutlined } from '@ant-design/icons-vue';
  import { type Recordable } from '@vben/types';
  import { defineComponent } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getLogListByPage } from '/@/api/demo/system';

  import { useDrawer } from '/@/components/Drawer';
  import RoleDrawer from './LogDrawer.vue';

  import { columns, searchFormSchema /*, setReloadFunc*/ } from './log.data';

  // import { useMessage } from '/@/hooks/web/useMessage';
  // import { useI18n } from '/@/hooks/web/useI18n';

  // const { createErrorModal } = useMessage();
  // const { t } = useI18n();

  export default defineComponent({
    name: 'LogManagement',
    components: { BasicTable, RoleDrawer, TableAction /*, SmileOutlined*/ },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload }] = useTable({
        title: '日志列表',
        api: getLogListByPage,
        afterFetch: afterFetch,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'operations',
          // slots: { customRender: 'action' },
          fixed: undefined,
        },
      });

      function afterFetch(dataList: any[]) {
        // setReloadFunc(reload);

        // console.log('1. dataList: ', dataList);
        // dataList.forEach((data: any) => {
        //   data.typeDisplay = typeList.filter((a) => a.value === data.type).map((b) => b.label) + '';
        //   if (
        //     typeof data.children !== 'undefined' &&
        //     data.children !== null &&
        //     data.children.length > 0
        //   ) {
        //     afterFetch(data.children);
        //   }
        // });
        // console.log('2. dataList: ', dataList);
        return dataList;
      }

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable<any>) {
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      // async function handleDelete(record: Recordable<any>) {
      //   console.log(record);
      //   try {
      //     const postData: any = record;
      //     await deleteRole(
      //       postData,
      //       'none', //不要默认的错误提示
      //     );
      //     reload();
      //   } catch (error) {
      //     createErrorModal({
      //       title: t('sys.api.errorTip'),
      //       content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
      //     });
      //   }
      // }

      function handleSuccess() {
        reload();
      }

      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        // handleDelete,
        handleSuccess,
      };
    },
  });
</script>
