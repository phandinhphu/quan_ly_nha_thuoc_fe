import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../contexts/auth/Context';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        tenDangNhap: '',
        matKhau: '',
        maNV: '',
        hoTen: '',
        gioiTinh: 'Nam',
        ngaySinh: '',
        soDienThoai: '',
        diaChi: '',
        vaiTro: 'STAFF',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await register(formData);
        
        if (result.success) {
            navigate('/');
        }
        
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Đăng ký tài khoản
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Tạo tài khoản mới trong hệ thống
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="tenDangNhap" className="block text-sm font-medium text-gray-700">
                                Tên đăng nhập *
                            </label>
                            <input
                                id="tenDangNhap"
                                name="tenDangNhap"
                                type="text"
                                required
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.tenDangNhap}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="matKhau" className="block text-sm font-medium text-gray-700">
                                Mật khẩu *
                            </label>
                            <input
                                id="matKhau"
                                name="matKhau"
                                type="password"
                                required
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.matKhau}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="maNV" className="block text-sm font-medium text-gray-700">
                                Mã nhân viên *
                            </label>
                            <input
                                id="maNV"
                                name="maNV"
                                type="text"
                                required
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.maNV}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="hoTen" className="block text-sm font-medium text-gray-700">
                                Họ tên *
                            </label>
                            <input
                                id="hoTen"
                                name="hoTen"
                                type="text"
                                required
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.hoTen}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="gioiTinh" className="block text-sm font-medium text-gray-700">
                                Giới tính *
                            </label>
                            <select
                                id="gioiTinh"
                                name="gioiTinh"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.gioiTinh}
                                onChange={handleChange}
                            >
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="ngaySinh" className="block text-sm font-medium text-gray-700">
                                Ngày sinh *
                            </label>
                            <input
                                id="ngaySinh"
                                name="ngaySinh"
                                type="date"
                                required
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.ngaySinh}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="soDienThoai" className="block text-sm font-medium text-gray-700">
                                Số điện thoại *
                            </label>
                            <input
                                id="soDienThoai"
                                name="soDienThoai"
                                type="tel"
                                required
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.soDienThoai}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="vaiTro" className="block text-sm font-medium text-gray-700">
                                Vai trò *
                            </label>
                            <select
                                id="vaiTro"
                                name="vaiTro"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.vaiTro}
                                onChange={handleChange}
                            >
                                <option value="STAFF">Nhân viên</option>
                                <option value="MANAGER">Quản lý</option>
                                <option value="ADMIN">Quản trị</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="diaChi" className="block text-sm font-medium text-gray-700">
                                Địa chỉ *
                            </label>
                            <textarea
                                id="diaChi"
                                name="diaChi"
                                rows="2"
                                required
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.diaChi}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/login"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Đã có tài khoản? Đăng nhập
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
