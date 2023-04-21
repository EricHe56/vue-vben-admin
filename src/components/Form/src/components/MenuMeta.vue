<template>
  <div>
    <aForm
      ref="formRef"
      :model="state"
      layout="vertical"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <aFormItem label="" style="width: 100%; margin-bottom: 0">
        <aInput style="display: none" />
      </aFormItem>
      <aFormItem v-show="false" label="M-OrderNo" name="orderNo">
        <aInputNumber v-bind="attrs" v-model:value="state.orderNo" :min="1" />
      </aFormItem>
      <aFormItem label="M-Title" name="title" :rules="rules.title">
        <aInput v-bind="attrs" v-model:value="state.title" @change.stop="onFormChange" />
      </aFormItem>
      <aFormItem v-show="true" label="M-DynamicLevel" name="dynamicLevel">
        <aInputNumber v-bind="attrs" v-model:value="state.dynamicLevel" :min="0" />
      </aFormItem>
      <aFormItem label="M-RealPath" name="realPath">
        <aInput v-bind="attrs" v-model:value="state.realPath" @change.stop="onFormChange" />
      </aFormItem>
      <aFormItem label="M-IgnoreAuth" name="ignoreAuth">
        <RadioGroup v-bind="attrs" v-model:value="state.ignoreAuth" button-style="solid">
          <RadioButton :value="true" :disabled="false">{{ '是' }} </RadioButton>
          <RadioButton :value="false" :disabled="false">{{ '否' }} </RadioButton>
        </RadioGroup>
      </aFormItem>
      <aFormItem label="M-Roles" name="roles">
        <div v-for="(tag, index) in state.roles" :key="tag">
          <!-- <aTooltip v-if="tag.length > 20" :title="tag">
            <aTag :closable="index !== 0" @close="handleTagClose(tag)">
              {{ `${tag.slice(0, 20)}...` }}
            </aTag>
          </aTooltip>
          <aTag v-else :closable="index !== 0" @close="handleTagClose(tag)">
            {{ tag }}
          </aTag> -->
          <aTag :closable="index >= 0" @close="handleTagClose(tag)">
            {{ tag }}
          </aTag>
        </div>
        <aInput
          v-show="inputTagVisible"
          ref="inputRef"
          type="text"
          size="small"
          :style="{ width: '78px' }"
          v-model:value="inputTagValue"
          @blur="handleTagInputConfirm"
          @keyup.enter="handleTagInputConfirm"
        />
        <aTag
          v-show="!inputTagVisible"
          @click="showTagInput"
          style="border-style: dashed; background: #fff"
        >
          <PlusOutlined />
          <span>New Tag</span>
        </aTag>
      </aFormItem>
      <aFormItem label="M-IgnoreKeepAlive" name="ignoreKeepAlive">
        <RadioGroup v-bind="attrs" v-model:value="state.ignoreKeepAlive" button-style="solid">
          <RadioButton :value="true" :disabled="false">{{ '是' }} </RadioButton>
          <RadioButton :value="false" :disabled="false">{{ '否' }} </RadioButton>
        </RadioGroup>
      </aFormItem>
      <aFormItem label="M-Affix" name="affix">
        <RadioGroup v-bind="attrs" v-model:value="state.affix" button-style="solid">
          <RadioButton :value="true" :disabled="false">{{ '是' }} </RadioButton>
          <RadioButton :value="false" :disabled="false">{{ '否' }} </RadioButton>
        </RadioGroup>
      </aFormItem>
      <aFormItem label="M-Icon" name="icon">
        <aInput v-bind="attrs" v-model:value="state.icon" @change.stop="onFormChange" />
      </aFormItem>
      <aFormItem label="M-FrameSrc" name="frameSrc">
        <aInput v-bind="attrs" v-model:value="state.frameSrc" @change.stop="onFormChange" />
      </aFormItem>
      <aFormItem label="M-TransitionName" name="transitionName">
        <aInput v-bind="attrs" v-model:value="state.transitionName" @change.stop="onFormChange" />
      </aFormItem>
      <aFormItem label="M-HideBreadcrumb" name="hideBreadcrumb">
        <RadioGroup v-bind="attrs" v-model:value="state.hideBreadcrumb" button-style="solid">
          <RadioButton :value="true" :disabled="false">{{ '是' }} </RadioButton>
          <RadioButton :value="false" :disabled="false">{{ '否' }} </RadioButton>
        </RadioGroup>
      </aFormItem>
      <aFormItem label="M-HideChildrenInMenu" name="hideChildrenInMenu">
        <RadioGroup v-bind="attrs" v-model:value="state.hideChildrenInMenu" button-style="solid">
          <RadioButton :value="true" :disabled="false">{{ '是' }} </RadioButton>
          <RadioButton :value="false" :disabled="false">{{ '否' }} </RadioButton>
        </RadioGroup>
      </aFormItem>
      <aFormItem label="M-CarryParam" name="carryParam">
        <RadioGroup v-bind="attrs" v-model:value="state.carryParam" button-style="solid">
          <RadioButton :value="true" :disabled="false">{{ '是' }} </RadioButton>
          <RadioButton :value="false" :disabled="false">{{ '否' }} </RadioButton>
        </RadioGroup>
      </aFormItem>
      <aFormItem label="M-Single" name="single">
        <RadioGroup v-bind="attrs" v-model:value="state.single" button-style="solid">
          <RadioButton :value="true" :disabled="false">{{ '是' }} </RadioButton>
          <RadioButton :value="false" :disabled="false">{{ '否' }} </RadioButton>
        </RadioGroup>
      </aFormItem>
      <aFormItem label="M-CurrentActiveMenu" name="currentActiveMenu">
        <aInput
          v-bind="attrs"
          v-model:value="state.currentActiveMenu"
          @change.stop="onFormChange"
        />
      </aFormItem>
      <aFormItem label="M-HideTab" name="hideTab">
        <RadioGroup v-bind="attrs" v-model:value="state.hideTab" button-style="solid">
          <RadioButton :value="true" :disabled="false">{{ '是' }} </RadioButton>
          <RadioButton :value="false" :disabled="false">{{ '否' }} </RadioButton>
        </RadioGroup>
      </aFormItem>
      <aFormItem label="M-HideMenu" name="hideMenu">
        <RadioGroup v-bind="attrs" v-model:value="state.hideMenu" button-style="solid">
          <RadioButton :value="true" :disabled="false">{{ '是' }} </RadioButton>
          <RadioButton :value="false" :disabled="false">{{ '否' }} </RadioButton>
        </RadioGroup>
      </aFormItem>
      <aFormItem label="M-IsLink" name="isLink">
        <RadioGroup v-bind="attrs" v-model:value="state.isLink" button-style="solid">
          <RadioButton :value="true" :disabled="false">{{ '是' }} </RadioButton>
          <RadioButton :value="false" :disabled="false">{{ '否' }} </RadioButton>
        </RadioGroup>
      </aFormItem>
      <aFormItem label="M-IgnoreRoute" name="ignoreRoute">
        <RadioGroup v-bind="attrs" v-model:value="state.ignoreRoute" button-style="solid">
          <RadioButton :value="true" :disabled="false">{{ '是' }} </RadioButton>
          <RadioButton :value="false" :disabled="false">{{ '否' }} </RadioButton>
        </RadioGroup>
      </aFormItem>
      <aFormItem label="M-HidePathForChildren" name="hidePathForChildren">
        <RadioGroup v-bind="attrs" v-model:value="state.hidePathForChildren" button-style="solid">
          <RadioButton :value="true" :disabled="false">{{ '是' }} </RadioButton>
          <RadioButton :value="false" :disabled="false">{{ '否' }} </RadioButton>
        </RadioGroup>
      </aFormItem>
    </aForm>
  </div>
