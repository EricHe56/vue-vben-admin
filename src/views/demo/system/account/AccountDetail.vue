<template>
  <PageWrapper
    :title="'用户: ' + accInfo.username + '(' + userDBId + ')的资料'"
    content="这是用户资料详情页面。本页面仅用于演示相同路由在tab中打开多个页面并且显示不同的数据"
    contentBackground
    @back="goBack"
  >
    <template #extra>
      <a-button type="primary" danger> 禁用账号 </a-button>
      <a-button type="primary"> 修改密码 </a-button>
    </template>
    <template #footer>
      <a-tabs default-active-key="detail" v-model:activeKey="currentKey">
        <a-tab-pane key="detail" tab="用户资料" />
        <a-tab-pane key="logs" tab="操作日志" />
      </a-tabs>
    </template>
    <div class="pt-4 m-4 desc-wrap">
      <template v-if="currentKey == 'detail' && isDetailsLoaded">
        <Avatar :src="accInfo.avatar || headerImg" :size="72" class="!mx-auto !block" />
        <div v-if="false">UserId: {{ accInfo.userId }}</div>
        <div>UserName: {{ accInfo.username }}</div>
        <div>RealName: {{ accInfo.realName }}</div>
        <div>Email: {{ accInfo.email }}</div>
        <div>Mobile: {{ accInfo.mobile }}</div>
        <div>Desc: {{ accInfo.desc }}</div>
        <div>HomePaht: {{ accInfo.homePath }}</div>
        <div>Roles: {{ accInfo.roles.map((a) => a.roleName) }}</div>
        <div>Status: {{ accInfo.status === 1 ? '启用' : '禁用' }}</div>
      </template>
      <template v-if="currentKey == 'logs'">
        <div v-for="i in 10" :key="i">这是用户{{ userDBId }}操作日志Tab</div>
      </template>
    </div>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { Tabs, Avatar } from 'ant-design-vue';
  import { isAccountExist } from '/@/api/demo/system';
  import headerImg from '/@/assets/images/header.jpg';
  // import { AdminAccount } from '/@/api/demo/model/systemModel';

  export default defineComponent({
    name: 'AccountDetail',
    components: { PageWrapper, ATabs: Tabs, ATabPane: Tabs.TabPane, Avatar },
    setup() {
      const route = useRoute();
      const go = useGo();
      // 此处可以得到用户ID
      const userDBId = ref(route.params?.id);
      const currentKey = ref('detail');
      const { setTitle } = useTabs();
      // TODO
      // 本页代码仅作演示，实际应当通过userId从接口获得用户的相关资料
      const accInfo: any = ref({});
      const isDetailsLoaded = ref(false);
      onMounted(async () => {
        const postData: any = {
          dbId: userDBId.value,
        };
        const data = await isAccountExist(postData);
        accInfo.value = data;
        isDetailsLoaded.value = true;
        // 设置Tab的标题（不会影响页面标题）
        setTitle('用户详情: ' + accInfo.value.username + '(' + userDBId.value + ')');
      });

      // 页面左侧点击返回链接时的操作
      function goBack() {
        // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
        go('/system/account');
      }

      return { userDBId, accInfo, headerImg, currentKey, goBack, isDetailsLoaded };
    },
  });
</script>

<style></style>
