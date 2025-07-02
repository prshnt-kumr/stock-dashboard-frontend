// App.js - Main application component with routing and providers

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Toaster } from 'react-hot-toast';
import { Activity, BarChart3, Settings, Home, TrendingUp } from 'lucide-react';
import './App.css';

// Lazy load components for better performance
const StockDashboard = lazy(() => import('./components/Dashboard/StockDashboard'));
const AdminPanel = lazy(() => import('./components/Admin/AdminPanel'));
const ErrorBoundary = lazy(() => import('./components/Common/ErrorBoundary'));

// Create React Query client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: parseInt(process.env.REACT_APP_API_RETRY_COUNT) || 2,
            refetchOnWindowFocus: false,
            staleTime: parseInt(process.env.REACT_APP_CACHE_TIME) || 5 * 60 * 1000, // 5 minutes
            cacheTime: parseInt(process.env.REACT_APP_CACHE_TIME) || 10 * 60 * 1000, // 10 minutes
        },
        mutations: {
            retry: 1,
        },
    },
});

// Loading component
const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading Stock Analysis Dashboard...</p>
        </div>
    </div>
);

// Navigation component
const Navigation = () => {
    const isAdminEnabled = process.env.REACT_APP_ENABLE_ADMIN_PANEL !== 'false';

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <TrendingUp className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">Stock Analysis</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            to="/"
                            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                            <Home className="h-4 w-4 mr-2" />
                            Dashboard
                        </Link>

                        {isAdminEnabled && (
                            <Link
                                to="/admin"
                                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            >
                                <Settings className="h-4 w-4 mr-2" />
                                Admin
                            </Link>
                        )}

                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Activity className="h-3 w-3" />
                            <span>v{process.env.REACT_APP_VERSION || '1.0.0'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

// Footer component
const Footer = () => (
    <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Powered by 7 Microservices</span>
                    <span>•</span>
                    <span>Real-time ML Predictions</span>
                    <span>•</span>
                    <span>Built with React & Azure Functions</span>
                </div>

                <div className="flex items-center space-x-4 text-xs text-gray-400">
                    {process.env.REACT_APP_BUILD_ENV && (
                        <>
                            <span>Environment: {process.env.REACT_APP_BUILD_ENV}</span>
                            <span>•</span>
                        </>
                    )}
                    <span>Last Updated: {new Date().toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    </footer>
);

// Error fallback component
const ErrorFallback = ({ error, resetError }) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
            <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Activity className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Application Error
            </h2>
            <p className="text-gray-600 mb-4">
                Something went wrong while loading the application.
            </p>
            <details className="text-left bg-gray-100 p-3 rounded-lg mb-4">
                <summary className="font-medium cursor-pointer">Error Details</summary>
                <pre className="text-xs mt-2 overflow-auto">
                    {error?.message || 'Unknown error occurred'}
                </pre>
            </details>
            <button
                onClick={resetError}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Try Again
            </button>
        </div>
    </div>
);

// Main App component
function App() {
    const isDebugMode = process.env.REACT_APP_DEBUG_MODE === 'true';
    const isDevToolsEnabled = process.env.REACT_APP_ENABLE_DEVTOOLS === 'true';
    const isAdminEnabled = process.env.REACT_APP_ENABLE_ADMIN_PANEL !== 'false';

    // Log configuration in debug mode
    React.useEffect(() => {
        if (isDebugMode) {
            console.log('🚀 Stock Analysis Dashboard Configuration:');
            console.log('Debug Mode:', isDebugMode);
            console.log('Admin Panel:', isAdminEnabled);
            console.log('Version:', process.env.REACT_APP_VERSION);
            console.log('Build Environment:', process.env.REACT_APP_BUILD_ENV);
            console.log('API Endpoints:', {
                price: process.env.REACT_APP_PRICE_SERVICE_URL,
                technical: process.env.REACT_APP_TECHNICAL_SERVICE_URL,
                fundamental: process.env.REACT_APP_FUNDAMENTAL_SERVICE_URL,
                news: process.env.REACT_APP_NEWS_SERVICE_URL,
                social: process.env.REACT_APP_SOCIAL_SERVICE_URL,
                orchestrator: process.env.REACT_APP_ORCHESTRATOR_SERVICE_URL,
                ml: process.env.REACT_APP_ML_SERVICE_URL
            });
        }
    }, [isDebugMode, isAdminEnabled]);

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className="min-h-screen bg-gray-50 flex flex-col">
                    {/* Global Error Boundary */}
                    <ErrorBoundary fallback={ErrorFallback}>
                        {/* Navigation */}
                        <Navigation />

                        {/* Main Content */}
                        <main className="flex-1">
                            <Suspense fallback={<LoadingSpinner />}>
                                <Routes>
                                    {/* Dashboard Route */}
                                    <Route path="/" element={<StockDashboard />} />

                                    {/* Admin Panel Route (if enabled) */}
                                    {isAdminEnabled && (
                                        <Route path="/admin" element={<AdminPanel />} />
                                    )}

                                    {/* Stock Detail Route */}
                                    <Route path="/stock/:ticker" element={<StockDashboard />} />

                                    {/* Redirect any unknown routes to dashboard */}
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            </Suspense>
                        </main>

                        {/* Footer */}
                        <Footer />

                        {/* Toast Notifications */}
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 4000,
                                style: {
                                    background: '#363636',
                                    color: '#fff',
                                    fontSize: '14px',
                                },
                                success: {
                                    style: {
                                        background: '#10B981',
                                    },
                                },
                                error: {
                                    style: {
                                        background: '#EF4444',
                                    },
                                },
                                loading: {
                                    style: {
                                        background: '#3B82F6',
                                    },
                                },
                            }}
                        />

                        {/* React Query DevTools (only in development) */}
                        {isDevToolsEnabled && process.env.NODE_ENV === 'development' && (
                            <ReactQueryDevtools initialIsOpen={false} />
                        )}
                    </ErrorBoundary>
                </div>
            </Router>
        </QueryClientProvider>
    );
}

export default App;