</template>
<script lang="ts">
  import {
    defineComponent,
    /*getCurrentInstance, reactive, toRaw,*/ PropType,
    ref,
    nextTick,
  } from 'vue';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import type { RuleObject } from 'ant-design-vue/lib/form/interface';
  import { Form, Input, InputNumber, Radio, Tag /*, Tooltip*/ } from 'ant-design-vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { useAttrs } from '@vben/hooks';

  // import { AdminRouteMeta } from '/@/api/demo/model/systemModel';

  interface AdminRouteMetaForm {
    orderNo?: number;
    title: string;
    dynamicLevel?: number;
    realPath?: string;
    ignoreAuth?: boolean;
    roles?: string[];
    ignoreKeepAlive?: boolean;
    affix?: boolean;
    icon?: string;
    frameSrc?: string;
    transitionName?: string;
    hideBreadcrumb?: boolean;
    hideChildrenInMenu?: boolean;
    carryParam?: boolean;
    single?: boolean;
    currentActiveMenu?: string;
    hideTab?: boolean;
    hideMenu?: boolean;
    isLink?: boolean;
    ignoreRoute?: boolean;
    hidePathForChildren?: boolean;
    validated: boolean;
  }

  export default defineComponent({
    name: 'MenuMeta',
    components: {
      aForm: Form,
      aFormItem: Form.Item,
      aInput: Input.Input,
      aInputNumber: InputNumber,
      RadioGroup: Radio.Group,
      RadioButton: Radio.Button,
      aTag: Tag,
      // aTooltip: Tooltip,
      PlusOutlined,
    },
    props: {
      value: {
        type: Object as PropType<AdminRouteMetaForm>,
        default: () => {
          return {
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
        },
      },
    },
    emits: ['change', 'update:value'],
    // setup(props, { emit }) {
    setup(props) {
      // const vm: any = getCurrentInstance();
      // const { onChange } = vm.attrs;
      // const attrs = useAttrs();
      // const { onChange } = attrs;
      const formRef = ref();
      const attrs = useAttrs();
      const emitData = ref<any[]>([]);
      // Embedded in the form, just use the hook binding to perform form verification
      const [state, setState] = useRuleFormItem(props, 'value', 'change', emitData);

      const rules: Record<string, RuleObject[]> = {
        title: [{ required: true, message: 'Please input Meta Title', trigger: 'blur' }],
        realPath: [{ required: true, message: 'Please input Meta Real Path', trigger: 'change' }],
      };

      const onFormChange = () => {
        formRef.value
          .validate()
          .then(() => {
            // console.log('values', state, toRaw(state));
            state.value.validated = true;
            setState(state.value);
          })
          .catch((error: ValidateErrorEntity<AdminRouteMetaForm>) => {
            console.log('meta form validate error', error);
            state.value.validated = false;
            setState(state.value);
          });
      };

      // tags:
      const inputRef = ref();
      const inputTagVisible = ref(false);
      const inputTagValue = ref('');

      const handleTagClose = (removedTag: string) => {
        const curTags = typeof state.value.roles !== 'undefined' ? state.value.roles : [];
        const tags = curTags.filter((tag) => tag !== removedTag);
        console.log(tags);
        state.value.roles = tags;
        setState(state.value);
      };

      const showTagInput = () => {
        inputTagVisible.value = true;
        nextTick(() => {
          inputRef.value.focus();
        });
      };

      const handleTagInputConfirm = () => {
        const inputValue = inputTagValue.value;
        let curTags = typeof state.value.roles !== 'undefined' ? state.value.roles : [];
        let tags = curTags;
        if (inputValue && tags.indexOf(inputValue) === -1) {
          tags = [...tags, inputValue];
        }
        console.log(tags);
        inputTagVisible.value = false;
        inputTagValue.value = '';
        state.value.roles = tags;
        setState(state.value);
      };

      return {
        formRef,
        state,
        attrs,
        rules,
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
        onFormChange,
        inputTagVisible,
        inputTagValue,
        handleTagClose,
        handleTagInputConfirm,
        showTagInput,
        inputRef,
      };
    },
    mounted() {
      console.log(this.$refs['inputRef']);
    },
  });
</script>
<style>
  span.anticon:not(.app-iconify) {
    vertical-align: -1.25px !important;
  }
</style>
