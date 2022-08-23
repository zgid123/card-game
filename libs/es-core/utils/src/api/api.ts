import Axios from 'axios';
import { stringifyUrl } from 'query-string';
import { isEmpty, isNil, reject } from 'ramda';
import { AuthService } from '@libs/es-core-auth-services';

import { parseData, parseError } from './helpers';

import type {
  TObject,
  TGetParams,
  IRequestBody,
  IRequestProps,
  IOptionsParams,
  IOptionsResult,
  IRequestParams,
} from './interface';

interface IConfigurationProps {
  ssr?: boolean;
  baseUrl: string;
  storage?: Storage;
  skipVersion?: boolean;
  requiredAuth?: boolean;
}

export class Api {
  static #ssr: boolean;
  static #apiEndpoint: string;
  static #skipVersion: boolean;
  static #authService: typeof AuthService;
  static #requiredAuth: boolean | undefined;

  public static config({
    baseUrl,
    storage,
    ssr = false,
    requiredAuth,
    skipVersion = false,
  }: IConfigurationProps): void {
    this.#ssr = ssr;
    this.#apiEndpoint = baseUrl;
    this.#authService = AuthService;
    this.#skipVersion = skipVersion;
    this.#requiredAuth = requiredAuth;

    this.#authService.config({
      storage,
    });
  }

  static async #options({
    requiredAuth,
    headers = {},
  }: IOptionsParams): Promise<IOptionsResult> {
    let options = {} as IOptionsResult;
    const authToken = await this.#authService.token();

    if (requiredAuth && authToken) {
      options = {
        ...options,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
    }

    options.headers = { ...(options.headers as TObject), ...headers };

    return options;
  }

  static async #request<T>({
    data,
    params,
    signal,
    headers,
    endpoint,
    version = 1,
    method = 'get',
    onUploadProgress,
    isExternal = false,
    requiredAuth = true,
    skipVersion = false,
  }: IRequestProps & IRequestBody & IRequestParams): Promise<T> {
    if (typeof endpoint !== 'string') {
      endpoint = stringifyUrl(
        {
          url: endpoint.url,
          query: reject(isNil, endpoint.query || {}),
        },
        {
          arrayFormat: 'bracket',
        },
      );
    }

    let url = endpoint.replace(/^\//, '');

    if (!isExternal) {
      url = [
        this.#apiEndpoint,
        !(this.#skipVersion || skipVersion) ? `v${version}` : '',
        url,
      ]
        .filter((s) => !!s)
        .join('/');
    }

    const promise = Axios.request({
      ...reject(
        (value) => !(!this.#ssr && value instanceof FormData) && isEmpty(value),
        {
          url,
          data,
          params,
          method,
        },
      ),
      ...(await this.#options({
        headers,
        requiredAuth: isNil(this.#requiredAuth)
          ? requiredAuth
          : this.#requiredAuth,
      })),
      signal,
      onUploadProgress,
    })
      .then(parseData)
      .catch(parseError);

    return promise;
  }

  public static get<T>(options: TGetParams): Promise<T> {
    return this.#request<T>({ method: 'get', ...options });
  }

  public static post<T>(
    options: Omit<IRequestProps, 'method'> & IRequestBody,
  ): Promise<T> {
    return this.#request<T>({ method: 'post', ...options });
  }

  public static put<T>(
    options: Omit<IRequestProps, 'method'> & IRequestBody,
  ): Promise<T> {
    return this.#request<T>({ method: 'put', ...options });
  }

  public static delete<T>(
    options: Omit<IRequestProps, 'method'> & IRequestBody,
  ): Promise<T> {
    return this.#request<T>({ method: 'delete', ...options });
  }
}
