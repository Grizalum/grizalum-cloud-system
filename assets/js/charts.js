/*
 * ============================================================================
 * GRIZALUM - Charts Management
 * Archivo: charts.js
 * Versión: 1.0.0
 * Descripción: Gestión de gráficos interactivos con Chart.js
 * ============================================================================
 */

// ===== CONFIGURACIÓN GLOBAL DE CHART.JS =====
if (typeof Chart !== 'undefined') {
    Chart.defaults.font.family = 'Inter, -apple-system, BlinkMacSystemFont, sans-serif';
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#64748b';
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.boxWidth = 6;
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;
}

// ===== COLORES GRIZALUM =====
const GRIZALUM_COLORS = {
    profit: '#059669',
    loss: '#dc2626',
    neutral: '#3b82f6',
    gold: '#d4af37',
    amber: '#f59e0b',
    violet: '#7c3aed',
    emerald: '#10b981',
    
    // Gradientes para gráficos
    gradients: {
        profit: ['#059669', '#10b981'],
        loss: ['#dc2626', '#ef4444'],
        blue: ['#3b82f6', '#1d4ed8'],
        gold: ['#d4af37', '#b87333'],
        amber: ['#d97706', '#f59e0b'],
        violet: ['#7c3aed', '#6366f1'],
        emerald: ['#059669', '#10b981']
    }
};

// ===== DATOS BASE =====
const CHART_DATA = {
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
    revenue: [35000, 38000, 42000, 39000, 44000, 40300, 45200],
    expenses: [28000, 29500, 31000, 30200, 32500, 30200, 28700],
    projectedMonths: ['Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    projectedCashFlow: [28000, 32000, 35000, 38000, 42000],
    expenseDistribution: {
        labels: ['Operativos', 'Administrativos', 'Ventas', 'Financieros'],
        data: [12500, 8200, 5500, 2500]
    },
    agingData: {
        labels: ['0-30 días', '31-60 días', '61-90 días', '+90 días'],
        amounts: [18200, 9800, 3200, 1600]
    },
    cashFlowDaily: [15000, 18500, 22000, 17800, 21500, 19800, 24500]
};

// ===== FUNCIÓN PRINCIPAL DE INICIALIZACIÓN =====
function initializeCharts() {
    try {
        console.log('📊 Inicializando sistema de gráficos...');
        
        if (typeof Chart === 'undefined') {
            console.error('❌ Chart.js no está disponible');
            return;
        }
        
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createAllCharts);
        } else {
            createAllCharts();
        }
        
    } catch (error) {
        console.error('❌ Error inicializando gráficos:', error);
    }
}

function createAllCharts() {
    try {
        // Crear todos los gráficos
        initRevenueChart();
        initExpensesChart();
        initCashFlowChart();
        initAgingChart();
        initCashFlowDetailChart();
        
        console.log('✅ Todos los gráficos inicializados correctamente');
        
    } catch (error) {
        console.error('❌ Error creando gráficos:', error);
    }
}

// ===== GRÁFICO DE INGRESOS VS GASTOS =====
function initRevenueChart() {
    try {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) {
            console.warn('⚠️ Canvas revenueChart no encontrado');
            return;
        }

        const gradient1 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
        gradient1.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
        gradient1.addColorStop(1, 'rgba(59, 130, 246, 0.05)');

        const gradient2 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
        gradient2.addColorStop(0, 'rgba(220, 38, 38, 0.3)');
        gradient2.addColorStop(1, 'rgba(220, 38, 38, 0.05)');

        charts.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: CHART_DATA.months,
                datasets: [{
                    label: 'Ingresos',
                    data: CHART_DATA.revenue,
                    borderColor: GRIZALUM_COLORS.neutral,
                    backgroundColor: gradient1,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: GRIZALUM_COLORS.neutral,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }, {
                    label: 'Gastos',
                    data: CHART_DATA.expenses,
                    borderColor: GRIZALUM_COLORS.loss,
                    backgroundColor: gradient2,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: GRIZALUM_COLORS.loss,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            font: { 
                                weight: 'bold',
                                size: 13
                            },
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: GRIZALUM_COLORS.gold,
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: S/. ${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                weight: 'bold'
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return 'S/. ' + value.toLocaleString();
                            },
                            font: {
                                weight: '500'
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });

        console.log('✅ Gráfico de ingresos vs gastos creado');

    } catch (error) {
        console.error('❌ Error creando gráfico de ingresos:', error);
    }
}

