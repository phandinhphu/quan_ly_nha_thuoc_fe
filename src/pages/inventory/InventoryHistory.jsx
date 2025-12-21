import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import inventoryService from '../../services/inventoryService';
import DataTable from '../../components/common/DataTable';

const InventoryHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const data = await inventoryService.getRecentHistory();
            setHistory(data.data);
        } catch {
            toast.error('Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { key: 'maLS', label: 'ID' },
        { key: 'maThuoc', label: 'Mã thuốc' },
        { 
            key: 'soLuongThayDoi', 
            label: 'Số lượng thay đổi',
            render: (row) => {
                const value = row.soLuongThayDoi;
                const color = value > 0 ? 'text-green-600' : 'text-red-600';
                return <span className={`font-semibold ${color}`}>{value > 0 ? '+' : ''}{value}</span>;
            }
        },
        { key: 'lyDo', label: 'Lý do' },
        { 
            key: 'ngayCapNhat', 
            label: 'Ngày thay đổi',
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
                <h1 className="text-3xl font-bold text-gray-900">Lịch sử tồn kho</h1>
                <p className="mt-2 text-gray-600">Lịch sử thay đổi tồn kho gần đây</p>
            </div>

            <DataTable columns={columns} data={history} />
        </div>
    );
};

export default InventoryHistory;
