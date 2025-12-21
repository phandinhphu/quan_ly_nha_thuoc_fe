import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Pill, Lock, User, ArrowRight } from 'lucide-react';
import AuthContext from '../../contexts/auth/Context';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        tenDangNhap: '',
        matKhau: '',
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

        const result = await login(formData);
        
        if (result.success) {
            console.log('Login successful, navigating to home page');
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
                <div className="absolute left-1/2 top-1/3 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
            </div>

            <div className="relative min-h-full flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                {/* Logo and Title */}
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-white/95 rounded-2xl shadow-2xl flex items-center justify-center transform hover:scale-110 transition-transform">
                            <Pill className="w-12 h-12 text-indigo-600" />
                        </div>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
                        Chào mừng trở lại
                    </h2>
                    <p className="text-indigo-100/90 text-base sm:text-lg">
                        Hệ thống Quản lý Nhà thuốc
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white/95 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-lg ring-1 ring-white/10">
                    <div className="mb-6">
                        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                            <Lock className="h-4 w-4" />
                            Đăng nhập
                        </div>
                    </div>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="tenDangNhap" className="block text-sm font-semibold text-gray-700 mb-2">
                                Tên đăng nhập
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

                        <div>
                            <label htmlFor="matKhau" className="block text-sm font-semibold text-gray-700 mb-2">
                                Mật khẩu
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

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Ghi nhớ đăng nhập
                                </label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Quên mật khẩu?
                                </a>
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
                                    Đang đăng nhập...
                                </div>
                            ) : (
                                <>
                                    Đăng nhập
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
                                to="/register"
                                className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
                            >
                                Chưa có tài khoản? <span className="underline">Đăng ký ngay</span>
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

export default Login;
