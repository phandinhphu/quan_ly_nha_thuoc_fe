import React, { useState, useEffect } from 'react';
import reportService from '../../services/reportService';
import { BarChart, Calendar, DollarSign, ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify';

const ReportPage = () => {
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalInvoices: 0,
        totalRevenue: 0,
        topSellingDrugs: []
    });

    // Default: ngày hiện tại
    const today = new Date().toISOString().split('T')[0];

    const [filter, setFilter] = useState(today);

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        setLoading(true);
        try {
            // Gọi API Summary để lấy tất cả dữ liệu cần thiết 1 lần
            const res = await reportService.getSummary(filter);
            // API trả về: { totalRevenue, totalOrders, topSellingDrugs }
            setStats(res.data || res); 
        } catch (error) {
            console.error("Lỗi tải báo cáo:", error);
            toast.error("Không thể tải dữ liệu báo cáo");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header & Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <BarChart className="text-blue-600" /> Báo Cáo Doanh Thu
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Thống kê tình hình kinh doanh nhà thuốc</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded shadow-sm">
                    <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-gray-400" />
                        <span className="text-sm text-gray-600">Lọc:</span>
                        <input 
                            type="date" 
                            name="date"
                            value={filter}
                            onChange={handleFilterChange}
                            className="border rounded px-2 py-1 text-sm focus:outline-blue-500"
                        />
                    </div>
                    <span className="text-gray-400">-</span>
                    <button 
                        onClick={fetchReport}
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors ml-2"
                    >
                        {loading ? 'Đang tải...' : 'Xem thống kê'}
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Card Doanh Thu */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Tổng Doanh Thu</p>
                        <h3 className="text-3xl font-bold text-gray-800">
                            {stats.totalRevenue?.toLocaleString()} <span className="text-lg text-gray-400 font-normal">VNĐ</span>
                        </h3>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <DollarSign size={24} />
                    </div>
                </div>

                {/* Card Đơn Hàng */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Tổng Số Đơn Hàng</p>
                        <h3 className="text-3xl font-bold text-gray-800">
                            {stats.totalInvoices} <span className="text-lg text-gray-400 font-normal">Đơn</span>
                        </h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <ShoppingBag size={24} />
                    </div>
                </div>
            </div>

            {/* Table Top Selling Drugs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-bold text-gray-800">Top Thuốc Bán Chạy</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">#</th>
                                <th className="px-6 py-3">Mã Thuốc</th>
                                <th className="px-6 py-3">Tên Thuốc</th>
                                <th className="px-6 py-3 text-center">Số Lượng Bán</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {stats.topSellingDrugs && stats.topSellingDrugs.length > 0 ? (
                                stats.topSellingDrugs.map((drug, index) => (
                                    <tr key={drug.maThuoc} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{drug.maThuoc}</td>
                                        <td className="px-6 py-4 text-blue-600 font-medium">{drug.tenThuoc}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                                                {drug.soLuongDaBan}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic">
                                        Không có dữ liệu trong khoảng thời gian này
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportPage;