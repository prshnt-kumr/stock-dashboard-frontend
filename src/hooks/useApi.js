// useApi.js - Custom React hooks for API integration

import { useState, useEffect, useCallback, useRef } from 'react';
import apiService from '../services/apiService';

// Generic API hook with caching and error handling
export const useApi = (apiCall, dependencies = [], options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const abortControllerRef = useRef(null);
    const cacheRef = useRef(new Map());

    const {
        enableCache = true,
        cacheTime = 5 * 60 * 1000, // 5 minutes
        retryCount = 3,
        retryDelay = 1000,
        onSuccess,
        onError,
        immediate = true
    } = options;

    const execute = useCallback(async (...args) => {
        // Create cache key
        const cacheKey = enableCache ? JSON.stringify([apiCall.name, ...args, ...dependencies]) : null;

        // Check cache first
        if (enableCache && cacheKey) {
            const cached = cacheRef.current.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < cacheTime) {
                setData(cached.data);
                setLastUpdated(cached.timestamp);
                return cached.data;
            }
        }

        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        setLoading(true);
        setError(null);

        let attempt = 0;
        while (attempt < retryCount) {
            try {
                const result = await apiCall(...args);

                if (result.success) {
                    setData(result.data);
                    setLastUpdated(Date.now());

                    // Cache the result
                    if (enableCache && cacheKey) {
                        cacheRef.current.set(cacheKey, {
                            data: result.data,
                            timestamp: Date.now()
                        });
                    }

                    if (onSuccess) onSuccess(result.data);
                    setLoading(false);
                    return result.data;
                } else {
                    throw new Error(result.error || 'API call failed');
                }
            } catch (err) {
                attempt++;
                if (attempt >= retryCount) {
                    setError(err.message);
                    if (onError) onError(err);
                    setLoading(false);
                    throw err;
                }
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
            }
        }
    }, [apiCall, dependencies, enableCache, cacheTime, retryCount, retryDelay, onSuccess, onError]);

    useEffect(() => {
        if (immediate) {
            execute();
        }

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, dependencies);

    return {
        data,
        loading,
        error,
        execute,
        lastUpdated,
        refresh: () => execute()
    };
};

// Specific hooks for each microservice

export const useStockPrice = (ticker, options = {}) => {
    return useApi(
        useCallback(() => apiService.getPriceData(ticker), [ticker]),
        [ticker],
        {
            enableCache: true,
            cacheTime: 2 * 60 * 1000, // 2 minutes for price data
            ...options
        }
    );
};

export const useTechnicalAnalysis = (ticker, options = {}) => {
    return useApi(
        useCallback(() => apiService.getTechnicalAnalysis(ticker), [ticker]),
        [ticker],
        {
            enableCache: true,
            cacheTime: 5 * 60 * 1000, // 5 minutes for technical data
            ...options
        }
    );
};

export const useFundamentalData = (ticker, options = {}) => {
    return useApi(
        useCallback(() => apiService.getFundamentalData(ticker), [ticker]),
        [ticker],
        {
            enableCache: true,
            cacheTime: 60 * 60 * 1000, // 1 hour for fundamental data
            ...options
        }
    );
};

export const useNewsSentiment = (ticker, options = {}) => {
    return useApi(
        useCallback(() => apiService.getNewsSentiment(ticker), [ticker]),
        [ticker],
        {
            enableCache: true,
            cacheTime: 10 * 60 * 1000, // 10 minutes for news data
            ...options
        }
    );
};

export const useSocialSentiment = (ticker, options = {}) => {
    return useApi(
        useCallback(() => apiService.getSocialSentiment(ticker), [ticker]),
        [ticker],
        {
            enableCache: true,
            cacheTime: 15 * 60 * 1000, // 15 minutes for social data
            ...options
        }
    );
};

export const useMLPrediction = (ticker, options = {}) => {
    return useApi(
        useCallback(() => apiService.getMLPrediction(ticker), [ticker]),
        [ticker],
        {
            enableCache: true,
            cacheTime: 30 * 60 * 1000, // 30 minutes for ML predictions
            ...options
        }
    );
};

// Complex data hooks

export const useCompleteStockAnalysis = (ticker, options = {}) => {
    return useApi(
        useCallback(() => apiService.getCompleteStockAnalysis(ticker), [ticker]),
        [ticker],
        {
            enableCache: true,
            cacheTime: 5 * 60 * 1000, // 5 minutes
            retryCount: 2, // Less retries for complex operations
            ...options
        }
    );
};

export const useServiceHealth = (options = {}) => {
    const [healthData, setHealthData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const checkHealth = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await apiService.checkServiceHealth();
            if (result.success) {
                setHealthData(result.data);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        checkHealth();

        // Auto-refresh health status every 30 seconds
        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    }, [checkHealth]);

    return {
        healthData,
        loading,
        error,
        refresh: checkHealth
    };
};

export const useLatestPredictions = (limit = 20, signal = null, minConfidence = 0, options = {}) => {
    return useApi(
        useCallback(() => apiService.getLatestPredictions(limit, signal, minConfidence), [limit, signal, minConfidence]),
        [limit, signal, minConfidence],
        {
            enableCache: true,
            cacheTime: 5 * 60 * 1000, // 5 minutes
            ...options
        }
    );
};

