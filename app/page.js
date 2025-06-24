import React, { useState, useCallback } from 'react';
import { 
  Home, TrendingUp, TrendingDown, Building, Plus, Menu, X, 
  DollarSign, Calendar, AlertCircle, Edit, Calculator, Check, CreditCard
} from 'lucide-react';

const GrizalumFinancial = () => {
  const [currentView, setCurrentView] = useState('resumen');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // DATOS PRINCIPALES
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
      cuotaMensual: 3189.57,
      saldoPendiente: 57412.26,
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
      fechaVenta: '2025-08-24',
      estado: 'En Proceso',
      roi: 20.8
    }
  ]);
  
  // FORMULARIOS
  const [showNuevoCliente, setShowNuevoCliente] = useState(false);
  const [showNuevaInversion, setShowNuevaInversion] = useState(false);
  const [showRegistrarPago, setShowRegistrarPago] = useState(false);
  const [showVenderInversion, setShowVenderInversion] = useState(false);
  const [showPagarDeuda, setShowPagarDeuda] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [inversionSeleccionada, setInversionSeleccionada] = useState(null);
  const [deudaSeleccionada, setDeudaSeleccionada] = useState(null);
  const [montoPago, setMontoPago] = useState('');
  const [montoVenta, setMontoVenta] = useState('');
  const [montoPagoDeuda, setMontoPagoDeuda] = useState('');

  // Estados de formularios con useCallback para mejor performance
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '', capital: '', tasa: 17, plazo: 18, telefono: '', tipo: 'Préstamo'
  });
  const [nuevaInversion, setNuevaInversion] = useState({
    nombre: '', tipo: 'Importación', inversion: '', gananciaEsperada: '', fechaVenta: '', cliente: ''
  });

  // CÁLCULOS
  const totalPorCobrar = misClientes.reduce((acc, c) => acc + c.saldoPendiente, 0);
  const totalPorPagar = misDeudas.reduce((acc, d) => acc + d.saldoPendiente, 0);
  const balanceNeto = totalPorCobrar - totalPorPagar;
  const ingresosMensuales = misClientes.reduce((acc, c) => acc + (c.estado === 'Activo' ? c.cuotaMensual : 0), 0);
  const gastosMensuales = misDeudas.reduce((acc, d) => acc + (d.estado === 'Activo' ? d.cuotaMensual : 0), 0);
  const flujoMensual = ingresosMensuales - gastosMensuales;

  const calcularPrestamo = useCallback((capital, tasa, plazo) => {
    const tasaMensual = tasa / 100 / 12;
    const cuotaMensual = (capital * tasaMensual * Math.pow(1 + tasaMensual, plazo)) / 
                        (Math.pow(1 + tasaMensual, plazo) - 1);
    return {
      cuotaMensual: Math.round(cuotaMensual * 100) / 100,
      totalPagar: Math.round(cuotaMensual * plazo * 100) / 100
    };
  }, []);

  // FUNCIONES OPTIMIZADAS
  const handleClienteChange = useCallback((field, value) => {
    setNuevoCliente(prev => ({...prev, [field]: value}));
  }, []);

  const handleInversionChange = useCallback((field, value) => {
    setNuevaInversion(prev => ({...prev, [field]: value}));
  }, []);

  const agregarCliente = useCallback(() => {
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

    setMisClientes(prev => [...prev, cliente]);
    setNuevoCliente({ nombre: '', capital: '', tasa: 17, plazo: 18, telefono: '', tipo: 'Préstamo' });
    setShowNuevoCliente(false);
    alert('✅ Cliente agregado\n💰 Cuota: S/' + prestamo.cuotaMensual.toLocaleString());
  }, [nuevoCliente, calcularPrestamo]);

  const agregarInversion = useCallback(() => {
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

    setMisInversiones(prev => [...prev, nuevaInv]);
    setNuevaInversion({ nombre: '', tipo: 'Importación', inversion: '', gananciaEsperada: '', fechaVenta: '', cliente: '' });
    setShowNuevaInversion(false);
    alert('✅ Inversión agregada\n💰 ROI esperado: ' + roi.toFixed(1) + '%');
  }, [nuevaInversion]);

  // NUEVA FUNCIÓN: REGISTRAR PAGO
  const registrarPago = useCallback(() => {
    if (!clienteSeleccionado || !montoPago) {
      alert('❌ Seleccione cliente y monto');
      return;
    }

    const monto = parseFloat(montoPago);
    if (monto <= 0) {
      alert('❌ Monto debe ser mayor a 0');
      return;
    }

    setMisClientes(prev => prev.map(cliente => {
      if (cliente.id === clienteSeleccionado.id) {
        const nuevoSaldo = Math.max(0, cliente.saldoPendiente - monto);
        const nuevoPago = {
          id: Date.now(),
          fecha: new Date().toISOString().split('T')[0],
          monto: monto,
          saldoAnterior: cliente.saldoPendiente,
          saldoNuevo: nuevoSaldo
        };

        return {
          ...cliente,
          saldoPendiente: nuevoSaldo,
          pagosRecibidos: cliente.pagosRecibidos + monto,
          historialPagos: [...cliente.historialPagos, nuevoPago],
          estado: nuevoSaldo === 0 ? 'Pagado' : 'Activo',
          proximoCobro: nuevoSaldo > 0 ? new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0] : null
        };
      }
      return cliente;
    }));

    setShowRegistrarPago(false);
    setClienteSeleccionado(null);
    setMontoPago('');
    alert('✅ Pago registrado\n💰 Monto: S/' + monto.toLocaleString() + '\n📊 Saldo restante: S/' + Math.max(0, clienteSeleccionado.saldoPendiente - monto).toLocaleString());
  }, [clienteSeleccionado, montoPago]);

  const abrirRegistroPago = useCallback((cliente) => {
    setClienteSeleccionado(cliente);
    setMontoPago(cliente.cuotaMensual.toString());
    setShowRegistrarPago(true);
  }, []);

  // NUEVA FUNCIÓN: VENDER INVERSIÓN
  const venderInversion = useCallback((inversion) => {
    setInversionSeleccionada(inversion);
    setMontoVenta((inversion.inversion + inversion.gananciaEsperada).toString());
    setShowVenderInversion(true);
  }, []);

  const confirmarVenta = useCallback(() => {
    if (!inversionSeleccionada || !montoVenta) {
      alert('❌ Complete todos los datos');
      return;
    }

    const monto = parseFloat(montoVenta);
    const gananciaReal = monto - inversionSeleccionada.inversion;
    const roiReal = (gananciaReal / inversionSeleccionada.inversion) * 100;

    setMisInversiones(prev => prev.map(inv => {
      if (inv.id === inversionSeleccionada.id) {
        return {
          ...inv,
          estado: 'Vendido',
          montoVenta: monto,
          gananciaReal: gananciaReal,
          roiReal: Math.round(roiReal * 10) / 10,
          fechaVentaReal: new Date().toISOString().split('T')[0]
        };
      }
      return inv;
    }));

    setShowVenderInversion(false);
    setInversionSeleccionada(null);
    setMontoVenta('');
    alert('✅ Venta registrada\n💰 Ganancia: S/' + gananciaReal.toLocaleString() + '\n📈 ROI real: ' + roiReal.toFixed(1) + '%');
  }, [inversionSeleccionada, montoVenta]);

  // NUEVA FUNCIÓN: PAGAR DEUDA
  const pagarDeuda = useCallback((deuda) => {
    setDeudaSeleccionada(deuda);
    setMontoPagoDeuda(deuda.cuotaMensual.toString());
    setShowPagarDeuda(true);
  }, []);

  const confirmarPagoDeuda = useCallback(() => {
    if (!deudaSeleccionada || !montoPagoDeuda) {
      alert('❌ Complete todos los datos');
      return;
    }

    const monto = parseFloat(montoPagoDeuda);
    if (monto <= 0) {
      alert('❌ Monto debe ser mayor a 0');
      return;
    }

    setMisDeudas(prev => prev.map(deuda => {
      if (deuda.id === deudaSeleccionada.id) {
        const nuevoSaldo = Math.max(0, deuda.saldoPendiente - monto);
        
        return {
          ...deuda,
          saldoPendiente: nuevoSaldo,
          estado: nuevoSaldo === 0 ? 'Pagado' : 'Activo',
          proximoPago: nuevoSaldo > 0 ? new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0] : null
        };
      }
      return deuda;
    }));

    setShowPagarDeuda(false);
    setDeudaSeleccionada(null);
    setMontoPagoDeuda('');
    alert('✅ Pago registrado\n💳 Monto: S/' + monto.toLocaleString() + '\n📊 Saldo restante: S/' + Math.max(0, deudaSeleccionada.saldoPendiente - monto).toLocaleString());
  }, [deudaSeleccionada, montoPagoDeuda]);

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block`}>
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">G</span>
          </div>
          <div>
            <h1 className="font-bold">GRIZALUM</h1>
            <p className="text-xs text-slate-300">Control Financiero</p>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
          <X size={20} />
        </button>
      </div>

      <nav className="mt-4 space-y-1">
        {[
          { id: 'resumen', label: 'Resumen', icon: Home },
          { id: 'clientes', label: 'Mis Clientes', icon: TrendingUp },
          { id: 'deudas', label: 'Mis Deudas', icon: TrendingDown },
          { id: 'inversiones', label: 'Inversiones', icon: Building },
          { id: 'movimientos', label: 'Movimientos', icon: Calendar }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => { setCurrentView(item.id); setSidebarOpen(false); }}
            className={`w-full flex items-center px-4 py-2 text-left transition-all text-sm ${
              currentView === item.id 
                ? 'bg-blue-600 border-r-4 border-blue-400' 
                : 'hover:bg-slate-700'
            }`}
          >
            <item.icon className="mr-2" size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-slate-700 rounded-lg p-3">
          <h4 className="font-semibold mb-1 text-sm">💡 Balance</h4>
          <p className={`text-lg font-bold ${balanceNeto >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            S/{balanceNeto.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );

  const ResumenGeneral = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Mi Situación Financiera</h1>
        <p className="text-gray-600">Control de ingresos, gastos e inversiones</p>
      </div>

      {/* CARDS PRINCIPALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Me Deben</p>
              <p className="text-2xl font-bold">S/{totalPorCobrar.toLocaleString()}</p>
              <p className="text-green-200 text-xs">{misClientes.length} clientes</p>
            </div>
            <TrendingUp size={28} className="text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Yo Debo</p>
              <p className="text-2xl font-bold">S/{totalPorPagar.toLocaleString()}</p>
              <p className="text-red-200 text-xs">{misDeudas.length} deudas</p>
            </div>
            <TrendingDown size={28} className="text-red-200" />
          </div>
        </div>

        <div className={`bg-gradient-to-r ${balanceNeto >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} text-white p-4 rounded-xl shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-opacity-80 text-sm">Balance Neto</p>
              <p className="text-2xl font-bold">S/{balanceNeto.toLocaleString()}</p>
              <p className="text-white text-opacity-80 text-xs">
                {balanceNeto >= 0 ? 'A favor' : 'En contra'}
              </p>
            </div>
            <DollarSign size={28} className="text-white text-opacity-60" />
          </div>
        </div>

        <div className={`bg-gradient-to-r ${flujoMensual >= 0 ? 'from-purple-500 to-purple-600' : 'from-yellow-500 to-yellow-600'} text-white p-4 rounded-xl shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-opacity-80 text-sm">Flujo Mensual</p>
              <p className="text-2xl font-bold">S/{flujoMensual.toLocaleString()}</p>
              <p className="text-white text-opacity-80 text-xs">
                {flujoMensual >= 0 ? 'Ganancia' : 'Déficit'}
              </p>
            </div>
            <Calculator size={28} className="text-white text-opacity-60" />
          </div>
        </div>
      </div>

      {/* ALERTA FLUJO NEGATIVO */}
      {flujoMensual < 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="text-red-400 mr-3" size={20} />
            <div>
              <h3 className="text-red-800 font-semibold">⚠️ Flujo Negativo</h3>
              <p className="text-red-700 text-sm">
                Déficit mensual: S/{Math.abs(flujoMensual).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const MisClientes = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Mis Clientes</h2>
          <p className="text-gray-600">Personas que me deben dinero</p>
        </div>
        <button 
          onClick={() => setShowNuevoCliente(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all flex items-center shadow-lg"
        >
          <Plus className="mr-2" size={18} />
          Nuevo Cliente
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Capital</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Cuota</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Saldo</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {misClientes.map(cliente => (
                <tr key={cliente.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-semibold text-gray-900">{cliente.nombre}</p>
                      <p className="text-sm text-gray-600">{cliente.tipo}</p>
                      {cliente.telefono && <p className="text-xs text-gray-500">📱 {cliente.telefono}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold">S/{cliente.capital.toLocaleString()}</td>
                  <td className="px-4 py-3 font-semibold text-green-600">S/{cliente.cuotaMensual.toLocaleString()}</td>
                  <td className="px-4 py-3 font-semibold text-blue-600">S/{cliente.saldoPendiente.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                      cliente.estado === 'Activo' ? 'bg-green-100 text-green-800' :
                      cliente.estado === 'Pagado' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {cliente.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => abrirRegistroPago(cliente)}
                        className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-all"
                        title="Registrar Pago"
                        disabled={cliente.estado === 'Pagado'}
                      >
                        <CreditCard size={14} />
                      </button>
                      <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all">
                        <Edit size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL NUEVO CLIENTE */}
      {showNuevoCliente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => {
                setShowNuevoCliente(false);
                setNuevoCliente({ nombre: '', capital: '', tasa: 17, plazo: 18, telefono: '', tipo: 'Préstamo' });
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold mb-4">Nuevo Cliente</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre del cliente"
                value={nuevoCliente.nombre}
                onChange={(e) => handleClienteChange('nombre', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                autoComplete="off"
                autoFocus
              />
              <input
                type="number"
                placeholder="Capital a prestar"
                value={nuevoCliente.capital}
                onChange={(e) => handleClienteChange('capital', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                autoComplete="off"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Tasa % (17)"
                  value={nuevoCliente.tasa}
                  onChange={(e) => handleClienteChange('tasa', parseFloat(e.target.value) || 17)}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  autoComplete="off"
                />
                <select
                  value={nuevoCliente.plazo}
                  onChange={(e) => handleClienteChange('plazo', parseInt(e.target.value))}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value={12}>12 meses</option>
                  <option value={18}>18 meses</option>
                  <option value={24}>24 meses</option>
                  <option value={36}>36 meses</option>
                </select>
              </div>
              <input
                type="tel"
                placeholder="Teléfono (opcional)"
                value={nuevoCliente.telefono}
                onChange={(e) => handleClienteChange('telefono', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                autoComplete="off"
              />
              
              {nuevoCliente.capital && (
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">📊 Resumen</h4>
                  {(() => {
                    const capital = parseFloat(nuevoCliente.capital);
                    if (capital > 0) {
                      const prestamo = calcularPrestamo(capital, nuevoCliente.tasa, nuevoCliente.plazo);
                      return (
                        <div className="text-sm text-green-700">
                          <p>• Cuota: <strong>S/{prestamo.cuotaMensual.toLocaleString()}</strong></p>
                          <p>• Total: <strong>S/{prestamo.totalPagar.toLocaleString()}</strong></p>
                          <p>• Ganancia: <strong>S/{(prestamo.totalPagar - capital).toLocaleString()}</strong></p>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={agregarCliente}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                disabled={!nuevoCliente.nombre || !nuevoCliente.capital}
              >
                ✅ Agregar
              </button>
              <button
                onClick={() => setShowNuevoCliente(false)}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REGISTRAR PAGO */}
      {showRegistrarPago && clienteSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => {
                setShowRegistrarPago(false);
                setClienteSeleccionado(null);
                setMontoPago('');
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold mb-4">💰 Registrar Pago</h3>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-blue-800">Cliente: {clienteSeleccionado.nombre}</h4>
              <p className="text-sm text-blue-700">Saldo actual: S/{clienteSeleccionado.saldoPendiente.toLocaleString()}</p>
              <p className="text-sm text-blue-700">Cuota mensual: S/{clienteSeleccionado.cuotaMensual.toLocaleString()}</p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Monto recibido:</label>
              <input
                type="number"
                placeholder="Monto del pago"
                value={montoPago}
                onChange={(e) => setMontoPago(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                autoComplete="off"
                autoFocus
              />
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setMontoPago(clienteSeleccionado.cuotaMensual.toString())}
                  className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg text-sm hover:bg-blue-200"
                >
                  Cuota Normal
                </button>
                <button
                  onClick={() => setMontoPago(clienteSeleccionado.saldoPendiente.toString())}
                  className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded-lg text-sm hover:bg-green-200"
                >
                  Pago Total
                </button>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={registrarPago}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                disabled={!montoPago || parseFloat(montoPago) <= 0}
              >
                ✅ Registrar Pago
              </button>
              <button
                onClick={() => setShowRegistrarPago(false)}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const MisDeudas = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Mis Deudas</h2>
          <p className="text-gray-600">Dinero que debo pagar</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Acreedor</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Capital</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Cuota</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Saldo</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {misDeudas.map(deuda => (
                <tr key={deuda.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-semibold text-gray-900">{deuda.acreedor}</p>
                      <p className="text-sm text-gray-600">{deuda.tipo}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold">S/{deuda.capital.toLocaleString()}</td>
                  <td className="px-4 py-3 font-semibold text-red-600">S/{deuda.cuotaMensual.toLocaleString()}</td>
                  <td className="px-4 py-3 font-semibold text-orange-600">S/{deuda.saldoPendiente.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                      {deuda.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => pagarDeuda(deuda)}
                      className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-all"
                      title="Registrar Pago de Deuda"
                      disabled={deuda.estado === 'Pagado'}
                    >
                      💳
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const MisInversiones = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Mis Inversiones</h2>
          <p className="text-gray-600">Proyectos y negocios</p>
        </div>
        <button 
          onClick={() => setShowNuevaInversion(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all flex items-center shadow-lg"
        >
          <Plus className="mr-2" size={18} />
          Nueva Inversión
        </button>
      </div>

      <div className="grid gap-4">
        {misInversiones.map(inversion => (
          <div key={inversion.id} className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{inversion.nombre}</h3>
                <p className="text-gray-600">{inversion.tipo}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  inversion.estado === 'En Proceso' ? 'bg-yellow-100 text-yellow-800' :
                  inversion.estado === 'Vendido' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {inversion.estado}
                </span>
                {inversion.estado === 'En Proceso' && (
                  <button
                    onClick={() => venderInversion(inversion)}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-all text-sm"
                  >
                    💰 Vender
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div>
                <p className="text-sm text-gray-600">Inversión</p>
                <p className="font-bold">S/{inversion.inversion.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ganancia Esperada</p>
                <p className="font-bold text-green-600">S/{inversion.gananciaEsperada.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ROI</p>
                <p className="font-bold text-purple-600">{inversion.roi}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha</p>
                <p className="font-bold text-sm">{inversion.fechaVenta}</p>
              </div>
            </div>

            {inversion.gananciaReal && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>✅ Vendido:</strong> Ganancia real: S/{inversion.gananciaReal.toLocaleString()} 
                  | ROI real: {((inversion.gananciaReal / inversion.inversion) * 100).toFixed(1)}%
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* RESUMEN DE INVERSIONES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h4 className="font-semibold text-gray-700 mb-2">Total Invertido</h4>
          <p className="text-xl font-bold text-blue-600">S/{misInversiones.reduce((acc, inv) => acc + inv.inversion, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h4 className="font-semibold text-gray-700 mb-2">Ganancia Estimada</h4>
          <p className="text-xl font-bold text-green-600">S/{misInversiones.reduce((acc, inv) => acc + (inv.gananciaReal || inv.gananciaEsperada), 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h4 className="font-semibold text-gray-700 mb-2">ROI Promedio</h4>
          <p className="text-xl font-bold text-purple-600">
            {misInversiones.length > 0 ? (misInversiones.reduce((acc, inv) => acc + (inv.roiReal || inv.roi), 0) / misInversiones.length).toFixed(1) : 0}%
          </p>
        </div>
      </div>

      {/* MODAL NUEVA INVERSIÓN */}
      {showNuevaInversion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => {
                setShowNuevaInversion(false);
                setNuevaInversion({ nombre: '', tipo: 'Importación', inversion: '', gananciaEsperada: '', fechaVenta: '', cliente: '' });
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold mb-4">Nueva Inversión</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre de la inversión"
                value={nuevaInversion.nombre}
                onChange={(e) => handleInversionChange('nombre', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                autoComplete="off"
                autoFocus
              />
              <select
                value={nuevaInversion.tipo}
                onChange={(e) => handleInversionChange('tipo', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="Importación">Importación</option>
                <option value="Inmobiliario">Inmobiliario</option>
                <option value="Negocio">Negocio</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Otro">Otro</option>
              </select>
              <input
                type="number"
                placeholder="Monto de inversión"
                value={nuevaInversion.inversion}
                onChange={(e) => handleInversionChange('inversion', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                autoComplete="off"
              />
              <input
                type="number"
                placeholder="Ganancia esperada"
                value={nuevaInversion.gananciaEsperada}
                onChange={(e) => handleInversionChange('gananciaEsperada', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                autoComplete="off"
              />
              <input
                type="date"
                value={nuevaInversion.fechaVenta}
                onChange={(e) => handleInversionChange('fechaVenta', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              
              {nuevaInversion.inversion && nuevaInversion.gananciaEsperada && (
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">📊 Análisis</h4>
                  {(() => {
                    const inv = parseFloat(nuevaInversion.inversion);
                    const gan = parseFloat(nuevaInversion.gananciaEsperada);
                    if (inv > 0 && gan > 0) {
                      const roi = ((gan / inv) * 100);
                      return (
                        <div className="text-sm text-purple-700">
                          <p>• ROI: <strong>{roi.toFixed(1)}%</strong></p>
                          <p>• Total: <strong>S/{(inv + gan).toLocaleString()}</strong></p>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={agregarInversion}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-semibold"
                disabled={!nuevaInversion.nombre || !nuevaInversion.inversion}
              >
                ✅ Agregar
              </button>
              <button
                onClick={() => setShowNuevaInversion(false)}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VENDER INVERSIÓN */}
      {showVenderInversion && inversionSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => {
                setShowVenderInversion(false);
                setInversionSeleccionada(null);
                setMontoVenta('');
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold mb-4">💰 Vender Inversión</h3>
            
            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-purple-800">Inversión: {inversionSeleccionada.nombre}</h4>
              <p className="text-sm text-purple-700">Inversión inicial: S/{inversionSeleccionada.inversion.toLocaleString()}</p>
              <p className="text-sm text-purple-700">Ganancia esperada: S/{inversionSeleccionada.gananciaEsperada.toLocaleString()}</p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Precio de venta real:</label>
              <input
                type="number"
                placeholder="Monto por el que vendiste"
                value={montoVenta}
                onChange={(e) => setMontoVenta(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                autoComplete="off"
                autoFocus
              />
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setMontoVenta((inversionSeleccionada.inversion + inversionSeleccionada.gananciaEsperada).toString())}
                  className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded-lg text-sm hover:bg-green-200"
                >
                  Según Plan
                </button>
                <button
                  onClick={() => setMontoVenta(inversionSeleccionada.inversion.toString())}
                  className="flex-1 bg-yellow-100 text-yellow-700 py-2 px-3 rounded-lg text-sm hover:bg-yellow-200"
                >
                  Sin Ganancia
                </button>
              </div>

              {montoVenta && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Ganancia real:</strong> S/{(parseFloat(montoVenta) - inversionSeleccionada.inversion).toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-800">
                    <strong>ROI real:</strong> {(((parseFloat(montoVenta) - inversionSeleccionada.inversion) / inversionSeleccionada.inversion) * 100).toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={confirmarVenta}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                disabled={!montoVenta || parseFloat(montoVenta) <= 0}
              >
                ✅ Confirmar Venta
              </button>
              <button
                onClick={() => setShowVenderInversion(false)}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PAGAR DEUDA */}
      {showPagarDeuda && deudaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => {
                setShowPagarDeuda(false);
                setDeudaSeleccionada(null);
                setMontoPagoDeuda('');
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold mb-4">💳 Pagar Deuda</h3>
            
            <div className="bg-red-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-red-800">Acreedor: {deudaSeleccionada.acreedor}</h4>
              <p className="text-sm text-red-700">Saldo actual: S/{deudaSeleccionada.saldoPendiente.toLocaleString()}</p>
              <p className="text-sm text-red-700">Cuota mensual: S/{deudaSeleccionada.cuotaMensual.toLocaleString()}</p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Monto a pagar:</label>
              <input
                type="number"
                placeholder="Monto del pago"
                value={montoPagoDeuda}
                onChange={(e) => setMontoPagoDeuda(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                autoComplete="off"
                autoFocus
              />
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setMontoPagoDeuda(deudaSeleccionada.cuotaMensual.toString())}
                  className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg text-sm hover:bg-blue-200"
                >
                  Cuota Normal
                </button>
                <button
                  onClick={() => setMontoPagoDeuda(deudaSeleccionada.saldoPendiente.toString())}
                  className="flex-1 bg-red-100 text-red-700 py-2 px-3 rounded-lg text-sm hover:bg-red-200"
                >
                  Pagar Todo
                </button>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={confirmarPagoDeuda}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-semibold"
                disabled={!montoPagoDeuda || parseFloat(montoPagoDeuda) <= 0}
              >
                ✅ Registrar Pago
              </button>
              <button
                onClick={() => setShowPagarDeuda(false)}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
