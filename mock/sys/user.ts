import { MockMethod } from 'vite-plugin-mock';
import {
  resultError,
  resultSuccess,
  getRequestToken,
  requestParams,
  // redirectRequest,
} from '../_util';

export function createFakeUserList() {
  return [
    {
      userId: '1',
      username: 'vben',
      realName: 'Vben Admin',
      avatar: '',
      desc: 'manager',
      password: '123456',
      token: 'fakeToken1',
      homePath: '/dashboard/analysis',
      roles: [
        {
          roleName: 'Super Admin',
          value: 'super',
        },
      ],
    },
    {
      userId: '2',
      username: 'test',
      password: '123456',
      realName: 'test user',
      avatar: '',
      desc: 'tester',
      token: 'fakeToken2',
      homePath: '/dashboard/workbench',
      roles: [
        {
          roleName: 'Tester',
          value: 'test',
        },
      ],
    },
  ];
}

const fakeCodeList: any = {
  '1': ['1000', '3000', '5000'],

  '2': ['2000', '4000', '6000'],
};
export default [
  // mock user login
  {
    url: '/web-api/admin/login',
    timeout: 2000,
    method: 'post',
    response: async (req: any): Promise<any> => {
      console.log('req:', req);
      const { username, password } = req.body;
      const checkUser = createFakeUserList().find(
        (item) => item.username === username && password === item.password,
      );
      if (!checkUser) {
        return resultError('Incorrect account or password！');
      }
      const { userId, username: _username, token, realName, desc, roles } = checkUser;
      return resultSuccess({
        roles,
        userId,
        username: _username,
        token,
        realName,
        desc,
      });

      // function: this way doesn't work
      // const ret = await redirectRequest('POST', req);
      // return ret;

      // internal: this way doesn't work
      // try {
      //   const response = await fetch('http://127.0.0.1:8080' + req.url, {
      //     method: 'POST',
      //     headers: {
      //       // "Content-Type": "application/json",
      //     },
      //     body: req.body === null ? null : JSON.stringify(req.body),
      //   });
      //   const respJson = await response.json();
      //   console.log('Success:', respJson);
      //   return respJson;
      // } catch (error) {
      //   console.error('Error:', error, '\n\n Error-Obj: ', JSON.stringify(error));
      //   // console.error('Error-Obj: ', JSON.stringify(error));
      //   return resultError('Incorrect account or password！');
      // }
    },
  },
  {
    url: '/web-api/admin/getUserInfo',
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = createFakeUserList().find((item) => item.token === token);
      if (!checkUser) {
        return resultError('The corresponding user information was not obtained!');
      }
      return resultSuccess(checkUser);
    },
  },
  {
    url: '/web-api/admin/getPermCode',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = createFakeUserList().find((item) => item.token === token);
      if (!checkUser) {
        return resultError('Invalid token!');
      }
      const codeList = fakeCodeList[checkUser.userId];

      return resultSuccess(codeList);
    },
  },
  {
    url: '/web-api/admin/logout',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = createFakeUserList().find((item) => item.token === token);
      if (!checkUser) {
        return resultError('Invalid token!');
      }
      return resultSuccess(undefined, { message: 'Token has been destroyed' });
    },
  },
  {
    url: '/web-api/admin/testRetry',
    statusCode: 405,
    method: 'get',
    response: () => {
      return resultError('Error!');
    },
  },
] as MockMethod[];
