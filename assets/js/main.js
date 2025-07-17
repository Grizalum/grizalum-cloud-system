/*
 * ============================================================================
 * GRIZALUM - Sistema Financiero Empresarial Premium
 * Archivo: main.js
 * Versión: 1.0.0
 * Descripción: Funcionalidad principal del sistema
 * ============================================================================
 */

// ===== VARIABLES GLOBALES =====
let charts = {};
let realTimeData = {
    cashFlow: 24500,
    revenue: 45200,
    expenses: 28700,
    profit: 16500,
    accountsReceivable: 32800,
    accountsPayable: 18900,
    inventory: 67300
};

let currentPeriod = 'mes';
let isLoadingComplete = false;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 GRIZALUM Sistema Financiero - Inicializando...');
    
    // Mostrar pantalla de carga
    showLoadingScreen();
    
    // Inicializar en secuencia
    setTimeout(() => {
        initializeSystem();
    }, 1000);
});

function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
        
        // Animar barra de progreso
        setTimeout(() => {
            const progress = loadingScreen.querySelector('.loading-progress');
            if (progress) {
                progress.style.width = '100%';
            }
        }, 500);
        
        // Ocultar pantalla de carga
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                isLoadingComplete = true;
            }, 500);
        }, 3000);
    }
}

function initializeSystem() {
    try {
        // Inicializar componentes principales
        initializeCharts();
        startRealTimeUpdates();
        setupEventListeners();
        animateKPIValues();
        setupAccessibility();
        setupKeyboardShortcuts();
        loadUserPreferences();
        
        // Mostrar mensaje de bienvenida
        setTimeout(() => {
            if (isLoadingComplete) {
                showSuccessMessage('🚀 GRIZALUM Sistema Premium - ¡Listo para usar!');
            }
        }, 3500);
        
        console.log('✅ Sistema completamente inicializado');
        console.log('🎯 Características activadas:');
        console.log('  📊 Gráficos interactivos con Chart.js');
        console.log('  🤖 Inteligencia Artificial predictiva');
        console.log('  ⚡ Micro-interacciones premium');
        console.log('  📱 Responsive design completo');
        console.log('  🔒 Validación y seguridad avanzada');
        console.log('  ♿ Accesibilidad total');
        console.log('  💰 Moneda: Soles peruanos (S/.)');
        console.log('  🎨 Diseño: Profesional y varonil');
        console.log('  🚀 Rendimiento: Optimizado al máximo');
        
    } catch (error) {
        console.error('❌ Error inicializando sistema:', error);
        showErrorMessage('Error inicializando el sistema. Por favor, recarga la página.');
    }
}

// ===== NAVEGACIÓN =====
function showSection(sectionId) {
    try {
        // Ocultar todas las secciones
        const sections = document.querySelectorAll('.page-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Mostrar sección seleccionada
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Actualizar estado de navegación
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        if (event && event.target) {
            const clickedLink = event.target.closest('.nav-link');
            if (clickedLink) {
                clickedLink.classList.add('active');
            }
        }

        // Actualizar título de página
        updatePageTitle(sectionId);
        
        // Guardar estado actual
        saveCurrentState(sectionId);
        
    } catch (error) {
        console.error('Error cambiando sección:', error);
    }
}

function updatePageTitle(sectionId) {
    const titles = {
        'dashboard': 'Dashboard Ejecutivo',
        'cash-flow': 'Flujo de Caja',
        'income-statement': 'Estado de Resultados',
        'balance-sheet': 'Balance General',
        'accounts-receivable': 'Cuentas por Cobrar',
        'accounts-payable': 'Cuentas por Pagar',
        'inventory': 'Inventario',
        'sales': 'Ventas',
        'purchases': 'Compras',
        'financial-analysis': 'Análisis Financiero',
        'reports': 'Reportes'
    };

    const subtitles = {
        'dashboard': 'Resumen financiero en tiempo real',
        'cash-flow': 'Gestión de entradas y salidas de efectivo',
        'income-statement': 'Análisis de ingresos y gastos',
        'balance-sheet': 'Estado de situación financiera',
        'accounts-receivable': 'Gestión de cobranzas',
        'accounts-payable': 'Gestión de pagos a proveedores',
        'inventory': 'Control de stock y rotación',
        'sales': 'Gestión de ventas y facturación',
        'purchases': 'Gestión de compras y proveedores',
        'financial-analysis': 'Indicadores y ratios financieros',
        'reports': 'Reportes ejecutivos y regulatorios'
    };

    const titleElement = document.getElementById('pageTitle');
    const subtitleElement = document.getElementById('pageSubtitle');
    
    if (titleElement) {
        titleElement.textContent = titles[sectionId] || 'GRIZALUM';
    }
    
    if (subtitleElement) {
        subtitleElement.textContent = subtitles[sectionId] || 'Sistema financiero';
    }
    
    // Actualizar título del documento
    document.title = `${titles[sectionId] || 'GRIZALUM'} - Sistema Financiero Empresarial`;
}

// ===== GESTIÓN DE PERÍODOS =====
function changePeriod(period, button) {
    try {
        if (!button) return;
        
        const buttons = document.querySelectorAll('.period-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        currentPeriod = period;
        
        // Mostrar estado de carga
        const originalText = button.textContent;
        button.innerHTML = '<span class="loading"></span>';
        button.disabled = true;
        
        // Simular carga de datos
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            updateFinancialData(period);
            showSuccessMessage(`📊 Datos actualizados para: ${period}`);
        }, 1500);
        
    } catch (error) {
        console.error('Error cambiando período:', error);
        showErrorMessage('Error actualizando período');
    }
}

