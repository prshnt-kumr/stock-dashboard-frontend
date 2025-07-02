// utils/formatters.js - Data formatting utilities

import { format, parseISO, isValid, formatDistanceToNow } from 'date-fns';

// ============================================================================
// NUMBER FORMATTING
// ============================================================================

/**
 * Format currency values
 */
export const formatCurrency = (value, currency = 'INR', locale = 'en-IN') => {
    if (value === null || value === undefined || isNaN(value)) return '—';

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: value < 1 ? 4 : 2,
        maximumFractionDigits: value < 1 ? 4 : 2,
    }).format(value);
};

/**
 * Format large numbers with appropriate suffixes (K, M, B, T)
 */
export const formatLargeNumber = (value, decimals = 1) => {
    if (value === null || value === undefined || isNaN(value)) return '—';

    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    if (absValue >= 1e12) {
        return `${sign}${(absValue / 1e12).toFixed(decimals)}T`;
    } else if (absValue >= 1e9) {
        return `${sign}${(absValue / 1e9).toFixed(decimals)}B`;
    } else if (absValue >= 1e6) {
        return `${sign}${(absValue / 1e6).toFixed(decimals)}M`;
    } else if (absValue >= 1e3) {
        return `${sign}${(absValue / 1e3).toFixed(decimals)}K`;
    } else {
        return `${sign}${absValue.toFixed(decimals)}`;
    }
};

/**
 * Format percentage values
 */
export const formatPercentage = (value, decimals = 2, showSign = true) => {
    if (value === null || value === undefined || isNaN(value)) return '—';

    const sign = showSign && value > 0 ? '+' : '';
    return `${sign}${value.toFixed(decimals)}%`;
};

/**
 * Format numbers with commas
 */
export const formatNumber = (value, decimals = 0) => {
    if (value === null || value === undefined || isNaN(value)) return '—';

    return value.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};

/**
 * Format market cap values
 */
export const formatMarketCap = (value, currency = '₹') => {
    if (value === null || value === undefined || isNaN(value)) return '—';

    if (value >= 1e11) { // 100B+
        return `${currency}${(value / 1e11).toFixed(1)} Lakh Cr`;
    } else if (value >= 1e9) { // 1B+
        return `${currency}${(value / 1e7).toFixed(0)} Cr`;
    } else if (value >= 1e7) { // 10M+
        return `${currency}${(value / 1e7).toFixed(1)} Cr`;
    } else {
        return `${currency}${(value / 1e5).toFixed(1)} L`;
    }
};

/**
 * Format volume numbers
 */
export const formatVolume = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '—';

    if (value >= 1e7) { // 10M+
        return `${(value / 1e7).toFixed(1)}Cr`;
    } else if (value >= 1e5) { // 100K+
        return `${(value / 1e5).toFixed(1)}L`;
    } else if (value >= 1e3) { // 1K+
        return `${(value / 1e3).toFixed(1)}K`;
    } else {
        return value.toString();
    }
};

// ============================================================================
// DATE & TIME FORMATTING
// ============================================================================

/**
 * Format date strings
 */
export const formatDate = (dateString, formatString = 'MMM dd, yyyy') => {
    if (!dateString) return '—';

    try {
        const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
        if (!isValid(date)) return '—';

        return format(date, formatString);
    } catch (error) {
        console.warn('Error formatting date:', error);
        return '—';
    }
};

/**
 * Format time strings
 */
export const formatTime = (dateString, formatString = 'HH:mm:ss') => {
    if (!dateString) return '—';

    try {
        const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
        if (!isValid(date)) return '—';

        return format(date, formatString);
    } catch (error) {
        console.warn('Error formatting time:', error);
        return '—';
    }
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString) => {
    if (!dateString) return '—';

    try {
        const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
        if (!isValid(date)) return '—';

        return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
        console.warn('Error formatting relative time:', error);
        return '—';
    }
};

/**
 * Format timestamp for display
 */
export const formatTimestamp = (timestamp, includeTime = true) => {
    if (!timestamp) return '—';

    try {
        const date = new Date(timestamp);
        if (!isValid(date)) return '—';

        const dateFormat = includeTime ? 'MMM dd, yyyy HH:mm' : 'MMM dd, yyyy';
        return format(date, dateFormat);
    } catch (error) {
        console.warn('Error formatting timestamp:', error);
        return '—';
    }
};

