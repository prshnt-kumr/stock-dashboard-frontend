// mockDataService.js - Mock data service for development and testing

class MockDataService {
    constructor() {
        this.isEnabled = process.env.REACT_APP_USE_MOCK_DATA === 'true';
        this.delay = parseInt(process.env.REACT_APP_MOCK_DELAY) || 1000; // Simulate API delay

        // Generate realistic mock data
        this.stockUniverse = [
            'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'HINDUNILVR.NS',
            'ICICIBANK.NS', 'KOTAKBANK.NS', 'LT.NS', 'SBIN.NS', 'BHARTIARTL.NS',
            'ASIANPAINT.NS', 'ITC.NS', 'AXISBANK.NS', 'MARUTI.NS', 'SUNPHARMA.NS',
            'TITAN.NS', 'ULTRACEMCO.NS', 'BAJFINANCE.NS', 'NESTLEIND.NS', 'WIPRO.NS'
        ];

        this.marketData = this.generateMarketData();
        this.newsDatabase = this.generateNewsDatabase();
        this.socialDatabase = this.generateSocialDatabase();
        this.mlModels = this.generateMLModels();
    }

    async simulateApiCall(data, delay = this.delay) {
        await new Promise(resolve => setTimeout(resolve, delay));

        // Simulate occasional API failures
        if (Math.random() < 0.05) { // 5% failure rate
            throw new Error('Simulated API failure');
        }

        return {
            success: true,
            data,
            timestamp: new Date().toISOString(),
            isMock: true
        };
    }

    generateMarketData() {
        const data = {};

        this.stockUniverse.forEach(ticker => {
            const basePrice = 1000 + Math.random() * 3000; // Random price between 1000-4000
            const priceHistory = this.generatePriceHistory(basePrice, 180); // 6 months of data
            const currentPrice = priceHistory[priceHistory.length - 1];

            data[ticker] = {
                // Price data
                price: {
                    ticker,
                    current_price: currentPrice.close,
                    open: currentPrice.open,
                    high: currentPrice.high,
                    low: currentPrice.low,
                    volume: currentPrice.volume,
                    daily_change: currentPrice.close - currentPrice.open,
                    daily_change_percent: ((currentPrice.close - currentPrice.open) / currentPrice.open) * 100,
                    market_cap: currentPrice.close * (10000000 + Math.random() * 90000000), // Random market cap
                    last_updated: new Date().toISOString(),
                    price_history: priceHistory
                },

                // Technical indicators
                technical: this.generateTechnicalIndicators(ticker, priceHistory),

                // Fundamental data
                fundamental: this.generateFundamentalData(ticker),

                // News sentiment
                news: this.generateNewsSentiment(ticker),

                // Social sentiment
                social: this.generateSocialSentiment(ticker),

                // ML predictions
                ml: this.generateMLPrediction(ticker, currentPrice.close)
            };
        });

        return data;
    }

    generatePriceHistory(basePrice, days) {
        const history = [];
        let currentPrice = basePrice;
        let currentVolume = 1000000 + Math.random() * 2000000;

        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            // Random price movement with trend
            const volatility = 0.02 + Math.random() * 0.03; // 2-5% daily volatility
            const trend = (Math.random() - 0.5) * 0.001; // Small trend bias
            const change = (Math.random() - 0.5) * volatility + trend;

            const open = currentPrice;
            const close = open * (1 + change);
            const high = Math.max(open, close) * (1 + Math.random() * 0.02);
            const low = Math.min(open, close) * (1 - Math.random() * 0.02);
            const volume = currentVolume * (0.8 + Math.random() * 0.4); // ±20% volume variation

            history.push({
                date: date.toISOString().split('T')[0],
                open: parseFloat(open.toFixed(2)),
                high: parseFloat(high.toFixed(2)),
                low: parseFloat(low.toFixed(2)),
                close: parseFloat(close.toFixed(2)),
                volume: Math.round(volume)
            });

            currentPrice = close;
            currentVolume = volume;
        }

