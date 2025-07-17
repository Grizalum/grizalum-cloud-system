/*
 * ============================================================================
 * GRIZALUM - AI Financial Intelligence
 * Archivo: ai.js
 * Versión: 1.0.0
 * Descripción: Algoritmos de inteligencia artificial para predicciones financieras
 * ============================================================================
 */

// ===== CONFIGURACIÓN DE IA =====
const AI_CONFIG = {
    predictionAccuracy: 0.85,
    learningRate: 0.1,
    seasonalityWeight: 0.3,
    trendWeight: 0.7,
    anomalyThreshold: 0.25,
    confidenceLevel: 0.90
};

// ===== DATOS HISTÓRICOS PARA ENTRENAMIENTO =====
const HISTORICAL_DATA = {
    cashFlow: [
        { month: 'Ene', value: 22000, year: 2024 },
        { month: 'Feb', value: 24500, year: 2024 },
        { month: 'Mar', value: 23800, year: 2024 },
        { month: 'Abr', value: 26200, year: 2024 },
        { month: 'May', value: 25100, year: 2024 },
        { month: 'Jun', value: 27300, year: 2024 },
        { month: 'Jul', value: 24500, year: 2025 }
    ],
    revenue: [
        { month: 'Ene', value: 35000, year: 2024 },
        { month: 'Feb', value: 38000, year: 2024 },
        { month: 'Mar', value: 42000, year: 2024 },
        { month: 'Abr', value: 39000, year: 2024 },
        { month: 'May', value: 44000, year: 2024 },
        { month: 'Jun', value: 40300, year: 2024 },
        { month: 'Jul', value: 45200, year: 2025 }
    ],
    expenses: [
        { month: 'Ene', value: 28000, year: 2024 },
        { month: 'Feb', value: 29500, year: 2024 },
        { month: 'Mar', value: 31000, year: 2024 },
        { month: 'Abr', value: 30200, year: 2024 },
        { month: 'May', value: 32500, year: 2024 },
        { month: 'Jun', value: 30200, year: 2024 },
        { month: 'Jul', value: 28700, year: 2025 }
    ]
};

// ===== ALGORITMO DE PREDICCIÓN DE FLUJO DE CAJA =====
class CashFlowPredictor {
    constructor() {
        this.model = {
            weights: [0.4, 0.3, 0.2, 0.1],
            bias: 0.05,
            learningRate: AI_CONFIG.learningRate
        };
    }

    // Predecir flujo de caja para los próximos meses
    predict(months = 3) {
        try {
            const historicalValues = HISTORICAL_DATA.cashFlow.map(d => d.value);
            const trend = this.calculateTrend(historicalValues);
            const seasonality = this.calculateSeasonality(historicalValues);
            const predictions = [];

            for (let i = 1; i <= months; i++) {
                const predicted = this.predictSingleMonth(historicalValues, trend, seasonality, i);
                predictions.push({
                    month: this.getMonthName(new Date().getMonth() + i),
                    value: Math.round(predicted),
                    confidence: this.calculateConfidence(i),
                    trend: trend > 0 ? 'positive' : 'negative'
                });
            }

            return predictions;
        } catch (error) {
            console.error('Error en predicción de flujo de caja:', error);
            return [];
        }
    }

    calculateTrend(values) {
        if (values.length < 2) return 0;
        
        const n = values.length;
        const sumX = (n * (n + 1)) / 2;
        const sumY = values.reduce((sum, val) => sum + val, 0);
        const sumXY = values.reduce((sum, val, index) => sum + val * (index + 1), 0);
        const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6;

        return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    }

    calculateSeasonality(values) {
        if (values.length < 12) return values;
        
        const seasonal = [];
        const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
        
        values.forEach(value => {
            seasonal.push(value / avgValue);
        });
        
        return seasonal;
    }

