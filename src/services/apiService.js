// apiService.js - Comprehensive API integration layer for all 7 microservices

class ApiService {
    constructor() {
        // Your Azure Function App URLs - Update these with your actual endpoints
        this.endpoints = {
            PRICE_SERVICE: process.env.REACT_APP_PRICE_SERVICE_URL || 'https://your-price-service.azurewebsites.net/api',
            TECHNICAL_SERVICE: process.env.REACT_APP_TECHNICAL_SERVICE_URL || 'https://your-technical-service.azurewebsites.net/api',
            FUNDAMENTAL_SERVICE: process.env.REACT_APP_FUNDAMENTAL_SERVICE_URL || 'https://your-fundamental-service.azurewebsites.net/api',
            NEWS_SERVICE: process.env.REACT_APP_NEWS_SERVICE_URL || 'https://your-news-service.azurewebsites.net/api',
            SOCIAL_SERVICE: process.env.REACT_APP_SOCIAL_SERVICE_URL || 'https://your-social-service.azurewebsites.net/api',
            ORCHESTRATOR_SERVICE: process.env.REACT_APP_ORCHESTRATOR_SERVICE_URL || 'https://your-orchestrator-service.azurewebsites.net/api',
            ML_SERVICE: process.env.REACT_APP_ML_SERVICE_URL || 'https://your-ml-service.azurewebsites.net/api'
        };

        this.defaultTimeout = parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000;
        this.isDebugMode = process.env.REACT_APP_DEBUG_MODE === 'true';
    }

    // Generic API request handler with error handling and retries
    async apiRequest(url, options = {}) {
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            timeout: this.defaultTimeout,
            ...options
        };

