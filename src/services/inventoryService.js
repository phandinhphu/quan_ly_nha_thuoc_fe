import PmaRequest from '../utils/httpRequest';
import { API_ENDPOINTS } from '../utils/constants';

const inventoryService = {
    // ===== LỊCH SỬ TỒN KHO =====
    // Tạo lịch sử tồn kho
    createHistory: async (data) => {
        const response = await PmaRequest.post(API_ENDPOINTS.INVENTORY.HISTORY, data);
        return response.data;
    },

    // Lấy tất cả lịch sử
    getAllHistory: async () => {
        const response = await PmaRequest.get(API_ENDPOINTS.INVENTORY.HISTORY);
        return response.data;
    },

    // Lấy lịch sử theo ID
    getHistoryById: async (id) => {
        const response = await PmaRequest.get(`${API_ENDPOINTS.INVENTORY.HISTORY}/${id}`);
        return response.data;
    },

    // Lấy lịch sử theo thuốc
    getHistoryByDrug: async (maThuoc) => {
        const response = await PmaRequest.get(`${API_ENDPOINTS.INVENTORY.HISTORY_BY_DRUG}/${maThuoc}`);
        return response.data;
    },

    // Lấy lịch sử gần đây
    getRecentHistory: async () => {
        const response = await PmaRequest.get(API_ENDPOINTS.INVENTORY.RECENT);
        return response.data;
    },

    // Lấy lịch sử theo khoảng thời gian
    getHistoryByDateRange: async (start, end) => {
        const response = await PmaRequest.get(
            `${API_ENDPOINTS.INVENTORY.DATE_RANGE}?start=${start}&end=${end}`
        );
        return response.data;
    },

    // Xóa lịch sử
    deleteHistory: async (id) => {
        const response = await PmaRequest.delete(`${API_ENDPOINTS.INVENTORY.HISTORY}/${id}`);
        return response.data;
    },

    // ===== KHO =====
    // Tạo kho
    createWarehouse: async (data) => {
        const response = await PmaRequest.post(API_ENDPOINTS.WAREHOUSES.BASE, data);
        return response.data;
    },

    // Lấy danh sách kho
    getWarehouses: async () => {
        const response = await PmaRequest.get(API_ENDPOINTS.WAREHOUSES.BASE);
        return response.data;
    },

    // Lấy chi tiết kho
    getWarehouseById: async (maKho) => {
        const response = await PmaRequest.get(`${API_ENDPOINTS.WAREHOUSES.BASE}/${maKho}`);
        return response.data;
    },

    // Cập nhật kho
    updateWarehouse: async (maKho, data) => {
        const response = await PmaRequest.put(`${API_ENDPOINTS.WAREHOUSES.BASE}/${maKho}`, data);
        return response.data;
    },

    // Xóa kho
    deleteWarehouse: async (maKho) => {
        const response = await PmaRequest.delete(`${API_ENDPOINTS.WAREHOUSES.BASE}/${maKho}`);
        return response.data;
    },

    // ===== CẢNH BÁO TỒN KHO =====
    // Tạo cảnh báo
    createStockAlert: async (data) => {
        const response = await PmaRequest.post(API_ENDPOINTS.STOCK_ALERTS.BASE, data);
        return response.data;
    },

    // Lấy tất cả cảnh báo
    getAllStockAlerts: async () => {
        const response = await PmaRequest.get(API_ENDPOINTS.STOCK_ALERTS.BASE);
        return response.data;
    },

    // Lấy cảnh báo theo thuốc
    getStockAlertByDrug: async (maThuoc) => {
        const response = await PmaRequest.get(`${API_ENDPOINTS.STOCK_ALERTS.BASE}/${maThuoc}`);
        return response.data;
    },

    // Lấy cảnh báo tồn kho thấp
    getLowStockAlerts: async () => {
        const response = await PmaRequest.get(API_ENDPOINTS.STOCK_ALERTS.LOW_STOCK);
        return response.data;
    },

    // Lấy cảnh báo theo trạng thái
    getStockAlertsByStatus: async (status) => {
        const response = await PmaRequest.get(`${API_ENDPOINTS.STOCK_ALERTS.BY_STATUS}/${status}`);
        return response.data;
    },

    // Cập nhật cảnh báo
    updateStockAlert: async (maThuoc, data) => {
        const response = await PmaRequest.put(`${API_ENDPOINTS.STOCK_ALERTS.BASE}/${maThuoc}`, data);
        return response.data;
    },

    // Cập nhật số lượng hiện tại
    updateCurrentStock: async (maThuoc, soLuongHienTai) => {
        const response = await PmaRequest.patch(
            `${API_ENDPOINTS.STOCK_ALERTS.UPDATE_CURRENT}/${maThuoc}/current-stock?soLuongHienTai=${soLuongHienTai}`
        );
        return response.data;
    },

    // Xóa cảnh báo
    deleteStockAlert: async (maThuoc) => {
        const response = await PmaRequest.delete(`${API_ENDPOINTS.STOCK_ALERTS.BASE}/${maThuoc}`);
        return response.data;
    },
};

export default inventoryService;
