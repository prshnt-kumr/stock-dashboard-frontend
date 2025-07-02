import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Activity, Database, AlertCircle, CheckCircle, Clock, Zap, RefreshCw, Settings, TrendingUp, Users, Server } from 'lucide-react';

const AdminPanel = () => {
    const [serviceHealth, setServiceHealth] = useState({});
    const [systemMetrics, setSystemMetrics] = useState(null);
    const [mlPerformance, setMLPerformance] = useState(null);
    const [activeAlerts, setActiveAlerts] = useState([]);
    const [jobLogs, setJobLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [selectedService, setSelectedService] = useState('all');

    // Mock data for demonstration
    const mockServiceHealth = {
        price: {
            status: 'healthy',
            uptime: '99.9%',
            lastUpdate: '2 mins ago',
            responseTime: '145ms',
            requestCount: 2847,
            errorRate: '0.1%',
            version: 'v2.1.0'
        },
        technical: {
            status: 'healthy',
            uptime: '99.8%',
            lastUpdate: '1 min ago',
            responseTime: '230ms',
            requestCount: 1923,
            errorRate: '0.2%',
            version: 'v2.0.3'
        },
        fundamental: {
            status: 'warning',
            uptime: '98.5%',
            lastUpdate: '15 mins ago',
            responseTime: '890ms',
            requestCount: 456,
            errorRate: '2.1%',
            version: 'v1.9.2'
        },
        news: {
            status: 'healthy',
            uptime: '99.7%',
            lastUpdate: '3 mins ago',
            responseTime: '320ms',
            requestCount: 1564,
            errorRate: '0.3%',
            version: 'v2.0.1'
        },
        social: {
            status: 'healthy',
            uptime: '99.6%',
            lastUpdate: '5 mins ago',
            responseTime: '445ms',
            requestCount: 987,
            errorRate: '0.4%',
            version: 'v1.8.9'
        },
        orchestrator: {
            status: 'healthy',
            uptime: '99.9%',
            lastUpdate: '1 min ago',
            responseTime: '89ms',
            requestCount: 3452,
            errorRate: '0.1%',
            version: 'v3.0.0'
        },
        ml: {
            status: 'healthy',
            uptime: '99.4%',
            lastUpdate: '2 mins ago',
            responseTime: '1230ms',
            requestCount: 234,
            errorRate: '0.8%',
            version: 'v5.0.0'
        }
    };

    const mockSystemMetrics = {
        totalRequests: 145623,
        successRate: 99.2,
        avgResponseTime: 387,
        dataFreshness: 95.8,
        dailyStats: [
            { date: '2025-01-01', requests: 12450, errors: 45, avgResponse: 342 },
            { date: '2025-01-02', requests: 13201, errors: 52, avgResponse: 356 },
            { date: '2025-01-03', requests: 11987, errors: 38, avgResponse: 329 },
            { date: '2025-01-04', requests: 14532, errors: 67, avgResponse: 401 },
            { date: '2025-01-05', requests: 15401, errors: 71, avgResponse: 423 },
            { date: '2025-01-06', requests: 16234, errors: 89, avgResponse: 445 }
        ]
    };

    const mockMLPerformance = {
        overallAccuracy: 78.5,
        directionAccuracy: 82.3,
        predictionsMade: 1247,
        modelsActive: 3,
        lastTraining: '2025-01-05T10:30:00Z',
        modelPerformance: [
            { model: 'Direction Predictor', accuracy: 82.3, predictions: 567 },
            { model: 'Return Predictor', accuracy: 74.1, predictions: 445 },
            { model: 'Signal Classifier', accuracy: 79.8, predictions: 235 }
        ],
        accuracyTrend: [
            { date: '2024-12-30', accuracy: 76.2 },
            { date: '2024-12-31', accuracy: 77.8 },
            { date: '2025-01-01', accuracy: 79.1 },
            { date: '2025-01-02', accuracy: 78.9 },
            { date: '2025-01-03', accuracy: 80.2 },
            { date: '2025-01-04', accuracy: 79.5 },
            { date: '2025-01-05', accuracy: 78.5 }
        ]
    };

    const mockActiveAlerts = [
        {
            id: 1,
            severity: 'warning',
            service: 'fundamental',
            message: 'Response time above threshold (890ms)',
            timestamp: '2025-01-06T14:25:00Z',
            status: 'active'
        },
        {
            id: 2,
            severity: 'info',
            service: 'ml',
            message: 'Model retraining scheduled for tonight',
            timestamp: '2025-01-06T13:45:00Z',
            status: 'active'
        },
        {
            id: 3,
            severity: 'error',
            service: 'news',
            message: 'NewsAPI rate limit approached (90% usage)',
            timestamp: '2025-01-06T12:15:00Z',
            status: 'resolved'
        }
    ];

    const mockJobLogs = [
        {
            id: 1,
            service: 'orchestrator',
            job: 'Daily Data Orchestration',
            status: 'completed',
            startTime: '2025-01-06T06:00:00Z',
            endTime: '2025-01-06T06:15:23Z',
            duration: '15m 23s',
            stocksProcessed: 100,
            successRate: 98
        },
        {
            id: 2,
            service: 'ml',
            job: 'ML Prediction Generation',
            status: 'running',
            startTime: '2025-01-06T14:30:00Z',
            endTime: null,
            duration: '5m 12s',
            stocksProcessed: 45,
            successRate: 100
        },
        {
            id: 3,
            service: 'price',
            job: 'Price Data Update',
            status: 'completed',
            startTime: '2025-01-06T14:00:00Z',
            endTime: '2025-01-06T14:05:45Z',
            duration: '5m 45s',
            stocksProcessed: 100,
            successRate: 100
        },
        {
            id: 4,
            service: 'technical',
            job: 'Technical Analysis Update',
            status: 'completed',
            startTime: '2025-01-06T13:30:00Z',
            endTime: '2025-01-06T13:42:18Z',
            duration: '12m 18s',
            stocksProcessed: 100,
            successRate: 97
        }
    ];

    // Fetch system data
    const fetchSystemData = async () => {
        setLoading(true);
        try {
            // In real implementation, these would be actual API calls
            await new Promise(resolve => setTimeout(resolve, 1000));

            setServiceHealth(mockServiceHealth);
            setSystemMetrics(mockSystemMetrics);
            setMLPerformance(mockMLPerformance);
            setActiveAlerts(mockActiveAlerts);
            setJobLogs(mockJobLogs);
            setLastUpdate(new Date().toLocaleTimeString());
        } catch (error) {
            console.error('Error fetching system data:', error);
        }
        setLoading(false);
    };

    // Trigger service operations
    const triggerOperation = async (operation, service = null) => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            alert(`${operation} ${service ? `for ${service}` : ''} triggered successfully!`);
            fetchSystemData(); // Refresh data
        } catch (error) {
            console.error('Error triggering operation:', error);
            alert('Operation failed. Please try again.');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSystemData();

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchSystemData, 30000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'healthy': return 'text-green-500 bg-green-100';
            case 'warning': return 'text-yellow-500 bg-yellow-100';
            case 'error': return 'text-red-500 bg-red-100';
            default: return 'text-gray-500 bg-gray-100';
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'info': return 'text-blue-500 bg-blue-100';
            case 'warning': return 'text-yellow-500 bg-yellow-100';
            case 'error': return 'text-red-500 bg-red-100';
            default: return 'text-gray-500 bg-gray-100';
        }
    };

    const getJobStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-600 bg-green-100';
            case 'running': return 'text-blue-600 bg-blue-100';
            case 'failed': return 'text-red-600 bg-red-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6B7280'];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">System Administration</h1>
                        <p className="text-gray-600">Microservice monitoring & management dashboard</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        {lastUpdate && (
                            <span className="text-sm text-gray-500">
                                Last updated: {lastUpdate}
                            </span>
                        )}
                        <button
                            onClick={fetchSystemData}
                            disabled={loading}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Service Filter */}
                <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">Filter by service:</label>
                    <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All Services</option>
                        <option value="price">Price Service</option>
                        <option value="technical">Technical Service</option>
                        <option value="fundamental">Fundamental Service</option>
                        <option value="news">News Service</option>
                        <option value="social">Social Service</option>
                        <option value="orchestrator">Orchestrator</option>
                        <option value="ml">ML Service</option>
                    </select>
                </div>
            </div>

            {/* System Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Requests</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {systemMetrics?.totalRequests?.toLocaleString() || '0'}
                            </p>
                        </div>
                        <Activity className="h-8 w-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Success Rate</p>
                            <p className="text-2xl font-bold text-green-600">
                                {systemMetrics?.successRate || 0}%
                            </p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {systemMetrics?.avgResponseTime || 0}ms
                            </p>
                        </div>
                        <Clock className="h-8 w-8 text-yellow-500" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">ML Accuracy</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {mlPerformance?.overallAccuracy || 0}%
                            </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Service Health Matrix */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Service Health Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                    {Object.entries(serviceHealth).map(([service, health]) => (
                        <div key={service} className="bg-white p-4 rounded-lg shadow-sm border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-900 capitalize">{service}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(health.status)}`}>
                                    {health.status}
                                </span>
                            </div>
                            <div className="space-y-1 text-xs text-gray-600">
                                <div className="flex justify-between">
                                    <span>Uptime:</span>
                                    <span className="font-medium">{health.uptime}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Response:</span>
                                    <span className="font-medium">{health.responseTime}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Requests:</span>
                                    <span className="font-medium">{health.requestCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Error Rate:</span>
                                    <span className="font-medium">{health.errorRate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Version:</span>
                                    <span className="font-medium">{health.version}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* System Metrics Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Daily Request Volume</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={systemMetrics?.dailyStats || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="requests" stroke="#2563eb" strokeWidth={2} name="Requests" />
                            <Line type="monotone" dataKey="errors" stroke="#dc2626" strokeWidth={2} name="Errors" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* ML Performance Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">ML Accuracy Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={mlPerformance?.accuracyTrend || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[70, 85]} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} name="Accuracy %" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Active Alerts */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Active Alerts</h2>
                    <span className="text-sm text-gray-500">
                        {activeAlerts.filter(alert => alert.status === 'active').length} active alerts
                    </span>
                </div>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-200">
                        {activeAlerts.slice(0, 5).map((alert) => (
                            <div key={alert.id} className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                                            {alert.severity}
                                        </span>
                                        <span className="text-sm font-medium text-gray-900">{alert.service}</span>
                                        <span className="text-sm text-gray-600">{alert.message}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-gray-500">
                                            {new Date(alert.timestamp).toLocaleString()}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${alert.status === 'active' ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'}`}>
                                            {alert.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Job Logs */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Recent Job Executions</h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => triggerOperation('Orchestrate All Services')}
                            disabled={loading}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                        >
                            <Zap className="h-4 w-4 inline mr-1" />
                            Run Orchestration
                        </button>
                        <button
                            onClick={() => triggerOperation('Train ML Models')}
                            disabled={loading}
                            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm"
                        >
                            Train Models
                        </button>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processed</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Started</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {jobLogs.map((job) => (
                                    <tr key={job.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                                            {job.service}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {job.job}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getJobStatusColor(job.status)}`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {job.duration}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {job.stocksProcessed} stocks
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {job.successRate}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {new Date(job.startTime).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <button
                        onClick={() => triggerOperation('Update All Prices')}
                        disabled={loading}
                        className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                        <Database className="h-5 w-5 mr-2" />
                        Update Prices
                    </button>
                    <button
                        onClick={() => triggerOperation('Update Technical Data')}
                        disabled={loading}
                        className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Activity className="h-5 w-5 mr-2" />
                        Update Technical
                    </button>
                    <button
                        onClick={() => triggerOperation('Update News Sentiment')}
                        disabled={loading}
                        className="flex items-center justify-center px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                    >
                        <Users className="h-5 w-5 mr-2" />
                        Update News
                    </button>
                    <button
                        onClick={() => triggerOperation('Generate Predictions')}
                        disabled={loading}
                        className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Predict
                    </button>
                    <button
                        onClick={() => triggerOperation('Health Check All')}
                        disabled={loading}
                        className="flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Health Check
                    </button>
                    <button
                        onClick={() => triggerOperation('Clear Cache')}
                        disabled={loading}
                        className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                        <RefreshCw className="h-5 w-5 mr-2" />
                        Clear Cache
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;