import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus, Trash2 } from 'lucide-react';
import supplierService from '../../services/supplierService';
import drugService from '../../services/drugService';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';

const Receipts = () => {
    const [receipts, setReceipts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [drugs, setDrugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalItems: 0,
        totalPages: 0,
    });
    const [formData, setFormData] = useState({
        maPhieuNhap: '',
        ngayNhap: '',
        maNCC: '',
        maNV: '',
        chiTiet: [{ maThuoc: '', soLuong: '', donGia: '' }],
    });

    useEffect(() => {
        const fetchStaticData = async () => {
            try {
                const [suppliersData, drugsData] = await Promise.all([
                    supplierService.getSuppliers(),
                    drugService.getDrugs(),
                ]);
                setSuppliers(suppliersData.data);
                setDrugs(drugsData.data);
            } catch {
                toast.error('Lỗi khi tải dữ liệu');
            }
        };

        fetchStaticData();
    }, []);

    useEffect(() => {
        fetchReceiptsPaged();
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

    const fetchReceiptsPaged = async () => {
        setLoading(true);
        try {
            const res = await supplierService.getReceiptsPaged(pagination.page, pagination.size);
            const { items, pagination: serverPaging } = normalizePagedResponse(res);

            setReceipts(items);
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

    const handleOpenModal = () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().split(' ')[0];

        setFormData({
            maPhieuNhap: `PN${Date.now()}`,
            ngayNhap: `${dateStr}T${timeStr}`,
            maNCC: '',
            maNV: user.maNV || '',
            chiTiet: [{ maThuoc: '', soLuong: '', donGia: '' }],
        });
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleAddDetail = () => {
        setFormData({
            ...formData,
            chiTiet: [...formData.chiTiet, { maThuoc: '', soLuong: '', donGia: '' }],
        });
    };

    const handleRemoveDetail = (index) => {
        const newChiTiet = formData.chiTiet.filter((_, i) => i !== index);
        setFormData({ ...formData, chiTiet: newChiTiet });
    };

    const handleDetailChange = (index, field, value) => {
        const newChiTiet = [...formData.chiTiet];
        newChiTiet[index][field] = value;
        setFormData({ ...formData, chiTiet: newChiTiet });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await supplierService.createReceipt(formData);
            toast.success('Tạo phiếu nhập thành công');
            handleCloseModal();
            fetchReceiptsPaged();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleDelete = async (receipt) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa phiếu nhập "${receipt.maPhieuNhap}"?`)) {
            try {
                await supplierService.deleteReceipt(receipt.maPhieuNhap);
                toast.success('Xóa phiếu nhập thành công');
                fetchReceiptsPaged();
            } catch {
                toast.error('Lỗi khi xóa phiếu nhập');
            }
        }
    };

    const calculateTotal = (receipt) => {
        if (!receipt.chiTiet) return 0;
        return receipt.chiTiet.reduce((sum, item) => sum + (item.soLuong * item.donGia), 0);
    };

    const columns = [
        { key: 'maPhieuNhap', label: 'Mã phiếu' },
        { 
            key: 'ngayNhap', 
            label: 'Ngày nhập',
            render: (row) => row.ngayNhap ? new Date(row.ngayNhap).toLocaleDateString('vi-VN') : ''
        },
        { key: 'maNCC', label: 'Mã NCC' },
        { key: 'maNV', label: 'Mã NV' },
        { 
            key: 'tongTien', 
            label: 'Tổng tiền',
            render: (row) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal(row))
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
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Phiếu nhập</h1>
                <button
                    onClick={handleOpenModal}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Tạo phiếu nhập
                </button>
            </div>

            <DataTable
                columns={columns}
                data={receipts}
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
                title="Tạo phiếu nhập mới"
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mã phiếu nhập *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.maPhieuNhap}
                                onChange={(e) => setFormData({ ...formData, maPhieuNhap: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ngày nhập *
                            </label>
                            <input
                                type="datetime-local"
                                required
                                value={formData.ngayNhap}
                                onChange={(e) => setFormData({ ...formData, ngayNhap: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nhà cung cấp *
                            </label>
                            <select
                                required
                                value={formData.maNCC}
                                onChange={(e) => setFormData({ ...formData, maNCC: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Chọn nhà cung cấp</option>
                                {suppliers.map((supplier) => (
                                    <option key={supplier.maNCC} value={supplier.maNCC}>
                                        {supplier.tenNCC}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mã nhân viên *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.maNV}
                                onChange={(e) => setFormData({ ...formData, maNV: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-medium text-gray-900">Chi tiết phiếu nhập</h3>
                            <button
                                type="button"
                                onClick={handleAddDetail}
                                className="flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                <Plus className="mr-1 h-4 w-4" />
                                Thêm
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formData.chiTiet.map((detail, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                                    <div className="col-span-5">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Thuốc *
                                        </label>
                                        <select
                                            required
                                            value={detail.maThuoc}
                                            onChange={(e) => handleDetailChange(index, 'maThuoc', e.target.value)}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="">Chọn thuốc</option>
                                            {drugs.map((drug) => (
                                                <option key={drug.maThuoc} value={drug.maThuoc}>
                                                    {drug.tenThuoc}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-3">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Số lượng *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={detail.soLuong}
                                            onChange={(e) => handleDetailChange(index, 'soLuong', e.target.value)}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Đơn giá *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={detail.donGia}
                                            onChange={(e) => handleDetailChange(index, 'donGia', e.target.value)}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        {formData.chiTiet.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveDetail(index)}
                                                className="p-1 text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
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
                            Tạo phiếu nhập
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Receipts;
