import { useState, useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../../contexts/auth/Context';
import { 
    Home, 
    Pill, 
    Package, 
    Warehouse, 
    Users, 
    FileText, 
    AlertTriangle,
    LogOut,
    Menu,
    X,
    ShoppingCart,
    ChevronDown,
    ChevronRight,
    FilePlus,
    History
} from 'lucide-react';

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navigation = [
        { name: 'Trang chủ', href: '/', icon: Home },
        { name: 'Quản lý thuốc', href: '/drugs', icon: Pill },
        { name: 'Loại thuốc', href: '/drug-categories', icon: Package },
        { name: 'Đơn vị tính', href: '/drug-units', icon: FileText },
        { name: 'Kho', href: '/warehouses', icon: Warehouse },
        { name: 'Cảnh báo tồn kho', href: '/stock-alerts', icon: AlertTriangle },
        { name: 'Lịch sử tồn kho', href: '/inventory-history', icon: FileText },
        { name: 'Nhà cung cấp', href: '/suppliers', icon: Users },
        { name: 'Phiếu nhập', href: '/receipts', icon: FileText },
        { name: 'Tạo đơn thuốc', href: '/sales/create', icon: FilePlus },
        { name: 'Lich sử đơn thuốc', href: '/sales/history', icon: History },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-indigo-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between h-16 px-4 bg-indigo-800">
                    <h1 className="text-xl font-bold text-white">PMA System</h1>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="mt-8 px-4 space-y-2">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                    isActive
                                        ? 'bg-indigo-700 text-white'
                                        : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                                }`}
                            >
                                <Icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <div className="sticky top-0 z-10 flex h-16 bg-white border-b border-gray-200 shadow-sm">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="px-4 text-gray-500 lg:hidden"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex-1 px-4 flex justify-between items-center">
                        <div className="flex-1 flex">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Hệ thống Quản lý Nhà thuốc
                            </h2>
                        </div>
                        <div className="ml-4 flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-700">{user.hoTen}</p>
                                <p className="text-xs text-gray-500">{user.vaiTro}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
