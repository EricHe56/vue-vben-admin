// 阿里对象存储cos Web上传
import { getToken } from '/@/utils/auth';
import { useGlobSetting } from '/@/hooks/setting';
// 请求用到的参数
const STS_Auth_Options = JSON.stringify({ callback: '', type: '' });

// // 对更多字符编码的 url encode 格式
// var camSafeUrlEncode = function(str) {
//   return encodeURIComponent(str)
//     .replace(/!/g, '%21')
//     .replace(/'/g, '%27')
//     .replace(/\(/g, '%28')
//     .replace(/\)/g, '%29')
//     .replace(/\*/g, '%2A')
// }

const getAuthorization = function (options, callback) {
  // var url = 'http://127.0.0.1:3000/sts-auth' +
  const { apiUrl } = useGlobSetting();
  const STS_Auth_Url = apiUrl + '/sys/oss_upload_policy';
  const url = STS_Auth_Url;
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Authorization', getToken() + '');
  xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
  xhr.onload = function (e) {
    console.log('xhr.onload:', e);
    let credentials;
    try {
      const respObj = JSON.parse(xhr.response);
      if (respObj.code !== 0) {
        alert(respObj.msg);
        return;
      }
      credentials = respObj.result;
    } catch (e) {
      console.log(e);
    }
    if (credentials) {
      callback(null, credentials);
    } else {
      console.error(xhr.responseText);
      callback('获取签名出错');
    }
  };
  xhr.onerror = function (e) {
    console.log('xhr.onerror:', e);
    callback('获取签名出错');
  };
  xhr.send(options);
};

// 上传文件
// file = document.getElementById('fileSelector').files[0]
export function uploadFile(file, callback, uploadEvent, newFileName = '') {
  if (newFileName === '') {
    newFileName = new Date(Date.now() + 8 * 3600000).toISOString().replace(/[-: T]/g, '');
  }
  const Key =
    'upload/' + newFileName + '.' + file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2); // 这里指定上传目录和文件名
  getAuthorization(STS_Auth_Options, function (err, credentials) {
    if (err) {
      alert(err);
      return;
    }

    const formData = new FormData();
    formData.append('name', file.name);
    // formData.append('key', credentials.dir + '${filename}');
    formData.append('key', credentials.dir + Key);
    formData.append('policy', credentials.policy);
    formData.append('OSSAccessKeyId', credentials.accessid);
    formData.append('success_action_status', '200');
    formData.append('callback', credentials.callback); // 可选回调自己的服务器
    formData.append('signature', credentials.signature);
    formData.append('file', file);
    const url = credentials.host;
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open('POST', url, true);
    // 不可手动设置multipart/form-data, 否则没有boundary做为包分界。浏览器和客户端会自行添加
    // xhr.setRequestHeader('Content-type', 'multipart/form-data; boundary=-----' + Date.now().toString(16))

    xhr.upload.onprogress = function (e) {
      console.log('上传进度 ' + Math.round((e.loaded / e.total) * 10000) / 100 + '%');
      console.log(JSON.stringify(e));
      // progress.innerHTML = (Math.round(e.loaded / e.total * 10000) / 100) + '%'
      uploadEvent.file.percent = Math.round((e.loaded / e.total) * 10000) / 100 + '%';
      uploadEvent.onProgress(uploadEvent.file);
    };
    xhr.onload = function (e) {
      if (xhr.status === 200 || xhr.status === 206) {
        const ETag = '';
        // try {
        //   ETag = xhr.getResponseHeader('ETag') + '';
        // } catch (e) {
        //   console.error(e);
        // }
        console.log('oss-uploaded success: ', e);
        const resultUrl = url + '/' + credentials.dir + Key;
        callback(null, { url: resultUrl, ETag: ETag });
        uploadEvent.onSuccess({ url: resultUrl, ETag: ETag });
      } else {
        // callback('文件 ' + Key + ' 上传失败，状态码：' + xhr.status)
        uploadEvent.onError();
      }
    };
    xhr.onerror = function (e) {
      console.log('oss-uploaded failed: ', e);
      // callback('文件 ' + Key + ' 上传失败，请检查是否没配置 CORS 跨域规则')
      uploadEvent.onError();
    };
    xhr.send(formData);
  });
}
