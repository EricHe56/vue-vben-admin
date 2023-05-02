<template>
  <Upload
    v-bind="$attrs"
    v-model:file-list:value="fileList"
    name="avatar"
    list-type="picture-card"
    class="avatar-uploader"
    :show-upload-list="false"
    :customRequest="uploadItem"
    :before-upload="beforeUpload"
    @change="handleChange"
  >
    <img v-if="state" :src="state" alt="avatar" style="max-width: 100%; max-height: 100%" />
    <div v-else>
      <loading-outlined v-if="loading" />
      <plus-outlined v-else />
      <div class="ant-upload-text">Upload</div>
    </div>
  </Upload>
</template>
<script lang="ts">
  import {
    uploadFile,
    // deleteFile
  } from '@/api/upload/upload-cos';
  // import { uploadFile } from '@/api/upload-oss'

  import { defineComponent, ref } from 'vue';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { useAttrs } from '@vben/hooks';
  import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
  import { message, Upload, UploadChangeParam, UploadProps } from 'ant-design-vue';
  // import { useI18n } from '/@/hooks/web/useI18n';

  // function getBase64(img: Blob, callback: (base64Url: string) => void) {
  //   const reader = new FileReader();
  //   reader.addEventListener('load', () => callback(reader.result as string));
  //   reader.readAsDataURL(img);
  // }
  export default defineComponent({
    name: 'SingleImageUpload',
    components: {
      Upload,
      LoadingOutlined,
      PlusOutlined,
    },
    inheritAttrs: false,
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['change', 'update:value'],
    // setup(props, { emit }) {
    setup(props) {
      const emitData = ref<any[]>([]);
      const attrs = useAttrs();
      // const { t } = useI18n();

      // Embedded in the form, just use the hook binding to perform form verification
      const [state, setState] = useRuleFormItem(props, 'value', 'change', emitData);
      // const imageUrl = ref<string>('');
      const fileList = ref([]);
      const loading = ref<boolean>(false);

      const handleChange = (info: UploadChangeParam) => {
        if (info.file.status === 'uploading') {
          loading.value = true;
          return;
        }
        if (info.file.status === 'done') {
          // // Get this url from response in real world.
          // if (typeof info.file.originFileObj === 'undefined') {
          //   return;
          // }
          // getBase64(info.file.originFileObj, (base64Url: string) => {
          //   imageUrl.value = base64Url;
          //   loading.value = false;
          // });
          // emitData.value = info.file.response.url;
          state.value = info.file.response.url;
          setState(state.value);
        }
        if (info.file.status === 'error') {
          loading.value = false;
          message.error('upload error');
        }
      };

      const beforeUpload = (fileType: any, fileListX: UploadProps['fileList']) => {
        let result = true;
        if (Array.isArray(fileListX)) {
          fileListX.forEach((file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
              message.error('You can only upload JPG or PNG file!');
            }
            const isLt2M = (typeof file.size === 'undefined' ? 0 : file.size) / 1024 / 1024 < 2;
            if (!isLt2M) {
              message.error('Image must smaller than 2MB!');
            }
            result = isJpgOrPng && isLt2M;
          });
        }
        return result;
      };

      const uploadItem = (event) => {
        var file = event.file;
        if (!file) {
          // alert('未选择上传文件')
          message.error('未选择上传文件');
          return;
        }
        uploadFile(
          file,
          (err, data) => {
            console.log('upload:', err || data);
            message[err ? 'error' : 'success'](err || '上传成功！');
          },
          event,
        );
      };

      return {
        state,
        attrs,
        fileList,
        loading,
        // imageUrl,
        handleChange,
        beforeUpload,
        uploadItem,
      };
    },
  });
</script>
<style>
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }

  .ant-upload-select-picture-card i {
    color: #999;
    font-size: 32px;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
