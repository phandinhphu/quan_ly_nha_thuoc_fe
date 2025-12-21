import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pill, Package, Warehouse, Users, AlertTriangle, TrendingUp, ShoppingCart, Activity } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';
import drugService from '../services/drugService';
import inventoryService from '../services/inventoryService';
import supplierService from '../services/supplierService';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalDrugs: 0,
        lowStockDrugs: 0,
        expiringDrugs: 0,
        totalSuppliers: 0,
        totalWarehouses: 0,
        lowStockAlerts: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [
                drugs,
                lowStock,
                expiring,
                suppliers,
                warehouses,
                alerts
            ] = await Promise.all([
                drugService.getDrugs(),
                drugService.getLowStockDrugs(10),
                drugService.getExpiringDrugs(30),
                supplierService.getSuppliers(),
                inventoryService.getWarehouses(),
                inventoryService.getLowStockAlerts(),
            ]);

            setStats({
                totalDrugs: drugs.length,
                lowStockDrugs: lowStock.length,
                expiringDrugs: expiring.length,
                totalSuppliers: suppliers.length,
                totalWarehouses: warehouses.length,
                lowStockAlerts: alerts.length,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const cards = [
        {
            title: 'Tổng số thuốc',
            value: stats.totalDrugs,
            subtitle: 'Weekly Sales',
            icon: Pill,
            bgColor: 'bg-blue-50',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            link: '/drugs',
        },
        {
            title: 'Người dùng mới',
            value: stats.totalSuppliers,
            subtitle: 'New Users',
            icon: Users,
            bgColor: 'bg-cyan-50',
            iconBg: 'bg-cyan-100',
            iconColor: 'text-cyan-600',
            link: '/suppliers',
        },
        {
            title: 'Đơn hàng mới',
            value: stats.lowStockAlerts,
            subtitle: 'New Orders',
            icon: ShoppingCart,
            bgColor: 'bg-yellow-50',
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
            link: '/receipts',
        },
        {
            title: 'Báo cáo lỗi',
            value: stats.expiringDrugs,
            subtitle: 'Bug Reports',
            icon: AlertTriangle,
            bgColor: 'bg-red-50',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            link: '/stock-alerts',
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
        <div className="space-y-6">
            {/* Welcome Message */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Hi, Welcome back</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            key={card.title}
                            to={card.link}
                            className={`${card.bgColor} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group`}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className={`${card.iconBg} w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon className={`h-8 w-8 ${card.iconColor}`} />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-800 mb-1">{card.value}</h3>
                                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Website Visits Chart */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Website Visits</h3>
                            <p className="text-sm text-gray-500">(+43%) than last year</p>
                        </div>
                    </div>
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <Activity className="h-16 w-16 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">Chart placeholder</p>
                        </div>
                    </div>
                </div>

                {/* Current Visits Pie Chart */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Current Visits</h3>
                    </div>
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <TrendingUp className="h-16 w-16 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">Pie chart placeholder</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Truy cập nhanh</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        to="/drugs"
                        className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
                    >
                        <Pill className="h-8 w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium text-gray-700">Thuốc</span>
                    </Link>
                    <Link
                        to="/warehouses"
                        className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
                    >
                        <Warehouse className="h-8 w-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium text-gray-700">Kho</span>
                    </Link>
                    <Link
                        to="/suppliers"
                        className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
                    >
                        <Users className="h-8 w-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium text-gray-700">NCC</span>
                    </Link>
                    <Link
                        to="/stock-alerts"
                        className="flex flex-col items-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors group"
                    >
                        <AlertTriangle className="h-8 w-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium text-gray-700">Cảnh báo</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