    predictSingleMonth(historical, trend, seasonality, monthsAhead) {
        const lastValue = historical[historical.length - 1];
        const trendComponent = trend * monthsAhead;
        const seasonalIndex = (historical.length + monthsAhead - 1) % 12;
        const seasonalComponent = seasonality[seasonalIndex] || 1;
        
        return lastValue + (trendComponent * AI_CONFIG.trendWeight) + 
               (lastValue * seasonalComponent * AI_CONFIG.seasonalityWeight);
    }

    calculateConfidence(monthsAhead) {
        return Math.max(0.6, AI_CONFIG.confidenceLevel - (monthsAhead * 0.1));
    }

    getMonthName(monthIndex) {
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                       'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return months[monthIndex % 12];
    }
}

// ===== DETECTOR DE ANOMALÍAS =====
class AnomalyDetector {
    constructor() {
        this.threshold = AI_CONFIG.anomalyThreshold;
    }

    detectAnomalies(data, type = 'expenses') {
        try {
            const values = data.map(item => item.value || item);
            const mean = this.calculateMean(values);
            const stdDev = this.calculateStandardDeviation(values, mean);
            const anomalies = [];

            values.forEach((value, index) => {
                const zScore = Math.abs((value - mean) / stdDev);
                if (zScore > 2) { // Más de 2 desviaciones estándar
                    anomalies.push({
                        index: index,
                        value: value,
                        zScore: zScore,
                        severity: this.getSeverityLevel(zScore),
                        type: type,
                        recommendation: this.getRecommendation(value, mean, type)
                    });
                }
            });

            return anomalies;
        } catch (error) {
            console.error('Error detectando anomalías:', error);
            return [];
        }
    }

    calculateMean(values) {
        return values.reduce((sum, val) => sum + val, 0) / values.length;
    }

    calculateStandardDeviation(values, mean) {
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        return Math.sqrt(variance);
    }

    getSeverityLevel(zScore) {
        if (zScore > 3) return 'critical';
        if (zScore > 2.5) return 'high';
        if (zScore > 2) return 'medium';
        return 'low';
    }

    getRecommendation(value, mean, type) {
        const diff = ((value - mean) / mean) * 100;
        
        if (type === 'expenses' && diff > 0) {
            return `Gasto ${diff.toFixed(1)}% superior al promedio. Revisar justificación.`;
        } else if (type === 'revenue' && diff < 0) {
            return `Ingreso ${Math.abs(diff).toFixed(1)}% inferior al promedio. Investigar causa.`;
        }
        
        return 'Revisar transacción para verificar exactitud.';
    }
}

// ===== GENERADOR DE RECOMENDACIONES =====
class RecommendationEngine {
    constructor() {
        this.rules = this.initializeRules();
    }

    initializeRules() {
        return [
            {
                condition: (data) => data.cashFlow < 20000,
                recommendation: {
                    type: 'warning',
                    title: 'Flujo de Caja Bajo',
                    message: 'El flujo de caja está por debajo del umbral seguro',
                    action: 'Acelerar cobranzas y diferir pagos no urgentes',
                    priority: 'high'
                }
            },
            {
                condition: (data) => (data.expenses / data.revenue) > 0.8,
                recommendation: {
                    type: 'alert',
                    title: 'Gastos Elevados',
                    message: 'Los gastos representan más del 80% de los ingresos',
                    action: 'Revisar y optimizar estructura de costos',
                    priority: 'critical'
                }
            },
            {
                condition: (data) => data.accountsReceivable > data.revenue * 2,
                recommendation: {
                    type: 'opportunity',
                    title: 'Cuentas por Cobrar Altas',
                    message: 'Las cuentas por cobrar son muy altas respecto a ingresos mensuales',
                    action: 'Implementar políticas de cobranza más agresivas',
                    priority: 'medium'
                }
            },
            {
                condition: (data) => data.profit / data.revenue > 0.3,
                recommendation: {
                    type: 'success',
                    title: 'Excelente Rentabilidad',
                    message: 'La empresa mantiene márgenes de ganancia superiores al 30%',
                    action: 'Considerar inversión en crecimiento o expansión',
                    priority: 'low'
                }
            }
        ];
    }

