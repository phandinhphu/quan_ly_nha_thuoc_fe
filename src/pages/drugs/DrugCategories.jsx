import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus } from 'lucide-react';
import drugService from '../../services/drugService';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';

const DrugCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalItems: 0,
        totalPages: 0,
    });
    const [formData, setFormData] = useState({
        maLoai: '',
        tenLoai: '',
        moTa: '',
    });

    useEffect(() => {
        fetchCategoriesPaged();
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

    const fetchCategoriesPaged = async () => {
        setLoading(true);
        try {
            const res = await drugService.getCategoriesPaged(pagination.page, pagination.size);
            const { items, pagination: serverPaging } = normalizePagedResponse(res);

            setCategories(items);
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

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                maLoai: category.maLoai || '',
                tenLoai: category.tenLoai || '',
                moTa: category.moTa || '',
            });
        } else {
            setEditingCategory(null);
            setFormData({ maLoai: '', tenLoai: '', moTa: '' });
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingCategory(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await drugService.updateCategory(editingCategory.maLoai, formData);
                toast.success('Cập nhật loại thuốc thành công');
            } else {
                await drugService.createCategory(formData);
                toast.success('Thêm loại thuốc thành công');
            }
            handleCloseModal();
            fetchCategoriesPaged();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleDelete = async (category) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa loại "${category.tenLoai}"?`)) {
            try {
                await drugService.deleteCategory(category.maLoai);
                toast.success('Xóa loại thuốc thành công');
                fetchCategoriesPaged();
            } catch {
                toast.error('Lỗi khi xóa loại thuốc');
            }
        }
    };

    const columns = [
        { key: 'maLoai', label: 'Mã loại' },
        { key: 'tenLoai', label: 'Tên loại' },
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
                <h1 className="text-3xl font-bold text-gray-900">Loại thuốc</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Thêm loại thuốc
                </button>
            </div>

            <DataTable
                columns={columns}
                data={categories}
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
                title={editingCategory ? 'Cập nhật loại thuốc' : 'Thêm loại thuốc mới'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mã loại *
                        </label>
                        <input
                            type="text"
                            required
                            disabled={!!editingCategory}
                            value={formData.maLoai}
                            onChange={(e) => setFormData({ ...formData, maLoai: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên loại *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.tenLoai}
                            onChange={(e) => setFormData({ ...formData, tenLoai: e.target.value })}
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
                            {editingCategory ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default DrugCategories;
