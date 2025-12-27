import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import drugService from "../../services/drugService";
import salesService from "../../services/salesService";
import useAuth from "../../hooks/useAuth"; // Giả định bạn có hook này lấy user info
import { toast } from "react-toastify"; // Hoặc thư viện thông báo bạn đang dùng

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Lấy thông tin nhân viên đăng nhập

  // State cho dữ liệu
  const [drugs, setDrugs] = useState([]); // Danh sách thuốc để chọn
  const [cart, setCart] = useState([]); // Chi tiết hóa đơn (các thuốc đã chọn)
  const [loading, setLoading] = useState(false);

  // State cho form nhập liệu hiện tại
  const [selectedDrugId, setSelectedDrugId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [maHoaDon, setMaHoaDon] = useState(""); // Có thể để user nhập hoặc tự sinh

  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Lấy danh sách thuốc khi component mount
  useEffect(() => {
    fetchDrugs();
    // Tự sinh mã hóa đơn ngẫu nhiên hoặc để trống cho user nhập
    setMaHoaDon(`HD-${Date.now()}`);

    // Click ra ngoài đóng dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchDrugs = async () => {
    try {
      // Dùng getDrugs hoặc getDrugsPaged tùy vào lượng dữ liệu
      const res = await drugService.getDrugs();
      // Giả sử API trả về mảng thuốc trong res.data hoặc res directly
      setDrugs(res.data || res);
    } catch (error) {
      console.error("Lỗi tải danh sách thuốc:", error);
      toast.error("Không thể tải danh sách thuốc");
    }
  };

  const filteredDrugs = drugs.filter((drug) =>
    drug.tenThuoc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectDrug = (drug) => {
    setSelectedDrugId(drug.maThuoc);
    setSearchTerm(drug.tenThuoc); // Điền tên thuốc vào ô input
    setShowDropdown(false); // Ẩn dropdown
  };

  // Xử lý thêm thuốc vào hóa đơn
  const handleAddToCart = () => {
    if (!selectedDrugId || quantity <= 0) {
      toast.warning("Vui lòng chọn thuốc và số lượng hợp lệ");
      return;
    }

    const drugInfo = drugs.find((d) => d.maThuoc === selectedDrugId);
    if (!drugInfo) return;

    // Kiểm tra xem thuốc đã có trong giỏ chưa
    const existingItemIndex = cart.findIndex(
      (item) => item.maThuoc === selectedDrugId
    );

    if (existingItemIndex > -1) {
      // Nếu có rồi thì cộng dồn số lượng
      const newCart = [...cart];
      newCart[existingItemIndex].soLuong += parseInt(quantity);
      setCart(newCart);
    } else {
      // Nếu chưa thì thêm mới
      setCart([
        ...cart,
        {
          maThuoc: drugInfo.maThuoc,
          tenThuoc: drugInfo.tenThuoc, // Để hiển thị
          donViTinh: drugInfo.donViTinh?.tenDonVi || "Cái", // Giả định cấu trúc
          soLuong: parseInt(quantity),
          donGia: drugInfo.giaBan || 0, // Giả định field giaBan
        },
      ]);
    }

    // Reset form nhỏ
    setSelectedDrugId("");
    setSearchTerm('');
    setQuantity(1);
  };

  // Xóa thuốc khỏi hóa đơn
  const handleRemoveItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  // Tính tổng tiền
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.soLuong * item.donGia,
    0
  );

  // Xử lý thanh toán / Tạo hóa đơn
  const handleSubmit = async () => {
    if (cart.length === 0) {
      toast.warning("Chưa có sản phẩm nào trong hóa đơn");
      return;
    }
    if (!maHoaDon) {
      toast.warning("Vui lòng nhập mã hóa đơn");
      return;
    }

    setLoading(true);
    try {
      // Format ngày bán theo yêu cầu backend: yyyy-MM-dd'T'HH:mm:ss
      const now = new Date();
      const ngayBanFormatted = now.toISOString().slice(0, 19);

      const payload = {
        maHoaDon: maHoaDon,
        ngayBan: ngayBanFormatted,
        maNV: user?.maNV || "NV_TEST", // Lấy từ auth context hoặc fallback
        chiTiet: cart.map((item) => ({
          maThuoc: item.maThuoc,
          soLuong: item.soLuong,
          donGia: item.donGia,
        })),
      };

      console.log("Payload sending:", payload); // Debug
      await salesService.createInvoice(payload);

      toast.success("Tạo hóa đơn thành công!");
      // Reset hoặc chuyển trang
      setCart([]);
      setMaHoaDon(`HD-${Date.now()}`);
      // navigate('/sales/invoices'); // Nếu muốn chuyển sang trang danh sách
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Lỗi khi tạo hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">
        Lập Hóa Đơn Bán Hàng
      </h2>

      {/* Form thông tin chung */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 border-b pb-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Mã Hóa Đơn
          </label>
          <input
            type="text"
            value={maHoaDon}
            onChange={(e) => setMaHoaDon(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Nhân viên lập
          </label>
          <input
            type="text"
            value={user?.hoTen || user?.username || "Admin"}
            disabled
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>
      </div>

      {/* Khu vực chọn thuốc */}
      <div className="flex gap-4 mb-4 items-end">
        <div className="flex-1 relative" ref={dropdownRef}>
          <label className="block text-gray-700 font-medium mb-1">
            Tìm Thuốc (Tên)
          </label>

          {/* Ô nhập liệu tìm kiếm */}
          <input
            type="text"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập tên thuốc để tìm..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true); // Hiện danh sách khi gõ
              setSelectedDrugId(""); // Reset ID nếu sửa tên
            }}
            onFocus={() => setShowDropdown(true)} // Hiện danh sách khi click vào
            autoComplete="off"
          />

          {/* Danh sách gợi ý (Dropdown) */}
          {showDropdown && (
            <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-b shadow-lg max-h-60 overflow-y-auto mt-1">
              {filteredDrugs.length > 0 ? (
                filteredDrugs.map((drug) => (
                  <div
                    key={drug.maThuoc}
                    onClick={() => handleSelectDrug(drug)}
                    className="p-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-800">
                      {drug.tenThuoc}
                    </span>
                    <span className="text-sm text-gray-500">
                      Tồn:{" "}
                      <strong
                        className={
                          drug.soLuongTon > 0
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      >
                        {drug.soLuongTon}
                      </strong>
                      {" | "}
                      Giá: {drug.giaBan?.toLocaleString()} đ
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-500 text-center">
                  Không tìm thấy thuốc nào
                </div>
              )}
            </div>
          )}
        </div>
        <div className="w-32">
          <label className="block text-gray-700 font-medium mb-1">
            Số lượng
          </label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          onClick={handleAddToCart}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 h-10"
        >
          Thêm +
        </button>
      </div>

      {/* Bảng chi tiết hóa đơn (Giỏ hàng) */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-4 border-b text-left">Mã Thuốc</th>
              <th className="py-2 px-4 border-b text-left">Tên Thuốc</th>
              <th className="py-2 px-4 border-b text-center">Đơn vị</th>
              <th className="py-2 px-4 border-b text-center">SL</th>
              <th className="py-2 px-4 border-b text-right">Đơn giá</th>
              <th className="py-2 px-4 border-b text-right">Thành tiền</th>
              <th className="py-2 px-4 border-b text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {cart.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  Chưa có thuốc nào được chọn
                </td>
              </tr>
            ) : (
              cart.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{item.maThuoc}</td>
                  <td className="py-2 px-4 border-b font-medium">
                    {item.tenThuoc}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {item.donViTinh}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {item.soLuong}
                  </td>
                  <td className="py-2 px-4 border-b text-right">
                    {item.donGia?.toLocaleString()} đ
                  </td>
                  <td className="py-2 px-4 border-b text-right">
                    {(item.soLuong * item.donGia)?.toLocaleString()} đ
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Tổng cộng và Nút tạo */}
      <div className="flex justify-end items-center gap-6 mt-4 pt-4 border-t">
        <div className="text-xl font-bold text-gray-800">
          Tổng tiền:{" "}
          <span className="text-red-600">
            {totalAmount.toLocaleString()} VNĐ
          </span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || cart.length === 0}
          className={`px-6 py-2 rounded text-white font-medium ${
            loading || cart.length === 0
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Đang xử lý..." : "Thanh Toán & Xuất Hóa Đơn"}
        </button>
      </div>
    </div>
  );
};

export default CreateInvoice;