// ===== GRÁFICO DE DISTRIBUCIÓN DE GASTOS =====
function initExpensesChart() {
    try {
        const ctx = document.getElementById('expensesChart');
        if (!ctx) {
            console.warn('⚠️ Canvas expensesChart no encontrado');
            return;
        }

        charts.expenses = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: CHART_DATA.expenseDistribution.labels,
                datasets: [{
                    data: CHART_DATA.expenseDistribution.data,
                    backgroundColor: [
                        GRIZALUM_COLORS.emerald,
                        GRIZALUM_COLORS.neutral,
                        GRIZALUM_COLORS.gold,
                        GRIZALUM_COLORS.loss
                    ],
                    borderWidth: 0,
                    hoverOffset: 15,
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            font: { 
                                weight: 'bold',
                                size: 12
                            },
                            padding: 20,
                            generateLabels: function(chart) {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
                                    return data.labels.map((label, i) => {
                                        const dataset = data.datasets[0];
                                        const value = dataset.data[i];
                                        const total = dataset.data.reduce((a, b) => a + b, 0);
                                        const percentage = ((value / total) * 100).toFixed(1);
                                        
                                        return {
                                            text: `${label} (${percentage}%)`,
                                            fillStyle: dataset.backgroundColor[i],
                                            strokeStyle: dataset.backgroundColor[i],
                                            lineWidth: 0,
                                            pointStyle: 'circle',
                                            hidden: false,
                                            index: i
                                        };
                                    });
                                }
                                return [];
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: GRIZALUM_COLORS.gold,
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: S/. ${context.parsed.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 2000
                }
            }
        });

        console.log('✅ Gráfico de distribución de gastos creado');

    } catch (error) {
        console.error('❌ Error creando gráfico de gastos:', error);
    }
}

// ===== GRÁFICO DE FLUJO DE CAJA PROYECTADO =====
function initCashFlowChart() {
    try {
        const ctx = document.getElementById('cashFlowChart');
        if (!ctx) {
            console.warn('⚠️ Canvas cashFlowChart no encontrado');
            return;
        }

        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.8)');
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0.8)');

        charts.cashFlow = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: CHART_DATA.projectedMonths,
                datasets: [{
                    label: 'Proyección IA',
                    data: CHART_DATA.projectedCashFlow,
                    backgroundColor: gradient,
                    borderColor: GRIZALUM_COLORS.violet,
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            usePointStyle: true,
                            font: { 
                                weight: 'bold',
                                size: 13
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: GRIZALUM_COLORS.gold,
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: S/. ${context.parsed.y.toLocaleString()}`;
                            },
                            afterLabel: function(context) {
                                return 'Predicción basada en IA';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                weight: 'bold'
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return 'S/. ' + value.toLocaleString();
                            },
                            font: {
                                weight: '500'
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutBounce'
                }
            }
        });

        console.log('✅ Gráfico de flujo de caja proyectado creado');

    } catch (error) {
        console.error('❌ Error creando gráfico de flujo de caja:', error);
    }
}

// ===== GRÁFICO DE AGING CUENTAS POR COBRAR =====
function initAgingChart() {
    try {
        const ctx = document.getElementById('agingChart');
        if (!ctx) {
            console.warn('⚠️ Canvas agingChart no encontrado');
            return;
        }

        charts.aging = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: CHART_DATA.agingData.labels,
                datasets: [{
                    label: 'Monto (S/.)',
                    data: CHART_DATA.agingData.amounts,
                    backgroundColor: [
                        GRIZALUM_COLORS.profit,
                        GRIZALUM_COLORS.amber,
                        '#d97706',
                        GRIZALUM_COLORS.loss
                    ],
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        display: false 
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: GRIZALUM_COLORS.gold,
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed.y / total) * 100).toFixed(1);
                                return `S/. ${context.parsed.y.toLocaleString()} (${percentage}%)`;
                            },
                            afterLabel: function(context) {
                                const statusMap = {
                                    '0-30 días': 'Estado: Vigente',
                                    '31-60 días': 'Estado: Atención',
                                    '61-90 días': 'Estado: Vencido',
                                    '+90 días': 'Estado: Crítico'
                                };
                                return statusMap[context.label] || '';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                weight: 'bold',
                                size: 11
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return 'S/. ' + value.toLocaleString();
                            },
                            font: {
                                weight: '500'
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });

        console.log('✅ Gráfico de aging cuentas por cobrar creado');

    } catch (error) {
        console.error('❌ Error creando gráfico de aging:', error);
    }
}

// ===== GRÁFICO DETALLADO DE FLUJO DE CAJA =====
function initCashFlowDetailChart() {
    try {
        const ctx = document.getElementById('cashFlowDetailChart');
        if (!ctx) {
            console.warn('⚠️ Canvas cashFlowDetailChart no encontrado');
            return;
        }

        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(5, 150, 105, 0.3)');
        gradient.addColorStop(1, 'rgba(5, 150, 105, 0.05)');

        charts.cashFlowDetail = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['1 Jul', '5 Jul', '10 Jul', '15 Jul', '20 Jul', '25 Jul', '30 Jul'],
                datasets: [{
                    label: 'Saldo Diario',
                    data: CHART_DATA.cashFlowDaily,
                    borderColor: GRIZALUM_COLORS.profit,
                    backgroundColor: gradient,
                    borderWidth: 4,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: GRIZALUM_COLORS.profit,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 3,
                    pointRadius: 8,
                    pointHoverRadius: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            usePointStyle: true,
                            font: { 
                                weight: 'bold',
                                size: 13
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: GRIZALUM_COLORS.gold,
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: S/. ${context.parsed.y.toLocaleString()}`;
                            },
                            afterLabel: function(context) {
                                const prevValue = context.dataIndex > 0 ? 
                                    context.dataset.data[context.dataIndex - 1] : context.parsed.y;
                                const change = context.parsed.y - prevValue;
                                const changePercent = prevValue !== 0 ? ((change / prevValue) * 100).toFixed(1) : '0.0';
                                return change >= 0 ? 
                                    `↗ +S/. ${Math.abs(change).toLocaleString()} (+${changePercent}%)` :
                                    `↘ -S/. ${Math.abs(change).toLocaleString()} (${changePercent}%)`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                weight: 'bold'
                            }
                        }
                    },
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return 'S/. ' + value.toLocaleString();
                            },
                            font: {
                                weight: '500'
                            }
                        }
                    }
                },
                animation: {
                    duration: 2500,
                    easing: 'easeInOutQuart'
                }
            }
        });

        console.log('✅ Gráfico detallado de flujo de caja creado');

    } catch (error) {
        console.error('❌ Error creando gráfico detallado de flujo de caja:', error);
    }
}

