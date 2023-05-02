import { getToken } from '/@/utils/auth';
import { useGlobSetting } from '/@/hooks/setting';
// 腾讯对象存储cos Web上传
// 请求用到的参数

// declare const window: any;
declare global {
  interface Window {
    CosAuth: any;
  }
}

// 对更多字符编码的 url encode 格式
const camSafeUrlEncode = function (str) {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A');
};

const getAuthorization = function (options, callback) {
  // var url = 'http://127.0.0.1:3000/sts-auth' +
  const { apiUrl } = useGlobSetting();
  const STS_Auth_Url = apiUrl + '/sys/cos_upload_credentials';
  const url = STS_Auth_Url;
  const xhr = new XMLHttpRequest();
  // xhr.withCredentials = true
  xhr.open('GET', url, true);
  // xhr.setRequestHeader('X-Token', getToken() + '');
  xhr.setRequestHeader('Authorization', getToken() + '');
  // xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8')
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
      callback(null, {
        XCosSecurityToken: credentials.token,
        Authorization: window.CosAuth({
          SecretId: credentials.ak,
          SecretKey: credentials.sk,
          Method: options.Method,
          Pathname: options.Pathname,
        }),
        CosDomain: credentials.cosDomain,
      });
    } else {
      console.error(xhr.responseText);
      // callback('获取签名出错')
    }
  };
  xhr.onerror = function (e) {
    console.log('xhr.onerror:', e);
    // callback('获取签名出错')
  };
  xhr.send();
};

// 上传文件
// file = document.getElementById('fileSelector').files[0]
export function uploadFile(file, callback, uploadEvent, newFileName = '') {
  if (newFileName === '') {
    newFileName = new Date(Date.now() + 8 * 3600000).toISOString().replace(/[-: T]/g, '');
  }
  const Key =
    'upload/' + newFileName + '.' + file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2); // 这里指定上传目录和文件名
  getAuthorization({ Method: 'PUT', Pathname: '/' + Key }, function (err, info) {
    if (err) {
      alert(err);
      return;
    }

    const auth = info.Authorization;
    const XCosSecurityToken = info.XCosSecurityToken;
    const fileType = file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2);
    const protocol = location.protocol === 'https:' ? 'https:' : 'http:';
    const prefix = protocol + '//' + info.CosDomain + '/';
    let url = prefix + camSafeUrlEncode(Key).replace(/%2F/g, '/');
    if (fileType === 'zip') {
      url = prefix + camSafeUrlEncode(Key).replace(/%2F/g, '/');
    }

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Authorization', auth);
    XCosSecurityToken && xhr.setRequestHeader('x-cos-security-token', XCosSecurityToken);
    xhr.upload.onprogress = function (e) {
      console.log('上传进度 ' + Math.round((e.loaded / e.total) * 10000) / 100 + '%');
      console.log(JSON.stringify(e));
      // progress.innerHTML = (Math.round(e.loaded / e.total * 10000) / 100) + '%'
      uploadEvent.file.percent = Math.round((e.loaded / e.total) * 10000) / 100 + '%';
      uploadEvent.onProgress(uploadEvent.file);
    };
    xhr.onload = function () {
      if (xhr.status === 200 || xhr.status === 206) {
        const ETag = '';
        // try{
        //   ETag = xhr.getResponseHeader('ETag')
        // }catch(e){
        //   console.error(e)
        // }

        callback(null, { url: url, ETag: ETag });
        uploadEvent.onSuccess({ url: url, ETag: ETag });
      } else {
        // callback('文件 ' + Key + ' 上传失败，状态码：' + xhr.status)
        uploadEvent.onError();
      }
    };
    xhr.onerror = function () {
      // callback('文件 ' + Key + ' 上传失败，请检查是否没配置 CORS 跨域规则')
      uploadEvent.onError();
    };
    xhr.send(file);
  });
}

export function deleteFile(file, callback) {
  if (!file.url.includes('http')) return;
  const Key = file.url;
  const pathName = Key.split('//')[1].substr(Key.split('//')[1].indexOf('/'));
  getAuthorization({ Method: 'DELETE', Pathname: pathName }, function (err, info) {
    if (err) {
      alert(err);
      return;
    }

    const auth = info.Authorization;
    const XCosSecurityToken = info.XCosSecurityToken;
    const url = Key;
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', url, true);
    xhr.setRequestHeader('Authorization', auth);
    XCosSecurityToken && xhr.setRequestHeader('x-cos-security-token', XCosSecurityToken);

    xhr.onload = function () {
      if (xhr.status === 200 || xhr.status === 204) {
        const ETag = '';
        // try{
        //   ETag = xhr.getResponseHeader('ETag')
        // }catch(e){
        //   console.error(e)
        // }

        callback(null, { url: url, ETag: ETag });
      } else {
        // callback('文件 ' + Key + ' 删除失败，状态码：' + xhr.status)
      }
    };
    xhr.onerror = function () {
      // callback('文件 ' + Key + ' 删除失败，请检查是否没配置 CORS 跨域规则')
    };
    xhr.send();
  });
}
