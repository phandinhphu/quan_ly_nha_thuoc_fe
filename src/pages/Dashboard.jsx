import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, subDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
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
import reportService from '../services/reportService';
import { useAuth } from '../hooks/auth';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalDrugs: 0,
        lowStockDrugs: 0,
        expiringDrugs: 0,
        totalSuppliers: 0,
    });

    const [revenueData, setRevenueData] = useState([]);
    const [productMixData, setProductMixData] = useState([]);

    const [loading, setLoading] = useState(true);

    const { user } = useAuth();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const requests = [
                drugService.getDrugs(),
                supplierService.getSuppliers(),
            ];

            if (user && user.role === 'ADMIN') {
                requests.push(drugService.getLowStockDrugs(10));
                requests.push(drugService.getExpiringDrugs(30));
            }

            const [drugs, suppliers, lowStock, expiring] = await Promise.all(requests);

            setStats({
                totalDrugs: drugs.data.length,
                lowStockDrugs: lowStock ? lowStock.data.length : 0,
                expiringDrugs: expiring ? expiring.data.length : 0,
                totalSuppliers: suppliers.data.length,
            });
            // lay doanh thu 7 ngay gan nhat
            const sevenDayReports = await fetchRevenueChartData();
            processCategoryData(sevenDayReports, drugs.data);
        } catch (error) {
            console.error('Dashboard error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRevenueChartData = async () => {
        const daysToFetch = 7;
        const promises = [];
        const dateList = [];

        for (let i = daysToFetch - 1; i >= 0; i--) {
            const date = subDays(new Date(), i);
            const dateString = format(date, 'yyyy-MM-dd');
            const displayDate = format(date, 'dd/MM');
            dateList.push({ dateString, displayDate });
            promises.push(reportService.getSummary(dateString));
        }

        const responses = await Promise.all(promises);

        // Xử lý dữ liệu cho biểu đồ Cột (Doanh thu)
        const revenueChartData = responses.map((res, index) => ({
            name: dateList[index].displayDate,
            revenue: res.totalRevenue || 0,
        }));
        setRevenueData(revenueChartData);

        // Trả về responses thô để dùng cho biểu đồ Tròn
        return responses; 
    };

    const processCategoryData = (reports, allDrugs) => {
        const drugMap = {};
        allDrugs.forEach(drug => {
            drugMap[drug.maThuoc] = drug; 
        });

        const categoryMap = {};

        reports.forEach(report => {
            if (report.topSellingDrugs) {
                report.topSellingDrugs.forEach(soldDrug => {
                    const drugInfo = drugMap[soldDrug.maThuoc];
                    
                    const categoryName = drugInfo ? drugInfo.tenLoai : 'Khác';

                    if (!categoryMap[categoryName]) {
                        categoryMap[categoryName] = 0;
                    }
                    
                    // Tính doanh thu = Số lượng (từ report) * Giá bán (từ thông tin thuốc)
                    const price = drugInfo ? drugInfo.giaBan : 0;
                    const quantity = soldDrug.soLuongDaBan || 0;
                    const estimatedRevenue = quantity * price;

                    categoryMap[categoryName] += estimatedRevenue;
                });
            }
        });

        // Chuyển đổi sang định dạng cho Recharts
        const chartData = Object.keys(categoryMap).map(key => ({
            name: key,
            value: categoryMap[key]
        })).filter(item => item.value > 0);

        setProductMixData(chartData);
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
            link: '/drugs',
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
                    <h3 className="font-bold text-lg mb-4">
                        Doanh thu 7 ngày qua
                    </h3>
                    <div className="h-64 w-full">
                        {/* Biểu đồ Recharts */}
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    dy={10}
                                />
                                <Tooltip 
                                    formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
                                    cursor={{ fill: '#f3f4f6' }}
                                />
                                <Bar 
                                    dataKey="revenue" 
                                    name="Doanh thu"
                                    fill="#4f46e5" 
                                    radius={[4, 4, 0, 0]} 
                                    barSize={30}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Product Structure */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-lg mb-4">
                        Cơ cấu doanh thu theo nhóm (7 ngày)
                    </h3>
                    <div className="h-64 w-full">
                        {/* Kiểm tra nếu có dữ liệu thì vẽ, không thì hiện thông báo */}
                        {productMixData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={productMixData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        nameKey="name"
                                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                            const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                            const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                            return (
                                                <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
                                                    {`${(percent * 100).toFixed(0)}%`}
                                                </text>
                                            );
                                        }}
                                    >
                                        {productMixData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)} />
                                    <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '12px' }}/>
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-400 flex-col">
                                <TrendingUp className="h-12 w-12 mb-2 opacity-50" />
                                <p>Chưa có dữ liệu bán hàng</p>
                            </div>
                        )}
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
