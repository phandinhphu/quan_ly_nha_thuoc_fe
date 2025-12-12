import PmaRequest from '../utils/httpRequest';
import { API_ENDPOINTS } from '../utils/constants';

const supplierService = {
    // ===== NHÀ CUNG CẤP =====
    // Tạo nhà cung cấp
    createSupplier: async (data) => {
        const response = await PmaRequest.post(API_ENDPOINTS.SUPPLIERS.BASE, data);
        return response.data;
    },

    // Lấy danh sách nhà cung cấp
    getSuppliers: async () => {
        const response = await PmaRequest.get(API_ENDPOINTS.SUPPLIERS.BASE);
        return response.data;
    },

    // Lấy chi tiết nhà cung cấp
    getSupplierById: async (maNCC) => {
        const response = await PmaRequest.get(`${API_ENDPOINTS.SUPPLIERS.BASE}/${maNCC}`);
        return response.data;
    },

    // Cập nhật nhà cung cấp
    updateSupplier: async (maNCC, data) => {
        const response = await PmaRequest.put(`${API_ENDPOINTS.SUPPLIERS.BASE}/${maNCC}`, data);
        return response.data;
    },

    // Xóa nhà cung cấp
    deleteSupplier: async (maNCC) => {
        const response = await PmaRequest.delete(`${API_ENDPOINTS.SUPPLIERS.BASE}/${maNCC}`);
        return response.data;
    },

    // ===== PHIẾU NHẬP =====
    // Tạo phiếu nhập
    createReceipt: async (data) => {
        const response = await PmaRequest.post(API_ENDPOINTS.SUPPLIERS.RECEIPTS, data);
        return response.data;
    },

    // Lấy danh sách phiếu nhập
    getReceipts: async () => {
        const response = await PmaRequest.get(API_ENDPOINTS.SUPPLIERS.RECEIPTS);
        return response.data;
    },

    // Lấy chi tiết phiếu nhập
    getReceiptById: async (maPhieuNhap) => {
        const response = await PmaRequest.get(`${API_ENDPOINTS.SUPPLIERS.RECEIPTS}/${maPhieuNhap}`);
        return response.data;
    },

    // Xóa phiếu nhập
    deleteReceipt: async (maPhieuNhap) => {
        const response = await PmaRequest.delete(`${API_ENDPOINTS.SUPPLIERS.RECEIPTS}/${maPhieuNhap}`);
        return response.data;
    },
};

export default supplierService;