// ===== ACTUALIZACIÓN DE GRÁFICOS =====
function updateChartsForPeriod(period) {
    try {
        console.log(`📊 Actualizando gráficos para período: ${period}`);
        
        // Multiplicadores según período
        const multipliers = {
            'hoy': 0.033,
            'semana': 0.23,
            'mes': 1,
            'trimestre': 3,
            'año': 12
        };
        
        const multiplier = multipliers[period] || 1;
        
        // Actualizar datos de ingresos vs gastos
        if (charts.revenue) {
            const newRevenueData = CHART_DATA.revenue.map(val => Math.round(val * multiplier));
            const newExpensesData = CHART_DATA.expenses.map(val => Math.round(val * multiplier));
            
            charts.revenue.data.datasets[0].data = newRevenueData;
            charts.revenue.data.datasets[1].data = newExpensesData;
            charts.revenue.update('active');
        }
        
        // Actualizar otros gráficos proporcionalmente
        if (charts.expenses) {
            const newExpenseDistribution = CHART_DATA.expenseDistribution.data.map(val => Math.round(val * multiplier));
            charts.expenses.data.datasets[0].data = newExpenseDistribution;
            charts.expenses.update('active');
        }
        
        if (charts.cashFlow) {
            const newProjectedData = CHART_DATA.projectedCashFlow.map(val => Math.round(val * multiplier));
            charts.cashFlow.data.datasets[0].data = newProjectedData;
            charts.cashFlow.update('active');
        }
        
        if (charts.aging) {
            const newAgingData = CHART_DATA.agingData.amounts.map(val => Math.round(val * multiplier));
            charts.aging.data.datasets[0].data = newAgingData;
            charts.aging.update('active');
        }
        
        if (charts.cashFlowDetail) {
            const newDailyData = CHART_DATA.cashFlowDaily.map(val => Math.round(val * multiplier));
            charts.cashFlowDetail.data.datasets[0].data = newDailyData;
            charts.cashFlowDetail.update('active');
        }
        
        console.log('✅ Gráficos actualizados correctamente');
        
    } catch (error) {
        console.error('❌ Error actualizando gráficos:', error);
    }
}

// ===== UTILIDADES PARA GRÁFICOS =====
function updateChartData(chartName, newData) {
    try {
        if (charts[chartName]) {
            charts[chartName].data.datasets[0].data = newData;
            charts[chartName].update('active');
            console.log(`✅ Gráfico ${chartName} actualizado con nuevos datos`);
        }
    } catch (error) {
        console.error(`❌ Error actualizando gráfico ${chartName}:`, error);
    }
}

function addDataToChart(chartName, label, value) {
    try {
        if (charts[chartName]) {
            charts[chartName].data.labels.push(label);
            charts[chartName].data.datasets[0].data.push(value);
            charts[chartName].update('active');
            console.log(`✅ Datos agregados al gráfico ${chartName}`);
        }
    } catch (error) {
        console.error(`❌ Error agregando datos al gráfico ${chartName}:`, error);
    }
}

