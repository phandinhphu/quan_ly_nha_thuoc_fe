import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import inventoryService from '../../services/inventoryService';
import DataTable from '../../components/common/DataTable';

const StockAlerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchAlerts();
    }, [filter]);

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            let data;
            if (filter === 'low-stock') {
                data = await inventoryService.getLowStockAlerts();
            } else if (filter === 'all') {
                data = await inventoryService.getAllStockAlerts();
            } else {
                data = await inventoryService.getStockAlertsByStatus(filter);
            }
            setAlerts(data.data);
        } catch {
            toast.error('Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            BINH_THUONG: { label: 'Bình thường', color: 'bg-green-100 text-green-800' },
            SAP_HET: { label: 'Sắp hết', color: 'bg-yellow-100 text-yellow-800' },
            HET_HANG: { label: 'Hết hàng', color: 'bg-red-100 text-red-800' },
        };

        const config = statusConfig[status] || statusConfig.BINH_THUONG;
        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
                {config.label}
            </span>
        );
    };

    const columns = [
        { key: 'maThuoc', label: 'Mã thuốc' },
        { 
            key: 'trangThai', 
            label: 'Trạng thái',
            render: (row) => getStatusBadge(row.trangThai)
        },
        { key: 'soLuongHienTai', label: 'Số lượng hiện tại' },
        { key: 'soLuongToiThieu', label: 'Số lượng tối thiểu' },
        { 
            key: 'ngayCapNhat', 
            label: 'Ngày cập nhật',
            render: (row) => row.ngayCapNhat ? new Date(row.ngayCapNhat).toLocaleString('vi-VN') : ''
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Cảnh báo tồn kho</h1>
            </div>

            <div className="mb-6 flex gap-4">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="all">Tất cả</option>
                    <option value="low-stock">Tồn kho thấp</option>
                    <option value="BINH_THUONG">Bình thường</option>
                    <option value="SAP_HET">Sắp hết</option>
                    <option value="HET_HANG">Hết hàng</option>
                </select>
            </div>

            <DataTable columns={columns} data={alerts} />
        </div>
    );
};

export default StockAlerts;
