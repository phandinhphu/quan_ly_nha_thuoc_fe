import { lazy } from 'react';
import MainLayout from '../layouts/MainLayout';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const DrugList = lazy(() => import('../pages/drugs/DrugList'));
const DrugCategories = lazy(() => import('../pages/drugs/DrugCategories'));
const DrugUnits = lazy(() => import('../pages/drugs/DrugUnits'));
const Warehouses = lazy(() => import('../pages/inventory/Warehouses'));
const StockAlerts = lazy(() => import('../pages/inventory/StockAlerts'));
const InventoryHistory = lazy(() => import('../pages/inventory/InventoryHistory'));
const Suppliers = lazy(() => import('../pages/suppliers/Suppliers'));
const Receipts = lazy(() => import('../pages/suppliers/Receipts'));
const CreateInvoice = lazy(() => import('../pages/sales/CreateInvoice'));
const InvoiceList = lazy(() => import('../pages/sales/InvoiceList'));
const ReportPage = lazy(() => import('../pages/reports/ReportPage'));

const privateRoutes = [
    { path: '/', component: Dashboard, layout: MainLayout, requiresAuth: true },
    { path: '/drugs', component: DrugList, layout: MainLayout, requiresAuth: true },
    { path: '/drug-categories', component: DrugCategories, layout: MainLayout, requiresAuth: true },
    { path: '/drug-units', component: DrugUnits, layout: MainLayout, requiresAuth: true },
    { path: '/warehouses', component: Warehouses, layout: MainLayout, requiresAuth: true },
    { path: '/stock-alerts', component: StockAlerts, layout: MainLayout, requiresAuth: true },
    { path: '/inventory-history', component: InventoryHistory, layout: MainLayout, requiresAuth: true },
    { path: '/suppliers', component: Suppliers, layout: MainLayout, requiresAuth: true },
    { path: '/receipts', component: Receipts, layout: MainLayout, requiresAuth: true },
    { path: '/sales/create', component: CreateInvoice, layout: MainLayout, requiresAuth: true },
    { path: '/sales/history', component: InvoiceList, layout: MainLayout, requiresAuth: true },
    { path: '/reports', component: ReportPage, layout: MainLayout, requiresAuth: true}
];

export default privateRoutes;