function removeDataFromChart(chartName) {
    try {
        if (charts[chartName]) {
            charts[chartName].data.labels.pop();
            charts[chartName].data.datasets[0].data.pop();
            charts[chartName].update('active');
            console.log(`✅ Datos removidos del gráfico ${chartName}`);
        }
    } catch (error) {
        console.error(`❌ Error removiendo datos del gráfico ${chartName}:`, error);
    }
}

// ===== EXPORTACIÓN DE GRÁFICOS =====
function exportChartAsImage(chartName, filename = null) {
    try {
        if (charts[chartName]) {
            const canvas = charts[chartName].canvas;
            const url = canvas.toDataURL('image/png');
            
            const link = document.createElement('a');
            link.download = filename || `grizalum_${chartName}_${new Date().toISOString().split('T')[0]}.png`;
            link.href = url;
            link.click();
            
            console.log(`✅ Gráfico ${chartName} exportado como imagen`);
        }
    } catch (error) {
        console.error(`❌ Error exportando gráfico ${chartName}:`, error);
    }
}

// ===== RESPONSIVE CHARTS =====
function resizeCharts() {
    try {
        Object.keys(charts).forEach(chartKey => {
            if (charts[chartKey] && typeof charts[chartKey].resize === 'function') {
                charts[chartKey].resize();
            }
        });
        console.log('✅ Gráficos redimensionados');
    } catch (error) {
        console.error('❌ Error redimensionando gráficos:', error);
    }
}

// ===== CLEANUP =====
function destroyAllCharts() {
    try {
        Object.keys(charts).forEach(chartKey => {
            if (charts[chartKey] && typeof charts[chartKey].destroy === 'function') {
                charts[chartKey].destroy();
                delete charts[chartKey];
            }
        });
        console.log('✅ Todos los gráficos destruidos');
    } catch (error) {
        console.error('❌ Error destruyendo gráficos:', error);
    }
}

// ===== ANIMACIONES PERSONALIZADAS =====
const customAnimations = {
    slideIn: {
        duration: 2000,
        easing: 'easeInOutQuart',
        from: {
            x: -100,
            opacity: 0
        },
        to: {
            x: 0,
            opacity: 1
        }
    },
    bounce: {
        duration: 2000,
        easing: 'easeOutBounce'
    },
    fade: {
        duration: 1500,
        easing: 'easeInOutQuad'
    }
};

// ===== EVENTOS DE GRÁFICOS =====
function setupChartEvents() {
    try {
        // Event listeners para interacciones con gráficos
        Object.keys(charts).forEach(chartKey => {
            if (charts[chartKey]) {
                charts[chartKey].canvas.addEventListener('click', function(event) {
                    const points = charts[chartKey].getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
                    
                    if (points.length) {
                        const firstPoint = points[0];
                        const label = charts[chartKey].data.labels[firstPoint.index];
                        const value = charts[chartKey].data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
                        
                        console.log(`📊 Click en ${chartKey}: ${label} = ${value}`);
                        
                        // Aquí se pueden agregar acciones personalizadas
                        handleChartClick(chartKey, label, value, firstPoint);
                    }
                });
            }
        });
        
        console.log('✅ Event listeners de gráficos configurados');
        
    } catch (error) {
        console.error('❌ Error configurando eventos de gráficos:', error);
    }
}

function handleChartClick(chartName, label, value, point) {
    try {
        // Personalizar comportamiento según el gráfico
        switch(chartName) {
            case 'revenue':
                console.log(`💰 Análisis detallado para ${label}: S/. ${value.toLocaleString()}`);
                break;
            case 'expenses':
                console.log(`💸 Desglose de ${label}: S/. ${value.toLocaleString()}`);
                break;
            case 'aging':
                console.log(`⏰ Cuentas en rango ${label}: S/. ${value.toLocaleString()}`);
                break;
            default:
                console.log(`📊 Dato seleccionado: ${label} = S/. ${value.toLocaleString()}`);
        }
        
        // Mostrar información adicional
        if (typeof showSuccessMessage === 'function') {
            showSuccessMessage(`📊 ${label}: S/. ${value.toLocaleString()}`);
        }
        
    } catch (error) {
        console.error('❌ Error manejando click en gráfico:', error);
    }
}

// ===== INICIALIZACIÓN AUTOMÁTICA =====
// Auto-inicializar cuando se carga el script
if (typeof window !== 'undefined') {
    // Hacer funciones disponibles globalmente
    window.initializeCharts = initializeCharts;
    window.updateChartsForPeriod = updateChartsForPeriod;
    window.updateChartData = updateChartData;
    window.exportChartAsImage = exportChartAsImage;
    window.resizeCharts = resizeCharts;
    
    // Configurar eventos de resize
    window.addEventListener('resize', debounce(resizeCharts, 250));
    
    // Configurar eventos de gráficos después de la inicialización
    setTimeout(setupChartEvents, 3000);
}

console.log('📊 Módulo de gráficos GRIZALUM cargado correctamente');
