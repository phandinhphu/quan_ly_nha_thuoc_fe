import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus } from 'lucide-react';
import inventoryService from '../../services/inventoryService';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';

const Warehouses = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingWarehouse, setEditingWarehouse] = useState(null);
    const [formData, setFormData] = useState({
        maKho: '',
        tenKho: '',
        diaChi: '',
        moTa: '',
    });

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const fetchWarehouses = async () => {
        try {
            const data = await inventoryService.getWarehouses();
            setWarehouses(data.data);
        } catch {
            toast.error('Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (warehouse = null) => {
        if (warehouse) {
            setEditingWarehouse(warehouse);
            setFormData({
                maKho: warehouse.maKho || '',
                tenKho: warehouse.tenKho || '',
                diaChi: warehouse.diaChi || '',
                moTa: warehouse.moTa || '',
            });
        } else {
            setEditingWarehouse(null);
            setFormData({ maKho: '', tenKho: '', diaChi: '', moTa: '' });
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingWarehouse(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingWarehouse) {
                await inventoryService.updateWarehouse(editingWarehouse.maKho, formData);
                toast.success('Cập nhật kho thành công');
            } else {
                await inventoryService.createWarehouse(formData);
                toast.success('Thêm kho thành công');
            }
            handleCloseModal();
            fetchWarehouses();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleDelete = async (warehouse) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa kho "${warehouse.tenKho}"?`)) {
            try {
                await inventoryService.deleteWarehouse(warehouse.maKho);
                toast.success('Xóa kho thành công');
                fetchWarehouses();
            } catch {
                toast.error('Lỗi khi xóa kho');
            }
        }
    };

    const columns = [
        { key: 'maKho', label: 'Mã kho' },
        { key: 'tenKho', label: 'Tên kho' },
        { key: 'diaChi', label: 'Địa chỉ' },
        { key: 'moTa', label: 'Mô tả' },
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
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Quản lý kho</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Thêm kho
                </button>
            </div>

            <DataTable
                columns={columns}
                data={warehouses}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
            />

            <Modal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                title={editingWarehouse ? 'Cập nhật kho' : 'Thêm kho mới'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mã kho *
                        </label>
                        <input
                            type="text"
                            required
                            disabled={!!editingWarehouse}
                            value={formData.maKho}
                            onChange={(e) => setFormData({ ...formData, maKho: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên kho *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.tenKho}
                            onChange={(e) => setFormData({ ...formData, tenKho: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Địa chỉ *
                        </label>
                        <textarea
                            rows="2"
                            required
                            value={formData.diaChi}
                            onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả
                        </label>
                        <textarea
                            rows="3"
                            value={formData.moTa}
                            onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                        >
                            {editingWarehouse ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Warehouses;
