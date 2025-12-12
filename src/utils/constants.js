const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// API Endpoints
export const API_ENDPOINTS = {
    // Auth Service
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        VERIFY: '/auth/verify',
        CURRENT_USER: '/auth/get/me',
    },
    // Drug Service
    DRUGS: {
        BASE: '/drugs',
        CATEGORIES: '/drugs/categories',
        UNITS: '/drugs/units',
        SEARCH: '/drugs/search',
        BY_CATEGORY: '/drugs/category',
        LOW_STOCK: '/drugs/low-stock',
        EXPIRING: '/drugs/expiring',
        UPDATE_STOCK: '/drugs',
    },
    // Inventory Service
    INVENTORY: {
        HISTORY: '/inventory-history',
        HISTORY_BY_DRUG: '/inventory-history/drug',
        RECENT: '/inventory-history/recent',
        DATE_RANGE: '/inventory-history/date-range',
    },
    WAREHOUSES: {
        BASE: '/warehouses',
    },
    STOCK_ALERTS: {
        BASE: '/stock-alerts',
        LOW_STOCK: '/stock-alerts/low-stock',
        BY_STATUS: '/stock-alerts/status',
        UPDATE_CURRENT: '/stock-alerts',
    },
    // Supplier Service
    SUPPLIERS: {
        BASE: '/suppliers',
        RECEIPTS: '/suppliers/receipts',
    },
};

// User Roles
export const USER_ROLES = {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    STAFF: 'STAFF',
};

// Stock Alert Status
export const STOCK_ALERT_STATUS = {
    NORMAL: 'BINH_THUONG',
    LOW: 'SAP_HET',
    OUT: 'HET_HANG',
};

export { API_URL };