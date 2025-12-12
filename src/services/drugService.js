import PmaRequest from '../utils/httpRequest';
import { API_ENDPOINTS } from '../utils/constants';

const drugService = {
    // ===== LOẠI THUỐC =====
    // Tạo loại thuốc
    createCategory: async (data) => {
        const response = await PmaRequest.post(API_ENDPOINTS.DRUGS.CATEGORIES, data);
        return response.data;
    },

    // Lấy danh sách loại thuốc
    getCategories: async () => {
        const response = await PmaRequest.get(API_ENDPOINTS.DRUGS.CATEGORIES);
        return response.data;
    },

    // Lấy chi tiết loại thuốc
    getCategoryById: async (maLoai) => {
        const response = await PmaRequest.get(`${API_ENDPOINTS.DRUGS.CATEGORIES}/${maLoai}`);
        return response.data;
    },

    // Cập nhật loại thuốc
    updateCategory: async (maLoai, data) => {
        const response = await PmaRequest.put(`${API_ENDPOINTS.DRUGS.CATEGORIES}/${maLoai}`, data);
        return response.data;
    },

    // Xóa loại thuốc
    deleteCategory: async (maLoai) => {
        const response = await PmaRequest.delete(`${API_ENDPOINTS.DRUGS.CATEGORIES}/${maLoai}`);
        return response.data;
    },

    // ===== ĐỐN VỊ TÍNH =====
    // Tạo đơn vị tính
    createUnit: async (data) => {
        const response = await PmaRequest.post(API_ENDPOINTS.DRUGS.UNITS, data);
        return response.data;
    },

    // Lấy danh sách đơn vị tính
    getUnits: async () => {
        const response = await PmaRequest.get(API_ENDPOINTS.DRUGS.UNITS);
        return response.data;
    },

    // Lấy chi tiết đơn vị tính
    getUnitById: async (maDonVi) => {
        const response = await PmaRequest.get(`${API_ENDPOINTS.DRUGS.UNITS}/${maDonVi}`);
        return response.data;
    },

    // Cập nhật đơn vị tính
    updateUnit: async (maDonVi, data) => {
        const response = await PmaRequest.put(`${API_ENDPOINTS.DRUGS.UNITS}/${maDonVi}`, data);
        return response.data;
    },

    // Xóa đơn vị tính
    deleteUnit: async (maDonVi) => {
        const response = await PmaRequest.delete(`${API_ENDPOINTS.DRUGS.UNITS}/${maDonVi}`);
        return response.data;
    },

    // ===== THUỐC =====
    // Tạo thuốc
    createDrug: async (data) => {
        const response = await PmaRequest.post(API_ENDPOINTS.DRUGS.BASE, data);
        return response.data;
    },

    // Lấy danh sách thuốc
    getDrugs: async () => {
        const response = await PmaRequest.get(API_ENDPOINTS.DRUGS.BASE);
        return response.data;
    },

    // Lấy chi tiết thuốc
    getDrugById: async (maThuoc) => {
        const response = await PmaRequest.get(`${API_ENDPOINTS.DRUGS.BASE}/${maThuoc}`);
        return response.data;
    },

    // Tìm kiếm thuốc theo tên
    searchDrugsByName: async (name) => {
        const response = await PmaRequest.get(`${API_ENDPOINTS.DRUGS.SEARCH}?name=${name}`);
        return response.data;
    },

    // Lấy thuốc theo loại
    getDrugsByCategory: async (maLoai) => {
        const response = await PmaRequest.get(`${API_ENDPOINTS.DRUGS.BY_CATEGORY}/${maLoai}`);
        return response.data;
    },

    // Lấy thuốc sắp hết hàng
    getLowStockDrugs: async (threshold = 10) => {
        const response = await PmaRequest.get(`${API_ENDPOINTS.DRUGS.LOW_STOCK}?threshold=${threshold}`);
        return response.data;
    },

    // Lấy thuốc sắp hết hạn
    getExpiringDrugs: async (daysAhead = 30) => {
        const response = await PmaRequest.get(`${API_ENDPOINTS.DRUGS.EXPIRING}?daysAhead=${daysAhead}`);
        return response.data;
    },

    // Cập nhật thuốc
    updateDrug: async (maThuoc, data) => {
        const response = await PmaRequest.put(`${API_ENDPOINTS.DRUGS.BASE}/${maThuoc}`, data);
        return response.data;
    },

    // Cập nhật tồn kho
    updateStock: async (maThuoc, data) => {
        const response = await PmaRequest.patch(`${API_ENDPOINTS.DRUGS.UPDATE_STOCK}/${maThuoc}/stock`, data);
        return response.data;
    },

    // Xóa thuốc
    deleteDrug: async (maThuoc) => {
        const response = await PmaRequest.delete(`${API_ENDPOINTS.DRUGS.BASE}/${maThuoc}`);
        return response.data;
    },
};

export default drugService;
