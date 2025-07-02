import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { RefreshCw, TrendingUp, TrendingDown, AlertCircle, Activity, Database, Zap } from 'lucide-react';

// Main Dashboard Component
const StockDashboard = () => {
    const [selectedStock, setSelectedStock] = useState('RELIANCE.NS');
    const [stockData, setStockData] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [marketOverview, setMarketOverview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [serviceHealth, setServiceHealth] = useState({});

    // API Configuration - Replace with your actual Azure Function URLs
    const API_CONFIG = {
        PRICE_SERVICE: 'https://your-price-service.azurewebsites.net/api',
        TECHNICAL_SERVICE: 'https://your-technical-service.azurewebsites.net/api',
        FUNDAMENTAL_SERVICE: 'https://your-fundamental-service.azurewebsites.net/api',
        NEWS_SERVICE: 'https://your-news-service.azurewebsites.net/api',
        SOCIAL_SERVICE: 'https://your-social-service.azurewebsites.net/api',
        ORCHESTRATOR_SERVICE: 'https://your-orchestrator-service.azurewebsites.net/api',
        ML_SERVICE: 'https://your-ml-service.azurewebsites.net/api'
    };

    // Popular Indian stocks for quick selection
    const popularStocks = [
        'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'HINDUNILVR.NS',
        'ICICIBANK.NS', 'KOTAKBANK.NS', 'LT.NS', 'SBIN.NS', 'BHARTIARTL.NS'
    ];

    // Mock data for demonstration (replace with actual API calls)
    const mockStockData = {
        ticker: selectedStock,
        currentPrice: 2547.30,
        change: +15.40,
        changePercent: +0.61,
        volume: 2547890,
        marketCap: '17,25,000 Cr',
        technical: {
            rsi: 68.5,
            macd: 12.4,
            sma20: 2530.50,
            sma50: 2485.20,
            bollinger: { upper: 2580, lower: 2480, position: 0.75 }
        },
        fundamental: {
            peRatio: 24.8,
            pbRatio: 2.1,
            roe: 12.8,
            debtToEquity: 0.45,
            marketCap: 1725000
        },
        sentiment: {
            news: 0.25,
            social: 0.15,
            overall: 0.20,
            confidence: 0.78
        },
        priceHistory: [
            { date: '2025-01-01', price: 2485, volume: 1200000 },
            { date: '2025-01-02', price: 2502, volume: 1350000 },
            { date: '2025-01-03', price: 2487, volume: 980000 },
            { date: '2025-01-04', price: 2521, volume: 1650000 },
            { date: '2025-01-05', price: 2534, volume: 1480000 },
            { date: '2025-01-06', price: 2547, volume: 2547890 }
        ]
    };

    const mockPredictions = [
        {
            ticker: 'RELIANCE.NS',
            signal: 'BUY',
            confidence: 0.85,
            targetPrice: 2650,
            timeframe: '1 week',
            predictedReturn: 4.1,
            riskScore: 0.3
        },
        {
            ticker: 'TCS.NS',
            signal: 'HOLD',
            confidence: 0.72,
            targetPrice: 4120,
            timeframe: '1 week',
            predictedReturn: 1.2,
            riskScore: 0.2
        },
        {
            ticker: 'HDFCBANK.NS',
            signal: 'BUY',
            confidence: 0.79,
            targetPrice: 1785,
            timeframe: '1 week',
            predictedReturn: 3.8,
            riskScore: 0.25
        }
    ];

    const mockServiceHealth = {
        price: { status: 'healthy', lastUpdate: '2 mins ago', uptime: '99.9%' },
        technical: { status: 'healthy', lastUpdate: '1 min ago', uptime: '99.8%' },
        fundamental: { status: 'warning', lastUpdate: '15 mins ago', uptime: '98.5%' },
        news: { status: 'healthy', lastUpdate: '3 mins ago', uptime: '99.7%' },
        social: { status: 'healthy', lastUpdate: '5 mins ago', uptime: '99.6%' },
        orchestrator: { status: 'healthy', lastUpdate: '1 min ago', uptime: '99.9%' },
        ml: { status: 'healthy', lastUpdate: '2 mins ago', uptime: '99.4%' }
    };

    // Fetch data from services
    const fetchStockData = async (ticker) => {
        setLoading(true);
        try {
            // In a real implementation, you would call your actual APIs
            // Example API calls:

            // const priceResponse = await fetch(`${API_CONFIG.PRICE_SERVICE}/price-data?ticker=${ticker}`);
            // const technicalResponse = await fetch(`${API_CONFIG.TECHNICAL_SERVICE}/technical-analysis?ticker=${ticker}`);
            // const fundamentalResponse = await fetch(`${API_CONFIG.FUNDAMENTAL_SERVICE}/fundamental-data?ticker=${ticker}`);
            // const newsResponse = await fetch(`${API_CONFIG.NEWS_SERVICE}/news-sentiment?ticker=${ticker}`);
            // const socialResponse = await fetch(`${API_CONFIG.SOCIAL_SERVICE}/social-sentiment?ticker=${ticker}`);

            // For now, using mock data
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
            setStockData(mockStockData);
            setLastUpdate(new Date().toLocaleTimeString());
        } catch (error) {
            console.error('Error fetching stock data:', error);
        }
        setLoading(false);
    };

    const fetchPredictions = async () => {
        try {
            // const response = await fetch(`${API_CONFIG.ML_SERVICE}/latest-predictions?limit=5`);
            // const data = await response.json();
            setPredictions(mockPredictions);
        } catch (error) {
            console.error('Error fetching predictions:', error);
        }
    };

    const fetchServiceHealth = async () => {
        try {
            // const healthResponse = await fetch(`${API_CONFIG.ORCHESTRATOR_SERVICE}/health-check`);
            setServiceHealth(mockServiceHealth);
        } catch (error) {
            console.error('Error fetching service health:', error);
        }
    };

    useEffect(() => {
        fetchStockData(selectedStock);
        fetchPredictions();
        fetchServiceHealth();

        // Set up auto-refresh every 30 seconds
        const interval = setInterval(() => {
            fetchStockData(selectedStock);
            fetchServiceHealth();
        }, 30000);

        return () => clearInterval(interval);
    }, [selectedStock]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'healthy': return 'text-green-500';
            case 'warning': return 'text-yellow-500';
            case 'error': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const getSignalColor = (signal) => {
        switch (signal) {
            case 'BUY': return 'text-green-600 bg-green-100';
            case 'SELL': return 'text-red-600 bg-red-100';
            case 'HOLD': return 'text-yellow-600 bg-yellow-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Stock Analysis Dashboard</h1>
                        <p className="text-gray-600">Real-time market data & ML predictions</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        {lastUpdate && (
                            <span className="text-sm text-gray-500">
                                Last updated: {lastUpdate}
                            </span>
                        )}
                        <button
                            onClick={() => fetchStockData(selectedStock)}
                            disabled={loading}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Stock Selector */}
                <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">Select Stock:</label>
                    <select
                        value={selectedStock}
                        onChange={(e) => setSelectedStock(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {popularStocks.map(stock => (
                            <option key={stock} value={stock}>{stock}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Service Health Status */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Microservice Health</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {Object.entries(serviceHealth).map(([service, health]) => (
                        <div key={service} className="bg-white p-3 rounded-lg shadow-sm border">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-gray-600 uppercase">{service}</span>
                                <div className={`w-2 h-2 rounded-full ${health.status === 'healthy' ? 'bg-green-500' : health.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                            </div>
                            <div className="text-xs text-gray-500">{health.lastUpdate}</div>
                            <div className="text-xs text-gray-400">{health.uptime} uptime</div>
                        </div>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : stockData ? (
                <>
                    {/* Main Stock Info */}
                    <div className="mb-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{stockData.ticker}</h2>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <span className="text-3xl font-bold text-gray-900">₹{stockData.currentPrice.toLocaleString()}</span>
                                        <span className={`flex items-center text-lg font-semibold ${stockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {stockData.change >= 0 ? <TrendingUp className="h-5 w-5 mr-1" /> : <TrendingDown className="h-5 w-5 mr-1" />}
                                            {stockData.change >= 0 ? '+' : ''}{stockData.change} ({stockData.changePercent >= 0 ? '+' : ''}{stockData.changePercent}%)
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-600">Volume</div>
                                    <div className="text-lg font-semibold">{stockData.volume.toLocaleString()}</div>
                                    <div className="text-sm text-gray-600 mt-2">Market Cap</div>
                                    <div className="text-lg font-semibold">{stockData.marketCap}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts and Analysis */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Price Chart */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">Price Movement</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={stockData.priceHistory}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Technical Indicators */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">Technical Analysis</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">RSI (14)</span>
                                    <span className={`font-semibold ${stockData.technical.rsi > 70 ? 'text-red-600' : stockData.technical.rsi < 30 ? 'text-green-600' : 'text-gray-900'}`}>
                                        {stockData.technical.rsi}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">MACD</span>
                                    <span className={`font-semibold ${stockData.technical.macd > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {stockData.technical.macd}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">SMA 20</span>
                                    <span className="font-semibold">₹{stockData.technical.sma20.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">SMA 50</span>
                                    <span className="font-semibold">₹{stockData.technical.sma50.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">BB Position</span>
                                    <span className="font-semibold">{(stockData.technical.bollinger.position * 100).toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fundamental & Sentiment Analysis */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Fundamental Analysis */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">Fundamental Analysis</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">P/E Ratio</span>
                                    <span className="font-semibold">{stockData.fundamental.peRatio}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">P/B Ratio</span>
                                    <span className="font-semibold">{stockData.fundamental.pbRatio}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">ROE (%)</span>
                                    <span className="font-semibold">{stockData.fundamental.roe}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Debt/Equity</span>
                                    <span className="font-semibold">{stockData.fundamental.debtToEquity}</span>
                                </div>
                            </div>
                        </div>

                        {/* Sentiment Analysis */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">Sentiment Analysis</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">News Sentiment</span>
                                    <span className={`font-semibold ${stockData.sentiment.news > 0 ? 'text-green-600' : stockData.sentiment.news < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                        {stockData.sentiment.news > 0 ? '+' : ''}{(stockData.sentiment.news * 100).toFixed(1)}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Social Sentiment</span>
                                    <span className={`font-semibold ${stockData.sentiment.social > 0 ? 'text-green-600' : stockData.sentiment.social < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                        {stockData.sentiment.social > 0 ? '+' : ''}{(stockData.sentiment.social * 100).toFixed(1)}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Overall Sentiment</span>
                                    <span className={`font-semibold ${stockData.sentiment.overall > 0 ? 'text-green-600' : stockData.sentiment.overall < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                        {stockData.sentiment.overall > 0 ? '+' : ''}{(stockData.sentiment.overall * 100).toFixed(1)}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Confidence</span>
                                    <span className="font-semibold">{(stockData.sentiment.confidence * 100).toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}

            {/* ML Predictions */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Top ML Predictions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {predictions.map((prediction, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-gray-900">{prediction.ticker}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSignalColor(prediction.signal)}`}>
                                    {prediction.signal}
                                </span>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Confidence:</span>
                                    <span className="font-medium">{(prediction.confidence * 100).toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Target:</span>
                                    <span className="font-medium">₹{prediction.targetPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Expected Return:</span>
                                    <span className={`font-medium ${prediction.predictedReturn > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {prediction.predictedReturn > 0 ? '+' : ''}{prediction.predictedReturn.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Risk Score:</span>
                                    <span className="font-medium">{(prediction.riskScore * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-gray-500 text-sm">
                <p>Powered by 7 Microservices | Real-time data & ML predictions</p>
            </div>
        </div>
    );
};

export default StockDashboard;