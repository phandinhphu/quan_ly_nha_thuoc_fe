import PmaRequest from '../utils/httpRequest';
import { API_ENDPOINTS } from '../utils/constants';

const reportService = {
    // Lấy báo cáo tổng hợp (Doanh thu, Đơn hàng, Top thuốc bán chạy)
    getSummary: async (date) => {
        const params = {};
        if (date) params.date = date;

        const response = await PmaRequest.get(API_ENDPOINTS.REPORTS.SUMMARY, { params });
        return response.data;
    }
};

export default reportService;   