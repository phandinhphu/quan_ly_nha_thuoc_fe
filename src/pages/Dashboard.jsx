import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pill, Package, Warehouse, Users, AlertTriangle, TrendingUp } from 'lucide-react';
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
            icon: Pill,
            color: 'bg-blue-500',
            link: '/drugs',
        },
        {
            title: 'Thuốc sắp hết hàng',
            value: stats.lowStockDrugs,
            icon: AlertTriangle,
            color: 'bg-orange-500',
            link: '/drugs?filter=low-stock',
        },
        {
            title: 'Thuốc sắp hết hạn',
            value: stats.expiringDrugs,
            icon: TrendingUp,
            color: 'bg-red-500',
            link: '/drugs?filter=expiring',
        },
        {
            title: 'Nhà cung cấp',
            value: stats.totalSuppliers,
            icon: Users,
            color: 'bg-green-500',
            link: '/suppliers',
        },
        {
            title: 'Kho',
            value: stats.totalWarehouses,
            icon: Warehouse,
            color: 'bg-purple-500',
            link: '/warehouses',
        },
        {
            title: 'Cảnh báo tồn kho',
            value: stats.lowStockAlerts,
            icon: Package,
            color: 'bg-yellow-500',
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
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-gray-600">Tổng quan hệ thống quản lý nhà thuốc</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            key={card.title}
                            to={card.link}
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
                                </div>
                                <div className={`${card.color} p-3 rounded-lg`}>
                                    <Icon className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Cảnh báo quan trọng</h3>
                    <div className="space-y-3">
                        {stats.lowStockDrugs > 0 && (
                            <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-orange-500 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {stats.lowStockDrugs} thuốc sắp hết hàng
                                    </p>
                                    <Link to="/drugs?filter=low-stock" className="text-xs text-orange-600 hover:text-orange-700">
                                        Xem chi tiết →
                                    </Link>
                                </div>
                            </div>
                        )}
                        {stats.expiringDrugs > 0 && (
                            <div className="flex items-center p-3 bg-red-50 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-red-500 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {stats.expiringDrugs} thuốc sắp hết hạn
                                    </p>
                                    <Link to="/drugs?filter=expiring" className="text-xs text-red-600 hover:text-red-700">
                                        Xem chi tiết →
                                    </Link>
                                </div>
                            </div>
                        )}
                        {stats.lowStockAlerts > 0 && (
                            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                                <Package className="h-5 w-5 text-yellow-500 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {stats.lowStockAlerts} cảnh báo tồn kho
                                    </p>
                                    <Link to="/stock-alerts" className="text-xs text-yellow-600 hover:text-yellow-700">
                                        Xem chi tiết →
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Truy cập nhanh</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <Link
                            to="/drugs"
                            className="flex items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            <Pill className="h-6 w-6 text-blue-600 mr-2" />
                            <span className="text-sm font-medium text-blue-900">Quản lý thuốc</span>
                        </Link>
                        <Link
                            to="/receipts"
                            className="flex items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                        >
                            <Package className="h-6 w-6 text-green-600 mr-2" />
                            <span className="text-sm font-medium text-green-900">Phiếu nhập</span>
                        </Link>
                        <Link
                            to="/warehouses"
                            className="flex items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                            <Warehouse className="h-6 w-6 text-purple-600 mr-2" />
                            <span className="text-sm font-medium text-purple-900">Kho</span>
                        </Link>
                        <Link
                            to="/suppliers"
                            className="flex items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                            <Users className="h-6 w-6 text-indigo-600 mr-2" />
                            <span className="text-sm font-medium text-indigo-900">Nhà cung cấp</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
