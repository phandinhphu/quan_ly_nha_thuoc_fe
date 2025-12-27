import PmaRequest from '../utils/httpRequest';
import { API_ENDPOINTS } from '../utils/constants';
import { toast } from 'react-toastify';

const salesService = {
    // Tạo hóa đơn mới
    // Backend: POST /api/sales/invoices
    createInvoice: async (data) => {
        const response = await PmaRequest.post(API_ENDPOINTS.SALES.INVOICES, data);
        return response.data;
    },

    // Lấy danh sách hóa đơn
    // Backend: GET /api/sales/invoices
    getAllInvoices: async () => {
        const response = await PmaRequest.get(API_ENDPOINTS.SALES.INVOICES);
        return response.data;
    },

    // Lấy chi tiết hóa đơn
    // Backend: GET /api/sales/invoices/{maHoaDon}
    getInvoiceById: async (maHoaDon) => {
        const response = await PmaRequest.get(`${API_ENDPOINTS.SALES.INVOICES}/${maHoaDon}`);
        return response.data;
    },

    // Xóa hóa đơn (Chỉ Admin)
    // Backend: DELETE /api/sales/invoices/{maHoaDon}
    deleteInvoice: async (maHoaDon) => {
        const response = await PmaRequest.delete(`${API_ENDPOINTS.SALES.INVOICES}/${maHoaDon}`);
        return response.data;
    }
};

export default salesService;