import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RouteGuard from './RouteGuard';
import publicRoutes from './publicRoutes';
import privateRoutes from './privateRoutes';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {publicRoutes.map((route, index) => {
                    const Page = route.component;
                    const Layout = route.layout;

                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <RouteGuard requiresAuth={route.requiresAuth}>
                                    <Layout>
                                        <Page />
                                    </Layout>
                                </RouteGuard>
                            }
                        />
                    );
                })}

                {privateRoutes.map((route, index) => {
                    const Page = route.component;
                    const Layout = route.layout;

                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <RouteGuard requiresAuth={route.requiresAuth}>
                                    <Layout>
                                        <Page />
                                    </Layout>
                                </RouteGuard>
                            }
                        />
                    );
                })}
            </Routes>
        </Router>
    );
};

export default AppRoutes;
