import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus } from 'lucide-react';
import supplierService from '../../services/supplierService';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalItems: 0,
        totalPages: 0,
    });
    const [formData, setFormData] = useState({
        maNCC: '',
        tenNCC: '',
        diaChi: '',
        soDienThoai: '',
        email: '',
        nguoiDaiDien: '',
    });

    useEffect(() => {
        fetchSuppliersPaged();
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

    const fetchSuppliersPaged = async () => {
        setLoading(true);
        try {
            const res = await supplierService.getSuppliersPaged(pagination.page, pagination.size);
            const { items, pagination: serverPaging } = normalizePagedResponse(res);

            setSuppliers(items);
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

    const handleOpenModal = (supplier = null) => {
        if (supplier) {
            setEditingSupplier(supplier);
            setFormData({
                maNCC: supplier.maNCC || '',
                tenNCC: supplier.tenNCC || '',
                diaChi: supplier.diaChi || '',
                soDienThoai: supplier.soDienThoai || '',
                email: supplier.email || '',
                nguoiDaiDien: supplier.nguoiDaiDien || '',
            });
        } else {
            setEditingSupplier(null);
            setFormData({
                maNCC: '',
                tenNCC: '',
                diaChi: '',
                soDienThoai: '',
                email: '',
                nguoiDaiDien: '',
            });
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingSupplier(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingSupplier) {
                await supplierService.updateSupplier(editingSupplier.maNCC, formData);
                toast.success('Cập nhật nhà cung cấp thành công');
            } else {
                await supplierService.createSupplier(formData);
                toast.success('Thêm nhà cung cấp thành công');
            }
            handleCloseModal();
            fetchSuppliersPaged();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (supplier) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa nhà cung cấp "${supplier.tenNCC}"?`)) {
            try {
                await supplierService.deleteSupplier(supplier.maNCC);
                toast.success('Xóa nhà cung cấp thành công');
                fetchSuppliersPaged();
            } catch {
                toast.error('Lỗi khi xóa nhà cung cấp');
            }
        }
    };

    const columns = [
        { key: 'maNCC', label: 'Mã NCC' },
        { key: 'tenNCC', label: 'Tên nhà cung cấp' },
        { key: 'soDienThoai', label: 'Số điện thoại' },
        { key: 'email', label: 'Email' },
        { key: 'nguoiDaiDien', label: 'Người đại diện' },
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
                <h1 className="text-3xl font-bold text-gray-900">Nhà cung cấp</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Thêm nhà cung cấp
                </button>
            </div>

            <DataTable
                columns={columns}
                data={suppliers}
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
                title={editingSupplier ? 'Cập nhật nhà cung cấp' : 'Thêm nhà cung cấp mới'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mã NCC *
                            </label>
                            <input
                                type="text"
                                required
                                disabled={!!editingSupplier}
                                value={formData.maNCC}
                                onChange={(e) => setFormData({ ...formData, maNCC: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên nhà cung cấp *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.tenNCC}
                                onChange={(e) => setFormData({ ...formData, tenNCC: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số điện thoại *
                            </label>
                            <input
                                type="tel"
                                required
                                value={formData.soDienThoai}
                                onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Người đại diện *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.nguoiDaiDien}
                                onChange={(e) => setFormData({ ...formData, nguoiDaiDien: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="col-span-2">
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
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            disabled={submitting}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {submitting && (
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {submitting ? 'Đang xử lý...' : (editingSupplier ? 'Cập nhật' : 'Thêm mới')}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Suppliers;