        if (this.isDebugMode) {
            console.log(`🔍 API Request: ${url}`, defaultOptions);
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), defaultOptions.timeout);

            const response = await fetch(url, {
                ...defaultOptions,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (this.isDebugMode) {
                console.log(`✅ API Response: ${url}`, data);
            }

            return {
                success: true,
                data,
                status: response.status,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error(`❌ API Error: ${url}`, error);

            return {
                success: false,
                error: error.message,
                status: error.name === 'AbortError' ? 'timeout' : 'error',
                timestamp: new Date().toISOString()
            };
        }
    }

    // ============================================================================
    // PRICE SERVICE METHODS
    // ============================================================================

    async getPriceData(ticker, force = false) {
        const url = `${this.endpoints.PRICE_SERVICE}/price-data`;
        const params = new URLSearchParams({
            ticker: ticker.toUpperCase(),
            ...(force && { force: 'true' })
        });

        return await this.apiRequest(`${url}?${params}`);
    }

    async getPriceHistory(ticker, days = 30) {
        const url = `${this.endpoints.PRICE_SERVICE}/price-history`;
        const params = new URLSearchParams({
            ticker: ticker.toUpperCase(),
            days: days.toString()
        });

        return await this.apiRequest(`${url}?${params}`);
    }

    async updateAllPrices() {
        const url = `${this.endpoints.PRICE_SERVICE}/batch-update-prices`;
        return await this.apiRequest(url, { method: 'POST' });
    }

    // ============================================================================
    // TECHNICAL SERVICE METHODS
    // ============================================================================

    async getTechnicalAnalysis(ticker, force = false) {
        const url = `${this.endpoints.TECHNICAL_SERVICE}/technical-analysis`;
        const params = new URLSearchParams({
            ticker: ticker.toUpperCase(),
            ...(force && { force: 'true' })
        });

        return await this.apiRequest(`${url}?${params}`);
    }

    async getTechnicalIndicators(ticker) {
        const url = `${this.endpoints.TECHNICAL_SERVICE}/technical-indicators`;
        const params = new URLSearchParams({ ticker: ticker.toUpperCase() });

        return await this.apiRequest(`${url}?${params}`);
    }

    async getTradingSignals(ticker) {
        const url = `${this.endpoints.TECHNICAL_SERVICE}/trading-signals`;
        const params = new URLSearchParams({ ticker: ticker.toUpperCase() });

        return await this.apiRequest(`${url}?${params}`);
    }

    async updateAllTechnical() {
        const url = `${this.endpoints.TECHNICAL_SERVICE}/batch-update-technical`;
        return await this.apiRequest(url, { method: 'POST' });
    }

    // ============================================================================
    // FUNDAMENTAL SERVICE METHODS  
    // ============================================================================

    async getFundamentalData(ticker, force = false) {
        const url = `${this.endpoints.FUNDAMENTAL_SERVICE}/fundamental-data`;
        const params = new URLSearchParams({
            ticker: ticker.toUpperCase(),
            ...(force && { force: 'true' })
        });

        return await this.apiRequest(`${url}?${params}`);
    }

    async getFinancialRatios(ticker) {
        const url = `${this.endpoints.FUNDAMENTAL_SERVICE}/financial-ratios`;
        const params = new URLSearchParams({ ticker: ticker.toUpperCase() });

        return await this.apiRequest(`${url}?${params}`);
    }

    async getCompanyProfile(ticker) {
        const url = `${this.endpoints.FUNDAMENTAL_SERVICE}/company-profile`;
        const params = new URLSearchParams({ ticker: ticker.toUpperCase() });

        return await this.apiRequest(`${url}?${params}`);
    }

    async updateAllFundamental() {
        const url = `${this.endpoints.FUNDAMENTAL_SERVICE}/batch-update-fundamental`;
        return await this.apiRequest(url, { method: 'POST' });
    }

    // ============================================================================
    // NEWS SENTIMENT SERVICE METHODS
    // ============================================================================

    async getNewsSentiment(ticker, force = false) {
        const url = `${this.endpoints.NEWS_SERVICE}/enhanced-news-sentiment`;
        const params = new URLSearchParams({
            ticker: ticker.toUpperCase(),
            ...(force && { force: 'false' })
        });

        return await this.apiRequest(`${url}?${params}`);
    }

    async getNewsArticles(ticker, limit = 10) {
        const url = `${this.endpoints.NEWS_SERVICE}/news-articles`;
        const params = new URLSearchParams({
            ticker: ticker.toUpperCase(),
            limit: limit.toString()
        });

        return await this.apiRequest(`${url}?${params}`);
    }

    async updateAllNews() {
        const url = `${this.endpoints.NEWS_SERVICE}/batch-update-news`;
        return await this.apiRequest(url, { method: 'POST' });
    }

    // ============================================================================
    // SOCIAL SENTIMENT SERVICE METHODS
    // ============================================================================

    async getSocialSentiment(ticker, force = false) {
        const url = `${this.endpoints.SOCIAL_SERVICE}/social-sentiment`;
        const params = new URLSearchParams({
            ticker: ticker.toUpperCase(),
            ...(force && { force: 'true' })
        });

        return await this.apiRequest(`${url}?${params}`);
    }

    async getRedditSentiment(ticker) {
        const url = `${this.endpoints.SOCIAL_SERVICE}/reddit-sentiment`;
        const params = new URLSearchParams({ ticker: ticker.toUpperCase() });

        return await this.apiRequest(`${url}?${params}`);
    }

    async getTwitterSentiment(ticker) {
        const url = `${this.endpoints.SOCIAL_SERVICE}/twitter-sentiment`;
        const params = new URLSearchParams({ ticker: ticker.toUpperCase() });

        return await this.apiRequest(`${url}?${params}`);
    }

    async updateAllSocial() {
        const url = `${this.endpoints.SOCIAL_SERVICE}/batch-update-social`;
        return await this.apiRequest(url, { method: 'POST' });
    }

    // ============================================================================
    // ORCHESTRATOR SERVICE METHODS
    // ============================================================================

    async getComprehensiveData(ticker) {
        const url = `${this.endpoints.ORCHESTRATOR_SERVICE}/comprehensive-data`;
        const params = new URLSearchParams({ ticker: ticker.toUpperCase() });

        return await this.apiRequest(`${url}?${params}`);
    }

    async orchestrateTicker(ticker) {
        const url = `${this.endpoints.ORCHESTRATOR_SERVICE}/ml-orchestrator`;
        const params = new URLSearchParams({ ticker: ticker.toUpperCase() });

        return await this.apiRequest(`${url}?${params}`);
    }

    async orchestrateAll() {
        const url = `${this.endpoints.ORCHESTRATOR_SERVICE}/ml-orchestrator`;
        const params = new URLSearchParams({ all: 'true' });

        return await this.apiRequest(`${url}?${params}`);
    }

    async generateRecommendations() {
        const url = `${this.endpoints.ORCHESTRATOR_SERVICE}/ml-orchestrator`;
        const params = new URLSearchParams({
            all: 'true',
            recommendations: 'true'
        });

        return await this.apiRequest(`${url}?${params}`);
    }

    // ============================================================================
    // ML SERVICE METHODS
    // ============================================================================

    async getMLPrediction(ticker) {
        const url = `${this.endpoints.ML_SERVICE}/enhanced-predict`;
        const params = new URLSearchParams({ ticker: ticker.toUpperCase() });

        return await this.apiRequest(`${url}?${params}`);
    }

    async getLatestPredictions(limit = 20, signal = null, minConfidence = 0) {
        const url = `${this.endpoints.ML_SERVICE}/latest-predictions`;
        const params = new URLSearchParams({
            limit: limit.toString(),
            ...(signal && { signal }),
            ...(minConfidence > 0 && { min_confidence: minConfidence.toString() })
        });

        return await this.apiRequest(`${url}?${params}`);
    }

    async getPredictionHistory(ticker, daysBack = 30, includeAccuracy = true) {
        const url = `${this.endpoints.ML_SERVICE}/prediction-history`;
        const params = new URLSearchParams({
            ticker: ticker.toUpperCase(),
            days_back: daysBack.toString(),
            include_accuracy: includeAccuracy.toString()
        });

        return await this.apiRequest(`${url}?${params}`);
    }

    async getPerformanceDashboard() {
        const url = `${this.endpoints.ML_SERVICE}/performance-dashboard`;
        return await this.apiRequest(url);
    }

    async trainModels(daysBack = null, force = false) {
        const url = `${this.endpoints.ML_SERVICE}/train-enhanced-models`;
        const params = new URLSearchParams({
            ...(daysBack && { days_back: daysBack.toString() }),
            ...(force && { force: 'true' })
        });

        return await this.apiRequest(`${url}?${params}`, { method: 'POST' });
    }

    async evaluateMLPerformance(daysBack = 7) {
        const url = `${this.endpoints.ML_SERVICE}/evaluate-performance`;
        const params = new URLSearchParams({ days_back: daysBack.toString() });

        return await this.apiRequest(`${url}?${params}`);
    }

    async getBatchPredictions() {
        const url = `${this.endpoints.ML_SERVICE}/enhanced-predict`;
        const params = new URLSearchParams({ batch: 'true' });

        return await this.apiRequest(`${url}?${params}`);
    }

    // ============================================================================
    // HEALTH CHECK METHODS
    // ============================================================================

    async checkServiceHealth(service = null) {
        const healthEndpoints = {
            price: `${this.endpoints.PRICE_SERVICE}/health`,
            technical: `${this.endpoints.TECHNICAL_SERVICE}/health`,
            fundamental: `${this.endpoints.FUNDAMENTAL_SERVICE}/health`,
            news: `${this.endpoints.NEWS_SERVICE}/health`,
            social: `${this.endpoints.SOCIAL_SERVICE}/health`,
            orchestrator: `${this.endpoints.ORCHESTRATOR_SERVICE}/health`,
            ml: `${this.endpoints.ML_SERVICE}/ml-health`
        };

        if (service && healthEndpoints[service]) {
            return await this.apiRequest(healthEndpoints[service]);
        }

        // Check all services
        const healthChecks = {};
        for (const [serviceName, endpoint] of Object.entries(healthEndpoints)) {
            try {
                const result = await this.apiRequest(endpoint);
                healthChecks[serviceName] = {
                    status: result.success ? 'healthy' : 'unhealthy',
                    lastCheck: result.timestamp,
                    details: result.data || result.error
                };
            } catch (error) {
                healthChecks[serviceName] = {
                    status: 'error',
                    lastCheck: new Date().toISOString(),
                    error: error.message
                };
            }
        }

        return {
            success: true,
            data: healthChecks,
            overall: Object.values(healthChecks).every(h => h.status === 'healthy') ? 'healthy' : 'degraded'
        };
    }

    async checkMLDependencies() {
        const url = `${this.endpoints.ML_SERVICE}/check-dependencies`;
        return await this.apiRequest(url);
    }

    // ============================================================================
    // CONVENIENCE METHODS - COMBINED DATA FETCHING
    // ============================================================================

    async getCompleteStockAnalysis(ticker) {
        const promises = [
            this.getPriceData(ticker),
            this.getTechnicalAnalysis(ticker),
            this.getFundamentalData(ticker),
            this.getNewsSentiment(ticker),
            this.getSocialSentiment(ticker),
            this.getMLPrediction(ticker)
        ];

        try {
            const [price, technical, fundamental, news, social, ml] = await Promise.allSettled(promises);

            return {
                success: true,
                data: {
                    ticker: ticker.toUpperCase(),
                    price: price.status === 'fulfilled' ? price.value.data : null,
                    technical: technical.status === 'fulfilled' ? technical.value.data : null,
                    fundamental: fundamental.status === 'fulfilled' ? fundamental.value.data : null,
                    news: news.status === 'fulfilled' ? news.value.data : null,
                    social: social.status === 'fulfilled' ? social.value.data : null,
                    ml: ml.status === 'fulfilled' ? ml.value.data : null
                },
                errors: {
                    price: price.status === 'rejected' ? price.reason : null,
                    technical: technical.status === 'rejected' ? technical.reason : null,
                    fundamental: fundamental.status === 'rejected' ? fundamental.reason : null,
                    news: news.status === 'rejected' ? news.reason : null,
                    social: social.status === 'rejected' ? social.reason : null,
                    ml: ml.status === 'rejected' ? ml.reason : null
                },
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    async updateAllServices() {
        const updatePromises = [
            this.updateAllPrices(),
            this.updateAllTechnical(),
            this.updateAllFundamental(),
            this.updateAllNews(),
            this.updateAllSocial()
        ];

        try {
            const results = await Promise.allSettled(updatePromises);

            return {
                success: true,
                results: {
                    price: results[0].status === 'fulfilled' ? results[0].value : results[0].reason,
                    technical: results[1].status === 'fulfilled' ? results[1].value : results[1].reason,
                    fundamental: results[2].status === 'fulfilled' ? results[2].value : results[2].reason,
                    news: results[3].status === 'fulfilled' ? results[3].value : results[3].reason,
                    social: results[4].status === 'fulfilled' ? results[4].value : results[4].reason
                },
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    // ============================================================================
    // MOCK DATA FALLBACKS (for development/testing)
    // ============================================================================

    getMockData(type, ticker = 'RELIANCE.NS') {
        const mockData = {
            price: {
                ticker,
                current_price: 2547.30,
                daily_change: 15.40,
                daily_change_percent: 0.61,
                volume: 2547890,
                market_cap: 172500000000,
                last_updated: new Date().toISOString()
            },
            technical: {
                ticker,
                rsi: 68.5,
                macd: 12.4,
                macd_signal: 8.2,
                macd_histogram: 4.2,
                sma_20: 2530.50,
                sma_50: 2485.20,
                bollinger_upper: 2580,
                bollinger_lower: 2480,
                bollinger_position: 0.75,
                atr: 45.2,
                last_updated: new Date().toISOString()
            },
            fundamental: {
                ticker,
                pe_ratio: 24.8,
                pb_ratio: 2.1,
                roe: 12.8,
                debt_to_equity: 0.45,
                current_ratio: 1.8,
                market_cap: 172500000000,
                revenue_growth: 8.5,
                profit_margin: 15.2,
                last_updated: new Date().toISOString()
            },
            news: {
                ticker,
                sentiment_score: 0.25,
                confidence: 0.78,
                article_count: 15,
                positive_count: 8,
                negative_count: 3,
                neutral_count: 4,
                last_updated: new Date().toISOString()
            },
            social: {
                ticker,
                overall_sentiment: 0.15,
                reddit_sentiment: 0.12,
                twitter_sentiment: 0.18,
                mention_count: 245,
                buzz_score: 0.6,
                last_updated: new Date().toISOString()
            },
            ml: {
                ticker,
                signal: 'BUY',
                confidence: 0.85,
                predicted_return: 4.1,
                target_price: 2650,
                risk_score: 0.3,
                prediction_date: new Date().toISOString()
            }
        };

        return {
            success: true,
            data: mockData[type] || {},
            isMock: true,
            timestamp: new Date().toISOString()
        };
    }
}

// Export singleton instance
const apiService = new ApiService();

export default apiService;