// ============================================================================
// STOCK-SPECIFIC FORMATTING
// ============================================================================

/**
 * Format ticker symbols
 */
export const formatTicker = (ticker) => {
    if (!ticker) return '—';
    return ticker.toUpperCase().replace('.NS', '');
};

/**
 * Format stock price with appropriate precision
 */
export const formatStockPrice = (price, currency = '₹') => {
    if (price === null || price === undefined || isNaN(price)) return '—';

    const decimals = price < 10 ? 3 : price < 100 ? 2 : 2;
    return `${currency}${price.toFixed(decimals)}`;
};

/**
 * Format price change with color coding
 */
export const formatPriceChange = (change, changePercent = null, showCurrency = true) => {
    if (change === null || change === undefined || isNaN(change)) return { text: '—', color: 'gray' };

    const currency = showCurrency ? '₹' : '';
    const sign = change > 0 ? '+' : '';
    const color = change > 0 ? 'green' : change < 0 ? 'red' : 'gray';

    let text = `${sign}${currency}${Math.abs(change).toFixed(2)}`;

    if (changePercent !== null && !isNaN(changePercent)) {
        text += ` (${sign}${changePercent.toFixed(2)}%)`;
    }

    return { text, color };
};

/**
 * Format technical indicator values
 */
export const formatTechnicalIndicator = (value, type) => {
    if (value === null || value === undefined || isNaN(value)) return '—';

    switch (type) {
        case 'rsi':
        case 'stochastic':
            return `${value.toFixed(1)}`;
        case 'macd':
        case 'momentum':
            return value.toFixed(3);
        case 'ratio':
        case 'multiplier':
            return value.toFixed(2);
        case 'price':
            return formatStockPrice(value);
        case 'percentage':
            return formatPercentage(value);
        default:
            return value.toFixed(2);
    }
};

/**
 * Format fundamental ratios
 */
export const formatFundamentalRatio = (value, type) => {
    if (value === null || value === undefined || isNaN(value)) return '—';

    switch (type) {
        case 'pe':
        case 'pb':
        case 'ps':
            return value.toFixed(1);
        case 'roe':
        case 'roa':
        case 'margin':
            return formatPercentage(value);
        case 'debt_ratio':
        case 'current_ratio':
            return value.toFixed(2);
        case 'market_cap':
            return formatMarketCap(value);
        case 'revenue':
        case 'profit':
            return formatLargeNumber(value);
        default:
            return value.toFixed(2);
    }
};

/**
 * Format sentiment scores
 */
export const formatSentiment = (score, includeLabel = true) => {
    if (score === null || score === undefined || isNaN(score)) return '—';

    const value = score.toFixed(3);

    if (!includeLabel) return value;

    let label;
    if (score > 0.3) label = 'Bullish';
    else if (score > 0.1) label = 'Slightly Bullish';
    else if (score > -0.1) label = 'Neutral';
    else if (score > -0.3) label = 'Slightly Bearish';
    else label = 'Bearish';

    return `${value} (${label})`;
};

/**
 * Format confidence scores
 */
export const formatConfidence = (confidence) => {
    if (confidence === null || confidence === undefined || isNaN(confidence)) return '—';

    const percentage = (confidence * 100).toFixed(1);
    let label;

    if (confidence > 0.8) label = 'Very High';
    else if (confidence > 0.6) label = 'High';
    else if (confidence > 0.4) label = 'Medium';
    else if (confidence > 0.2) label = 'Low';
    else label = 'Very Low';

    return `${percentage}% (${label})`;
};

// ============================================================================
// ML & PREDICTION FORMATTING
// ============================================================================

/**
 * Format ML signals
 */
export const formatSignal = (signal) => {
    if (!signal) return { text: '—', color: 'gray' };

    const signalMap = {
        'BUY': { text: 'BUY', color: 'green' },
        'SELL': { text: 'SELL', color: 'red' },
        'HOLD': { text: 'HOLD', color: 'yellow' },
        'STRONG_BUY': { text: 'STRONG BUY', color: 'green' },
        'STRONG_SELL': { text: 'STRONG SELL', color: 'red' }
    };

    return signalMap[signal.toUpperCase()] || { text: signal, color: 'gray' };
};

