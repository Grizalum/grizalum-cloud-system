'use client'

import React, { useState } from 'react';
import { 
  Home, TrendingUp, TrendingDown, Building, Plus, Menu, X, 
  DollarSign, Calendar, AlertCircle, Calculator, Edit, 
  Trash2, History
} from 'lucide-react';

const GrizalumFinancial = () => {
  const [currentView, setCurrentView] = useState('resumen');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [misClientes, setMisClientes] = useState([
    {
      id: 1,
      nombre: 'Antonio',
      tipo: 'Préstamo Familiar',
      capital: 10000,
      tasa: 17,
      plazo: 18,
      cuotaMensual: 633.30,
      totalCobrar: 11399.40,
      saldoPendiente: 11399.40,
      pagosRecibidos: 0,
      estado: 'Activo',
      proximoCobro: '2025-07-24',
      telefono: '+51 999 123 456',
      historialPagos: []
    }
  ]);

  const [misDeudas, setMisDeudas] = useState([
    {
      id: 1,
      acreedor: 'Banco Santander',
      tipo: 'Préstamo Personal',
      capital: 50000,
      tasa: 17,
      plazo: 18,
      cuotaMensual: 3189.57,
      totalPagar: 57412.26,
      saldoPendiente: 57412.26,
      pagosPagados: 0,
      estado: 'Activo',
      proximoPago: '2025-07-21',
      modalidad: 'Débito Automático'
    }
  ]);

  const [misInversiones, setMisInversiones] = useState([
    {
      id: 1,
      nombre: 'Máquina Importada',
      tipo: 'Importación',
      inversion: 12000,
      gananciaEsperada: 2500,
      fechaVenta: '2025-08-24',
      estado: 'En Proceso',
      roi: 20.8,
      cliente: 'Cliente Garantizado'
    }
  ]);
  
  const [showNuevoCliente, setShowNuevoCliente] = useState(false);
  const [showNuevaInversion, setShowNuevaInversion] = useState(false);
  const [showPagarCliente, setShowPagarCliente] = useState(false);
  const [showHistorialPagos, setShowHistorialPagos] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '', capital: '', tasa: 17, plazo: 18, telefono: '', tipo: 'Préstamo'
  });
  const [nuevaInversion, setNuevaInversion] = useState({
    nombre: '', tipo: 'Importación', inversion: '', gananciaEsperada: '', fechaVenta: '', cliente: ''
  });
  const [montoPago, setMontoPago] = useState('');

  // CÁLCULOS
  const totalPorCobrar = misClientes.reduce((acc, c) => acc + c.saldoPendiente, 0);
  const totalPorPagar = misDeudas.reduce((acc, d) => acc + d.saldoPendiente, 0);
  const balanceNeto = totalPorCobrar - totalPorPagar;
  const ingresosMensuales = misClientes.reduce((acc, c) => acc + (c.estado === 'Activo' ? c.cuotaMensual : 0), 0);
  const gastosMensuales = misDeudas.reduce((acc, d) => acc + (d.estado === 'Activo' ? d.cuotaMensual : 0), 0);
  const flujoMensual = ingresosMensuales - gastosMensuales;

  // FUNCIONES
  const calcularPrestamo = (capital, tasa, plazo) => {
    const tasaMensual = tasa / 100 / 12;
    const cuotaMensual = (capital * tasaMensual * Math.pow(1 + tasaMensual, plazo)) / 
                        (Math.pow(1 + tasaMensual, plazo) - 1);
    return {
      cuotaMensual: Math.round(cuotaMensual * 100) / 100,
      totalPagar: Math.round(cuotaMensual * plazo * 100) / 100
    };
  };

  const agregarCliente = () => {
    if (!nuevoCliente.nombre || !nuevoCliente.capital) {
      alert('❌ Complete nombre y capital');
      return;
    }

    const capital = parseFloat(nuevoCliente.capital);
    const prestamo = calcularPrestamo(capital, nuevoCliente.tasa, nuevoCliente.plazo);
    
    const cliente = {
      id: Date.now(),
      nombre: nuevoCliente.nombre,
      tipo: nuevoCliente.tipo,
      capital: capital,
      tasa: nuevoCliente.tasa,
      plazo: nuevoCliente.plazo,
      cuotaMensual: prestamo.cuotaMensual,
      totalCobrar: prestamo.totalPagar,
      saldoPendiente: prestamo.totalPagar,
      pagosRecibidos: 0,
      estado: 'Activo',
      proximoCobro: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      telefono: nuevoCliente.telefono,
      historialPagos: []
    };

    setMisClientes([...misClientes, cliente]);
    setNuevoCliente({ nombre: '', capital: '', tasa: 17, plazo: 18, telefono: '', tipo: 'Préstamo' });
    setShowNuevoCliente(false);
    alert('✅ Cliente agregado\n\n💰 Cuota: S/' + prestamo.cuotaMensual.toLocaleString() + '\n📊 Total: S/' + prestamo.totalPagar.toLocaleString());
  };

  const registrarPago = () => {
    if (!montoPago || !clienteSeleccionado) {
      alert('❌ Complete el monto del pago');
      return;
    }

    const monto = parseFloat(montoPago);
    if (monto <= 0) {
      alert('❌ El monto debe ser mayor a 0');
      return;
    }

    const nuevoPago = {
      id: Date.now(),
      fecha: new Date().toISOString().split('T')[0],
      monto: monto,
      tipo: monto >= clienteSeleccionado.cuotaMensual * 0.9 ? 'Cuota Completa' : 'Pago Parcial',
      nota: monto >= clienteSeleccionado.cuotaMensual * 0.9 ? 'Pago mensual' : 'Abono a cuenta'
    };

    const clientesActualizados = misClientes.map(cliente => {
      if (cliente.id === clienteSeleccionado.id) {
        const nuevoSaldo = cliente.saldoPendiente - monto;
        const nuevosHistorial = [...(cliente.historialPagos || []), nuevoPago];
        const nuevoEstado = nuevoSaldo <= 0 ? 'Pagado' : 'Activo';
        
        let proximoCobro = cliente.proximoCobro;
        if (nuevoEstado === 'Activo' && monto >= cliente.cuotaMensual * 0.9) {
          const fechaActual = new Date();
          fechaActual.setMonth(fechaActual.getMonth() + 1);
          proximoCobro = fechaActual.toISOString().split('T')[0];
        }

        return {
          ...cliente,
          saldoPendiente: Math.max(0, nuevoSaldo),
          pagosRecibidos: cliente.pagosRecibidos + monto,
          historialPagos: nuevosHistorial,
          estado: nuevoEstado,
          proximoCobro: nuevoEstado === 'Pagado' ? 'Completado' : proximoCobro
        };
      }
      return cliente;
    });

    setMisClientes(clientesActualizados);
    setMontoPago('');
    setShowPagarCliente(false);
    
    const clienteActualizado = clientesActualizados.find(c => c.id === clienteSeleccionado.id);
    alert('✅ ¡PAGO REGISTRADO!\n\n💰 Monto: S/' + monto.toLocaleString() + 
          '\n💳 Nuevo saldo: S/' + clienteActualizado.saldoPendiente.toLocaleString() +
          (clienteActualizado.estado === 'Pagado' ? '\n🎉 ¡PRÉSTAMO COMPLETADO!' : ''));
  };

  const eliminarPago = (clienteId, pagoId) => {
    const confirmacion = confirm('🗑️ ¿ELIMINAR ESTE PAGO?\n\nEsta acción no se puede deshacer.\nSe restaurará el saldo anterior.');
    
    if (!confirmacion) return;

    const clientesActualizados = misClientes.map(cliente => {
      if (cliente.id === clienteId) {
        const pagoAEliminar = cliente.historialPagos.find(p => p.id === pagoId);
        if (!pagoAEliminar) return cliente;

        const nuevosHistorial = cliente.historialPagos.filter(p => p.id !== pagoId);
        const nuevoSaldo = cliente.saldoPendiente + pagoAEliminar.monto;
        const nuevoEstado = nuevoSaldo > 0 ? 'Activo' : 'Pagado';

        return {
          ...cliente,
          saldoPendiente: nuevoSaldo,
          pagosRecibidos: cliente.pagosRecibidos - pagoAEliminar.monto,
          historialPagos: nuevosHistorial,
          estado: nuevoEstado,
          proximoCobro: nuevoEstado === 'Activo' && cliente.proximoCobro === 'Completado' ? 
                        new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0] : 
                        cliente.proximoCobro
        };
      }
      return cliente;
    });

    setMisClientes(clientesActualizados);
    alert('✅ Pago eliminado correctamente\n\nEl saldo se ha restaurado.');
  };

  const agregarInversion = () => {
    if (!nuevaInversion.nombre || !nuevaInversion.inversion) {
      alert('❌ Complete nombre e inversión');
      return;
    }

    const inversion = parseFloat(nuevaInversion.inversion);
    const ganancia = parseFloat(nuevaInversion.gananciaEsperada) || 0;
    const roi = ganancia > 0 ? ((ganancia / inversion) * 100) : 0;
    
    const nuevaInv = {
      id: Date.now(),
      nombre: nuevaInversion.nombre,
      tipo: nuevaInversion.tipo,
      inversion: inversion,
      gananciaEsperada: ganancia,
      fechaVenta: nuevaInversion.fechaVenta || new Date(Date.now() + 60*24*60*60*1000).toISOString().split('T')[0],
      estado: 'En Proceso',
      roi: Math.round(roi * 10) / 10,
      cliente: nuevaInversion.cliente || 'Por definir'
    };

    setMisInversiones([...misInversiones, nuevaInv]);
    setNuevaInversion({ nombre: '', tipo: 'Importación', inversion: '', gananciaEsperada: '', fechaVenta: '', cliente: '' });
    setShowNuevaInversion(false);
    alert('✅ Inversión agregada\n\n💰 Inversión: S/' + inversion.toLocaleString() + '\n📈 ROI esperado: ' + roi.toFixed(1) + '%\n📅 Fecha estimada: ' + nuevaInv.fechaVenta);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* SIDEBAR */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">GRIZALUM</h1>
              <p className="text-xs text-slate-300">Control Financiero</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 space-y-2">
          {[
            { id: 'resumen', label: 'Resumen General', icon: Home },
            { id: 'clientes', label: 'Mis Clientes', icon: TrendingUp },
            { id: 'deudas', label: 'Mis Deudas', icon: TrendingDown },
            { id: 'inversiones', label: 'Mis Inversiones', icon: Building },
            { id: 'movimientos', label: 'Movimientos', icon: Calendar }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setCurrentView(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center px-6 py-3 text-left transition-all ${
                currentView === item.id 
                  ? 'bg-blue-600 border-r-4 border-blue-400' 
                  : 'hover:bg-slate-700'
              }`}
            >
              <item.icon className="mr-3" size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="font-semibold mb-2 text-sm">💡 Balance Actual</h4>
            <p className={`text-lg font-bold ${balanceNeto >= 0 ? 'text-green-400' : 'text-red-400'}`}>
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
        <div className="lg:hidden bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">GRIZALUM</h1>
            <div className="w-6"></div>
          </div>
        </div>

        <div className="p-6">
          {/* RESUMEN */}
          {currentView === 'resumen' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Mi Situación Financiera</h1>
                    <p className="text-gray-600">Control completo de ingresos, gastos e inversiones</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Me Deben</p>
                      <p className="text-3xl font-bold">S/{totalPorCobrar.toLocaleString()}</p>
                      <p className="text-green-200 text-xs">{misClientes.length} clientes</p>
                    </div>
                    <TrendingUp size={32} className="text-green-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm">Yo Debo</p>
                      <p className="text-3xl font-bold">S/{totalPorPagar.toLocaleString()}</p>
                      <p className="text-red-200 text-xs">{misDeudas.length} deudas</p>
                    </div>
                    <TrendingDown size={32} className="text-red-200" />
                  </div>
                </div>

                <div className={`bg-gradient-to-r ${balanceNeto >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} text-white p-6 rounded-2xl shadow-lg`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-opacity-80 text-sm">Balance Neto</p>
                      <p className="text-3xl font-bold">S/{balanceNeto.toLocaleString()}</p>
                      <p className="text-white text-opacity-80 text-xs">
                        {balanceNeto >= 0 ? 'A favor' : 'En contra'}
                      </p>
                    </div>
                    <DollarSign size={32} className="text-white text-opacity-60" />
                  </div>
                </div>

                <div className={`bg-gradient-to-r ${flujoMensual >= 0 ? 'from-purple-500 to-purple-600' : 'from-yellow-500 to-yellow-600'} text-white p-6 rounded-2xl shadow-lg`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-opacity-80 text-sm">Flujo Mensual</p>
                      <p className="text-3xl font-bold">S/{flujoMensual.toLocaleString()}</p>
                      <p className="text-white text-opacity-80 text-xs">
                        {flujoMensual >= 0 ? 'Ganancia' : 'Déficit'}
                      </p>
                    </div>
                    <Calculator size={32} className="text-white text-opacity-60" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CLIENTES */}
          {currentView === 'clientes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">Mis Clientes</h2>
                  <p className="text-gray-600">Personas y empresas que me deben dinero</p>
                </div>
                <button 
                  onClick={() => setShowNuevoCliente(true)}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all flex items-center shadow-lg transform hover:scale-105"
                >
                  <Plus className="mr-2" size={20} />
                  Nuevo Cliente
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Cliente</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Capital</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Cuota Mensual</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Saldo Pendiente</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Estado</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Próximo Cobro</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {misClientes.map(cliente => (
                        <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-gray-900">{cliente.nombre}</p>
                              <p className="text-sm text-gray-600">{cliente.tipo}</p>
                              {cliente.telefono && <p className="text-xs text-gray-500">📱 {cliente.telefono}</p>}
                              {cliente.historialPagos?.length > 0 && (
                                <p className="text-xs text-blue-600">💳 {cliente.historialPagos.length} pagos registrados</p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold">S/{cliente.capital.toLocaleString()}</td>
                          <td className="px-6 py-4 font-semibold text-green-600">S/{cliente.cuotaMensual.toLocaleString()}</td>
                          <td className="px-6 py-4 font-semibold text-blue-600">S/{cliente.saldoPendiente.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              cliente.estado === 'Activo' ? 'bg-green-100 text-green-800' :
                              cliente.estado === 'Pagado' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {cliente.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">{cliente.proximoCobro}</td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => {
                                  setClienteSeleccionado(cliente);
                                  setMontoPago(cliente.cuotaMensual.toString());
                                  setShowPagarCliente(true);
                                }}
                                className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 disabled:opacity-50"
                                title="Registrar pago"
                                disabled={cliente.estado === 'Pagado'}
                              >
                                💰
                              </button>
                              <button 
                                onClick={() => {
                                  setClienteSeleccionado(cliente);
                                  setShowHistorialPagos(true);
                                }}
                                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
                                title="Ver historial de pagos"
                              >
                                <History size={16} />
                              </button>
                              <button 
                                className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition-all transform hover:scale-105"
                                title="Editar cliente"
                              >
                                <Edit size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* OTRAS VISTAS */}
          {currentView === 'deudas' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Mis Deudas</h2>
              <p className="text-gray-600">Sección en desarrollo</p>
            </div>
          )}

          {currentView === 'inversiones' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Mis Inversiones</h2>
              <p className="text-gray-600">Sección en desarrollo</p>
            </div>
          )}

          {currentView === 'movimientos' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Movimientos</h2>
              <p className="text-gray-600">Sección en desarrollo</p>
            </div>
          )}
        </div>
      </div>

      {/* MODALES */}
      
      {/* MODAL NUEVO CLIENTE */}
      {showNuevoCliente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">💼 Nuevo Cliente</h3>
              <button 
                onClick={() => setShowNuevoCliente(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">👤 Nombre Completo</label>
                  <input
                    type="text"
                    placeholder="Ej: Juan Carlos Pérez"
                    value={nuevoCliente.nombre}
                    onChange={(e) => setNuevoCliente({...nuevoCliente, nombre: e.target.value})}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">💰 Capital a Prestar</label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-gray-500">S/</span>
                    <input
                      type="number"
                      placeholder="10000"
                      value={nuevoCliente.capital}
                      onChange={(e) => setNuevoCliente({...nuevoCliente, capital: e.target.value})}
                      className="w-full pl-12 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">📱 Teléfono</label>
                  <input
                    type="tel"
                    placeholder="+51 999 123 456"
                    value={nuevoCliente.telefono}
                    onChange={(e) => setNuevoCliente({...nuevoCliente, telefono: e.target.value})}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">📋 Tipo de Préstamo</label>
                  <select
                    value={nuevoCliente.tipo}
                    onChange={(e) => setNuevoCliente({...nuevoCliente, tipo: e.target.value})}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  >
                    <option value="Préstamo Personal">🏠 Préstamo Personal</option>
                    <option value="Préstamo Familiar">👨‍👩‍👧‍👦 Préstamo Familiar</option>
                    <option value="Préstamo Comercial">🏢 Préstamo Comercial</option>
                    <option value="Préstamo Express">⚡ Préstamo Express</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">📈 Tasa Anual (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="17"
                      value={nuevoCliente.tasa}
                      onChange={(e) => setNuevoCliente({...nuevoCliente, tasa: parseFloat(e.target.value) || 17})}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">📅 Plazo (meses)</label>
                    <select
                      value={nuevoCliente.plazo}
                      onChange={(e) => setNuevoCliente({...nuevoCliente, plazo: parseInt(e.target.value)})}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    >
                      <option value={6}>6 meses</option>
                      <option value={12}>12 meses</option>
                      <option value={18}>18 meses</option>
                      <option value={24}>24 meses</option>
                      <option value={36}>36 meses</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {nuevoCliente.capital && (
              <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border-2 border-green-200">
                <h4 className="font-bold text-green-800 mb-4 flex items-center">
                  📊 Resumen del Préstamo
                  <span className="ml-2 text-green-600">✨</span>
                </h4>
                {(() => {
                  const capital = parseFloat(nuevoCliente.capital);
                  if (capital > 0) {
                    const prestamo = calcularPrestamo(capital, nuevoCliente.tasa, nuevoCliente.plazo);
                    const ganancia = prestamo.totalPagar - capital;
                    const roiAnual = ((ganancia / capital) * 100);
                    
                    return (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-green-600">Cuota Mensual</p>
                          <p className="text-xl font-bold text-green-800">S/{prestamo.cuotaMensual.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-blue-600">Total a Cobrar</p>
                          <p className="text-xl font-bold text-blue-800">S/{prestamo.totalPagar.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-purple-600">Tu Ganancia</p>
                          <p className="text-xl font-bold text-purple-800">S/{ganancia.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-orange-600">ROI Total</p>
                          <p className="text-xl font-bold text-orange-800">{roiAnual.toFixed(1)}%</p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            )}
            
            <div className="flex space-x-4 mt-8">
              <button
                onClick={agregarCliente}
                disabled={!nuevoCliente.nombre || !nuevoCliente.capital}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl hover:from-green-700 hover:to-green-800 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                ✅ Crear Cliente
              </button>
              <button
                onClick={() => setShowNuevoCliente(false)}
                className="flex-1 bg-gray-500 text-white py-4 rounded-xl hover:bg-gray-600 font-semibold transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REGISTRAR PAGO */}
      {showPagarCliente && clienteSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">💰 Registrar Pago</h3>
              <button 
                onClick={() => setShowPagarCliente(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-3 text-lg">Cliente: {clienteSeleccionado.nombre}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
                  <div>
                    <p>💳 <strong>Cuota mensual:</strong></p>
                    <p className="text-lg font-bold text-green-600">S/{clienteSeleccionado.cuotaMensual.toLocaleString()}</p>
                  </div>
                  <div>
                    <p>💰 <strong>Saldo pendiente:</strong></p>
                    <p className="text-lg font-bold text-blue-600">S/{clienteSeleccionado.saldoPendiente.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">💵 Monto del Pago</label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-gray-500 text-xl font-bold">S/</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={montoPago}
                    onChange={(e) => setMontoPago(e.target.value)}
                    className="w-full pl-16 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-xl font-bold text-center"
                    autoFocus
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setMontoPago(clienteSeleccionado.cuotaMensual.toString())}
                  className="bg-green-100 text-green-800 py-3 px-4 rounded-xl hover:bg-green-200 transition-all font-semibold"
                >
                  💳 Cuota Completa
                  <div className="text-xs mt-1">S/{clienteSeleccionado.cuotaMensual.toLocaleString()}</div>
                </button>
                <button
                  onClick={() => setMontoPago((clienteSeleccionado.cuotaMensual / 2).toString())}
                  className="bg-yellow-100 text-yellow-800 py-3 px-4 rounded-xl hover:bg-yellow-200 transition-all font-semibold"
                >
                  💰 Media Cuota
                  <div className="text-xs mt-1">S/{(clienteSeleccionado.cuotaMensual / 2).toLocaleString()}</div>
                </button>
                <button
                  onClick={() => setMontoPago(clienteSeleccionado.saldoPendiente.toString())}
                  className="bg-blue-100 text-blue-800 py-3 px-4 rounded-xl hover:bg-blue-200 transition-all font-semibold"
                >
                  🎯 Liquidar Todo
                  <div className="text-xs mt-1">S/{clienteSeleccionado.saldoPendiente.toLocaleString()}</div>
                </button>
              </div>

              {montoPago && parseFloat(montoPago) > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-300">
                  <h4 className="font-bold text-green-800 mb-3 flex items-center">
                    📊 Preview del Pago ✨
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-green-700">💵 <strong>Monto a pagar:</strong></p>
                      <p className="text-xl font-bold text-green-800">S/{parseFloat(montoPago).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-blue-700">💰 <strong>Nuevo saldo:</strong></p>
                      <p className="text-xl font-bold text-blue-800">S/{Math.max(0, clienteSeleccionado.saldoPendiente - parseFloat(montoPago)).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-4 mt-8">
              <button
                onClick={registrarPago}
                disabled={!montoPago || parseFloat(montoPago) <= 0}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl hover:from-green-700 hover:to-green-800 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 text-lg"
              >
                ✅ Registrar Pago
              </button>
              <button
                onClick={() => setShowPagarCliente(false)}
                className="flex-1 bg-gray-500 text-white py-4 rounded-xl hover:bg-gray-600 font-semibold transition-all text-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HISTORIAL DE PAGOS */}
      {showHistorialPagos && clienteSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[85vh] overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">📋 Historial de Pagos</h3>
              <button 
                onClick={() => setShowHistorialPagos(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-3 text-lg">Cliente: {clienteSeleccionado.nombre}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-blue-700">
                <div>
                  <p>💰 <strong>Capital inicial:</strong></p>
                  <p className="text-lg font-bold">S/{clienteSeleccionado.capital.toLocaleString()}</p>
                </div>
                <div>
                  <p>💳 <strong>Total pagado:</strong></p>
                  <p className="text-lg font-bold text-green-600">S/{clienteSeleccionado.pagosRecibidos.toLocaleString()}</p>
                </div>
                <div>
                  <p>📊 <strong>Saldo pendiente:</strong></p>
                  <p className="text-lg font-bold text-blue-600">S/{clienteSeleccionado.saldoPendiente.toLocaleString()}</p>
                </div>
                <div>
                  <p>🎯 <strong>Estado:</strong></p>
                  <p className={`text-lg font-bold ${clienteSeleccionado.estado === 'Pagado' ? 'text-green-600' : 'text-orange-600'}`}>
                    {clienteSeleccionado.estado}
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-y-auto max-h-96">
              {clienteSeleccionado.historialPagos?.length > 0 ? (
                <div className="space-y-3">
                  {clienteSeleccionado.historialPagos.map((pago, index) => (
                    <div key={pago.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                              #{clienteSeleccionado.historialPagos.length - index}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 text-lg">S/{pago.monto.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">{new Date(pago.fecha).toLocaleDateString()} • {pago.tipo}</p>
                              {pago.nota && <p className="text-xs text-gray-500 italic">{pago.nota}</p>}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => eliminarPago(clienteSeleccionado.id, pago.id)}
                          className="bg-red-100 text-red-600 p-3 rounded-lg hover:bg-red-200 transition-all transform hover:scale-105"
                          title="Eliminar este pago"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <History size={64} className="mx-auto mb-4 text-gray-300" />
                  <h5 className="text-xl font-semibold mb-2">No hay pagos registrados</h5>
                  <p className="text-gray-400 mb-6">Los pagos aparecerán aquí cuando se registren</p>
                  <button
                    onClick={() => {
                      setMontoPago(clienteSeleccionado.cuotaMensual.toString());
                      setShowPagarCliente(true);
                      setShowHistorialPagos(false);
                    }}
                    className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all flex items-center mx-auto"
                  >
                    <Plus className="mr-2" size={20} />
                    Registrar Primer Pago
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t">
              <button
                onClick={() => setShowHistorialPagos(false)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold transition-all"
              >
                Cerrar Historial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY MÓVIL */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
};

export default GrizalumFinancial;
