// Interface data format used to return a unified format
import { ResultEnum } from '/@/enums/httpEnum';

export function resultSuccess<T = Recordable>(result: T, { message = 'ok' } = {}) {
  return {
    code: ResultEnum.SUCCESS,
    result,
    message,
    type: 'success',
  };
}

export function resultPageSuccess<T = any>(
  page: number,
  pageSize: number,
  list: T[],
  { message = 'ok' } = {},
) {
  const pageData = pagination(page, pageSize, list);

  return {
    ...resultSuccess({
      list: pageData,
      total: list.length,
    }),
    message,
  };
}

export function resultError(
  message = 'Request failed',
  { code = ResultEnum.ERROR, result = null } = {},
) {
  return {
    code,
    result,
    message,
    type: 'error',
  };
}

export function pagination<T = any>(pageNo: number, pageSize: number, array: T[]): T[] {
  const offset = (pageNo - 1) * Number(pageSize);
  return offset + Number(pageSize) >= array.length
    ? array.slice(offset, array.length)
    : array.slice(offset, offset + Number(pageSize));
}

export interface requestParams {
  method: string;
  body: any;
  headers?: { authorization?: string };
  query: any;
}

/**
 * @description 本函数用于从request数据中获取token，请根据项目的实际情况修改
 *
 */
export function getRequestToken({ headers }: requestParams): string | undefined {
  return headers?.authorization;
}

/**
 * this way doesn't work
 * @postBody this function is using for redirect request to third-party api server
 */
export async function redirectRequest(method = 'GET', req: any): Promise<any> {
  console.log('req:', req);
  try {
    const response = await fetch('http://127.0.0.1:8080' + req.url, {
      method: method,
      headers: {
        // "Content-Type": "application/json",
      },
      body: req.body === null ? null : JSON.stringify(req.body),
    });
    const respJson = await response.json();
    console.log('Success:', respJson);
    return respJson;
  } catch (error) {
    console.error('Error:', error, '\n\n Error-Obj: ', JSON.stringify(error));
    // console.error('Error-Obj: ', JSON.stringify(error));
    return resultError('Incorrect account or password！');
  }
}
