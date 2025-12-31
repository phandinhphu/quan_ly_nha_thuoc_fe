import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus, Search } from 'lucide-react';
import drugService from '../../services/drugService';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';

const DrugList = () => {
    const [drugs, setDrugs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingDrug, setEditingDrug] = useState(null);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalItems: 0,
        totalPages: 0,
    });
    const [formData, setFormData] = useState({
        maThuoc: '',
        tenThuoc: '',
        maLoai: '',
        maDonVi: '',
        giaNhap: '',
        giaBan: '',
        hanSuDung: '',
        nhaSanXuat: '',
        soLuongTon: '',
        moTa: '',
    });

    useEffect(() => {
        const fetchStaticData = async () => {
            try {
                const [categoriesData, unitsData] = await Promise.all([
                    drugService.getCategories(),
                    drugService.getUnits(),
                ]);
                setCategories(categoriesData.data);
                setUnits(unitsData.data);
            } catch {
                toast.error('Lỗi khi tải dữ liệu');
            }
        };

        fetchStaticData();
    }, []);

    useEffect(() => {
        fetchDrugsPaged();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.page, pagination.size, searchQuery]);

    const normalizePagedResponse = (response) => {
        // Expected: { success, message, data: { items: [], pagination: { page, size, totalItems, totalPages } } }
        const dataWrapper = response?.data;
        const items = dataWrapper?.items ?? dataWrapper ?? [];
        const paging = dataWrapper?.pagination;

        return {
            items: Array.isArray(items) ? items : [],
            pagination: paging,
        };
    };

    const fetchDrugsPaged = async () => {
        setLoading(true);
        try {
            const res = await drugService.getDrugsPaged(pagination.page, pagination.size, searchQuery);
            const { items, pagination: serverPaging } = normalizePagedResponse(res);

            setDrugs(items);
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

    const handleSearch = async () => {
        const nextQuery = searchTerm.trim();
        setPagination((prev) => ({ ...prev, page: 0 }));
        setSearchQuery(nextQuery);
    };

    const handleOpenModal = (drug = null) => {
        if (drug) {
            setEditingDrug(drug);
            setFormData({
                maThuoc: drug.maThuoc || '',
                tenThuoc: drug.tenThuoc || '',
                maLoai: drug.maLoai || '',
                maDonVi: drug.maDonVi || '',
                giaNhap: drug.giaNhap || '',
                giaBan: drug.giaBan || '',
                hanSuDung: drug.hanSuDung ? drug.hanSuDung.split('T')[0] : '',
                nhaSanXuat: drug.nhaSanXuat || '',
                soLuongTon: drug.soLuongTon || '',
                moTa: drug.moTa || '',
            });
        } else {
            setEditingDrug(null);
            setFormData({
                maThuoc: '',
                tenThuoc: '',
                maLoai: '',
                maDonVi: '',
                giaNhap: '',
                giaBan: '',
                hanSuDung: '',
                nhaSanXuat: '',
                soLuongTon: '',
                moTa: '',
            });
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingDrug(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingDrug) {
                await drugService.updateDrug(editingDrug.maThuoc, formData);
                toast.success('Cập nhật thuốc thành công');
            } else {
                await drugService.createDrug(formData);
                toast.success('Thêm thuốc thành công');
            }
            handleCloseModal();
            fetchDrugsPaged();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (drug) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa thuốc "${drug.tenThuoc}"?`)) {
            try {
                await drugService.deleteDrug(drug.maThuoc);
                toast.success('Xóa thuốc thành công');
                fetchDrugsPaged();
            } catch {
                toast.error('Lỗi khi xóa thuốc');
            }
        }
    };

    const columns = [
        { key: 'maThuoc', label: 'Mã thuốc' },
        { key: 'tenThuoc', label: 'Tên thuốc' },
        { 
            key: 'giaBan', 
            label: 'Giá bán',
            render: (row) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.giaBan)
        },
        { key: 'soLuongTon', label: 'Tồn kho' },
        { 
            key: 'hanSuDung', 
            label: 'Hạn sử dụng',
            render: (row) => row.hanSuDung ? new Date(row.hanSuDung).toLocaleDateString('vi-VN') : ''
        },
        { key: 'nhaSanXuat', label: 'Nhà sản xuất' },
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
                <h1 className="text-3xl font-bold text-gray-900">Quản lý thuốc</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Thêm thuốc
                </button>
            </div>

            <div className="mb-6 flex gap-4">
                <div className="flex-1 flex gap-2">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên thuốc..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="flex items-center px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                        <Search className="mr-2 h-5 w-5" />
                        Tìm kiếm
                    </button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={drugs}
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
                title={editingDrug ? 'Cập nhật thuốc' : 'Thêm thuốc mới'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mã thuốc *
                            </label>
                            <input
                                type="text"
                                required
                                disabled={!!editingDrug}
                                value={formData.maThuoc}
                                onChange={(e) => setFormData({ ...formData, maThuoc: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên thuốc *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.tenThuoc}
                                onChange={(e) => setFormData({ ...formData, tenThuoc: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Loại thuốc *
                            </label>
                            <select
                                required
                                value={formData.maLoai}
                                onChange={(e) => setFormData({ ...formData, maLoai: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Chọn loại thuốc</option>
                                {categories.map((cat) => (
                                    <option key={cat.maLoai} value={cat.maLoai}>
                                        {cat.tenLoai}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Đơn vị tính *
                            </label>
                            <select
                                required
                                value={formData.maDonVi}
                                onChange={(e) => setFormData({ ...formData, maDonVi: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Chọn đơn vị</option>
                                {units.map((unit) => (
                                    <option key={unit.maDonVi} value={unit.maDonVi}>
                                        {unit.tenDonVi}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Giá nhập *
                            </label>
                            <input
                                type="number"
                                required
                                value={formData.giaNhap}
                                onChange={(e) => setFormData({ ...formData, giaNhap: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Giá bán *
                            </label>
                            <input
                                type="number"
                                required
                                value={formData.giaBan}
                                onChange={(e) => setFormData({ ...formData, giaBan: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Hạn sử dụng *
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.hanSuDung}
                                onChange={(e) => setFormData({ ...formData, hanSuDung: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nhà sản xuất *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.nhaSanXuat}
                                onChange={(e) => setFormData({ ...formData, nhaSanXuat: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {!editingDrug && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Số lượng tồn
                                </label>
                                <input
                                    type="number"
                                    value={formData.soLuongTon}
                                    onChange={(e) => setFormData({ ...formData, soLuongTon: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        )}

                        <div className="col-span-2">
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
                            {submitting ? 'Đang xử lý...' : (editingDrug ? 'Cập nhật' : 'Thêm mới')}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default DrugList;
