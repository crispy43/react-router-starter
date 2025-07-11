import type { ExtendedJSONSchema } from 'json-schema-to-ts';
import type { ActionFunctionArgs, LoaderFunctionArgs, Params } from 'react-router';

import type { ServerException, ToJson, ToSerialized } from '~/common/types';
import ajv from '~/lib/ajv';

import { DeferredData } from './defer';
import { AjvInvalidException, HttpException } from './exceptions';

// load server utilities
export default function serverUtils() {}

// * 환경변수 가져오기
export const env = (name: string, defaultValue?: string) => {
  const env = process.env[name];
  if (!env && !defaultValue) {
    throw new Error(`Please define the ${name} environment variable.`);
  }
  return env ? env : defaultValue;
};

// * FormData 객체 추출
export const parseFormData = async <T = any>(request: Request) => {
  const formData = await request.formData();
  return Object.fromEntries(formData) as T;
};

// * JSON 객체 추출
export const parseJsonData = async <T = any>(request: Request) => {
  const jsonData = await request.json();
  return jsonData as ToJson<T>;
};

// * URL에서 searchParams(쿼리스트링)를 Object 형태로 파싱
export const parseSearchParams = <T = any>(url: string) => {
  const urlObj = new URL(url).searchParams;
  return Object.fromEntries(urlObj) as T;
};

// * Ajv 유효성 검사
export const validate = (schema: ExtendedJSONSchema, data: any) => {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    throw new AjvInvalidException(validate.errors!);
  }
  return valid;
};

// * FormData 객체 추출 및 Ajv 유효성 검사
export const validateFormData = async <T>(
  request: Request,
  schema: ExtendedJSONSchema,
) => {
  const payload = await parseFormData<T>(request);
  validate(schema, payload);
  return payload;
};

// * JSON 객체 추출 및 Ajv 유효성 검사
export const validateJsonData = async <T>(
  request: Request,
  schema: ExtendedJSONSchema,
) => {
  const payload = await parseJsonData<T>(request);
  validate(schema, payload);
  return payload;
};

// * SearchParams(쿼리스트링) 파싱 및 Ajv 유효성 검사
export const validateSearchParams = <T>(request: Request, schema: ExtendedJSONSchema) => {
  const payload = parseSearchParams<T>(request.url);
  validate(schema, payload);
  return payload;
};

// * Params Ajv 유효성 검사
export const validateParams = (params: Params<string>, schema: ExtendedJSONSchema) => {
  validate(schema, params);
  return params;
};

// * JSON 타입 추론 응답 생성
// NOTE: Remix에서 json 함수가 deprecated됨에 따라 기존 함수 대채 및 JSON 직렬화 타입 추론
export const toJson = <T = any>(data: T, options?: ResponseInit) => {
  return new Response(JSON.stringify(data), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  }) as unknown as ToJson<T>;
};

// * JSON 타입 추론 지연 스트림 응답 생성
// NOTE: Remix에서 defer 함수가 deprecated됨에 따라 기존 함수 대채 및 JSON 직렬화 타입 추론
export const typedDefer = <T = any>(data: T, options?: ResponseInit) => {
  return new DeferredData(data as any, options) as unknown as ToJson<T>;
};

// * 컨트롤러 호출 및 에러 예외 처리
export const control = async <T>(
  controller: (
    args?: LoaderFunctionArgs | ActionFunctionArgs,
  ) => Promise<Response | ToSerialized<T & ServerException>>,
  args?: LoaderFunctionArgs | ActionFunctionArgs,
): Promise<ToSerialized<T & ServerException>> => {
  return controller(args).catch((error) => {
    if (error instanceof HttpException) {
      return toJson(
        {
          message: error.message,
          ...(error.path && { path: error.path }),
        },
        { status: error.status },
      );
    } else if (error instanceof Error) {
      console.error(error);
      return toJson({ message: error.message }, { status: 500 });
    } else {
      console.error(error);
      return toJson({ message: 'Unknown Error' }, { status: 500 });
    }
  }) as Promise<ToSerialized<T & ServerException>>;
};
