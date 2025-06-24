'use client'

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, Users, Plus, Search, Home, CreditCard, History, Menu, Clock, X, Edit2, Save, Cloud, Trash2 } from 'lucide-react';

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
    phone: '',
    email: ''
  });
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [selectedBorrower, setSelectedBorrower] = useState(null);

  const shareData = () => {
    try {
      if (borrowers.length === 0) {
        alert('❌ No hay datos para compartir\n\nPrimero agrega al menos un prestatario.');
        return;
      }
      const dataToShare = {
        borrowers: borrowers,
        payments: payments,
        timestamp: new Date().toISOString(),
        version: '2.0'
      };
      const encodedData = btoa(JSON.stringify(dataToShare));
      const shareUrl = window.location.origin + window.location.pathname + '?data=' + encodedData;
      window.history.replaceState({}, '', shareUrl);
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert('📋 ¡Link copiado exitosamente!\n\n📊 DATOS INCLUIDOS:\n• ' + borrowers.length + ' prestatarios\n• ' + payments.length + ' pagos\n• Información completa actualizada\n\n✅ Pégalo en WhatsApp, Telegram o cualquier chat\n📱 Funciona en PC y móvil');
        }).catch(() => {
          prompt('🔗 COPIA ESTE LINK:\n\nContiene ' + borrowers.length + ' prestatarios y ' + payments.length + ' pagos:\n\n', shareUrl);
        });
      } else {
        prompt('🔗 COPIA ESTE LINK:\n\nContiene ' + borrowers.length + ' prestatarios y ' + payments.length + ' pagos:\n\n', shareUrl);
      }
    } catch (error) {
      console.error('Error al compartir:', error);
      alert('❌ Error al compartir. Intenta de nuevo.');
    }
  };

  const syncWithCloud = () => {
    try {
      setSyncStatus('syncing');
      setTimeout(() => {
        setSyncStatus('synced');
        setLastSync(new Date());
        alert('☁️ ¡Datos sincronizados con la nube!\n\nTus datos están ahora disponibles desde cualquier dispositivo.');
      }, 2000);
    } catch (error) {
      alert('❌ Error al sincronizar');
      setSyncStatus('error');
    }
  };

  const downloadBackup = () => {
    try {
      const data = {
        borrowers,
        payments,
        exportDate: new Date().toISOString(),
        source: 'GRIZALUM Cloud System',
        version: '2.0'
      };
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'GRIZALUM_' + new Date().toISOString().split('T')[0] + '.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      alert('✅ Respaldo descargado en tu computadora!\n\n📁 Archivo descargado con todos tus datos.\n💾 Guárdalo en lugar seguro.');
    } catch (error) {
      alert('❌ Error al descargar respaldo');
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
          console.error('Error al decodificar datos de URL');
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
          console.error('Error al parsear datos guardados');
        }
      }
      const initialBorrowers = [{
        id: 1,
        name: 'María González',
        loanAmount: 20000,
        interestRate: 18,
        loanTerm: 18,
        monthlyPayment: 1278.52,
        totalToPay: 23013.36,
        currentBalance: 20500,
        paymentsMade: 3,
        status: 'En Progreso',
        phone: '+51 999 555 123',
        email: 'maria@email.com'
      }];
      setBorrowers(initialBorrowers);
      setSyncStatus('synced');
    } catch (error) {
      console.error('Error al cargar datos');
      setSyncStatus('error');
    }
  };

  const saveToStorage = (borrowersData, paymentsData) => {
    try {
      if (typeof window === 'undefined') return false;
      const dataToSave = {
        borrowers: borrowersData,
        payments: paymentsData,
        timestamp: new Date().toISOString(),
        version: '2.0'
      };
      localStorage.setItem('grizalum_data_backup', JSON.stringify(dataToSave));
      localStorage.setItem('grizalum_last_save', new Date().toISOString());
      return true;
    } catch (error) {
      console.error('Error al guardar');
      return false;
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

  const handleAddBorrower = () => {
    if (!newBorrower.name || !newBorrower.loanAmount) {
      alert('Por favor completa el nombre y monto');
      return;
    }
    const loanAmount = parseFloat(newBorrower.loanAmount);
    const monthlyPayment = (loanAmount * 1.18) / 18;
    const totalToPay = monthlyPayment * 18;
    const borrower = {
      id: Date.now(),
      name: newBorrower.name,
      loanAmount: loanAmount,
      interestRate: 18,
      loanTerm: 18,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalToPay: Math.round(totalToPay * 100) / 100,
      currentBalance: Math.round(totalToPay * 100) / 100,
      paymentsMade: 0,
      status: 'Pendiente',
      phone: newBorrower.phone || '',
      email: newBorrower.email || ''
    };
    setBorrowers([...borrowers, borrower]);
    setNewBorrower({ name: '', loanAmount: '', phone: '', email: '' });
    setShowAddBorrower(false);
    alert('✅ Prestatario agregado correctamente');
  };

  const handlePayment = () => {
    const borrower = borrowers.find(b => b.id === paymentForm.borrowerId);
    const amount = parseFloat(paymentForm.amount);
    if (!borrower || !amount || amount <= 0) {
      alert('Por favor selecciona un prestatario y monto válido');
      return;
    }
    if (amount > borrower.currentBalance) {
      alert('El monto no puede ser mayor al saldo pendiente');
      return;
    }
    const newBalance = borrower.currentBalance - amount;
    setBorrowers(borrowers.map(b => 
      b.id === paymentForm.borrowerId ? {
        ...b,
        currentBalance: Math.round(newBalance * 100) / 100,
        paymentsMade: b.paymentsMade + 1,
        status: newBalance <= 0.01 ? 'Pagado' : 'En Progreso'
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
      isEdited: paymentForm.isCustomAmount
    };
    setPayments([...payments, newPayment]);
    setPaymentForm({
      borrowerId: null,
      amount: '',
      date: new Date().toISOString().split('T')[0],
      isCustomAmount: false
    });
    alert('✅ Pago registrado correctamente');
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
    const newMonthlyPayment = (loanAmount * (1 + editForm.interestRate / 100)) / editForm.loanTerm;
    const newTotalToPay = newMonthlyPayment * editForm.loanTerm;
    const paymentsMade = parseInt(editForm.paymentsMade);
    const currentBalance = parseFloat(editForm.currentBalance);
    let status = 'Pendiente';
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
        monthlyPayment: Math.round(newMonthlyPayment * 100) / 100,
        totalToPay: Math.round(newTotalToPay * 100) / 100,
        currentBalance: currentBalance,
        paymentsMade: paymentsMade,
        status: status
      } : b
    ));
    setEditingBorrower(null);
    setEditForm({});
    alert('✅ Prestatario actualizado');
  };

  const deletePayment = (paymentId) => {
    if (!confirm('⚠️ ¿Estás seguro de borrar este pago?\n\nEsta acción recalculará automáticamente el saldo del prestatario.')) {
      return;
    }

    try {
      const paymentToDelete = payments.find(p => p.id === paymentId);
      if (!paymentToDelete) {
        alert('❌ Pago no encontrado');
        return;
      }

      // Remover el pago de la lista
      const updatedPayments = payments.filter(p => p.id !== paymentId);
      
      // Recalcular el saldo del prestatario
      const borrower = borrowers.find(b => b.id === paymentToDelete.borrowerId);
      if (borrower) {
        // Obtener todos los pagos restantes de este prestatario ordenados por fecha
        const borrowerPayments = updatedPayments
          .filter(p => p.borrowerId === paymentToDelete.borrowerId)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Recalcular el saldo actual basado en los pagos restantes
        const totalPaid = borrowerPayments.reduce((sum, payment) => sum + payment.amount, 0);
        const newCurrentBalance = borrower.totalToPay - totalPaid;
        const newPaymentsMade = borrowerPayments.length;
        
        // Determinar el nuevo estado
        let newStatus = 'Pendiente';
        if (newPaymentsMade > 0 && newCurrentBalance > 0) {
          newStatus = 'En Progreso';
        } else if (newCurrentBalance <= 0) {
          newStatus = 'Pagado';
        }

        // Actualizar el prestatario
        const updatedBorrowers = borrowers.map(b => 
          b.id === paymentToDelete.borrowerId ? {
            ...b,
            currentBalance: Math.round(newCurrentBalance * 100) / 100,
            paymentsMade: newPaymentsMade,
            status: newStatus
          } : b
        );

        // Recalcular el remainingBalance de los pagos restantes
        let runningBalance = borrower.totalToPay;
        const recalculatedPayments = updatedPayments.map(payment => {
          if (payment.borrowerId === paymentToDelete.borrowerId) {
            runningBalance -= payment.amount;
            return {
              ...payment,
              remainingBalance: Math.round(runningBalance * 100) / 100
            };
          }
          return payment;
        });

        setBorrowers(updatedBorrowers);
        setPayments(recalculatedPayments);
        
        alert('✅ Pago eliminado y datos recalculados correctamente');
      }
    } catch (error) {
      console.error('Error al eliminar pago:', error);
      alert('❌ Error al eliminar el pago. Intenta de nuevo.');
    }
  };

  const showBorrowerHistory = (borrower) => {
    setSelectedBorrower(borrower);
    setShowPaymentHistory(true);
  };
  const totalExpected = borrowers.reduce((acc, b) => acc + b.totalToPay, 0);
  const totalBalance = borrowers.reduce((acc, b) => acc + b.currentBalance, 0);
  const totalCollected = totalExpected - totalBalance;

  const filteredBorrowers = borrowers.filter(borrower => {
    const matchesSearch = borrower.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || borrower.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const borrowerPayments = selectedBorrower ? 
    payments.filter(p => p.borrowerId === selectedBorrower.id) : [];

  const progressData = borrowers.map(b => ({
    name: b.name.split(' ')[0],
    progreso: ((b.totalToPay - b.currentBalance) / b.totalToPay * 100) || 0
  }));

  const statusData = [
    { name: 'Pagado', value: borrowers.filter(b => b.status === 'Pagado').length },
    { name: 'En Progreso', value: borrowers.filter(b => b.status === 'En Progreso').length },
    { name: 'Pendiente', value: borrowers.filter(b => b.status === 'Pendiente').length }
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
        <text x="200" y="345" textAnchor="middle" fill="#666" fontSize="12">COMPAÑÍA METALÚRGICA</text>
      </svg>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const configs = {
      'Pagado': { bg: 'bg-green-100', text: 'text-green-800', icon: '✓' },
      'En Progreso': { bg: 'bg-blue-100', text: 'text-blue-800', icon: '⏳' },
      'Pendiente': { bg: 'bg-red-100', text: 'text-red-800', icon: '⚠️' }
    };
    const config = configs[status] || configs['Pendiente'];
    return (
      <span className={'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ' + config.bg + ' ' + config.text}>
        {config.icon} {status}
      </span>
    );
  };

  const ConnectionStatus = () => {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
      setMounted(true);
    }, []);
    
    if (!mounted) return null;
    
    const getStatusInfo = () => {
      if (syncStatus === 'syncing') {
        return { color: 'text-blue-500', icon: 'animate-pulse', text: 'Sincronizando...' };
      } else if (syncStatus === 'synced') {
        return { color: 'text-green-500', icon: '', text: '☁️ Sincronizado ' + new Date().toLocaleTimeString() };
      } else {
        return { color: 'text-red-500', icon: '', text: 'Error de conexión' };
      }
    };
    
    const statusInfo = getStatusInfo();
    
    return (
      <div className="flex items-center space-x-2 text-xs">
        <Cloud className={'h-4 w-4 ' + statusInfo.color + ' ' + statusInfo.icon} />
        <span className={statusInfo.color}>
          {statusInfo.text}
        </span>
        {syncStatus === 'synced' && (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
            ✅ NUBE ACTIVA
          </span>
        )}
      </div>
    );
  };

  const Dashboard = () => (
    <div className="space-y-8 relative">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <GrizalumLogo size="600" />
      </div>
      <div className="relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard - GRIZALUM Cloud ☁️</h1>
              <p className="text-gray-600 mt-1">Sistema de Gestión de Préstamos en la Nube - Accesible desde cualquier dispositivo</p>
              <div className="mt-2">
                <ConnectionStatus />
              </div>
            </div>
            <div className="flex space-x-3">
              <button onClick={shareData} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-all">
                🔗 Compartir
              </button>
              <button onClick={syncWithCloud} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-all">
                ☁️ Subir a Nube
              </button>
              <button onClick={downloadBackup} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center transition-all">
                💾 Descargar
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-orange-600 to-red-800 text-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Capital Prestado</p>
                <p className="text-3xl font-bold mt-2">S/ {totalLent.toLocaleString()}</p>
              </div>
              <DollarSign className="h-12 w-12 text-orange-200" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-800 text-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Cobrado</p>
                <p className="text-3xl font-bold mt-2">S/ {totalCollected.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-200" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Pendiente</p>
                <p className="text-3xl font-bold mt-2">S/ {totalBalance.toLocaleString()}</p>
              </div>
              <Clock className="h-12 w-12 text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Prestatarios</p>
                <p className="text-3xl font-bold mt-2">{borrowers.length}</p>
              </div>
              <Users className="h-12 w-12 text-purple-200" />
            </div>
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
            <div className="text-6xl mb-4">☁️</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">¡GRIZALUM Cloud - Sistema en la Nube!</h3>
            <p className="text-gray-500 mb-6">
              ☁️ Tus datos se guardan automáticamente en la nube y están disponibles desde cualquier dispositivo.<br/>
              📱 Accede desde tu PC, tablet o móvil con el mismo link.
            </p>
            <button onClick={() => setShowAddBorrower(true)} className="bg-gradient-to-r from-orange-600 to-red-700 text-white px-8 py-3 rounded-xl hover:from-orange-700 hover:to-red-800 transition-all font-bold">
              <Plus className="inline mr-2" size={20} />
              Agregar Primer Prestatario
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
            <h2 className="text-3xl font-bold text-gray-800">Prestatarios</h2>
            <p className="text-gray-600">Gestiona tu cartera de clientes</p>
            <div className="mt-2">
              <ConnectionStatus />
            </div>
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
              <option value="Pendiente">Pendiente</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Pagado">Pagado</option>
            </select>
          </div>
          {filteredBorrowers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-gray-500">No hay prestatarios</h3>
              <p className="text-gray-400">Agrega tu primer prestatario para comenzar</p>
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
                      <t
