import axios from 'axios';

export const BASE_URL = 'https://preworksdemo.reviewdevelopment.net/api/v1';
export const IMG_URL = 'https://preworksdemo.reviewdevelopment.net/';

const getHeader = (isFormData = false) => ({
  'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
  'Access-Control-Allow-Origin': '*',
});

const getAuthHeader = (token: string, isFormData = false) => ({
  'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
  'Access-Control-Allow-Origin': '*',
  Authorization: `Bearer ${token}`,
});

const constructApiRequest = (
  path: string,
  method: string,
  body?: any,
  token?: string,
) => {
  const isFormData = body instanceof FormData;
  const headers = token
    ? getAuthHeader(token, isFormData)
    : getHeader(isFormData);

  return {
    url: path,
    method,
    headers,
    data: body || undefined,
  };
};

const Axios = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
});

const requests = {
  get: (path: string, token?: string) =>
    Axios(constructApiRequest(path, 'get', '', token)),

  post: (path: string, params?: any, token?: string) =>
    Axios(constructApiRequest(path, 'post', params, token)),

  put: (path: string, params?: any, token?: string) =>
    Axios(constructApiRequest(path, 'put', params, token)),

  delete: (path: string, params?: any, token?: string) =>
    Axios(constructApiRequest(path, 'delete', params, token)),
};

const requestPath = {
  phoneSignin: '/auth/phone-signin',
  verifyOtp: '/auth/verify-otp',
  resendOtp: 'auth/resendOtp',
  shortProfile: '/auth/short-Profile',
  banners: '/customer/banners',
  professionalList: '/customer/prof-list',
  projectList: '/customer/project-list',
  createProject: '/customer/create-project',
};

const ApiManager = {
  getBanners: token => requests.get(requestPath.banners, token),

  getProfessionals: (type = 'all', token?: string) => {
    return requests.get(`${requestPath.professionalList}/${type}`, token);
  },
  phoneSignin: params => requests.post(requestPath.phoneSignin, params),

  verifyOtp: params => requests.post(requestPath.verifyOtp, params),

  shortProfile: (id: string, params: any, token?: string) => {
    return requests.put(`${requestPath.shortProfile}/${id}`, params, token);
  },
  resendOtp: params => requests.post(requestPath.resendOtp, params),

  getProjects: (userId: string, token?: string) => {
    return requests.get(`${requestPath.projectList}/${userId}`, token);
  },
  createProject: (data: any, token?: string) => {
    return requests.post(requestPath.createProject, data, token);
  },
};

export default ApiManager;