export const useMLPerformance = (options = {}) => {
    return useApi(
        useCallback(() => apiService.evaluateMLPerformance(), []),
        [],
        {
            enableCache: true,
            cacheTime: 10 * 60 * 1000, // 10 minutes
            immediate: false, // Don't load immediately
            ...options
        }
    );
};

export const usePredictionHistory = (ticker, daysBack = 30, includeAccuracy = true, options = {}) => {
    return useApi(
        useCallback(() => apiService.getPredictionHistory(ticker, daysBack, includeAccuracy), [ticker, daysBack, includeAccuracy]),
        [ticker, daysBack, includeAccuracy],
        {
            enableCache: true,
            cacheTime: 15 * 60 * 1000, // 15 minutes
            ...options
        }
    );
};

// Real-time data hook with WebSocket-like polling
export const useRealTimeData = (ticker, interval = 30000) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        let intervalId;
        let isActive = true;

        const fetchData = async () => {
            if (!isActive) return;

            setLoading(true);
            setError(null);

            try {
                const result = await apiService.getCompleteStockAnalysis(ticker);
                if (isActive && result.success) {
                    setData(result.data);
                    setIsConnected(true);
                } else if (isActive) {
                    setError(result.error);
                    setIsConnected(false);
                }
            } catch (err) {
                if (isActive) {
                    setError(err.message);
                    setIsConnected(false);
                }
            }

            if (isActive) {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchData();

        // Set up polling
        intervalId = setInterval(fetchData, interval);

        return () => {
            isActive = false;
            clearInterval(intervalId);
            setIsConnected(false);
        };
    }, [ticker, interval]);

    return {
        data,
        loading,
        error,
        isConnected
    };
};

// Batch operations hook
export const useBatchOperations = () => {
    const [operations, setOperations] = useState({});
    const [loading, setLoading] = useState(false);

    const executeOperation = useCallback(async (operationType, ...args) => {
        const operationId = `${operationType}_${Date.now()}`;

        setLoading(true);
        setOperations(prev => ({
            ...prev,
            [operationId]: { status: 'running', type: operationType, startTime: Date.now() }
        }));

        try {
            let result;

            switch (operationType) {
                case 'updateAllPrices':
                    result = await apiService.updateAllPrices();
                    break;
                case 'updateAllTechnical':
                    result = await apiService.updateAllTechnical();
                    break;
                case 'updateAllFundamental':
                    result = await apiService.updateAllFundamental();
                    break;
                case 'updateAllNews':
                    result = await apiService.updateAllNews();
                    break;
                case 'updateAllSocial':
                    result = await apiService.updateAllSocial();
                    break;
                case 'updateAllServices':
                    result = await apiService.updateAllServices();
                    break;
                case 'orchestrateAll':
                    result = await apiService.orchestrateAll();
                    break;
                case 'generateRecommendations':
                    result = await apiService.generateRecommendations();
                    break;
                case 'trainMLModels':
                    result = await apiService.trainModels(...args);
                    break;
                case 'getBatchPredictions':
                    result = await apiService.getBatchPredictions();
                    break;
                default:
                    throw new Error(`Unknown operation: ${operationType}`);
            }

            setOperations(prev => ({
                ...prev,
                [operationId]: {
                    ...prev[operationId],
                    status: result.success ? 'completed' : 'failed',
                    result,
                    endTime: Date.now()
                }
            }));

            return result;

        } catch (error) {
            setOperations(prev => ({
                ...prev,
                [operationId]: {
                    ...prev[operationId],
                    status: 'failed',
                    error: error.message,
                    endTime: Date.now()
                }
            }));
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearOperations = useCallback(() => {
        setOperations({});
    }, []);

    return {
        operations,
        loading,
        executeOperation,
        clearOperations
    };
};

// Local storage hook for persisting data
export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = useCallback((value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    const removeValue = useCallback(() => {
        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
        }
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue];
};

// Notification hook
export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((notification) => {
        const id = Date.now();
        const newNotification = {
            id,
            timestamp: new Date(),
            ...notification
        };

        setNotifications(prev => [...prev, newNotification]);

        // Auto-remove after delay if specified
        if (notification.duration) {
            setTimeout(() => {
                removeNotification(id);
            }, notification.duration);
        }

        return id;
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    return {
        notifications,
        addNotification,
        removeNotification,
        clearNotifications
    };
};

// Debug hook for development
export const useDebug = (value, label) => {
    useEffect(() => {
        if (process.env.REACT_APP_DEBUG_MODE === 'true') {
            console.log(`[DEBUG] ${label}:`, value);
        }
    }, [value, label]);
};

export default {
    useApi,
    useStockPrice,
    useTechnicalAnalysis,
    useFundamentalData,
    useNewsSentiment,
    useSocialSentiment,
    useMLPrediction,
    useCompleteStockAnalysis,
    useServiceHealth,
    useLatestPredictions,
    useMLPerformance,
    usePredictionHistory,
    useRealTimeData,
    useBatchOperations,
    useLocalStorage,
    useNotifications,
    useDebug
};