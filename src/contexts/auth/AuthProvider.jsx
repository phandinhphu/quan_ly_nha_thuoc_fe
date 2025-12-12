import { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import AuthContext from './Context';
import authService from '../../services/authService';

const getInitialAuthState = () => {
    try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
            const parsedUser = JSON.parse(storedUser);
            return {
                token: storedToken,
                user: parsedUser,
                isAuthenticated: true,
            };
        }
    } catch (error) {
        console.error('Error parsing stored auth:', error);
    }
    
    return {
        token: null,
        user: null,
        isAuthenticated: false,
    };
};

const AuthProvider = ({ children }) => {
    const initialState = useMemo(() => getInitialAuthState(), []);
    const [user, setUser] = useState(initialState.user);
    const [token, setToken] = useState(initialState.token);
    const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuthenticated);
    const loading = false; // Auth state is initialized synchronously

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const currentUser = await authService.getCurrentUser();
                console.log('Fetched current user:', currentUser);
                localStorage.setItem('user', JSON.stringify(currentUser.data));
                setUser(currentUser.data);
            } catch (error) {
                console.error('Failed to fetch current user:', error);
            }
        };

        if (token) {
            fetchCurrentUser();
        }
    }, [token]);

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            
            // Lưu token và user info
            const { token: authToken } = response.data;
            localStorage.setItem('token', authToken);
            document.cookie = `token=${authToken}; path=/; max-age=${7 * 24 * 60 * 60}`;

            setToken(authToken);
            setIsAuthenticated(true);

            toast.success('Đăng nhập thành công!');
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Đăng nhập thất bại!');
            return { success: false, error };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            
            // Lưu token và user info
            const { token: authToken } = response.data;
            localStorage.setItem('token', authToken);
            document.cookie = `token=${authToken}; path=/; max-age=${7 * 24 * 60 * 60}`;

            setToken(authToken);
            setIsAuthenticated(true);

            toast.success('Đăng ký thành công!');
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Đăng ký thất bại!');
            return { success: false, error };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        document.cookie = 'token=; path=/; max-age=0';

        setToken(null);
        setUser(null);
        setIsAuthenticated(false);

        toast.info('Đã đăng xuất');
    };

    const value = {
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
        register,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;