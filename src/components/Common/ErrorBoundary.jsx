// ErrorBoundary.jsx - React Error Boundary for graceful error handling

import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            errorId: Date.now().toString(36) + Math.random().toString(36).substr(2)
        };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo
        });

        // Log to external error tracking service if available
        if (process.env.REACT_APP_ERROR_TRACKING_API_KEY) {
            this.logErrorToService(error, errorInfo);
        }
    }

    logErrorToService = (error, errorInfo) => {
        try {
            // Example: Send to external error tracking service
            const errorData = {
                message: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack,
                errorId: this.state.errorId,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href,
                version: process.env.REACT_APP_VERSION || 'unknown'
            };

            // You can replace this with your preferred error tracking service
            // Examples: Sentry, LogRocket, Bugsnag, etc.
            console.log('Error logged:', errorData);

        } catch (loggingError) {
            console.error('Failed to log error:', loggingError);
        }
    }

    handleRetry = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: null
        });
    }

    handleGoHome = () => {
        window.location.href = '/';
    }

    render() {
        if (this.state.hasError) {
            // Custom error UI based on props or default
            if (this.props.fallback) {
                return this.props.fallback(this.state.error, this.handleRetry);
            }

            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
                        {/* Error Icon */}
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>

                        {/* Error Title */}
                        <h1 className="text-xl font-semibold text-gray-900 mb-2">
                            Something went wrong
                        </h1>

                        {/* Error Description */}
                        <p className="text-gray-600 mb-6">
                            We're sorry, but something unexpected happened. The error has been logged and our team will investigate.
                        </p>

                        {/* Error ID */}
                        <div className="bg-gray-100 rounded-lg p-3 mb-6">
                            <p className="text-sm text-gray-600">Error ID:</p>
                            <p className="text-xs font-mono text-gray-800">{this.state.errorId}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={this.handleRetry}
                                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Try Again
                            </button>

                            <button
                                onClick={this.handleGoHome}
                                className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Go to Dashboard
                            </button>
                        </div>

                        {/* Debug Info (only in development) */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="cursor-pointer text-sm font-medium text-gray-700 flex items-center">
                                    <Bug className="w-4 h-4 mr-2" />
                                    Debug Information
                                </summary>
                                <div className="mt-3 p-3 bg-red-50 rounded-lg">
                                    <div className="mb-3">
                                        <h4 className="text-sm font-medium text-red-800">Error Message:</h4>
                                        <p className="text-xs text-red-700 font-mono break-all">
                                            {this.state.error.message}
                                        </p>
                                    </div>

                                    {this.state.error.stack && (
                                        <div className="mb-3">
                                            <h4 className="text-sm font-medium text-red-800">Stack Trace:</h4>
                                            <pre className="text-xs text-red-700 font-mono whitespace-pre-wrap break-all max-h-32 overflow-y-auto">
                                                {this.state.error.stack}
                                            </pre>
                                        </div>
                                    )}

                                    {this.state.errorInfo && this.state.errorInfo.componentStack && (
                                        <div>
                                            <h4 className="text-sm font-medium text-red-800">Component Stack:</h4>
                                            <pre className="text-xs text-red-700 font-mono whitespace-pre-wrap break-all max-h-32 overflow-y-auto">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </details>
                        )}

                        {/* Support Info */}
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500">
                                If this problem persists, please contact support with the error ID above.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;