function updateFinancialData(period) {
    try {
        // Multiplicadores según período
        const multipliers = {
            'hoy': 0.033,
            'semana': 0.23,
            'mes': 1,
            'trimestre': 3,
            'año': 12
        };
        
        const multiplier = multipliers[period] || 1;
        
        // Actualizar datos base
        const baseData = {
            cashFlow: 24500,
            revenue: 45200,
            expenses: 28700,
            profit: 16500
        };
        
        Object.keys(baseData).forEach(key => {
            realTimeData[key] = Math.round(baseData[key] * multiplier);
        });
        
        // Actualizar interfaz
        updateSidebarSummary();
        updateKPICards();
        updateChartsForPeriod(period);
        
    } catch (error) {
        console.error('Error actualizando datos financieros:', error);
    }
}

// ===== ACTUALIZACIONES EN TIEMPO REAL =====
function startRealTimeUpdates() {
    // Actualizar cada minuto
    setInterval(() => {
        updateRealTimeData();
        updateSidebarSummary();
        updateRealTimeIndicators();
    }, 60000);
    
    // Actualizar indicadores de tiempo cada 10 segundos
    setInterval(() => {
        updateTimeIndicators();
    }, 10000);
}

function updateRealTimeData() {
    try {
        // Simular cambios realistas en los datos
        const variance = 0.005; // 0.5% de variación
        
        Object.keys(realTimeData).forEach(key => {
            const change = (Math.random() - 0.5) * variance * 2;
            const newValue = realTimeData[key] * (1 + change);
            realTimeData[key] = Math.round(Math.max(0, newValue));
        });
        
        // Asegurar consistencia financiera
        realTimeData.profit = realTimeData.revenue - realTimeData.expenses;
        
    } catch (error) {
        console.error('Error actualizando datos en tiempo real:', error);
    }
}

function updateSidebarSummary() {
    try {
        const elements = {
            'sidebarCashFlow': realTimeData.cashFlow,
            'sidebarRevenue': realTimeData.revenue,
            'sidebarExpenses': realTimeData.expenses,
            'sidebarProfit': realTimeData.profit
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = formatCurrency(value);
            }
        });
        
    } catch (error) {
        console.error('Error actualizando resumen sidebar:', error);
    }
}

function updateKPICards() {
    try {
        const kpiValues = document.querySelectorAll('.kpi-value-animation');
        kpiValues.forEach((element, index) => {
            const dataKeys = ['cashFlow', 'revenue', 'expenses', 'profit', 'accountsReceivable', 'accountsPayable', 'inventory'];
            const dataKey = dataKeys[index];
            
            if (dataKey && realTimeData[dataKey]) {
                animateValue(element, realTimeData[dataKey]);
            }
        });
        
    } catch (error) {
        console.error('Error actualizando KPI cards:', error);
    }
}

function updateRealTimeIndicators() {
    try {
        const indicators = document.querySelectorAll('.real-time-indicator span');
        const now = new Date();
        const timeAgo = Math.floor(Math.random() * 5) + 1; // 1-5 minutos
        
        indicators.forEach(indicator => {
            if (indicator.textContent.includes('minutos')) {
                indicator.textContent = `Datos actualizados hace ${timeAgo} minutos`;
            }
        });
        
    } catch (error) {
        console.error('Error actualizando indicadores tiempo real:', error);
    }
}

// ===== ANIMACIONES =====
function animateKPIValues() {
    try {
        const values = document.querySelectorAll('.kpi-value-animation');
        
        values.forEach((element, index) => {
            setTimeout(() => {
                const finalValue = element.textContent;
                const numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, ''));
                
                if (!isNaN(numericValue)) {
                    animateValue(element, numericValue);
                }
            }, index * 200);
        });
        
    } catch (error) {
        console.error('Error animando valores KPI:', error);
    }
}

