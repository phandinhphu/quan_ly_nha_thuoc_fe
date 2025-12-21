import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Pill, User, Lock, Mail, Phone, MapPin, Calendar, ArrowRight } from 'lucide-react';
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
        <div className="fixed inset-0 overflow-y-auto bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-700">
            {/* Decorative background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-48 -right-48 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute left-1/2 top-1/3 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
            </div>

            <div className="relative min-h-full flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
                <div className="w-full max-w-4xl space-y-8">
                {/* Logo and Title */}
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-white/95 rounded-2xl shadow-2xl flex items-center justify-center transform hover:scale-110 transition-transform">
                            <Pill className="w-12 h-12 text-indigo-600" />
                        </div>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
                        Tạo tài khoản mới
                    </h2>
                    <p className="text-indigo-100/90 text-base sm:text-lg">
                        Đăng ký để tham gia hệ thống quản lý nhà thuốc
                    </p>
                </div>

                {/* Register Form */}
                <div className="bg-white/95 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-lg ring-1 ring-white/10">
                    <div className="mb-6">
                        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                            <User className="h-4 w-4" />
                            Đăng ký
                        </div>
                    </div>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                            {/* Tên đăng nhập */}
                            <div>
                                <label htmlFor="tenDangNhap" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tên đăng nhập *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        id="tenDangNhap"
                                        name="tenDangNhap"
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="Nhập tên đăng nhập"
                                        value={formData.tenDangNhap}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Mật khẩu */}
                            <div>
                                <label htmlFor="matKhau" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Mật khẩu *
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        id="matKhau"
                                        name="matKhau"
                                        type="password"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="Nhập mật khẩu"
                                        value={formData.matKhau}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Mã nhân viên */}
                            <div>
                                <label htmlFor="maNV" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Mã nhân viên *
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        id="maNV"
                                        name="maNV"
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="Nhập mã nhân viên"
                                        value={formData.maNV}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Họ tên */}
                            <div>
                                <label htmlFor="hoTen" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Họ và tên *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        id="hoTen"
                                        name="hoTen"
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="Nhập họ và tên"
                                        value={formData.hoTen}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Giới tính */}
                            <div>
                                <label htmlFor="gioiTinh" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Giới tính *
                                </label>
                                <select
                                    id="gioiTinh"
                                    name="gioiTinh"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                                    value={formData.gioiTinh}
                                    onChange={handleChange}
                                >
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>

                            {/* Ngày sinh */}
                            <div>
                                <label htmlFor="ngaySinh" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Ngày sinh *
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        id="ngaySinh"
                                        name="ngaySinh"
                                        type="date"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        value={formData.ngaySinh}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Số điện thoại */}
                            <div>
                                <label htmlFor="soDienThoai" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Số điện thoại *
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        id="soDienThoai"
                                        name="soDienThoai"
                                        type="tel"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="Nhập số điện thoại"
                                        value={formData.soDienThoai}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Vai trò */}
                            <div>
                                <label htmlFor="vaiTro" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Vai trò *
                                </label>
                                <select
                                    id="vaiTro"
                                    name="vaiTro"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                                    value={formData.vaiTro}
                                    onChange={handleChange}
                                >
                                    <option value="STAFF">Nhân viên</option>
                                    <option value="MANAGER">Quản lý</option>
                                    <option value="ADMIN">Quản trị</option>
                                </select>
                            </div>

                            {/* Địa chỉ */}
                            <div className="md:col-span-2">
                                <label htmlFor="diaChi" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Địa chỉ *
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                    <textarea
                                        id="diaChi"
                                        name="diaChi"
                                        rows="3"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                                        placeholder="Nhập địa chỉ chi tiết"
                                        value={formData.diaChi}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Đang đăng ký...
                                </div>
                            ) : (
                                <>
                                    Đăng ký tài khoản
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Hoặc</span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <Link
                                to="/login"
                                className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
                            >
                                Đã có tài khoản? <span className="underline">Đăng nhập ngay</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-indigo-200">
                    © 2024 PMA System. All rights reserved.
                </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
