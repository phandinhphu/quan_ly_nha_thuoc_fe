import React, { useEffect, useState } from 'react';
import salesService from '../../services/salesService';
import drugService from '../../services/drugService'; // 1. Import drugService

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // 2. Thêm state lưu danh sách thuốc
    const [drugs, setDrugs] = useState([]); 

    useEffect(() => {
        loadInvoices();
        fetchDrugs(); // 3. Gọi hàm lấy thuốc
    }, []);

    const loadInvoices = async () => {
        try {
            setLoading(true);
            const res = await salesService.getAllInvoices();
            setInvoices(res.data || []); 
        } catch (error) {
            console.error("Lỗi lấy danh sách hóa đơn:", error);
        } finally {
            setLoading(false);
        }
    };

    // 4. Hàm lấy danh sách thuốc để tra cứu tên
    const fetchDrugs = async () => {
        try {
            const res = await drugService.getDrugs();
            setDrugs(res.data || res);
        } catch (error) {
            console.error("Lỗi lấy danh sách thuốc:", error);
        }
    };

    const handleViewDetail = (invoice) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedInvoice(null);
    }

    const handleDelete = async (maHoaDon) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa hóa đơn ${maHoaDon} không?`)) {
            try {
                await salesService.deleteInvoice(maHoaDon);
                
                setInvoices(prevInvoices => prevInvoices.filter(inv => inv.maHoaDon !== maHoaDon));
                
                toast.success(`Đã xóa thành công hóa đơn ${maHoaDon}`);
            } catch (error) {
                console.error("Lỗi xóa hóa đơn:", error);
                toast.error(error.response?.data?.message || "Xóa hóa đơn thất bại!");
            }
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Lịch Sử Hóa Đơn</h2>
            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : (
                <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th className="px-6 py-3">Mã HĐ</th>
                                <th className="px-6 py-3">Ngày Bán</th>
                                <th className="px-6 py-3">Nhân Viên</th>
                                <th className="px-6 py-3 text-right">Tổng Tiền</th>
                                <th className="px-6 py-3 text-center">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((inv) => (
                                <tr key={inv.maHoaDon} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{inv.maHoaDon}</td>
                                    <td className="px-6 py-4">
                                        {inv.ngayBan ? new Date(inv.ngayBan).toLocaleString('vi-VN') : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">{inv.tenNhanVien || inv.maNV}</td>
                                    <td className="px-6 py-4 text-right font-bold text-blue-600">
                                        {inv.tongTien?.toLocaleString()} đ
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => handleViewDetail(inv)} 
                                            className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-xs"
                                        >
                                            Xem Chi Tiết
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(inv.maHoaDon)} 
                                            className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-xs"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && selectedInvoice && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 animate-fade-in-down">
                        <div className="flex justify-between items-center border-b pb-3 mb-4">
                            <h3 className="text-xl font-bold text-gray-800">
                                Chi Tiết Hóa Đơn: {selectedInvoice.maHoaDon}
                            </h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-red-500 text-2xl font-bold">
                                &times;
                            </button>
                        </div>

                        <div className="mb-4 text-sm grid grid-cols-2 gap-4">
                            <p><strong>Ngày bán:</strong> {selectedInvoice.ngayBan ? new Date(selectedInvoice.ngayBan).toLocaleString('vi-VN') : ''}</p>
                            <p><strong>Nhân viên:</strong> {selectedInvoice.tenNhanVien || selectedInvoice.maNV}</p>
                        </div>

                        {/* Bảng chi tiết thuốc trong modal */}
                        <div className="overflow-y-auto max-h-64 border rounded">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-100 text-xs uppercase sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2">Mã Thuốc</th>
                                        <th className="px-4 py-2 text-left">Tên Thuốc</th>
                                        <th className="px-4 py-2 text-center">Số Lượng</th>
                                        <th className="px-4 py-2 text-right">Đơn Giá</th>
                                        <th className="px-4 py-2 text-right">Thành Tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedInvoice.chiTiet && selectedInvoice.chiTiet.map((item, index) => {
                                        // 5. Logic tìm tên thuốc
                                        const drugInfo = drugs.find(d => d.maThuoc === item.maThuoc);
                                        const tenThuoc = drugInfo ? drugInfo.tenThuoc : 'Đang tải...';

                                        return (
                                            <tr key={index} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="px-4 py-2">{item.maThuoc}</td>
                                                {/* Hiển thị tên thuốc */}
                                                <td className="px-4 py-2 font-medium text-blue-700">{tenThuoc}</td>
                                                <td className="px-4 py-2 text-center">{item.soLuong}</td>
                                                <td className="px-4 py-2 text-right">{item.donGia?.toLocaleString()} đ</td>
                                                <td className="px-4 py-2 text-right font-medium">
                                                    {(item.soLuong * item.donGia)?.toLocaleString()} đ
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 pt-4 border-t flex justify-between items-center">
                            <div className="text-lg font-bold">
                                Tổng cộng: <span className="text-red-600">{selectedInvoice.tongTien?.toLocaleString()} đ</span>
                            </div>
                            <button 
                                onClick={closeModal}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoiceList;