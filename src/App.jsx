import { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthProvider from './contexts/auth/AuthProvider';
import AppRoutes from './routes/AppRouter';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Suspense
                fallback={
                    <div className="min-h-screen flex items-center justify-center bg-gray-100">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                }
            >
                <AppRoutes />
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </Suspense>
        </AuthProvider>
    );
}

export default App;