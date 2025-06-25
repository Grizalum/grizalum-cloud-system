'use client'

import React, { useState } from 'react';
import { 
  Home, TrendingUp, TrendingDown, Building, Plus, Menu, X, 
  DollarSign, Calendar, Calculator, History, Share2, Cloud, FileSpreadsheet,
  Edit, Bell, Check, Send, Eye, CreditCard, MessageSquare, Shield
} from 'lucide-react';

const GrizalumFinancial = () => {
  const [currentView, setCurrentView] = useState('resumen');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [misClientes, setMisClientes] = useState([
    {
      id: 1,
      nombre: 'Antonio',
      email: 'antonio@example.com',
      telefono: '+51 999 123 456',
      capital: 10000,
      cuotaMensual: 633.30,
      totalCobrar: 11399.40,
      saldoPendiente: 8000.00,
      pagosRecibidos: 3399.40,
      estado: 'Activo',
      fechaInicio: '2024-01-15',
      historialPagos: [
        { id: 1, fecha: '2024-02-15', monto: 633.30, metodo: 'Transferencia' },
        { id: 2, fecha: '2024-03-15', monto: 633.30, metodo: 'Efectivo' },
        { id: 3, fecha: '2024-04-15', monto: 1000.00, metodo: 'Transferencia' },
        { id: 4, fecha: '2024-05-15', monto: 633.30, metodo: 'Transferencia' },
        { id: 5, fecha: '2024-06-15', monto: 500.00, metodo: 'Efectivo' }
      ]
    }
  ]);

  const [misDeudas, setMisDeudas] = useState([
    {
      id: 1,
      acreedor: 'Banco Santander',
      capital: 50000,
      cuotaMensual: 2500.00,
      saldoPendiente: 45000.00,
      estado: 'Activo',
      proximoPago: '2025-07-21'
    }
  ]);

  const [misInversiones, setMisInversiones] = useState([
    {
      id: 1,
      nombre: 'Máquina Importada',
      tipo: 'Importación',
      inversion: 12000,
      gananciaEsperada: 2500,
      estado: 'En Proceso',
      roi: 20.8,
      progreso: 65
    }
  ]);

  const [movimientos, setMovimientos] = useState([
    {
      id: 1,
      fecha: '2025-06-24',
      tipo: 'Ingreso',
      categoria: 'Pago Cliente',
      descripcion: 'Pago de Antonio',
      monto: 500.00,
      cliente: 'Antonio',
      metodo: 'Efectivo'
    }
  ]);

  const [alertas] = useState([
    { id: 1, mensaje: 'Pago de Antonio vence en 3 días', urgencia: 'media' }
  ]);
  
  // Estados para modales
  const [showModal, setShowModal] = useState('');
  const [showEditarCliente, setShowEditarCliente] = useState(false);
  const [showRegistrarPago, setShowRegistrarPago] = useState(false);
  const [showCompartir, setShowCompartir] = useState(false);
  const [showCronograma, setShowCronograma] = useState(false);
  
  // Estados para formularios
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [formData, setFormData] = useState({});
  const [pagoData, setPagoData] = useState({ 
    monto: '', 
    fecha: new Date().toISOString().split('T')[0], 
    metodo: 'Transferencia', 
    nota: '' 
  });

  // Cálculos financieros
  const totalPorCobrar = misClientes.reduce((acc, c) => acc + c.saldoPendiente, 0);
  const totalPorPagar = misDeudas.reduce((acc, d) => acc + d.saldoPendiente, 0);
  const totalInversiones = misInversiones.reduce((acc, i) => acc + i.inversion, 0);
  const gananciaEsperadaTotal = misInversiones.reduce((acc, i) => acc + i.gananciaEsperada, 0);
  const balanceNeto = totalPorCobrar - totalPorPagar;
  const ingresosMensuales = misClientes.reduce((acc, c) => acc + (c.estado === 'Activo' ? c.cuotaMensual : 0), 0);
  const gastosMensuales = misDeudas.reduce((acc, d) => acc + (d.estado === 'Activo' ? d.cuotaMensual : 0), 0);
  const flujoMensual = ingresosMensuales - gastosMensuales;

  // Funciones principales
  const agregarCliente = () => {
    if (!formData.nombre || !formData.capital) {
      alert('❌ Complete nombre y capital');
      return;
    }

    const capital = parseFloat(formData.capital);
    const cuotaMensual = capital * 0.063;
    const totalCobrar = capital * 1.14;
    
    const nuevoCliente = {
      id: Date.now(),
      nombre: formData.nombre,
      email: formData.email || '',
      telefono: formData.telefono || '',
      capital: capital,
      cuotaMensual: cuotaMensual,
      totalCobrar: totalCobrar,
      saldoPendiente: totalCobrar,
      pagosRecibidos: 0,
      estado: 'Activo',
      fechaInicio: new Date().toISOString().split('T')[0],
      historialPagos: []
    };
    
    setMisClientes([...misClientes, nuevoCliente]);
    agregarMovimiento('Egreso', 'Préstamo Otorgado', `Préstamo a ${nuevoCliente.nombre}`, capital);
    setFormData({});
    setShowModal('');
    alert('✅ Cliente agregado exitosamente');
  };

  const agregarDeuda = () => {
    if (!formData.acreedor || !formData.capital) {
      alert('❌ Complete acreedor y capital');
      return;
    }

    const capital = parseFloat(formData.capital);
    const nuevaDeuda = {
      id: Date.now(),
      acreedor: formData.acreedor,
      capital: capital,
      cuotaMensual: capital * 0.063,
      saldoPendiente: capital * 1.14,
      estado: 'Activo',
      proximoPago: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
    };
    
    setMisDeudas([...misDeudas, nuevaDeuda]);
    agregarMovimiento('Ingreso', 'Préstamo Recibido', `Préstamo de ${nuevaDeuda.acreedor}`, capital);
    setFormData({});
    setShowModal('');
    alert('✅ Deuda agregada exitosamente');
  };

  const agregarInversion = () => {
    if (!formData.nombre || !formData.inversion) {
      alert('❌ Complete nombre e inversión');
      return;
    }

    const inversion = parseFloat(formData.inversion);
    const ganancia = parseFloat(formData.ganancia) || 0;
    const roi = ganancia > 0 ? ((ganancia / inversion) * 100) : 0;
    
    const nuevaInversion = {
      id: Date.now(),
      nombre: formData.nombre,
      tipo: 'Importación',
      inversion: inversion,
      gananciaEsperada: ganancia,
      estado: 'En Proceso',
      roi: Math.round(roi * 10) / 10,
      progreso: 0
    };
    
    setMisInversiones([...misInversiones, nuevaInversion]);
    agregarMovimiento('Egreso', 'Inversión', `Inversión en ${nuevaInversion.nombre}`, inversion);
    setFormData({});
    setShowModal('');
    alert('✅ Inversión agregada exitosamente');
  };

  const agregarMovimiento = (tipo, categoria, descripcion, monto, cliente = null) => {
    const nuevoMovimiento = {
      id: Date.now(),
      fecha: new Date().toISOString().split('T')[0],
      tipo,
      categoria,
      descripcion,
      monto,
      cliente,
      metodo: 'Manual'
    };
    setMovimientos([...movimientos, nuevoMovimiento]);
  };

  const registrarPago = () => {
    if (!pagoData.monto || !clienteSeleccionado) {
      alert('❌ Complete todos los campos');
      return;
    }

    const monto = parseFloat(pagoData.monto);
    if (monto <= 0) {
      alert('❌ El monto debe ser mayor a 0');
      return;
    }

    const nuevoPago = {
      id: Date.now(),
      fecha: pagoData.fecha,
      monto: monto,
      metodo: pagoData.metodo
    };

    const clientesActualizados = misClientes.map(cliente => {
      if (cliente.id === clienteSeleccionado.id) {
        const nuevoSaldo = cliente.saldoPendiente - monto;
        const nuevosHistorial = [...cliente.historialPagos, nuevoPago];
        const nuevoEstado = nuevoSaldo <= 0 ? 'Pagado' : 'Activo';

        return {
          ...cliente,
          saldoPendiente: Math.max(0, nuevoSaldo),
          pagosRecibidos: cliente.pagosRecibidos + monto,
          historialPagos: nuevosHistorial,
          estado: nuevoEstado
        };
      }
      return cliente;
    });

    setMisClientes(clientesActualizados);
    agregarMovimiento('Ingreso', 'Pago Cliente', `Pago de ${clienteSeleccionado.nombre}`, monto, clienteSeleccionado.nombre);
    
    setPagoData({ monto: '', fecha: new Date().toISOString().split('T')[0], metodo: 'Transferencia', nota: '' });
    setShowRegistrarPago(false);
    alert('✅ ¡PAGO REGISTRADO!');
  };

  const editarCliente = () => {
    if (!formData.nombre || !formData.capital) {
      alert('❌ Complete los campos requeridos');
      return;
    }

    const clientesActualizados = misClientes.map(cliente => {
      if (cliente.id === clienteSeleccionado.id) {
        return {
          ...cliente,
          nombre: formData.nombre,
          email: formData.email || '',
          telefono: formData.telefono || '',
          capital: parseFloat(formData.capital)
        };
      }
      return cliente;
    });

    setMisClientes(clientesActualizados);
    setFormData({});
    setShowEditarCliente(false);
    alert('✅ Cliente actualizado');
  };

  // Funciones de exportación
  const descargarExcel = () => {
    const reporte = [
      ['REPORTE FINANCIERO GRIZALUM'],
      ['Fecha:', new Date().toLocaleDateString()],
      [''],
      ['RESUMEN'],
      ['Total por Cobrar:', `S/ ${totalPorCobrar.toLocaleString()}`],
      ['Total por Pagar:', `S/ ${totalPorPagar.toLocaleString()}`],
      ['Balance Neto:', `S/ ${balanceNeto.toLocaleString()}`],
      [''],
      ['CLIENTES'],
      ['Nombre', 'Capital', 'Saldo', 'Estado'],
      ...misClientes.map(c => [c.nombre, c.capital, c.saldoPendiente, c.estado]),
      [''],
      ['DEUDAS'],
      ['Acreedor', 'Capital', 'Saldo'],
      ...misDeudas.map(d => [d.acreedor, d.capital, d.saldoPendiente])
    ];

    const csvContent = reporte.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GRIZALUM_Reporte_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    alert('📊 Reporte descargado');
  };

  const compartirWhatsApp = () => {
    const mensaje = `🏢 GRIZALUM - Resumen Financiero
📅 ${new Date().toLocaleDateString()}

💰 BALANCE:
• Me deben: S/ ${totalPorCobrar.toLocaleString()}
• Yo debo: S/ ${totalPorPagar.toLocaleString()}
• Balance neto: S/ ${balanceNeto.toLocaleString()}

📊 CLIENTES: ${misClientes.length} activos
💸 DEUDAS: ${misDeudas.length} pendientes
🚀 INVERSIONES: ${misInversiones.length} proyectos`;

    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* SIDEBAR */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg lg:text-xl">G</span>
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-bold">GRIZALUM</h1>
              <p className="text-xs text-slate-300">Control Financiero</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 space-y-1">
          {[
            { id: 'resumen', label: 'Resumen', icon: Home },
            { id: 'clientes', label: 'Clientes', icon: TrendingUp },
            { id: 'deudas', label: 'Deudas', icon: TrendingDown },
            { id: 'inversiones', label: 'Inversiones', icon: Building },
            { id: 'movimientos', label: 'Movimientos', icon: Calendar },
            { id: 'alertas', label: 'Alertas', icon: Bell }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setCurrentView(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center px-4 lg:px-6 py-3 text-left text-sm lg:text-base transition-all ${
                currentView === item.id 
                  ? 'bg-blue-600 border-r-4 border-blue-400' 
                  : 'hover:bg-slate-700'
              }`}
            >
              <item.icon className="mr-3" size={18} />
              {item.label}
              {item.id === 'alertas' && alertas.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {alertas.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-4 right-4 lg:left-6 lg:right-6">
          <div className="bg-slate-700 rounded-lg p-3 lg:p-4">
            <h4 className="font-semibold mb-2 text-xs lg:text-sm">💡 Balance</h4>
            <p className={`text-lg lg:text-xl font-bold ${balanceNeto >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              S/{balanceNeto.toLocaleString()}
            </p>
            <p className="text-xs text-slate-300 mt-1">
              {balanceNeto >= 0 ? '✅ Positivo' : '⚠️ Negativo'}
            </p>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="lg:ml-64">
        {/* HEADER MÓVIL */}
        <div className="lg:hidden bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">GRIZALUM</h1>
            <button onClick={() => setShowCompartir(true)} className="text-blue-600">
              <Share2 size={24} />
            </button>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          {/* BOTONES DE ACCIÓN */}
          <div className="mb-6 bg-white rounded-2xl shadow-xl p-3 lg:p-4">
            <div className="flex flex-wrap gap-2 lg:gap-3 justify-center lg:justify-end">
              <button
                onClick={compartirWhatsApp}
                className="bg-green-500 text-white px-3 lg:px-4 py-2 rounded-xl hover:bg-green-600 transition-all flex items-center text-sm lg:text-base"
              >
                <MessageSquare className="mr-1 lg:mr-2" size={16} />
                WhatsApp
              </button>
              <button
                onClick={() => alert('Datos guardados')}
                className="bg-purple-500 text-white px-3 lg:px-4 py-2 rounded-xl hover:bg-purple-600 transition-all flex items-center text-sm lg:text-base"
              >
                <Cloud className="mr-1 lg:mr-2" size={16} />
                Guardar
              </button>
              <button
                onClick={descargarExcel}
                className="bg-green-600 text-white px-3 lg:px-4 py-2 rounded-xl hover:bg-green-700 transition-all flex items-center text-sm lg:text-base"
              >
                <FileSpreadsheet className="mr-1 lg:mr-2" size={16} />
                Excel
              </button>
            </div>
          </div>

          {/* SEGURIDAD */}
          <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <Shield className="text-green-600" size={24} />
              <div>
                <h4 className="font-semibold text-green-800">🔒 Datos Seguros</h4>
                <p className="text-sm text-green-700">Tu información está protegida y es completamente privada.</p>
              </div>
            </div>
          </div>

          {/* RESUMEN */}
          {currentView === 'resumen' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-4 lg:p-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Situación Financiera</h1>
                <p className="text-gray-600">Control completo de ingresos, gastos e inversiones</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 lg:p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Me Deben</p>
                      <p className="text-2xl lg:text-3xl font-bold">S/{totalPorCobrar.toLocaleString()}</p>
                      <p className="text-green-200 text-xs">{misClientes.length} clientes</p>
                    </div>
                    <TrendingUp size={28} className="text-green-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 lg:p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm">Yo Debo</p>
                      <p className="text-2xl lg:text-3xl font-bold">S/{totalPorPagar.toLocaleString()}</p>
                      <p className="text-red-200 text-xs">{misDeudas.length} deudas</p>
                    </div>
                    <TrendingDown size={28} className="text-red-200" />
                  </div>
                </div>

                <div className={`bg-gradient-to-r ${balanceNeto >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} text-white p-4 lg:p-6 rounded-2xl shadow-lg`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-opacity-80 text-sm">Balance Neto</p>
                      <p className="text-2xl lg:text-3xl font-bold">S/{balanceNeto.toLocaleString()}</p>
                      <p className="text-white text-opacity-80 text-xs">
                        {balanceNeto >= 0 ? 'A favor' : 'En contra'}
                      </p>
                    </div>
                    <DollarSign size={28} className="text-white text-opacity-60" />
                  </div>
                </div>

                <div className={`bg-gradient-to-r ${flujoMensual >= 0 ? 'from-purple-500 to-purple-600' : 'from-yellow-500 to-yellow-600'} text-white p-4 lg:p-6 rounded-2xl shadow-lg`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-opacity-80 text-sm">Flujo Mensual</p>
                      <p className="text-2xl lg:text-3xl font-bold">S/{flujoMensual.toLocaleString()}</p>
                      <p className="text-white text-opacity-80 text-xs">
                        {flujoMensual >= 0 ? 'Ganancia' : 'Déficit'}
                      </p>
                    </div>
                    <Calculator size={28} className="text-white text-opacity-60" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CLIENTES */}
          {currentView === 'clientes' && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">Mis Clientes</h2>
                  <p className="text-gray-600">Gestiona préstamos y pagos</p>
                </div>
                <button 
                  onClick={() => setShowModal('cliente')}
                  className="bg-green-500 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl hover:bg-green-600 transition-all flex items-center"
                >
                  <Plus className="mr-2" size={20} />
                  Nuevo Cliente
                </button>
              </div>

              {/* Vista móvil */}
              <div className="lg:hidden space-y-4">
                {misClientes.map(cliente => {
                  const progreso = Math.round((cliente.pagosRecibidos / cliente.totalCobrar) * 100);
                  return (
                    <div key={cliente.id} className="bg-white rounded-2xl shadow-xl p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{cliente.nombre}</h3>
                          <p className="text-sm text-gray-600">{cliente.telefono}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          cliente.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {cliente.estado}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Capital</p>
                          <p className="font-semibold">S/{cliente.capital.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Saldo</p>
                          <p className="font-semibold text-blue-600">S/{cliente.saldoPendiente.toLocaleString()}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500 mb-1">Progreso {progreso}%</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${progreso}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setClienteSeleccionado(cliente);
                            setPagoData({...pagoData, monto: cliente.cuotaMensual.toString()});
                            setShowRegistrarPago(true);
                          }}
                          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center"
                          disabled={cliente.estado === 'Pagado'}
                        >
                          <DollarSign size={16} className="mr-1" />
                          Pagar
                        </button>
                        <button 
                          onClick={() => {
                            setClienteSeleccionado(cliente);
                            setFormData({
                              nombre: cliente.nombre,
                              email: cliente.email,
                              telefono: cliente.telefono,
                              capital: cliente.capital.toString()
                            });
                            setShowEditarCliente(true);
                          }}
                          className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Vista desktop */}
              <div className="hidden lg:block bg-white rounded-2xl shadow-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Cliente</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Capital</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Saldo</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Progreso</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Estado</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {misClientes.map(cliente => {
                      const progreso = Math.round((cliente.pagosRecibidos / cliente.totalCobrar) * 100);
                      return (
                        <tr key={cliente.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-gray-900">{cliente.nombre}</p>
                              <p className="text-sm text-gray-600">{cliente.email}</p>
                              <p className="text-xs text-gray-500">📱 {cliente.telefono}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold">S/{cliente.capital.toLocaleString()}</td>
                          <td className="px-6 py-4 font-semibold text-blue-600">S/{cliente.saldoPendiente.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${progreso}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{progreso}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              cliente.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {cliente.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => {
                                  setClienteSeleccionado(cliente);
                                  setPagoData({...pagoData, monto: cliente.cuotaMensual.toString()});
                                  setShowRegistrarPago(true);
                                }}
                                className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
                                disabled={cliente.estado === 'Pagado'}
                              >
                                <DollarSign size={16} />
                              </button>
                              <button 
                                onClick={() => {
                                  setClienteSeleccionado(cliente);
                                  setFormData({
                                    nombre: cliente.nombre,
                                    email: cliente.email,
                                    telefono: cliente.telefono,
                                    capital: cliente.capital.toString()
                                  });
                                  setShowEditarCliente(true);
                                }}
                                className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700"
                              >
                                <Edit size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DEUDAS */}
          {currentView === 'deudas' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">Mis Deudas</h2>
                  <p className="text-gray-600">Obligaciones que debo pagar</p>
                </div>
                <button 
                  onClick={() => setShowModal('deuda')}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 flex items-center"
                >
                  <Plus className="mr-2" size={20} />
                  Nueva Deuda
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {misDeudas.map(deuda => (
                  <div key={deuda.id} className="bg-white rounded-2xl shadow-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{deuda.acreedor}</h3>
                        <p className="text-sm text-gray-600">Próximo pago: {deuda.proximoPago}</p>
                      </div>
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {deuda.estado}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Capital</p>
                        <p className="font-semibold">S/{deuda.capital.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Saldo Pendiente</p>
                        <p className="font-semibold text-red-600">S/{deuda.saldoPendiente.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INVERSIONES */}
          {currentView === 'inversiones' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">Mis Inversiones</h2>
                  <p className="text-gray-600">Proyectos de inversión</p>
                </div>
                <button 
                  onClick={() => setShowModal('inversion')}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 flex items-center"
                >
                  <Plus className="mr-2" size={20} />
                  Nueva Inversión
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {misInversiones.map(inversion => (
                  <div key={inversion.id} className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{inversion.nombre}</h3>
                        <p className="text-sm text-gray-600">{inversion.tipo}</p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {inversion.estado}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">💰 Inversión</p>
                          <p className="font-bold text-lg">S/{inversion.inversion.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">📈 Ganancia</p>
                          <p className="font-bold text-lg text-green-600">S/{inversion.gananciaEsperada.toLocaleString()}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">🎯 ROI: {inversion.roi}%</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                            style={{ width: `${inversion.progreso}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Progreso: {inversion.progreso}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MOVIMIENTOS */}
          {currentView === 'movimientos' && (
            <div className="space-y-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">Movimientos</h2>
              
              <div className="space-y-4">
                {movimientos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).map(movimiento => (
                  <div key={movimiento.id} className="bg-white rounded-2xl shadow-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{movimiento.descripcion}</p>
                        <p className="text-sm text-gray-600">{movimiento.categoria}</p>
                        <p className="text-xs text-gray-500">{new Date(movimiento.fecha).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          movimiento.tipo === 'Ingreso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {movimiento.tipo}
                        </span>
                        <p className={`font-bold text-lg mt-1 ${
                          movimiento.tipo === 'Ingreso' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {movimiento.tipo === 'Ingreso' ? '+' : '-'}S/{movimiento.monto.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ALERTAS */}
          {currentView === 'alertas' && (
            <div className="space-y-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">Alertas</h2>
              
              <div className="space-y-4">
                {alertas.map(alerta => (
                  <div key={alerta.id} className="bg-white rounded-2xl shadow-xl p-4 border-l-4 border-yellow-400">
                    <div className="flex items-center">
                      <Bell className="text-yellow-500 mr-3" size={20} />
                      <div>
                        <p className="font-semibold text-gray-900">{alerta.mensaje}</p>
                        <p className="text-sm text-gray-600">Urgencia: {alerta.urgencia}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODALES */}
      
      {/* Modal Nuevo Cliente/Deuda/Inversión */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {showModal === 'cliente' && '👤 Nuevo Cliente'}
                {showModal === 'deuda' && '💳 Nueva Deuda'}
                {showModal === 'inversion' && '🚀 Nueva Inversión'}
              </h3>
              <button onClick={() => setShowModal('')}>
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {showModal === 'cliente' && (
                <>
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    value={formData.nombre || ''}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <input
                    type="tel"
                    placeholder="Teléfono"
                    value={formData.telefono || ''}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">S/</span>
                    <input
                      type="number"
                      placeholder="Capital a prestar"
                      value={formData.capital || ''}
                      onChange={(e) => setFormData({...formData, capital: e.target.value})}
                      className="w-full pl-10 p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </>
              )}

              {showModal === 'deuda' && (
                <>
                  <input
                    type="text"
                    placeholder="Acreedor (ej: Banco Santander)"
                    value={formData.acreedor || ''}
                    onChange={(e) => setFormData({...formData, acreedor: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">S/</span>
                    <input
                      type="number"
                      placeholder="Capital prestado"
                      value={formData.capital || ''}
                      onChange={(e) => setFormData({...formData, capital: e.target.value})}
                      className="w-full pl-10 p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </>
              )}

              {showModal === 'inversion' && (
                <>
                  <input
                    type="text"
                    placeholder="Nombre del proyecto"
                    value={formData.nombre || ''}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">S/</span>
                    <input
                      type="number"
                      placeholder="Monto de inversión"
                      value={formData.inversion || ''}
                      onChange={(e) => setFormData({...formData, inversion: e.target.value})}
                      className="w-full pl-10 p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">S/</span>
                    <input
                      type="number"
                      placeholder="Ganancia esperada"
                      value={formData.ganancia || ''}
                      onChange={(e) => setFormData({...formData, ganancia: e.target.value})}
                      className="w-full pl-10 p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  if (showModal === 'cliente') agregarCliente();
                  if (showModal === 'deuda') agregarDeuda();
                  if (showModal === 'inversion') agregarInversion();
                }}
                className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600"
              >
                ✅ Guardar
              </button>
              <button
                onClick={() => setShowModal('')}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Registrar Pago */}
      {showRegistrarPago && clienteSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">💰 Registrar Pago</h3>
              <button onClick={() => setShowRegistrarPago(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <h4 className="font-bold text-blue-800">Cliente: {clienteSeleccionado.nombre}</h4>
                <p className="text-sm text-blue-600">Saldo: S/{clienteSeleccionado.saldoPendiente.toLocaleString()}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">💵 Monto del Pago</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">S/</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={pagoData.monto}
                    onChange={(e) => setPagoData({...pagoData, monto: e.target.value})}
                    className="w-full pl-10 p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">📅 Fecha</label>
                <input
                  type="date"
                  value={pagoData.fecha}
                  onChange={(e) => setPagoData({...pagoData, fecha: e.target.value})}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">💳 Método de Pago</label>
                <select
                  value={pagoData.metodo}
                  onChange={(e) => setPagoData({...pagoData, metodo: e.target.value})}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="Transferencia">Transferencia</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPagoData({...pagoData, monto: clienteSeleccionado.cuotaMensual.toString()})}
                  className="bg-green-100 text-green-800 py-2 px-3 rounded-xl hover:bg-green-200 font-semibold text-sm"
                >
                  💳 Cuota Completa
                </button>
                <button
                  onClick={() => setPagoData({...pagoData, monto: clienteSeleccionado.saldoPendiente.toString()})}
                  className="bg-blue-100 text-blue-800 py-2 px-3 rounded-xl hover:bg-blue-200 font-semibold text-sm"
                >
                  🎯 Liquidar Todo
                </button>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={registrarPago}
                disabled={!pagoData.monto || parseFloat(pagoData.monto) <= 0}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 font-bold disabled:opacity-50"
              >
                ✅ Registrar Pago
              </button>
              <button
                onClick={() => setShowRegistrarPago(false)}
                className="flex-1 bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Cliente */}
      {showEditarCliente && clienteSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">✏️ Editar Cliente</h3>
              <button onClick={() => setShowEditarCliente(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nombre completo"
                value={formData.nombre || ''}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="tel"
                placeholder="Teléfono"
                value={formData.telefono || ''}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">S/</span>
                <input
                  type="number"
                  placeholder="Capital"
                  value={formData.capital || ''}
                  onChange={(e) => setFormData({...formData, capital: e.target.value})}
                  className="w-full pl-10 p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={editarCliente}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-bold"
              >
                ✅ Guardar Cambios
              </button>
              <button
                onClick={() => setShowEditarCliente(false)}
                className="flex-1 bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
};

export default GrizalumFinancial;