/**
 * Format risk scores
 */
export const formatRiskScore = (risk) => {
    if (risk === null || risk === undefined || isNaN(risk)) return '—';

    const percentage = (risk * 100).toFixed(1);
    let label;

    if (risk > 0.7) label = 'Very High';
    else if (risk > 0.5) label = 'High';
    else if (risk > 0.3) label = 'Medium';
    else if (risk > 0.1) label = 'Low';
    else label = 'Very Low';

    return `${percentage}% (${label})`;
};

/**
 * Format model accuracy
 */
export const formatAccuracy = (accuracy) => {
    if (accuracy === null || accuracy === undefined || isNaN(accuracy)) return '—';

    const percentage = (accuracy * 100).toFixed(1);
    let grade;

    if (accuracy > 0.9) grade = 'A+';
    else if (accuracy > 0.8) grade = 'A';
    else if (accuracy > 0.7) grade = 'B';
    else if (accuracy > 0.6) grade = 'C';
    else grade = 'D';

    return `${percentage}% (${grade})`;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Truncate long text
 */
export const truncateText = (text, maxLength = 50, suffix = '...') => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Capitalize first letter of each word
 */
export const capitalize = (text) => {
    if (!text) return '';
    return text.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

/**
 * Format API error messages
 */
export const formatError = (error) => {
    if (!error) return 'Unknown error occurred';

    if (typeof error === 'string') return error;

    if (error.message) return error.message;

    if (error.error) return error.error;

    return 'An unexpected error occurred';
};

/**
 * Format data freshness indicator
 */
export const formatDataFreshness = (timestamp) => {
    if (!timestamp) return { text: 'Unknown', color: 'gray', status: 'unknown' };

    try {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMinutes = (now - date) / (1000 * 60);

        if (diffMinutes < 5) {
            return { text: 'Very Fresh', color: 'green', status: 'very_fresh' };
        } else if (diffMinutes < 30) {
            return { text: 'Fresh', color: 'green', status: 'fresh' };
        } else if (diffMinutes < 180) { // 3 hours
            return { text: 'Acceptable', color: 'yellow', status: 'acceptable' };
        } else {
            return { text: 'Stale', color: 'red', status: 'stale' };
        }
    } catch (error) {
        return { text: 'Unknown', color: 'gray', status: 'unknown' };
    }
};

/**
 * Format health status
 */
export const formatHealthStatus = (status) => {
    const statusMap = {
        'healthy': { text: 'Healthy', color: 'green', icon: '✅' },
        'warning': { text: 'Warning', color: 'yellow', icon: '⚠️' },
        'error': { text: 'Error', color: 'red', icon: '❌' },
        'unknown': { text: 'Unknown', color: 'gray', icon: '❓' }
    };

    return statusMap[status] || statusMap['unknown'];
};

/**
 * Format chart data for display
 */
export const formatChartData = (data, xKey, yKey, formatY = null) => {
    if (!Array.isArray(data)) return [];

    return data.map(item => ({
        ...item,
        [xKey]: formatDate(item[xKey], 'MMM dd'),
        [yKey]: formatY ? formatY(item[yKey]) : item[yKey]
    }));
};

// ============================================================================
// EXPORT DEFAULT OBJECT
// ============================================================================

export default {
    // Number formatting
    formatCurrency,
    formatLargeNumber,
    formatPercentage,
    formatNumber,
    formatMarketCap,
    formatVolume,

    // Date & time formatting
    formatDate,
    formatTime,
    formatRelativeTime,
    formatTimestamp,

    // Stock-specific formatting
    formatTicker,
    formatStockPrice,
    formatPriceChange,
    formatTechnicalIndicator,
    formatFundamentalRatio,
    formatSentiment,
    formatConfidence,

    // ML & prediction formatting
    formatSignal,
    formatRiskScore,
    formatAccuracy,

    // Utility functions
    truncateText,
    capitalize,
    formatError,
    formatDataFreshness,
    formatHealthStatus,
    formatChartData
};