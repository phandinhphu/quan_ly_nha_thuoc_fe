import PmaRequest from '../utils/httpRequest';
import { API_ENDPOINTS } from '../utils/constants';

const authService = {
    // Đăng nhập
    login: async (credentials) => {
        const response = await PmaRequest.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
        return response.data;
    },

    // Đăng ký
    register: async (userData) => {
        const response = await PmaRequest.post(API_ENDPOINTS.AUTH.REGISTER, userData);
        return response.data;
    },

    // Xác thực token (POST)
    verifyToken: async (token) => {
        const response = await PmaRequest.post(API_ENDPOINTS.AUTH.VERIFY, { token });
        return response.data;
    },

    // Xác thực token (GET)
    verifyTokenGet: async () => {
        const response = await PmaRequest.get(API_ENDPOINTS.AUTH.VERIFY);
        return response.data;
    },

    // Lấy thông tin người dùng hiện tại (GET)
    getCurrentUser: async () => {
        const response = await PmaRequest.get(API_ENDPOINTS.AUTH.CURRENT_USER);
        return response.data;
    },
};

export default authService;
