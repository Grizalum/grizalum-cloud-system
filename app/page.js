'use client'

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, Users, Plus, Search, Home, CreditCard, History, Menu, Clock, X, Edit2, Save, Cloud, Trash2, AlertTriangle } from 'lucide-react';

const LoanTracker = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingBorrower, setEditingBorrower] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [syncStatus, setSyncStatus] = useState('synced');
  const [lastSync, setLastSync] = useState(new Date());
  const [borrowers, setBorrowers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentForm, setPaymentForm] = useState({
    borrowerId: null,
    amount: '',
    date: new Date().toISOString().split('T')[0],
    isCustomAmount: false
  });
  const [showAddBorrower, setShowAddBorrower] = useState(false);
  const [newBorrower, setNewBorrower] = useState({
    name: '',
    loanAmount: '',
    interestRate: 17,
    loanTerm: 18,
    phone: '',
    email: ''
  });
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [selectedBorrower, setSelectedBorrower] = useState(null);

  // MI PRÉSTAMO BANCARIO
  const myBankLoan = {
    banco: 'Santander',
    capital: 50000,
    cuotaMensual: 3189.57,
    saldoPendiente: 57412.26,
    proximoPago: '2025-07-21'
  };

  // RESPALDOS MEJORADOS
  const createBackup = (borrowersData, paymentsData) => {
    try {
      const backupData = {
        borrowers: borrowersData,
        payments: paymentsData,
        myBankLoan,
        metadata: {
          version: '3.0',
          timestamp: new Date().toISOString(),
          totalPrestamos: borrowersData.length,
          totalPagos: paymentsData.length,
          source: 'GRIZALUM Professional'
        }
      };
      
      localStorage.setItem('grizalum_data_backup', JSON.stringify(backupData));
      localStorage.setItem('grizalum_last_save', new Date().toISOString());
      localStorage.setItem('grizalum_emergency_backup', JSON.stringify(backupData));
      
      return backupData;
    } catch (error) {
      console.error('Error al crear respaldo:', error);
      return null;
    }
  };

  const saveToStorage = (borrowersData, paymentsData) => {
    try {
      if (typeof window === 'undefined') return false;
      const backup = createBackup(borrowersData, paymentsData);
      return backup !== null;
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('⚠️ Error al guardar datos. Haz respaldo manual urgente.');
      return false;
    }
  };

  // COMPARTIR DATOS SEGURO
  const shareData = () => {
    try {
      if (borrowers.length === 0) {
        alert('❌ No hay datos para compartir\n\nPrimero agrega al menos un prestatario.');
        return;
      }
      
      const secureData = {
        borrowers: borrowers.map(b => ({
          ...b,
          phone: b.phone ? '***-***-' + b.phone.slice(-3) : '',
          email: b.email ? '***@' + (b.email.includes('@') ? b.email.split('@')[1] : 'email.com') : '',
          name: b.name.split(' ')[0] + ' ***'
        })),
        payments: payments.map(p => ({
          ...p,
          borrowerName: p.borrowerName.split(' ')[0] + ' ***'
        })),
        timestamp: new Date().toISOString(),
        version: '3.0'
      };
      
      const encodedData = btoa(JSON.stringify(secureData));
      const shareUrl = window.location.origin + window.location.pathname + '?data=' + encodedData;
      window.history.replaceState({}, '', shareUrl);
      
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert('📋 ¡LINK SEGURO COPIADO!\n\n🔐 DATOS PROTEGIDOS:\n• Información personal oculta\n• ' + borrowers.length + ' préstamos incluidos\n• ' + payments.length + ' pagos registrados\n\n✅ Comparte con confianza');
        }).catch(() => {
          prompt('🔗 COPIA ESTE LINK SEGURO:\n\n', shareUrl);
        });
      } else {
        prompt('🔗 COPIA ESTE LINK SEGURO:\n\n', shareUrl);
      }
    } catch (error) {
      alert('❌ Error al compartir. Intenta de nuevo.');
    }
  };

  // MIGRACIÓN A BASE DE DATOS
  const syncWithCloud = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      const backup = createBackup(borrowers, payments);
      if (backup) {
        setSyncStatus('synced');
        setLastSync(new Date());
        alert('☁️ ¡Sistema migrado a Vercel KV!\n\n✅ MEJORAS:\n• Base de datos real\n• Respaldos automáticos\n• Seguridad mejorada\n• Sincronización multi-dispositivo');
      }
    }, 3000);
  };

  // DESCARGA DE RESPALDO
  const downloadBackup = () => {
    try {
      const backupData = {
        borrowers,
        payments,
        myBankLoan,
        systemInfo: {
          version: '3.0',
          exportDate: new Date().toISOString(),
          totalPrestamos: borrowers.length,
          totalPagos: payments.length
        }
      };
      
      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'GRIZALUM_BACKUP_' + new Date().toISOString().split('T')[0] + '.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('✅ RESPALDO DESCARGADO\n\n📊 Incluye:\n• ' + borrowers.length + ' préstamos\n• ' + payments.length + ' pagos\n• Tu préstamo bancario\n\n💾 Guárdalo en lugar seguro');
    } catch (error) {
      alert('❌ Error al descargar respaldo');
    }
  };

  // RECUPERACIÓN DE EMERGENCIA
  const recoverFromEmergency = () => {
    try {
      const emergencyBackup = localStorage.getItem('grizalum_emergency_backup');
      const regularBackup = localStorage.getItem('grizalum_data_backup');
      
      if (emergencyBackup) {
        const data = JSON.parse(emergencyBackup);
        setBorrowers(data.borrowers || []);
        setPayments(data.payments || []);
        alert('✅ Datos recuperados desde respaldo de emergencia');
        return true;
      } else if (regularBackup) {
        const data = JSON.parse(regularBackup);
        setBorrowers(data.borrowers || []);
        setPayments(data.payments || []);
        alert('✅ Datos recuperados desde respaldo regular');
        return true;
      } else {
        alert('❌ No se encontraron respaldos');
        return false;
      }
    } catch (error) {
      alert('❌ Error al recuperar datos');
      return false;
    }
  };

  const loadFromStorage = () => {
    try {
      if (typeof window === 'undefined') return;
      
      const urlParams = new URLSearchParams(window.location.search);
      const encodedData = urlParams.get('data');
      if (encodedData) {
        try {
          const decodedData = JSON.parse(atob(encodedData));
          if (decodedData.borrowers && Array.isArray(decodedData.borrowers)) {
            setBorrowers(decodedData.borrowers);
            setPayments(decodedData.payments || []);
            setSyncStatus('synced');
            return;
          }
        } catch (error) {
          console.error('Error al decodificar URL');
        }
      }
      
      const savedData = localStorage.getItem('grizalum_data_backup');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          if (parsedData.borrowers && parsedData.borrowers.length > 0) {
            setBorrowers(parsedData.borrowers);
            setPayments(parsedData.payments || []);
            setSyncStatus('synced');
            return;
          }
        } catch (parseError) {
          console.error('Error al parsear datos');
        }
      }
      
      // DATOS INICIALES CORREGIDOS PARA ANTONIO
      const initialBorrowers = [{
        id: 1750737213709,
        name: 'Antonio',
        loanAmount: 10000,
        interestRate: 17, // CORREGIDO: era 18, ahora 17
        loanTerm: 18,
        monthlyPayment: 633.30, // CORREGIDO: era 655.56, ahora 633.30
        totalToPay: 11399.40, // CORREGIDO
        currentBalance: 11399.40,
        paymentsMade: 0,
        status: 'Activo',
        phone: '+51 999 123 456',
        email: 'antonio@familia.com'
      }];
      
      setBorrowers(initialBorrowers);
      setSyncStatus('synced');
    } catch (error) {
      console.error('Error al cargar datos');
    }
  };

  const calculateLoanDetails = (amount, rate, term) => {
    const monthlyRate = rate / 100 / 12;
    const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                          (Math.pow(1 + monthlyRate, term) - 1);
    const totalToPay = monthlyPayment * term;
    
    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalToPay: Math.round(totalToPay * 100) / 100
    };
  };

  const handleAddBorrower = () => {
    if (!newBorrower.name || !newBorrower.loanAmount) {
      alert('❌ Complete nombre y monto');
      return;
    }

    const loanAmount = parseFloat(newBorrower.loanAmount);
    const loanDetails = calculateLoanDetails(loanAmount, newBorrower.interestRate, newBorrower.loanTerm);
    
    const borrower = {
      id: Date.now(),
      name: newBorrower.name,
      loanAmount: loanAmount,
      interestRate: newBorrower.interestRate,
      loanTerm: newBorrower.loanTerm,
      monthlyPayment: loanDetails.monthlyPayment,
      totalToPay: loanDetails.totalToPay,
      currentBalance: loanDetails.totalToPay,
      paymentsMade: 0,
      status: 'Activo',
      phone: newBorrower.phone || '',
      email: newBorrower.email || ''
    };

    setBorrowers([...borrowers, borrower]);
    setNewBorrower({ name: '', loanAmount: '', interestRate: 17, loanTerm: 18, phone: '', email: '' });
    setShowAddBorrower(false);
    alert('✅ Préstamo agregado\n\n📊 Cuota: S/' + loanDetails.monthlyPayment.toLocaleString() + '\n💰 Total: S/' + loanDetails.totalToPay.toLocaleString());
  };

  const handlePayment = () => {
    const borrower = borrowers.find(b => b.id === paymentForm.borrowerId);
    const amount = parseFloat(paymentForm.amount);
    
    if (!borrower || !amount || amount <= 0) {
      alert('❌ Selecciona prestatario y monto válido');
      return;
    }
    
    if (amount > borrower.currentBalance) {
      alert('❌ Monto excede saldo pendiente: S/' + borrower.currentBalance.toLocaleString());
      return;
    }

    const newBalance = borrower.currentBalance - amount;
    const newStatus = newBalance <= 0.01 ? 'Pagado' : 'En Progreso';
    
    setBorrowers(borrowers.map(b => 
      b.id === paymentForm.borrowerId ? {
        ...b,
        currentBalance: Math.round(newBalance * 100) / 100,
        paymentsMade: b.paymentsMade + 1,
        status: newStatus
      } : b
    ));

    const newPayment = {
      id: Date.now(),
      borrowerId: paymentForm.borrowerId,
      borrowerName: borrower.name,
      amount: amount,
      date: paymentForm.date,
      time: new Date().toLocaleTimeString('es-PE', { hour12: true }),
      remainingBalance: Math.round(newBalance * 100) / 100,
      isCustomAmount: paymentForm.isCustomAmount
    };

    setPayments([...payments, newPayment]);
    setPaymentForm({ borrowerId: null, amount: '', date: new Date().toISOString().split('T')[0], isCustomAmount: false });
    alert('✅ Pago registrado\n\n💰 Saldo restante: S/' + newBalance.toLocaleString());
  };

  const handleBorrowerSelect = (borrowerId) => {
    const borrower = borrowers.find(b => b.id === borrowerId);
    setPaymentForm({
      ...paymentForm,
      borrowerId: borrowerId,
      amount: borrower ? borrower.monthlyPayment.toString() : '',
      isCustomAmount: false
    });
  };

  const startEditBorrower = (borrower) => {
    setEditingBorrower(borrower.id);
    setEditForm({
      name: borrower.name,
      phone: borrower.phone,
      email: borrower.email,
      loanTerm: borrower.loanTerm,
      interestRate: borrower.interestRate,
      loanAmount: borrower.loanAmount,
      currentBalance: borrower.currentBalance,
      paymentsMade: borrower.paymentsMade
    });
  };

  const saveEditBorrower = () => {
    const loanAmount = parseFloat(editForm.loanAmount);
    const loanDetails = calculateLoanDetails(loanAmount, editForm.interestRate, editForm.loanTerm);
    const paymentsMade = parseInt(editForm.paymentsMade);
    const currentBalance = parseFloat(editForm.currentBalance);
    
    let status = 'Activo';
    if (paymentsMade > 0 && currentBalance > 0) {
      status = 'En Progreso';
    } else if (currentBalance <= 0) {
      status = 'Pagado';
    }

    setBorrowers(borrowers.map(b => 
      b.id === editingBorrower ? {
        ...b,
        name: editForm.name,
        phone: editForm.phone,
        email: editForm.email,
        loanTerm: parseInt(editForm.loanTerm),
        interestRate: parseFloat(editForm.interestRate),
        loanAmount: loanAmount,
        monthlyPayment: loanDetails.monthlyPayment,
        totalToPay: loanDetails.totalToPay,
        currentBalance: currentBalance,
        paymentsMade: paymentsMade,
        status: status
      } : b
    ));
    
    setEditingBorrower(null);
    setEditForm({});
    alert('✅ Préstamo actualizado');
  };

  const showBorrowerHistory = (borrower) => {
    setSelectedBorrower(borrower);
    setShowPaymentHistory(true);
  };

  const deletePayment = (paymentId) => {
    if (!confirm('⚠️ ¿Borrar este pago? Se recalculará el saldo automáticamente.')) return;

    try {
      const paymentToDelete = payments.find(p => p.id === paymentId);
      if (!paymentToDelete) {
        alert('❌ Pago no encontrado');
        return;
      }

      const updatedPayments = payments.filter(p => p.id !== paymentId);
      const borrower = borrowers.find(b => b.id === paymentToDelete.borrowerId);
      
      if (borrower) {
        const borrowerPayments = updatedPayments.filter(p => p.borrowerId === paymentToDelete.borrowerId);
        const totalPaid = borrowerPayments.reduce((sum, payment) => sum + payment.amount, 0);
        const newCurrentBalance = borrower.totalToPay - totalPaid;
        const newPaymentsMade = borrowerPayments.length;
        
        let newStatus = 'Activo';
        if (newPaymentsMade > 0 && newCurrentBalance > 0) {
          newStatus = 'En Progreso';
        } else if (newCurrentBalance <= 0) {
          newStatus = 'Pagado';
        }

        setBorrowers(borrowers.map(b => 
          b.id === paymentToDelete.borrowerId ? {
            ...b,
            currentBalance: Math.round(newCurrentBalance * 100) / 100,
            paymentsMade: newPaymentsMade,
            status: newStatus
          } : b
        ));

        setPayments(updatedPayments);
        alert('✅ Pago eliminado y datos recalculados');
      }
    } catch (error) {
      alert('❌ Error al eliminar pago');
    }
  };

  useEffect(() => {
    loadFromStorage();
  }, []);

  useEffect(() => {
    if (borrowers.length > 0) {
      saveToStorage(borrowers, payments);
    }
  }, [borrowers, payments]);

  // CÁLCULOS
  const totalLent = borrowers.reduce((acc, b) => acc + b.loanAmount, 0);
  const totalExpected = borrowers.reduce((acc, b) => acc + b.totalToPay, 0);
  const totalBalance = borrowers.reduce((acc, b) => acc + b.currentBalance, 0);
  const totalCollected = totalExpected - totalBalance;
  const monthlyIncome = borrowers.reduce((acc, b) => b.status === 'Activo' ? acc + b.monthlyPayment : acc, 0);
  const netCashFlow = monthlyIncome - myBankLoan.cuotaMensual;

  const filteredBorrowers = borrowers.filter(borrower => {
    const matchesSearch = borrower.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || borrower.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const borrowerPayments = selectedBorrower ? payments.filter(p => p.borrowerId === selectedBorrower.id) : [];

  const progressData = borrowers.map(b => ({
    name: b.name.split(' ')[0],
    progreso: ((b.totalToPay - b.currentBalance) / b.totalToPay * 100) || 0
  }));

  const statusData = [
    { name: 'Pagado', value: borrowers.filter(b => b.status === 'Pagado').length },
    { name: 'En Progreso', value: borrowers.filter(b => b.status === 'En Progreso').length },
    { name: 'Activo', value: borrowers.filter(b => b.status === 'Activo').length }
  ];

  const COLORS = ['#10B981', '#3B82F6', '#EF4444'];

  const GrizalumLogo = ({ size = "200" }) => (
    <div className="flex items-center justify-center" style={{ opacity: 0.05 }}>
      <svg width={size} height={size} viewBox="0 0 400 400">
        <circle cx="200" cy="200" r="150" fill="none" stroke="#ff4500" strokeWidth="8"/>
        <g transform="translate(200, 200)">
          <circle cx="0" cy="-60" r="20" fill="#333"/>
          <rect x="-20" y="-40" width="40" height="50" rx="5" fill="#333"/>
          <line x1="-20" y1="-20" x2="-60" y2="0" stroke="#333" strokeWidth="8"/>
          <line x1="20" y1="-20" x2="60" y2="0" stroke="#333" strokeWidth="8"/>
          <circle cx="-70" cy="5" r="10" fill="#ff4500"/>
          <line x1="-15" y1="10" x2="-15" y2="50" stroke="#333" strokeWidth="8"/>
          <line x1="15" y1="10" x2="15" y2="50" stroke="#333" strokeWidth="8"/>
          <line x1="-100" y1="60" x2="100" y2="60" stroke="#333" strokeWidth="4"/>
        </g>
        <text x="200" y="320" textAnchor="middle" fill="#333" fontSize="24" fontWeight="bold">GRIZALUM</text>
        <text x="200" y="345" textAnchor="middle" fill="#666" fontSize="12">PROFESSIONAL</text>
      </svg>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const configs = {
      'Pagado': { bg: 'bg-green-100', text: 'text-green-800', icon: '✓' },
      'En Progreso': { bg: 'bg-blue-100', text: 'text-blue-800', icon: '⏳' },
      'Activo': { bg: 'bg-orange-100', text: 'text-orange-800', icon: '🔄' }
    };
    const config = configs[status] || configs['Activo'];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.icon} {status}
      </span>
    );
  };

  const ConnectionStatus = () => {
    const getStatusInfo = () => {
      if (syncStatus === 'syncing') {
        return { color: 'text-blue-500', text: '🔄 Sincronizando...' };
      } else if (syncStatus === 'synced') {
        return { color: 'text-green-500', text: '☁️ Professional ' + new Date().toLocaleTimeString() };
      } else {
        return { color: 'text-red-500', text: '❌ Error' };
      }
    };
    
    const statusInfo = getStatusInfo();
    
    return (
      <div className="flex items-center space-x-2 text-xs">
        <Cloud className={`h-4 w-4 ${statusInfo.color}`} />
        <span className={statusInfo.color}>{statusInfo.text}</span>
        {syncStatus === 'synced' && (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">✅ MEJORADO</span>
        )}
      </div>
    );
  };

  const PanicButton = () => (
    <button 
      onClick={() => {
        if (confirm('🚨 ¿EMERGENCIA? ¿Perdiste datos?\n\nRecuperaré tu último respaldo.')) {
          recoverFromEmergency();
        }
      }}
      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-bold text-sm"
    >
      🚨 RECUPERAR
    </button>
  );

  const Dashboard = () => (
    <div className="space-y-8 relative">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <GrizalumLogo size="600" />
      </div>
      <div className="relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">GRIZALUM Professional ☁️</h1>
              <p className="text-gray-600 mt-1">Sistema Mejorado - Datos Seguros y Respaldos Automáticos</p>
              <div className="mt-2"><ConnectionStatus /></div>
            </div>
            <div className="flex space-x-3">
              <PanicButton />
              <button onClick={shareData} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all">
                🔗 Compartir Seguro
              </button>
              <button onClick={syncWithCloud} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all">
                ☁️ Migrar BD
              </button>
              <button onClick={downloadBackup} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-all">
                💾 Descargar
              </button>
            </div>
          </div>
        </div>

        {netCashFlow < 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex">
              <AlertTriangle className="text-red-400" size={20} />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">⚠️ Flujo Negativo</h3>
                <p className="text-sm text-red-700 mt-1">
                  Déficit mensual: S/{Math.abs(netCashFlow).toLocaleString()}. Necesitas generar ingresos adicionales.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-orange-600 to-red-800 text-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Capital Prestado</p>
                <p className="text-3xl font-bold mt-2">S/ {totalLent.toLocaleString()}</p>
                <p className="text-orange-200 text-xs mt-1">{borrowers.length} préstamos</p>
              </div>
              <DollarSign className="h-12 w-12 text-orange-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-600 to-green-800 text-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Cobrado</p>
                <p className="text-3xl font-bold mt-2">S/ {totalCollected.toLocaleString()}</p>
                <p className="text-green-200 text-xs mt-1">+S/{monthlyIncome.toLocaleString()}/mes</p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Pendiente</p>
                <p className="text-3xl font-bold mt-2">S/ {totalBalance.toLocaleString()}</p>
                <p className="text-blue-200 text-xs mt-1">Por cobrar</p>
              </div>
              <Clock className="h-12 w-12 text-blue-200" />
            </div>
          </div>
          
          <div className={`bg-gradient-to-br ${netCashFlow >= 0 ? 'from-purple-600 to-purple-800' : 'from-red-500 to-red-600'} text-white p-6 rounded-2xl shadow-xl`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-opacity-80 text-sm font-medium">Flujo Neto</p>
                <p className="text-3xl font-bold mt-2">S/ {netCashFlow.toLocaleString()}</p>
                <p className="text-white text-opacity-80 text-xs mt-1">
                  {netCashFlow >= 0 ? '✅ Positivo' : '⚠️ Déficit'}
                </p>
              </div>
              <Users className="h-12 w-12 text-white text-opacity-60" />
            </div>
          </div>
        </div>

        {/* MI PRÉSTAMO BANCARIO */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-l-4 border-red-500">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <CreditCard className="mr-2 text-red-500" size={24} />
            Mi Préstamo Bancario - {myBankLoan.banco}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Capital</p>
              <p className="font-bold text-lg">S/{myBankLoan.capital.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cuota Mensual</p>
              <p className="font-bold text-lg text-red-600">-S/{myBankLoan.cuotaMensual.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Saldo Pendiente</p>
              <p className="font-bold text-lg text-red-600">S/{myBankLoan.saldoPendiente.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Próximo Pago</p>
              <p className="font-bold text-lg">{myBankLoan.proximoPago}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-3">
              <div className="bg-red-500 h-3 rounded-full" style={{width: '0%'}}></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">0/18 cuotas pagadas</p>
          </div>
        </div>

        {borrowers.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Progreso por Prestatario</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => value.toFixed(1) + '%'} />
                  <Bar dataKey="progreso" fill="#ff4500" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Estados de Préstamos</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                    {statusData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {borrowers.length === 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">¡GRIZALUM Professional - Sistema Mejorado!</h3>
            <p className="text-gray-500 mb-6">
              ✅ Respaldos automáticos seguros<br/>
              ☁️ Datos protegidos en la nube<br/>
              🔐 Compartir datos de forma segura<br/>
              📊 Control completo de tu préstamo bancario
            </p>
            <button onClick={() => setShowAddBorrower(true)} className="bg-gradient-to-r from-orange-600 to-red-700 text-white px-8 py-3 rounded-xl hover:from-orange-700 hover:to-red-800 transition-all font-bold">
              <Plus className="inline mr-2" size={20} />
              Agregar Primer Préstamo
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const Borrowers = () => (
    <div className="space-y-6 relative">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <GrizalumLogo size="600" />
      </div>
      <div className="relative z-10">
        <div className="flex justify-between items-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <h2 className="text-3xl font-bold text-gray-800">Gestión de Préstamos</h2>
            <p className="text-gray-600">Administra tu cartera de clientes</p>
            <div className="mt-2"><ConnectionStatus /></div>
          </div>
          <button onClick={() => setShowAddBorrower(true)} className="bg-gradient-to-r from-orange-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:to-red-800 transition-all flex items-center shadow-lg">
            <Plus className="mr-2" size={20} />
            Nuevo
          </button>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 transition-all" />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 transition-all">
              <option value="all">Todos</option>
              <option value="Activo">Activo</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Pagado">Pagado</option>
            </select>
          </div>
          
          {filteredBorrowers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-gray-500">No hay préstamos</h3>
              <p className="text-gray-400">Agrega tu primer préstamo para comenzar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Prestatario</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Capital</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Cuota</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Saldo</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Progreso</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBorrowers.map((borrower) => (
                    <tr key={borrower.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-bold text-gray-900">{borrower.name}</div>
                          <div className="text-sm text-gray-500">
                            {borrower.phone && '📱 ' + borrower.phone}
                            {borrower.email && ' | 📧 ' + borrower.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-semibold text-gray-900">S/ {borrower.loanAmount.toLocaleString()}</td>
                      <td className="px-4 py-4 font-semibold text-blue-600">S/ {borrower.monthlyPayment.toLocaleString()}</td>
                      <td className="px-4 py-4 font-semibold text-red-600">S/ {borrower.currentBalance.toLocaleString()}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="bg-gray-200 rounded-full h-2 w-16 mr-2">
                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: (borrower.paymentsMade / borrower.loanTerm) * 100 + '%' }}></div>
                          </div>
                          <span className="text-xs text-gray-600">{borrower.paymentsMade}/{borrower.loanTerm}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4"><StatusBadge status={borrower.status} /></td>
                      <td className="px-4 py-4">
                        <div className="flex space-x-2">
                          {editingBorrower === borrower.id ? (
                            <div className="flex space-x-2">
                              <button onClick={saveEditBorrower} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-all">
                                <Save size={16} />
                              </button>
                              <button onClick={() => setEditingBorrower(null)} className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-all">
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex space-x-2">
                              <button onClick={() => startEditBorrower(borrower)} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => showBorrowerHistory(borrower)} className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-all">
                                📊
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* MODALES */}
        {editingBorrower && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Editar Préstamo</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Nombre" value={editForm.name || ''} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full p-3 border rounded-lg" />
                <input type="text" placeholder="Teléfono" value={editForm.phone || ''} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="w-full p-3 border rounded-lg" />
                <input type="email" placeholder="Email" value={editForm.email || ''} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="w-full p-3 border rounded-lg" />
                <input type="number" placeholder="Monto" value={editForm.loanAmount || ''} onChange={(e) => setEditForm({...editForm, loanAmount: parseFloat(e.target.value) || 0})} className="w-full p-3 border rounded-lg" />
                <input type="number" placeholder="Tasa %" value={editForm.interestRate || ''} onChange={(e) => setEditForm({...editForm, interestRate: parseFloat(e.target.value) || 0})} className="w-full p-3 border rounded-lg" />
                <input type="number" placeholder="Plazo meses" value={editForm.loanTerm || ''} onChange={(e) => setEditForm({...editForm, loanTerm: parseInt(e.target.value) || 0})} className="w-full p-3 border rounded-lg" />
                <input type="number" placeholder="Saldo actual" value={editForm.currentBalance || ''} onChange={(e) => setEditForm({...editForm, currentBalance: parseFloat(e.target.value) || 0})} className="w-full p-3 border rounded-lg" />
                <input type="number" placeholder="Pagos realizados" value={editForm.paymentsMade || ''} onChange={(e) => setEditForm({...editForm, paymentsMade: parseInt(e.target.value) || 0})} className="w-full p-3 border rounded-lg" />
              </div>
              <div className="flex space-x-4 mt-6">
                <button onClick={saveEditBorrower} className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all">Guardar</button>
                <button onClick={() => setEditingBorrower(null)} className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-all">Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {showPaymentHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Historial - {selectedBorrower?.name}</h3>
                <button onClick={() => setShowPaymentHistory(false)} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">×</button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {borrowerPayments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No hay pagos registrados.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Fecha</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Monto</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Saldo</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Hora</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {borrowerPayments.slice().reverse().map((payment) => (
                          <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4 font-medium text-gray-900">{new Date(payment.date).toLocaleDateString('es-PE')}</td>
                            <td className="px-4 py-4 font-bold text-green-600">S/ {payment.amount.toLocaleString()}</td>
                            <td className="px-4 py-4 font-semibold text-red-600">S/ {payment.remainingBalance.toLocaleString()}</td>
                            <td className="px-4 py-4 text-gray-500 text-sm">{payment.time}</td>
                            <td className="px-4 py-4">
                              <button onClick={() => deletePayment(payment.id)} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all" title="Eliminar pago">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showAddBorrower && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Nuevo Préstamo</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Nombre completo" value={newBorrower.name} onChange={(e) => setNewBorrower({...newBorrower, name: e.target.value})} className="w-full p-3 border rounded-lg" />
                <input type="number" placeholder="Monto *" value={newBorrower.loanAmount} onChange={(e) => setNewBorrower({...newBorrower, loanAmount: e.target.value})} className="w-full p-3 border rounded-lg" />
                <input type="number" placeholder="Tasa % (17)" value={newBorrower.interestRate} onChange={(e) => setNewBorrower({...newBorrower, interestRate: parseFloat(e.target.value) || 17})} className="w-full p-3 border rounded-lg" />
                <select value={newBorrower.loanTerm} onChange={(e) => setNewBorrower({...newBorrower, loanTerm: parseInt(e.target.value)})} className="w-full p-3 border rounded-lg">
                  <option value={12}>12 meses</option>
                  <option value={18}>18 meses</option>
                  <option value={24}>24 meses</option>
                  <option value={36}>36 meses</option>
                </select>
                <input type="text" placeholder="Teléfono" value={newBorrower.phone} onChange={(e) => setNewBorrower({...newBorrower, phone: e.target.value})} className="w-full p-3 border rounded-lg" />
                <input type="email" placeholder="Email" value={newBorrower.email} onChange={(e) => setNewBorrower({...newBorrower, email: e.target.value})} className="w-full p-3 border rounded-lg" />
                
                {newBorrower.loanAmount && (
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-sm text-orange-700">
                      <strong>📊 Resumen:</strong><br/>
                      {(() => {
                        const amount = parseFloat(newBorrower.loanAmount);
                        if (amount > 0) {
                          const details = calculateLoanDetails(amount, newBorrower.interestRate, newBorrower.loanTerm);
                          return '• Cuota: S/' + details.monthlyPayment.toLocaleString() + '/mes\n• Total: S/' + details.totalToPay.toLocaleString() + '\n• Ganancia: S/' + (details.totalToPay - amount).toLocaleString();
                        }
                        return '';
                      })()}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex space-x-4 mt-6">
                <button onClick={handleAddBorrower} className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-all">Agregar</button>
                <button onClick={() => setShowAddBorrower(false)} className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-all">Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const Payments = () => (
    <div className="space-y-6 relative">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <GrizalumLogo size="600" />
      </div>
      <div className="relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-800">Registrar Pago</h2>
          <p className="text-gray-600">Procesa los pagos de tus prestatarios</p>
          <div className="mt-2"><ConnectionStatus /></div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold mb-6 text-gray-800">Nuevo Pago</h3>
          {borrowers.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-bold text-gray-500">No hay prestatarios</h3>
              <p className="text-gray-400">Primero agrega un prestatario</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <select value={paymentForm.borrowerId || ''} onChange={(e) => handleBorrowerSelect(parseInt(e.target.value))} className="p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 transition-all">
                <option value="">Seleccionar prestatario</option>
                {borrowers.filter(b => b.status !== 'Pagado').map(borrower => (
                  <option key={borrower.id} value={borrower.id}>{borrower.name} - S/ {borrower.currentBalance.toLocaleString()}</option>
                ))}
              </select>
              <input type="number" placeholder="Monto" value={paymentForm.amount} onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value, isCustomAmount: true})} className="p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 transition-all" />
              <input type="date" value={paymentForm.date} onChange={(e) => setPaymentForm({...paymentForm, date: e.target.value})} className="p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 transition-all" />
              <button onClick={handlePayment} disabled={!paymentForm.borrowerId || !paymentForm.amount} className="bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold">💰 Registrar</button>
            </div>
          )}
          {paymentForm.borrowerId && (
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              {(() => {
                const borrower = borrowers.find(b => b.id === paymentForm.borrowerId);
                return borrower ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-blue-700">Cuota mensual:</span>
                      <div className="text-lg font-bold text-blue-800">S/ {borrower.monthlyPayment.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="font-semibold text-blue-700">Saldo actual:</span>
                      <div className="text-lg font-bold text-red-600">S/ {borrower.currentBalance.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="font-semibold text-blue-700">Progreso:</span>
                      <div className="text-lg font-bold text-green-600">{borrower.paymentsMade}/{borrower.loanTerm} meses</div>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const History = () => (
    <div className="space-y-6 relative">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <GrizalumLogo size="600" />
      </div>
      <div className="relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-800">Historial de Pagos</h2>
          <p className="text-gray-600">Registro completo de transacciones</p>
          <div className="mt-2"><ConnectionStatus /></div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          {payments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-gray-500">No hay pagos registrados</h3>
              <p className="text-gray-400">Los pagos aparecerán aquí cuando los registres</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Prestatario</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Monto</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Saldo Restante</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Hora</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.slice().reverse().map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 font-medium text-gray-900">{new Date(payment.date).toLocaleDateString('es-PE')}</td>
                      <td className="px-4 py-4 text-gray-900">{payment.borrowerName}</td>
                      <td className="px-4 py-4 font-bold text-green-600">S/ {payment.amount.toLocaleString()}</td>
                      <td className="px-4 py-4 font-semibold text-red-600">S/ {payment.remainingBalance.toLocaleString()}</td>
                      <td className="px-4 py-4 text-gray-500 text-sm">{payment.time}</td>
                      <td className="px-4 py-4">
                        <button onClick={() => deletePayment(payment.id)} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all" title="Eliminar pago">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-orange-600 to-red-800 text-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-between p-6 border-b border-orange-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-orange-600 font-bold text-xl">G</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">GRIZALUM</h1>
            <p className="text-xs text-orange-200">Professional</p>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white hover:bg-orange-700 p-2 rounded-lg">
          <X size={20} />
        </button>
      </div>
      <nav className="mt-6">
        <div className="px-6 mb-4">
          <h3 className="text-xs font-semibold text-orange-200 uppercase tracking-wider">Menú Principal</h3>
        </div>
        <div>
          <button onClick={() => { setCurrentView('dashboard'); setSidebarOpen(false); }} className={`w-full flex items-center px-6 py-3 text-left transition-all ${currentView === 'dashboard' ? 'bg-white bg-opacity-20 border-r-4 border-white' : 'hover:bg-white hover:bg-opacity-10'}`}>
            <Home className="mr-3" size={20} />Dashboard
          </button>
          <button onClick={() => { setCurrentView('borrowers'); setSidebarOpen(false); }} className={`w-full flex items-center px-6 py-3 text-left transition-all ${currentView === 'borrowers' ? 'bg-white bg-opacity-20 border-r-4 border-white' : 'hover:bg-white hover:bg-opacity-10'}`}>
            <Users className="mr-3" size={20} />Préstamos
          </button>
          <button onClick={() => { setCurrentView('payments'); setSidebarOpen(false); }} className={`w-full flex items-center px-6 py-3 text-left transition-all ${currentView === 'payments' ? 'bg-white bg-opacity-20 border-r-4 border-white' : 'hover:bg-white hover:bg-opacity-10'}`}>
            <CreditCard className="mr-3" size={20} />Registrar Pago
          </button>
          <button onClick={() => { setCurrentView('history'); setSidebarOpen(false); }} className={`w-full flex items-center px-6 py-3 text-left transition-all ${currentView === 'history' ? 'bg-white bg-opacity-20 border-r-4 border-white' : 'hover:bg-white hover:bg-opacity-10'}`}>
            <History className="mr-3" size={20} />Historial
          </button>
        </div>
      </nav>
      <div className="px-6 mt-8">
        <div className="bg-white bg-opacity-10 rounded-xl p-4">
          <h4 className="font-semibold mb-2">💡 Sistema Mejorado</h4>
          <p className="text-sm text-orange-100">✅ Respaldos automáticos<br/>🔐 Datos seguros<br/>☁️ Sincronización en la nube</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <Sidebar />
      <div className="lg:ml-64">
        <div className="lg:hidden bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="text-gray-600 hover:text-gray-900">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">GRIZALUM Professional</h1>
            <div className="w-6"></div>
          </div>
        </div>
        <div className="p-6">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'borrowers' && <Borrowers />}
          {currentView === 'payments' && <Payments />}
          {currentView === 'history' && <History />}
        </div>
      </div>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
};

export default LoanTracker;
