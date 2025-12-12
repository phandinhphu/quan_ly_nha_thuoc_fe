import { createContext } from 'react';

const AuthContext = createContext({
    user: null,
    token: null,
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
    register: () => {},
});

export default AuthContext;