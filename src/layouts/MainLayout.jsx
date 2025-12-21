import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/auth';
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
    ChevronDown,
    Bell,
    Search,
    Settings,
    User,
    ShoppingBag
} from 'lucide-react';

const MainLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navigation = [
        { name: 'Trang chủ', href: '/', icon: Home },
        { 
            name: 'Quản lý thuốc', 
            icon: Pill,
            children: [
                { name: 'Danh sách thuốc', href: '/drugs' },
                { name: 'Loại thuốc', href: '/drug-categories' },
                { name: 'Đơn vị tính', href: '/drug-units' },
            ]
        },
        { 
            name: 'Kho & Tồn kho', 
            icon: Warehouse,
            children: [
                { name: 'Quản lý kho', href: '/warehouses' },
                { name: 'Cảnh báo tồn kho', href: '/stock-alerts' },
                { name: 'Lịch sử tồn kho', href: '/inventory-history' },
            ]
        },
        { 
            name: 'Nhà cung cấp', 
            icon: Users,
            children: [
                { name: 'Danh sách NCC', href: '/suppliers' },
                { name: 'Phiếu nhập', href: '/receipts' },
            ]
        },
    ];

    const [expandedMenus, setExpandedMenus] = useState({});

    const toggleMenu = (name) => {
        setExpandedMenus(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    const isPathActive = (href) => {
        return location.pathname === href;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-30 w-64 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
                style={{ background: 'linear-gradient(180deg, rgb(79, 70, 229) 0%, rgb(147, 51, 234) 50%, rgb(79, 70, 229) 100%)' }}
            >
                <div className="flex items-center justify-between h-20 px-6 bg-black bg-opacity-20 backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
                            <Pill className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">PMA System</h1>
                            <p className="text-xs text-indigo-200">Pharmacy Management</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="mt-6 px-3 space-y-1 overflow-y-auto h-[calc(100vh-120px)] pb-6">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        if (item.children) {
                            const isExpanded = expandedMenus[item.name];
                            const hasActiveChild = item.children.some(child => isPathActive(child.href));
                            return (
                                <div key={item.name}>
                                    <button
                                        onClick={() => toggleMenu(item.name)}
                                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                                            hasActiveChild
                                                ? 'bg-white bg-opacity-90 text-gray-900 shadow-lg'
                                                : 'text-indigo-100 hover:bg-white hover:bg-opacity-10 hover:text-gray-900'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <Icon className="mr-3 h-5 w-5" />
                                            {item.name}
                                        </div>
                                        <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                    </button>
                                    {isExpanded && (
                                        <div className="mt-2 ml-4 space-y-1 animate-slide-in">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.name}
                                                    to={child.href}
                                                    onClick={() => setSidebarOpen(false)}
                                                    className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all ${
                                                        isPathActive(child.href)
                                                            ? 'bg-white text-gray-900 font-medium shadow-md'
                                                            : 'text-indigo-100 hover:bg-white hover:bg-opacity-10 hover:text-gray-900'
                                                    }`}
                                                >
                                                    <div className="w-2 h-2 rounded-full bg-current mr-3"></div>
                                                    {child.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }
                        const isActive = isPathActive(item.href);
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                                    isActive
                                        ? 'bg-white bg-opacity-90 text-gray-900 shadow-lg'
                                        : 'text-indigo-100 hover:bg-white hover:bg-opacity-10 hover:text-gray-900'
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
                <div className="sticky top-0 z-10 flex h-16 bg-white shadow-md backdrop-blur-lg bg-opacity-95">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors lg:hidden"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex-1 px-6 flex justify-between items-center">
                        <div className="flex-1 flex items-center max-w-md">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                                />
                            </div>
                        </div>
                        
                        <div className="ml-4 flex items-center space-x-4">
                            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold shadow-md" style={{ background: 'linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(168, 85, 247) 100%)' }}>
                                        {user?.hoTen?.charAt(0) || 'U'}
                                    </div>
                                    <div className="text-left hidden md:block">
                                        <p className="text-sm font-medium text-gray-700">{user?.hoTen}</p>
                                        <p className="text-xs text-gray-500">{user?.vaiTro}</p>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                </button>
                                
                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 animate-fade-in">
                                        <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            <User className="mr-3 h-4 w-4" />
                                            Tài khoản
                                        </button>
                                        <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            <Settings className="mr-3 h-4 w-4" />
                                            Cài đặt
                                        </button>
                                        <hr className="my-1" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="mr-3 h-4 w-4" />
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="p-6">
                    <div className="animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
