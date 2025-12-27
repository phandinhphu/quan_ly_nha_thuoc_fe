import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Pill,
    Warehouse,
    Users,
    AlertTriangle,
    TrendingUp,
    ShoppingCart,
    Activity
} from 'lucide-react';

import drugService from '../services/drugService';
import supplierService from '../services/supplierService';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalDrugs: 0,
        lowStockDrugs: 0,
        expiringDrugs: 0,
        totalSuppliers: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [drugs, lowStock, expiring, suppliers] = await Promise.all([
                drugService.getDrugs(),
                drugService.getLowStockDrugs(10),
                drugService.getExpiringDrugs(30),
                supplierService.getSuppliers(),
            ]);

            setStats({
                totalDrugs: drugs.data.length,
                lowStockDrugs: lowStock.data.length,
                expiringDrugs: expiring.data.length,
                totalSuppliers: suppliers.data.length,
            });
        } catch (error) {
            console.error('Dashboard error:', error);
        } finally {
            setLoading(false);
        }
    };

    const cards = [
        {
            title: 'Tổng số thuốc',
            value: stats.totalDrugs,
            subtitle: 'Mặt hàng đang kinh doanh',
            icon: Pill,
            bg: 'bg-blue-50',
            iconColor: 'text-blue-600',
            link: '/drugs',
        },
        {
            title: 'Thuốc sắp hết',
            value: stats.lowStockDrugs,
            subtitle: 'Dưới ngưỡng tồn kho',
            icon: Warehouse,
            bg: 'bg-yellow-50',
            iconColor: 'text-yellow-600',
            link: '/stock-alerts',
        },
        {
            title: 'Thuốc sắp hết hạn',
            value: stats.expiringDrugs,
            subtitle: 'Trong 30 ngày',
            icon: AlertTriangle,
            bg: 'bg-red-50',
            iconColor: 'text-red-600',
            link: '/stock-alerts',
        },
        {
            title: 'Nhà cung cấp',
            value: stats.totalSuppliers,
            subtitle: 'Đang hợp tác',
            icon: Users,
            bg: 'bg-green-50',
            iconColor: 'text-green-600',
            link: '/suppliers',
        },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-10 w-10 border-b-2 border-indigo-600 rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">
                Tổng quan hệ thống
            </h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            key={card.title}
                            to={card.link}
                            className={`${card.bg} rounded-2xl p-6 hover:shadow-md transition`}
                        >
                            <div className="flex flex-col items-center text-center">
                                <Icon className={`h-10 w-10 mb-3 ${card.iconColor}`} />
                                <p className="text-3xl font-bold">{card.value}</p>
                                <p className="font-medium text-gray-700">
                                    {card.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {card.subtitle}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-lg mb-2">
                        Doanh thu theo ngày
                    </h3>
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        <Activity className="h-16 w-16 mb-2" />
                        <p>Biểu đồ doanh thu</p>
                    </div>
                </div>

                {/* Product Structure */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-lg mb-2">
                        Cơ cấu bán hàng
                    </h3>
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        <TrendingUp className="h-16 w-16 mb-2" />
                        <p>Biểu đồ nhóm thuốc</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6"> 
                <h3 className="text-lg font-bold text-gray-800 mb-4">Truy cập nhanh</h3> 
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4"> 
                    <Link to="/drugs" className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group" > 
                        <Pill className="h-8 w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" /> 
                        <span className="text-sm font-medium text-gray-700">Thuốc</span> 
                    </Link> 
                    <Link to="/warehouses" className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group" > 
                        <Warehouse className="h-8 w-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" /> 
                        <span className="text-sm font-medium text-gray-700">Kho</span> 
                    </Link> 
                    <Link to="/suppliers" className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group" > 
                        <Users className="h-8 w-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" /> 
                        <span className="text-sm font-medium text-gray-700">NCC</span> 
                    </Link> 
                    <Link to="/stock-alerts" className="flex flex-col items-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors group" > 
                        <AlertTriangle className="h-8 w-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" /> 
                        <span className="text-sm font-medium text-gray-700">Cảnh báo</span> 
                    </Link> 
                </div> 
            </div>
        </div>
    );
};

export default Dashboard;
