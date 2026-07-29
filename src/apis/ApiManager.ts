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

  delete: (path: string, token?: string) =>
    Axios({
      url: path,
      method: 'delete',
      headers: token ? getAuthHeader(token) : getHeader(),
    }),
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

  //send notification (trigger notification)
  sendNotification: '/customer/sendNotification',

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
  getFAQ: '/admin/getFaqs',
  readNotifications: '/admin/read-notification',
  checkLogin: '/auth/check-Login',
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
    console.log('DELETE ID =>', projectId);
    console.log('DELETE URL =>', requestPath.deleteProject + '/' + projectId);
    console.log('TOKEN =>', token);
    return requests.get(`${requestPath.deleteProject}/${projectId}`, token);
  },

  getNotifications: (userId: string, token?: string) => {
    return requests.get(`${requestPath.getNotifications}/${userId}`, token);
  },

  readNotifications: (userId: string, token?: string) => {
    return requests.get(`${requestPath.readNotifications}/${userId}`, token);
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
  helpRequest: (data: any, token?: string) => {
    return requests.post(requestPath.helpRequest, data, token);
  },

  deleteWork: (workId: string, token?: string) => {
    return requests.delete(`/professional/delete-Work/${workId}`, token);
  },

  deleteFile: (data: any, token?: string) => {
    return requests.post('/customer/delete-file', data, token);
  },
  getPlans: (token?: string) => {
    return requests.get('/admin/getPlans', token);
  },

  createOrder: (data: any, token?: string) => {
    return requests.post('/professional/create-order', data, token);
  }, // this was for payment throuch link

  createSubscription: (data: any, token?: string) => {
    return requests.post('/professional/create-subscription', data, token);
  }, // this is for payment through sdk

  verifySubscription: (data: any, token?: string) => {
    return requests.post('/professional/verify-subscription', data, token);
  }, // this is for payment through sdk

  registerFcmToken: (data: any, token?: string) => {
    return requests.post(requestPath.registerFcmToken, data, token);
  },
  getFAQ: (token?: string) => {
    return requests.get(requestPath.getFAQ, token);
  },

  sendNotification: (data: any, token?: string) => {
    return requests.post(requestPath.sendNotification, data, token);
  },
  checkLogin: (userId: string, token?: string) => {
    return requests.get(`${requestPath.checkLogin}/${userId}`, token);
  },
};

export default ApiManager;
