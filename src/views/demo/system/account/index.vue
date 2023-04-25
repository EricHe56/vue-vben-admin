<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <DeptTree class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <BasicTable @register="registerTable" class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">新增账号</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:info-standard-line',
                tooltip: '查看用户详情',
                onClick: handleView.bind(null, record),
              },
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑用户资料',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除此账号',
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
    <AccountModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getAccountList, getAllRoleList, deleteAccount } from '/@/api/demo/system';
  import { PageWrapper } from '/@/components/Page';
  import { default as DeptTree, getDeptTreeData } from './DeptTree.vue';

  import { useModal } from '/@/components/Modal';
  import { default as AccountModal, setAccountModalRoleList } from './AccountModal.vue';

  import { columns, searchFormSchema, setAccountFormSchemaRoleList } from './account.data';
  import { useGo } from '/@/hooks/web/usePage';

  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { createErrorModal } = useMessage();
  const { t } = useI18n();

  export default defineComponent({
    name: 'AccountManagement',
    components: { BasicTable, PageWrapper, DeptTree, AccountModal, TableAction },
    setup() {
      type Recordable<T = any> = Record<string, T>;

      const go = useGo();
      const [registerModal, { openModal }] = useModal();
      const searchInfo = reactive<Recordable>({});
      const [registerTable, { reload /*updateTableDataRecord*/ }] = useTable({
        title: '账号列表',
        api: getAccountList,
        afterFetch: afterFetch,
        rowKey: 'id',
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        handleSearchInfoFn(info) {
          console.log('handleSearchInfoFn', info);
          return info;
        },
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          // slots: { customRender: 'action' },
        },
      });

      function findDept(id, deptList: any[]) {
        for (let i = 0; i < deptList.length; i++) {
          const dept = deptList[i];
          if (dept.id === id) {
            return dept;
          }
        }
        return null;
      }

      async function afterFetch(dataList: any[]) {
        // console.log('1. dataList: ', dataList);
        const deptTreeData = getDeptTreeData();
        dataList.forEach((admin: any) => {
          admin.roleValues = admin.roles.map((a) => a.value);
          admin.deptDisplay = '';

          const ids = admin.dept.split('-');
          let curId = '';
          let curDeptList = deptTreeData;
          for (let i = 0; i < ids.length; i++) {
            curId += i !== 0 ? '-' + ids[i] : ids[i];
            const dept = findDept(curId, curDeptList);
            if (dept !== null) {
              admin.deptDisplay += i === 0 ? '' : '-';
              admin.deptDisplay += dept.deptName;
              curDeptList = dept.children;
            } else {
              break;
            }
          }
        });
        // console.log('2. dataList: ', dataList);
        await getRoleList();
        return dataList;
      }

      let roleList: any[] = [];
      async function getRoleList() {
        const apiList: any[] = await getAllRoleList();
        if (apiList !== null) {
          roleList = apiList;
        }
        setAccountFormSchemaRoleList(roleList);
        setAccountModalRoleList(roleList);
        return;
      }

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        console.log(record);
        openModal(true, {
          record,
          isUpdate: true,
        });
      }

      async function handleDelete(record: Recordable) {
        console.log(record);
        try {
          const postData: any = record;
          await deleteAccount(
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
      // function handleSuccess({ isUpdate, values }) {
      //   if (isUpdate) {
      //     // 演示不刷新表格直接更新内部数据。
      //     // 注意：updateTableDataRecord要求表格的rowKey属性为string并且存在于每一行的record的keys中
      //     const result = updateTableDataRecord(values.id, values);
      //     console.log(result);
      //   } else {
      //     reload();
      //   }
      // }

      function handleSelect(deptId = '') {
        searchInfo.deptId = deptId;
        reload();
      }

      function handleView(record: Recordable) {
        go('/system/account_detail/' + record.id);
      }

      return {
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleSelect,
        handleView,
        searchInfo,
      };
    },
  });
</script>