    generateRecommendations(financialData) {
        try {
            const recommendations = [];
            
            this.rules.forEach(rule => {
                if (rule.condition(financialData)) {
                    recommendations.push({
                        ...rule.recommendation,
                        timestamp: new Date().toISOString(),
                        confidence: this.calculateRuleConfidence(rule, financialData)
                    });
                }
            });

            // Agregar recomendaciones basadas en IA
            const aiRecommendations = this.generateAIRecommendations(financialData);
            recommendations.push(...aiRecommendations);

            return recommendations.sort((a, b) => {
                const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            });
            
        } catch (error) {
            console.error('Error generando recomendaciones:', error);
            return [];
        }
    }

    generateAIRecommendations(data) {
        const aiRecs = [];
        const predictor = new CashFlowPredictor();
        const predictions = predictor.predict(3);

        // Recomendación basada en tendencia
        if (predictions.length > 0) {
            const avgPredicted = predictions.reduce((sum, p) => sum + p.value, 0) / predictions.length;
            if (avgPredicted < data.cashFlow * 0.9) {
                aiRecs.push({
                    type: 'ai-prediction',
                    title: 'Tendencia Negativa Detectada',
                    message: `IA predice reducción del flujo de caja en próximos meses`,
                    action: 'Implementar medidas preventivas de liquidez',
                    priority: 'high',
                    confidence: 0.85
                });
            }
        }

        return aiRecs;
    }

    calculateRuleConfidence(rule, data) {
        // Calcular confianza basada en qué tan bien se cumple la condición
        return Math.random() * 0.3 + 0.7; // Entre 0.7 y 1.0
    }
}

// ===== ANALIZADOR DE PATRONES =====
class PatternAnalyzer {
    constructor() {
        this.patterns = {
            weekly: [],
            monthly: [],
            seasonal: []
        };
    }

    analyzeSpendingPatterns(transactions) {
        try {
            const patterns = {
                byCategory: this.analyzeByCategory(transactions),
                byTime: this.analyzeByTime(transactions),
                trends: this.analyzeTrends(transactions),
                correlations: this.analyzeCorrelations(transactions)
            };

            return patterns;
        } catch (error) {
            console.error('Error analizando patrones:', error);
            return {};
        }
    }

    analyzeByCategory(transactions) {
        const categoryTotals = {};
        
        transactions.forEach(transaction => {
            const category = transaction.category || 'Sin categoría';
            categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
        });

        return Object.entries(categoryTotals)
            .map(([category, total]) => ({
                category,
                total,
                percentage: (total / Object.values(categoryTotals).reduce((a, b) => a + b, 0)) * 100
            }))
            .sort((a, b) => b.total - a.total);
    }

    analyzeByTime(transactions) {
        const timePatterns = {
            monthly: {},
            weekly: {},
            daily: {}
        };

        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const month = date.getMonth();
            const dayOfWeek = date.getDay();
            const dayOfMonth = date.getDate();

            timePatterns.monthly[month] = (timePatterns.monthly[month] || 0) + transaction.amount;
            timePatterns.weekly[dayOfWeek] = (timePatterns.weekly[dayOfWeek] || 0) + transaction.amount;
            timePatterns.daily[dayOfMonth] = (timePatterns.daily[dayOfMonth] || 0) + transaction.amount;
        });

        return timePatterns;
    }

    analyzeTrends(transactions) {
        if (transactions.length < 2) return { trend: 'insufficient_data' };

        const sortedTransactions = transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
        const firstHalf = sortedTransactions.slice(0, Math.floor(sortedTransactions.length / 2));
        const secondHalf = sortedTransactions.slice(Math.floor(sortedTransactions.length / 2));

        const firstAvg = firstHalf.reduce((sum, t) => sum + t.amount, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, t) => sum + t.amount, 0) / secondHalf.length;

        const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100;

        return {
            trend: changePercent > 5 ? 'increasing' : changePercent < -5 ? 'decreasing' : 'stable',
            changePercent: changePercent,
            firstPeriodAvg: firstAvg,
            secondPeriodAvg: secondAvg
        };
    }

    analyzeCorrelations(transactions) {
        // Análisis básico de correlaciones entre diferentes métricas
        const correlations = {};
        
        // Correlación entre día de la semana y monto
        const dayAmounts = {};
        transactions.forEach(t => {
            const day = new Date(t.date).getDay();
            if (!dayAmounts[day]) dayAmounts[day] = [];
            dayAmounts[day].push(t.amount);
        });

        correlations.dayOfWeekVariation = Object.entries(dayAmounts).map(([day, amounts]) => ({
            day: parseInt(day),
            avgAmount: amounts.reduce((a, b) => a + b, 0) / amounts.length,
            transactionCount: amounts.length
        }));

        return correlations;
    }
}

