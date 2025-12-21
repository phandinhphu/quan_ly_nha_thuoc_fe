import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus } from 'lucide-react';
import drugService from '../../services/drugService';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';

const DrugUnits = () => {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState(null);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalItems: 0,
        totalPages: 0,
    });
    const [formData, setFormData] = useState({
        maDonVi: '',
        tenDonVi: '',
    });

    useEffect(() => {
        fetchUnitsPaged();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.page, pagination.size]);

    const normalizePagedResponse = (response) => {
        const dataWrapper = response?.data;
        const items = dataWrapper?.items ?? dataWrapper ?? [];
        const paging = dataWrapper?.pagination;

        return {
            items: Array.isArray(items) ? items : [],
            pagination: paging,
        };
    };

    const fetchUnitsPaged = async () => {
        setLoading(true);
        try {
            const res = await drugService.getUnitsPaged(pagination.page, pagination.size);
            const { items, pagination: serverPaging } = normalizePagedResponse(res);

            setUnits(items);
            if (serverPaging) {
                setPagination((prev) => ({
                    ...prev,
                    page: serverPaging.page ?? prev.page,
                    size: serverPaging.size ?? prev.size,
                    totalItems: serverPaging.totalItems ?? prev.totalItems,
                    totalPages: serverPaging.totalPages ?? prev.totalPages,
                }));
            }
        } catch {
            toast.error('Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (unit = null) => {
        if (unit) {
            setEditingUnit(unit);
            setFormData({
                maDonVi: unit.maDonVi || '',
                tenDonVi: unit.tenDonVi || '',
            });
        } else {
            setEditingUnit(null);
            setFormData({ maDonVi: '', tenDonVi: '' });
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingUnit(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUnit) {
                await drugService.updateUnit(editingUnit.maDonVi, formData);
                toast.success('Cập nhật đơn vị tính thành công');
            } else {
                await drugService.createUnit(formData);
                toast.success('Thêm đơn vị tính thành công');
            }
            handleCloseModal();
            fetchUnitsPaged();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleDelete = async (unit) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa đơn vị "${unit.tenDonVi}"?`)) {
            try {
                await drugService.deleteUnit(unit.maDonVi);
                toast.success('Xóa đơn vị tính thành công');
                fetchUnitsPaged();
            } catch {
                toast.error('Lỗi khi xóa đơn vị tính');
            }
        }
    };

    const columns = [
        { key: 'maDonVi', label: 'Mã đơn vị' },
        { key: 'tenDonVi', label: 'Tên đơn vị' },
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
                <h1 className="text-3xl font-bold text-gray-900">Đơn vị tính</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Thêm đơn vị tính
                </button>
            </div>

            <DataTable
                columns={columns}
                data={units}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
            />

            <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                disabled={loading}
                onPageChange={(nextPage) => setPagination((prev) => ({ ...prev, page: nextPage }))}
            />

            <Modal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                title={editingUnit ? 'Cập nhật đơn vị tính' : 'Thêm đơn vị tính mới'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mã đơn vị *
                        </label>
                        <input
                            type="text"
                            required
                            disabled={!!editingUnit}
                            value={formData.maDonVi}
                            onChange={(e) => setFormData({ ...formData, maDonVi: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên đơn vị *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.tenDonVi}
                            onChange={(e) => setFormData({ ...formData, tenDonVi: e.target.value })}
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
                            {editingUnit ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default DrugUnits;
