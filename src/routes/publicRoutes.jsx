import { lazy } from 'react';
import DefaultLayout from '../layouts/DefaultLayout';

const LoginPage = lazy(() => import('../pages/auth/Login'));
const RegisterPage = lazy(() => import('../pages/auth/Register'));

const publicRoutes = [
    { path: '/login', component: LoginPage, layout: DefaultLayout, requiresAuth: false },
    { path: '/register', component: RegisterPage, layout: DefaultLayout, requiresAuth: false },
];

export default publicRoutes;