function animateValue(element, targetValue) {
    try {
        let current = 0;
        const increment = targetValue / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetValue) {
                current = targetValue;
                clearInterval(timer);
            }
            element.textContent = formatCurrency(Math.round(current));
        }, 40);
        
    } catch (error) {
        console.error('Error animando valor:', error);
    }
}

// ===== GESTIÓN DE FLUJO DE CAJA =====
function showCashFlowForm() {
    try {
        const form = document.getElementById('cashFlowForm');
        if (form) {
            form.style.display = 'block';
            
            // Establecer fecha actual
            const dateInput = document.getElementById('transactionDate');
            if (dateInput) {
                dateInput.value = new Date().toISOString().split('T')[0];
            }
            
            // Scroll suave al formulario
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
    } catch (error) {
        console.error('Error mostrando formulario flujo de caja:', error);
    }
}

function hideCashFlowForm() {
    try {
        const form = document.getElementById('cashFlowForm');
        if (form) {
            form.style.display = 'none';
        }
        
    } catch (error) {
        console.error('Error ocultando formulario flujo de caja:', error);
    }
}

function addCashFlowTransaction(event) {
    try {
        event.preventDefault();
        
        const formData = {
            date: document.getElementById('transactionDate')?.value,
            type: document.getElementById('transactionType')?.value,
            category: document.getElementById('transactionCategory')?.value,
            description: document.getElementById('transactionDescription')?.value,
            amount: parseFloat(document.getElementById('transactionAmount')?.value || 0),
            flow: document.getElementById('transactionFlow')?.value
        };
        
        // Validar datos
        if (!validateCashFlowForm(formData)) {
            return;
        }
        
        // Actualizar datos en tiempo real
        if (formData.flow === 'entrada') {
            realTimeData.cashFlow += formData.amount;
            realTimeData.revenue += formData.amount;
        } else {
            realTimeData.cashFlow -= formData.amount;
            realTimeData.expenses += formData.amount;
        }
        
        // Recalcular utilidad
        realTimeData.profit = realTimeData.revenue - realTimeData.expenses;
        
        // Actualizar interfaz
        updateSidebarSummary();
        updateCashFlowTable(formData);
        
        // Mostrar confirmación
        showSuccessMessage('✅ Transacción agregada exitosamente');
        
        // Limpiar y ocultar formulario
        event.target.reset();
        hideCashFlowForm();
        
    } catch (error) {
        console.error('Error agregando transacción:', error);
        showErrorMessage('Error agregando transacción');
    }
}

function updateCashFlowTable(transaction) {
    try {
        const tableBody = document.getElementById('cashFlowTableBody');
        if (!tableBody) return;
        
        const newRow = document.createElement('tr');
        const formatDate = (dateStr) => {
            return new Date(dateStr).toLocaleDateString('es-PE');
        };
        
        const formatAmount = (amount, flow) => {
            const formatted = formatCurrency(amount);
            if (flow === 'entrada') {
                return `<td style="color: var(--profit); font-weight: 700;">+${formatted}</td><td>-</td>`;
            } else {
                return `<td>-</td><td style="color: var(--loss); font-weight: 700;">-${formatted}</td>`;
            }
        };
        
        newRow.innerHTML = `
            <td>${formatDate(transaction.date)}</td>
            <td>${transaction.description}</td>
            <td>${transaction.category}</td>
            <td>${transaction.type}</td>
            ${formatAmount(transaction.amount, transaction.flow)}
            <td style="color: var(--profit); font-weight: 700;">${formatCurrency(realTimeData.cashFlow)}</td>
            <td>
                <button class="btn btn-sm btn-neutral micro-interaction" onclick="editTransaction(${Date.now()})">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        
        // Insertar con animación
        newRow.style.opacity = '0';
        newRow.style.transform = 'translateY(-20px)';
        tableBody.insertBefore(newRow, tableBody.firstChild);
        
        setTimeout(() => {
            newRow.style.transition = 'all 0.5s ease';
            newRow.style.opacity = '1';
            newRow.style.transform = 'translateY(0)';
        }, 100);
        
    } catch (error) {
        console.error('Error actualizando tabla flujo de caja:', error);
    }
}

// ===== VALIDACIONES =====
function validateCashFlowForm(formData) {
    try {
        const errors = [];
        
        if (!formData.date) errors.push('La fecha es requerida');
        if (!formData.description) errors.push('La descripción es requerida');
        if (!formData.amount || formData.amount <= 0) errors.push('El monto debe ser mayor a cero');
        if (!formData.type) errors.push('El tipo de actividad es requerido');
        if (!formData.flow) errors.push('El tipo de flujo es requerido');
        if (!formData.category) errors.push('La categoría es requerida');
        
        if (errors.length > 0) {
            showErrorMessage('Errores encontrados:\n\n' + errors.join('\n'));
            return false;
        }
        
        return true;
        
    } catch (error) {
        console.error('Error validando formulario:', error);
        return false;
    }
}

function
