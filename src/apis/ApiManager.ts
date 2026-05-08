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
  projectDetails: '/customer/project-details',
  projectEnquiryList: '/customer/enquiry-list',
  updateProject: '/customer/update-project',
  deleteProject: '/customer/delete-project',
  getNotifications: '/customer/get-notification',

  // customer's projects in the professional acct
  projectsForProfessional: '/professional/customer-Projects',

  projectEnquiry: '/professional/proj-Enquiry',
  getProfile: '/customer/get-profile',
  updateProfile: '/customer/update-profile',
  appliedProjects: '/professional/applied-Projects',

  addWork: '/professional/add-Work',
  updateWork: '/professional/update-Work',

  helpRequest: '/customer/helpUs',
  registerFcmToken: '/auth/register-fcm-token',
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
  getProjectDetails: (projectId: string, token?: string) => {
    return requests.get(`${requestPath.projectDetails}/${projectId}`, token);
  },
  getProjectEnquiryList: (projectId: string, token?: string) => {
    return requests.get(
      `${requestPath.projectEnquiryList}/${projectId}`,
      token,
    );
  },
  updateProject: (data: any, token?: string) => {
    return requests.put(requestPath.updateProject, data, token);
  },
  deleteProject: (projectId: string, token?: string) => {
    return requests.delete(
      `${requestPath.deleteProject}/${projectId}`,
      {},
      token,
    );
  },
  getNotifications: (userId: string, token?: string) => {
    return requests.get(`${requestPath.getNotifications}/${userId}`, token);
  },
  getProjectsForProfessional: (token?: string) => {
    return requests.get(`${requestPath.projectsForProfessional}`, token);
  },
  projectEnquiry: (data: any, token?: string) => {
    return requests.post(requestPath.projectEnquiry, data, token);
  },
  getProfile: (userId: string, token?: string) => {
    return requests.get(`${requestPath.getProfile}/${userId}`, token);
  },

  updateProfile: (userId: string, data: any, token?: string) => {
    return requests.put(`${requestPath.updateProfile}/${userId}`, data, token);
  },
  appliedProjects: (userId: string, token?: string) => {
    return requests.get(`${requestPath.appliedProjects}/${userId}`, token);
  },
  addWork: (data: any, token?: string) => {
    return requests.post(requestPath.addWork, data, token);
  },
  updateWork: (workId: string, data: any, token?: string) => {
    return requests.put(`${requestPath.updateWork}/${workId}`, data, token);
  },
  helpRequest: (userId: string, token?: string) => {
    return requests.get(`${requestPath.helpRequest}/${userId}`, token);
  },

  deleteWork: (workId: string, token?: string) => {
    return requests.delete(`/professional/delete-Work/${workId}`, {}, token);
  },

  deleteFile: (data: any, token?: string) => {
    return requests.post('/customer/delete-file', data, token);
  },
  getSubscriptions: (token?: string) => {
    return requests.get('/admin/getSubscription', token);
  },

  createOrder: (data: any, token?: string) => {
    return requests.post('/professional/create-order', data, token);
  },

  registerFcmToken: (data: any, token?: string) => {
    return requests.post(requestPath.registerFcmToken, data, token);
  },
};

export default ApiManager;