        return history;
    }

    generateTechnicalIndicators(ticker, priceHistory) {
        const closes = priceHistory.map(p => p.close);
        const volumes = priceHistory.map(p => p.volume);

        // Simple moving averages
        const sma5 = this.calculateSMA(closes, 5);
        const sma20 = this.calculateSMA(closes, 20);
        const sma50 = this.calculateSMA(closes, 50);

        // RSI
        const rsi = this.calculateRSI(closes, 14);

        // MACD
        const macd = this.calculateMACD(closes);

        // Bollinger Bands
        const bb = this.calculateBollingerBands(closes, 20, 2);

        return {
            ticker,
            rsi: parseFloat(rsi.toFixed(2)),
            macd: parseFloat(macd.macd.toFixed(2)),
            macd_signal: parseFloat(macd.signal.toFixed(2)),
            macd_histogram: parseFloat(macd.histogram.toFixed(2)),
            sma_5: parseFloat(sma5.toFixed(2)),
            sma_20: parseFloat(sma20.toFixed(2)),
            sma_50: parseFloat(sma50.toFixed(2)),
            bollinger_upper: parseFloat(bb.upper.toFixed(2)),
            bollinger_lower: parseFloat(bb.lower.toFixed(2)),
            bollinger_middle: parseFloat(bb.middle.toFixed(2)),
            bollinger_position: parseFloat(bb.position.toFixed(2)),
            atr: parseFloat((Math.random() * 50 + 10).toFixed(2)),
            volume_sma: parseFloat(this.calculateSMA(volumes, 20).toFixed(0)),
            last_updated: new Date().toISOString()
        };
    }

    generateFundamentalData(ticker) {
        return {
            ticker,
            pe_ratio: parseFloat((5 + Math.random() * 45).toFixed(2)),
            pb_ratio: parseFloat((0.5 + Math.random() * 4).toFixed(2)),
            roe: parseFloat((Math.random() * 30).toFixed(2)),
            roa: parseFloat((Math.random() * 15).toFixed(2)),
            debt_to_equity: parseFloat((Math.random() * 2).toFixed(2)),
            current_ratio: parseFloat((1 + Math.random() * 2).toFixed(2)),
            quick_ratio: parseFloat((0.5 + Math.random() * 1.5).toFixed(2)),
            profit_margin: parseFloat((Math.random() * 25).toFixed(2)),
            revenue_growth: parseFloat((Math.random() * 20 - 5).toFixed(2)),
            earnings_growth: parseFloat((Math.random() * 25 - 10).toFixed(2)),
            beta: parseFloat((0.5 + Math.random() * 1.5).toFixed(2)),
            dividend_yield: parseFloat((Math.random() * 5).toFixed(2)),
            market_cap: Math.round(10000000000 + Math.random() * 500000000000), // 10B - 510B
            enterprise_value: Math.round(12000000000 + Math.random() * 600000000000),
            book_value_per_share: parseFloat((100 + Math.random() * 500).toFixed(2)),
            last_updated: new Date().toISOString()
        };
    }

    generateNewsSentiment(ticker) {
        const articles = Math.floor(5 + Math.random() * 20); // 5-25 articles
        const positive = Math.floor(articles * (0.2 + Math.random() * 0.6)); // 20-80% positive
        const negative = Math.floor(articles * (0.1 + Math.random() * 0.3)); // 10-40% negative
        const neutral = articles - positive - negative;

        const sentiment_score = (positive - negative) / articles;

        return {
            ticker,
            sentiment_score: parseFloat(sentiment_score.toFixed(3)),
            confidence: parseFloat((0.5 + Math.random() * 0.5).toFixed(2)),
            article_count: articles,
            positive_count: Math.max(0, positive),
            negative_count: Math.max(0, negative),
            neutral_count: Math.max(0, neutral),
            trending_keywords: this.generateKeywords(),
            source_diversity: parseFloat((0.6 + Math.random() * 0.4).toFixed(2)),
            last_updated: new Date().toISOString(),
            recent_articles: this.generateRecentArticles(ticker, 5)
        };
    }

    generateSocialSentiment(ticker) {
        const mentions = Math.floor(50 + Math.random() * 500); // 50-550 mentions

        return {
            ticker,
            overall_sentiment: parseFloat((Math.random() * 2 - 1).toFixed(3)), // -1 to 1
            reddit_sentiment: parseFloat((Math.random() * 2 - 1).toFixed(3)),
            twitter_sentiment: parseFloat((Math.random() * 2 - 1).toFixed(3)),
            reddit_mentions: Math.floor(mentions * 0.3),
            twitter_mentions: Math.floor(mentions * 0.7),
            mention_count: mentions,
            buzz_score: parseFloat((Math.random()).toFixed(2)),
            sentiment_trend: ['rising', 'falling', 'stable'][Math.floor(Math.random() * 3)],
            top_subreddits: ['investing', 'IndiaInvestments', 'SecurityAnalysis'],
            hashtags: this.generateHashtags(ticker),
            last_updated: new Date().toISOString()
        };
    }

    generateMLPrediction(ticker, currentPrice) {
        const signals = ['BUY', 'SELL', 'HOLD'];
        const signal = signals[Math.floor(Math.random() * signals.length)];

        const predicted_return = (Math.random() * 0.2 - 0.1); // -10% to +10%
        const confidence = 0.5 + Math.random() * 0.4; // 50-90% confidence

        return {
            ticker,
            signal,
            confidence: parseFloat(confidence.toFixed(2)),
            predicted_return: parseFloat(predicted_return.toFixed(3)),
            target_price: parseFloat((currentPrice * (1 + predicted_return)).toFixed(2)),
            stop_loss: parseFloat((currentPrice * 0.95).toFixed(2)),
            take_profit: parseFloat((currentPrice * 1.15).toFixed(2)),
            risk_score: parseFloat((Math.random() * 0.5 + 0.2).toFixed(2)), // 20-70% risk
            model_version: 'v5.0.0-mock',
            features_used: Math.floor(30 + Math.random() * 50),
            prediction_date: new Date().toISOString(),
            expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week
        };
    }

    // Technical indicator calculations
    calculateSMA(data, period) {
        if (data.length < period) return data[data.length - 1] || 0;
        const slice = data.slice(-period);
        return slice.reduce((sum, val) => sum + val, 0) / period;
    }

    calculateRSI(data, period = 14) {
        if (data.length < period + 1) return 50; // Neutral RSI

        let gains = 0;
        let losses = 0;

        for (let i = data.length - period; i < data.length; i++) {
            const change = data[i] - data[i - 1];
            if (change > 0) gains += change;
            else losses -= change;
        }

        const avgGain = gains / period;
        const avgLoss = losses / period;

        if (avgLoss === 0) return 100;

        const rs = avgGain / avgLoss;
        return 100 - (100 / (1 + rs));
    }

    calculateMACD(data, fast = 12, slow = 26, signal = 9) {
        if (data.length < slow) {
            return { macd: 0, signal: 0, histogram: 0 };
        }

        const emaFast = this.calculateEMA(data, fast);
        const emaSlow = this.calculateEMA(data, slow);
        const macdLine = emaFast - emaSlow;

        // Simplified signal line calculation
        const signalLine = macdLine * 0.8;
        const histogram = macdLine - signalLine;

        return {
            macd: macdLine,
            signal: signalLine,
            histogram: histogram
        };
    }

    calculateEMA(data, period) {
        if (data.length === 0) return 0;
        if (data.length < period) return data[data.length - 1];

        const multiplier = 2 / (period + 1);
        let ema = data[0];

        for (let i = 1; i < data.length; i++) {
            ema = (data[i] * multiplier) + (ema * (1 - multiplier));
        }

        return ema;
    }

    calculateBollingerBands(data, period = 20, deviation = 2) {
        const sma = this.calculateSMA(data, period);

        if (data.length < period) {
            return {
                upper: sma * 1.02,
                middle: sma,
                lower: sma * 0.98,
                position: 0.5
            };
        }

        const slice = data.slice(-period);
        const variance = slice.reduce((sum, val) => sum + Math.pow(val - sma, 2), 0) / period;
        const stdDev = Math.sqrt(variance);

        const upper = sma + (stdDev * deviation);
        const lower = sma - (stdDev * deviation);
        const current = data[data.length - 1];
        const position = (current - lower) / (upper - lower);

        return {
            upper,
            middle: sma,
            lower,
            position: Math.max(0, Math.min(1, position))
        };
    }

    // Helper methods for generating realistic mock content
    generateKeywords() {
        const keywords = [
            'earnings', 'revenue', 'growth', 'acquisition', 'dividend',
            'expansion', 'partnership', 'innovation', 'market share', 'regulation'
        ];
        return keywords.sort(() => 0.5 - Math.random()).slice(0, 3);
    }

    generateHashtags(ticker) {
        return [
            `#${ticker.replace('.NS', '')}`,
            '#IndianStocks',
            '#Investing',
            '#StockMarket'
        ];
    }

    generateRecentArticles(ticker, count) {
        const headlines = [
            `${ticker} reports strong quarterly results`,
            `Analysts upgrade ${ticker} target price`,
            `${ticker} announces new strategic initiative`,
            `Market volatility impacts ${ticker} trading`,
            `${ticker} management discusses future outlook`
        ];

        return headlines.slice(0, count).map((headline, index) => ({
            title: headline,
            source: ['Economic Times', 'Moneycontrol', 'LiveMint', 'Business Standard'][index % 4],
            timestamp: new Date(Date.now() - index * 3600000).toISOString(),
            sentiment: Math.random() * 2 - 1
        }));
    }

    generateNewsDatabase() {
        // Pre-generate news data for faster responses
        return {};
    }

    generateSocialDatabase() {
        // Pre-generate social media data
        return {};
    }

    generateMLModels() {
        return {
            direction: {
                accuracy: 0.78 + Math.random() * 0.15,
                predictions_made: Math.floor(1000 + Math.random() * 500),
                last_trained: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            return: {
                accuracy: 0.72 + Math.random() * 0.18,
                predictions_made: Math.floor(800 + Math.random() * 400),
                last_trained: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            signal: {
                accuracy: 0.75 + Math.random() * 0.16,
                predictions_made: Math.floor(600 + Math.random() * 300),
                last_trained: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
            }
        };
    }

    // Public API methods that match the real API structure
    async getPriceData(ticker) {
        if (!this.isEnabled) throw new Error('Mock data service not enabled');

        const data = this.marketData[ticker]?.price;
        if (!data) throw new Error(`No data for ticker ${ticker}`);

        return this.simulateApiCall(data);
    }

    async getTechnicalAnalysis(ticker) {
        if (!this.isEnabled) throw new Error('Mock data service not enabled');

        const data = this.marketData[ticker]?.technical;
        if (!data) throw new Error(`No data for ticker ${ticker}`);

        return this.simulateApiCall(data);
    }

    async getFundamentalData(ticker) {
        if (!this.isEnabled) throw new Error('Mock data service not enabled');

        const data = this.marketData[ticker]?.fundamental;
        if (!data) throw new Error(`No data for ticker ${ticker}`);

        return this.simulateApiCall(data);
    }

    async getNewsSentiment(ticker) {
        if (!this.isEnabled) throw new Error('Mock data service not enabled');

        const data = this.marketData[ticker]?.news;
        if (!data) throw new Error(`No data for ticker ${ticker}`);

        return this.simulateApiCall(data);
    }

    async getSocialSentiment(ticker) {
        if (!this.isEnabled) throw new Error('Mock data service not enabled');

        const data = this.marketData[ticker]?.social;
        if (!data) throw new Error(`No data for ticker ${ticker}`);

        return this.simulateApiCall(data);
    }

    async getMLPrediction(ticker) {
        if (!this.isEnabled) throw new Error('Mock data service not enabled');

        const data = this.marketData[ticker]?.ml;
        if (!data) throw new Error(`No data for ticker ${ticker}`);

        return this.simulateApiCall(data);
    }

    async getCompleteStockAnalysis(ticker) {
        if (!this.isEnabled) throw new Error('Mock data service not enabled');

        const stockData = this.marketData[ticker];
        if (!stockData) throw new Error(`No data for ticker ${ticker}`);

        return this.simulateApiCall(stockData);
    }

    async getLatestPredictions(limit = 20) {
        if (!this.isEnabled) throw new Error('Mock data service not enabled');

        const predictions = this.stockUniverse
            .slice(0, limit)
            .map(ticker => ({
                ...this.marketData[ticker]?.ml,
                current_price: this.marketData[ticker]?.price.current_price
            }))
            .sort((a, b) => b.confidence - a.confidence);

        return this.simulateApiCall({
            predictions,
            total: predictions.length,
            generated_at: new Date().toISOString()
        });
    }

    async getServiceHealth() {
        if (!this.isEnabled) throw new Error('Mock data service not enabled');

        const services = ['price', 'technical', 'fundamental', 'news', 'social', 'orchestrator', 'ml'];
        const healthData = {};

        services.forEach(service => {
            healthData[service] = {
                status: Math.random() > 0.1 ? 'healthy' : 'warning', // 90% healthy
                uptime: `${(99 + Math.random()).toFixed(1)}%`,
                lastUpdate: `${Math.floor(Math.random() * 10) + 1} mins ago`,
                responseTime: `${Math.floor(100 + Math.random() * 500)}ms`,
                requestCount: Math.floor(1000 + Math.random() * 5000),
                errorRate: `${(Math.random() * 2).toFixed(1)}%`,
                version: `v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`
            };
        });

        return this.simulateApiCall(healthData);
    }

    async getMLPerformance() {
        if (!this.isEnabled) throw new Error('Mock data service not enabled');

        const performance = {
            overall_accuracy: parseFloat((0.75 + Math.random() * 0.15).toFixed(3)),
            direction_accuracy: parseFloat((0.78 + Math.random() * 0.12).toFixed(3)),
            predictions_evaluated: Math.floor(500 + Math.random() * 1000),
            model_performance: this.mlModels,
            accuracy_trend: Array.from({ length: 7 }, (_, i) => ({
                date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                accuracy: parseFloat((0.7 + Math.random() * 0.2).toFixed(3))
            }))
        };

        return this.simulateApiCall(performance);
    }
}

// Export singleton instance
const mockDataService = new MockDataService();

export default mockDataService;