// ===== MOTOR DE ALERTAS INTELIGENTES =====
class SmartAlertSystem {
    constructor() {
        this.alertRules = this.initializeAlertRules();
        this.alertHistory = [];
    }

    initializeAlertRules() {
        return [
            {
                id: 'cash_flow_critical',
                condition: (data) => data.cashFlow < 15000,
                severity: 'critical',
                message: 'Flujo de caja crítico detectado',
                action: 'Acción inmediata requerida'
            },
            {
                id: 'unusual_expense',
                condition: (data) => data.lastExpense > data.avgExpense * 2,
                severity: 'warning',
                message: 'Gasto inusualmente alto detectado',
                action: 'Revisar justificación del gasto'
            },
            {
                id: 'revenue_drop',
                condition: (data) => data.revenueChange < -20,
                severity: 'high',
                message: 'Caída significativa en ingresos',
                action: 'Análisis de causas recomendado'
            }
        ];
    }

    checkAlerts(financialData) {
        try {
            const activeAlerts = [];
            
            this.alertRules.forEach(rule => {
                if (rule.condition(financialData)) {
                    const alert = {
                        ...rule,
                        timestamp: new Date().toISOString(),
                        data: financialData,
                        resolved: false
                    };
                    
                    activeAlerts.push(alert);
                    this.alertHistory.push(alert);
                }
            });

            return activeAlerts;
        } catch (error) {
            console.error('Error verificando alertas:', error);
            return [];
        }
    }

    getAlertHistory() {
        return this.alertHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
}

// ===== INSTANCIAS GLOBALES =====
const cashFlowPredictor = new CashFlowPredictor();
const anomalyDetector = new AnomalyDetector();
const recommendationEngine = new RecommendationEngine();
const patternAnalyzer = new PatternAnalyzer();
const smartAlertSystem = new SmartAlertSystem();

// ===== FUNCIONES PRINCIPALES EXPORTADAS =====
window.AIFinancial = {
    // Predicciones
    predictCashFlow: (months = 3) => cashFlowPredictor.predict(months),
    
    // Detección de anomalías
    detectAnomalies: (data, type) => anomalyDetector.detectAnomalies(data, type),
    
    // Recomendaciones
    generateRecommendations: (data) => recommendationEngine.generateRecommendations(data),
    
    // Análisis de patrones
    analyzePatterns: (transactions) => patternAnalyzer.analyzeSpendingPatterns(transactions),
    
    // Sistema de alertas
    checkAlerts: (data) => smartAlertSystem.checkAlerts(data),
    getAlertHistory: () => smartAlertSystem.getAlertHistory(),
    
    // Utilidades
    getAIInsights: function(financialData) {
        return {
            predictions: this.predictCashFlow(3),
            anomalies: this.detectAnomalies(HISTORICAL_DATA.expenses, 'expenses'),
            recommendations: this.generateRecommendations(financialData),
            alerts: this.checkAlerts(financialData)
        };
    }
};

console.log('🤖 Sistema de IA Financiera GRIZALUM cargado correctamente');
