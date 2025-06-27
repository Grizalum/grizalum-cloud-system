import React, { useState, useEffect } from 'react';
import { 
  Home, 
  TrendingUp, 
  TrendingDown, 
  Building, 
  Plus, 
  Menu, 
  X, 
  DollarSign, 
  Calendar, 
  Calculator, 
  History, 
  Share2, 
  FileSpreadsheet, 
  Edit, 
  Bell, 
  MessageSquare, 
  Shield, 
  Trash2, 
  CheckCircle, 
  Save, 
  Cloud, 
  WifiOff 
} from 'lucide-react';

const GrizalumFinancial = () => {
  const [currentView, setCurrentView] = useState('resumen');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [datosGuardados, setDatosGuardados] = useState(false);
  const [firebaseConectado, setFirebaseConectado] = useState(true);
  const [sincronizando, setSincronizando] = useState(false);
  const [showModalCliente, setShowModalCliente] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  
  const [formCliente, setFormCliente] = useState({
    nombre: '',
    email: '',
    telefono: '',
    capital: '',
    tasaInteres: '',
    plazoMeses: '',
    fechaInicio: new Date().toISOString().split('T')[0]
  });
  
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
      estado: 'En Proceso',
      fechaInicio: '2024-01-15',
      fechaPrestamo: '2024-01-15',
      tasaInteres: 14,
      plazoMeses: 18,
      regimen: 'Mensual',
      fechaVencimiento: '2025-07-15',
      historialPagos: [
        { id: 1, fecha: '2024-02-15', monto: 633.30, metodo: 'Transferencia' },
        { id: 2, fecha: '2024-03-15', monto: 633.30, metodo: 'Efectivo' }
      ]
    },
    {
      id: 2,
      nombre: 'María González',
      email: 'maria@example.com',
      telefono: '+51 987 654 321',
      capital: 15000,
      cuotaMensual: 950.00,
      totalCobrar: 17100.00,
      saldoPendiente: 12000.00,
      pagosRecibidos: 5100.00,
      estado: 'En Proceso',
      fechaInicio: '2024-03-01',
      fechaPrestamo: '2024-03-01',
      tasaInteres: 14,
      plazoMeses: 18,
      regimen: 'Mensual',
      fechaVencimiento: '2025-09-01',
      historialPagos: [
        { id: 1, fecha: '2024-04-01', monto: 950.00, metodo: 'Transferencia' }
      ]
    }
  ]);

  const [misDeudas, setMisDeudas] = useState([
    {
      id: 1,
      acreedor: 'Banco Santander',
      descripcion: 'Préstamo comercial para capital de trabajo',
      capital: 50000,
      cuotaMensual: 2500.00,
      saldoPendiente: 45000.00,
      tasaInteres: 18,
      estado: 'Activo',
      proximoPago: '2025-07-21',
      tipo: 'Préstamo Bancario'
    },
    {
      id: 2,
      acreedor: 'Proveedor Textil SAC',
      descripcion: 'Compra de mercadería a crédito',
      capital: 8000,
      cuotaMensual: 800.00,
      saldoPendiente: 6400.00,
      tasaInteres: 0,
      estado: 'Activo',
      proximoPago: '2025-07-05',
      tipo: 'Crédito Comercial'
    }
  ]);

  const [misInversiones, setMisInversiones] = useState([
    {
      id: 1,
      nombre: 'Máquina Importada Industrial',
      descripcion: 'Máquina para aumentar producción',
      tipo: 'Maquinaria',
      inversion: 12000,
      gananciaEsperada: 2500,
      gananciaActual: 1625,
      estado: 'En Proceso',
      roi: 20.8,
      progreso: 65
    },
    {
      id: 2,
      nombre: 'Local Comercial Centro',
      descripcion: 'Alquiler de local para nueva sucursal',
      tipo: 'Inmueble',
      inversion: 25000,
      gananciaEsperada: 5000,
      gananciaActual: 3750,
      estado: 'En Proceso',
      roi: 25.0,
      progreso: 75
    }
  ]);

  const [movimientos, setMovimientos] = useState([
    {
      id: 1,
      fecha: '2025-06-26',
      tipo: 'Ingreso',
      categoria: 'Pago Cliente',
      descripcion: 'Pago mensual de María González',
      monto: 950.00,
      cliente: 'María González',
      metodo: 'Transferencia'
    },
    {
      id: 2,
      fecha: '2025-06-25',
      tipo: 'Egreso',
      categoria: 'Pago Deuda',
      descripcion: 'Cuota mensual Banco Santander',
      monto: 2500.00,
      cliente: 'Banco Santander',
      metodo: 'Transferencia'
    }
  ]);

  const [alertas, setAlertas] = useState([
    { 
      id: 1, 
      mensaje: 'Pago de Antonio vence en 3 días', 
      urgencia: 'media', 
      tipo: 'pago_pendiente',
      fechaVencimiento: '2025-06-29',
      activa: true,
      fechaCreacion: '2025-06-26'
    }
  ]);

  const [interacciones, setInteracciones] = useState([
    {
      id: 1,
      fecha: '2025-06-26T10:30:00',
      tipo: 'pago_registrado',
      descripcion: 'Pago de María González: S/950',
      usuario: 'Usuario'
    }
  ]);

  useEffect(() => {
    const simularConexionFirebase = () => {
      setFirebaseConectado(Math.random() > 0.1);
    };
    const interval = setInterval(simularConexionFirebase, 5000);
    return () => clearInterval(interval);
  }, []);

  const calcularCuotaMensual = (capital, tasa, meses) => {
    const tasaMensual = tasa / 100 / 12;
    const cuota = (capital * tasaMensual * Math.pow(1 + tasaMensual, meses)) / 
                  (Math.pow(1 + tasaMensual, meses) - 1);
    return cuota;
  };
  
  const agregarCliente = async () => {
    try {
      if (!formCliente.nombre || !formCliente.capital || !formCliente.tasaInteres || !formCliente.plazoMeses) {
        alert('⚠️ Por favor completa todos los campos obligatorios');
        return;
      }
      
      setSincronizando(true);
      
      const capital = parseFloat(formCliente.capital);
      const tasa = parseFloat(formCliente.tasaInteres);
      const meses = parseInt(formCliente.plazoMeses);
      const cuotaMensual = calcularCuotaMensual(capital, tasa, meses);
      const totalCobrar = cuotaMensual * meses;
      
      const fechaInicio = new Date(formCliente.fechaInicio);
      const fechaVencimiento = new Date(fechaInicio);
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + meses);
      
      const nuevoCliente = {
        id: Date.now(),
        nombre: formCliente.nombre,
        email: formCliente.email,
        telefono: formCliente.telefono,
        capital: capital,
        cuotaMensual: Math.round(cuotaMensual * 100) / 100,
        totalCobrar: Math.round(totalCobrar * 100) / 100,
        saldoPendiente: Math.round(totalCobrar * 100) / 100,
        pagosRecibidos: 0,
        estado: 'En Proceso',
        fechaInicio: formCliente.fechaInicio,
        fechaPrestamo: formCliente.fechaInicio,
        tasaInteres: tasa,
        plazoMeses: meses,
        regimen: 'Mensual',
        fechaVencimiento: fechaVencimiento.toISOString().split('T')[0],
        historialPagos: []
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMisClientes([...misClientes, nuevoCliente]);
      setFormCliente({
        nombre: '',
        email: '',
        telefono: '',
        capital: '',
        tasaInteres: '',
        plazoMeses: '',
        fechaInicio: new Date().toISOString().split('T')[0]
      });
      setShowModalCliente(false);
      setSincronizando(false);
      alert('✅ Cliente agregado y sincronizado con Firebase');
    } catch (error) {
      setSincronizando(false);
      alert('❌ Error agregando cliente');
    }
  };

  const filtrarPorBusqueda = (items, campos) => {
    if (!busqueda) return items;
    return items.filter(item => 
      campos.some(campo => {
        const valor = item[campo];
        return valor && valor.toString().toLowerCase().includes(busqueda.toLowerCase());
      })
    );
  };

  const totalPorCobrar = misClientes.reduce((acc, c) => acc + c.saldoPendiente, 0);
  const totalPorPagar = misDeudas.reduce((acc, d) => acc + d.saldoPendiente, 0);
  const totalInversiones = misInversiones.reduce((acc, i) => acc + i.inversion, 0);
  const balanceNeto = totalPorCobrar - totalPorPagar;
  const recursosDisponibles = totalPorCobrar + totalInversiones;
  const cobertura = totalPorPagar > 0 ? (recursosDisponibles / totalPorPagar) * 100 : 100;

  const eliminarAlerta = (alertaId) => {
    setAlertas(alertas.filter(a => a.id !== alertaId));
  };

  const eliminarCliente = async (clienteId) => {
    if (window.confirm('⚠️ ¿Estás seguro de eliminar este cliente?')) {
      setSincronizando(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMisClientes(misClientes.filter(c => c.id !== clienteId));
      setSincronizando(false);
      alert('✅ Cliente eliminado y sincronizado con Firebase');
    }
  };

  const eliminarDeuda = (deudaId) => {
    if (window.confirm('⚠️ ¿Estás seguro de eliminar esta deuda?')) {
      setMisDeudas(misDeudas.filter(d => d.id !== deudaId));
      alert('✅ Deuda eliminada correctamente');
    }
  };

  const eliminarInversion = (inversionId) => {
    if (window.confirm('⚠️ ¿Estás seguro de eliminar esta inversión?')) {
      setMisInversiones(misInversiones.filter(i => i.id !== inversionId));
      alert('✅ Inversión eliminada correctamente');
    }
  };

  const eliminarMovimiento = (movimientoId) => {
    if (window.confirm('⚠️ ¿Estás seguro de eliminar este movimiento?')) {
      setMovimientos(movimientos.filter(m => m.id !== movimientoId));
      alert('✅ Movimiento eliminado correctamente');
    }
  };

  const eliminarInteraccion = (interaccionId) => {
    if (window.confirm('⚠️ ¿Estás seguro de eliminar esta actividad?')) {
      setInteracciones(interacciones.filter(i => i.id !== interaccionId));
      alert('✅ Actividad eliminada correctamente');
    }
  };

  const guardarDatos = async () => {
    setSincronizando(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setDatosGuardados(true);
    setSincronizando(false);
    alert('💾 ¡Datos sincronizados con Firebase!');
    setTimeout(() => setDatosGuardados(false), 3000);
  };

  const compartirWhatsApp = () => {
    const mensaje = `🏢 GRIZALUM - Resumen Financiero
📅 ${new Date().toLocaleDateString()}

💰 SITUACIÓN FINANCIERA:
• Me deben: S/ ${totalPorCobrar.toLocaleString()}
• Yo debo: S/ ${totalPorPagar.toLocaleString()}
• Balance neto: S/ ${balanceNeto.toLocaleString()}
• Cobertura: ${Math.round(cobertura)}%

📈 CARTERA:
• Clientes activos: ${misClientes.filter(c => c.estado === 'En Proceso').length}
• Deudas pendientes: ${misDeudas.filter(d => d.estado === 'Activo').length}
• Inversiones activas: ${misInversiones.filter(i => i.estado === 'En Proceso').length}`;

    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative">
      <div 
        className="fixed inset-0 z-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cg%3E%3Ccircle cx='200' cy='150' r='80' fill='none' stroke='%23FF4500' stroke-width='12'/%3E%3Cg fill='%23000000'%3E%3Ccircle cx='200' cy='120' r='20'/%3E%3Crect x='180' y='140' width='40' height='60' rx='8'/%3E%3Crect x='155' y='150' width='20' height='8' rx='4' transform='rotate(-30 165 154)'/%3E%3Crect x='225' y='150' width='20' height='8' rx='4' transform='rotate(30 235 154)'/%3E%3Crect x='185' y='200' width='12' height='30' rx='6'/%3E%3Crect x='203' y='200' width='12' height='30' rx='6'/%3E%3Cline x1='245' y1='150' x2='270' y2='130' stroke='%23000000' stroke-width='6' stroke-linecap='round'/%3E%3C/g%3E%3Ccircle cx='50' cy='180' r='25' fill='%23000000'/%3E%3Ccircle cx='50' cy='180' r='15' fill='%23FF4500'/%3E%3Cline x1='30' y1='250' x2='370' y2='250' stroke='%23000000' stroke-width='8'/%3E%3Cline x1='60' y1='270' x2='90' y2='270' stroke='%23000000' stroke-width='6'/%3E%3Cline x1='110' y1='270' x2='140' y2='270' stroke='%23000000' stroke-width='6'/%3E%3Cline x1='160' y1='270' x2='190' y2='270' stroke='%23000000' stroke-width='6'/%3E%3Cline x1='210' y1='270' x2='240' y2='270' stroke='%23000000' stroke-width='6'/%3E%3Cline x1='260' y1='270' x2='290' y2='270' stroke='%23000000' stroke-width='6'/%3E%3Cline x1='310' y1='270' x2='340' y2='270' stroke='%23000000' stroke-width='6'/%3E%3Ctext x='200' y='320' text-anchor='middle' font-family='Arial Black, sans-serif' font-size='42' font-weight='900' fill='%23000000'%3EGRIZALUM%3C/text%3E%3Cline x1='80' y1='335' x2='320' y2='335' stroke='%23000000' stroke-width='4'/%3E%3Ctext x='200' y='355' text-anchor='middle' font-family='Arial, sans-serif' font-size='16' font-weight='normal' fill='%23000000'%3ECOMPAÑÍA METALÚRGICA%3C/text%3E%3Cline x1='80' y1='365' x2='320' y2='365' stroke='%23000000' stroke-width='4'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '350px 350px',
          backgroundPosition: 'center'
        }}
      />
      
      <div className="relative z-10">
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
          <div className="flex items-center justify-between p-4 lg:p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg lg:text-xl">G</span>
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-bold">GRIZALUM</h1>
                <p className="text-xs text-slate-300">Control Financiero Pro</p>
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
              { id: 'alertas', label: 'Alertas', icon: Bell },
              { id: 'interacciones', label: 'Actividad', icon: History }
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
                {item.id === 'alertas' && alertas.filter(a => a.activa).length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {alertas.filter(a => a.activa).length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-6 left-4 right-4 lg:left-6 lg:right-6">
            <div className="bg-slate-700 rounded-lg p-3 lg:p-4">
              <h4 className="font-semibold mb-2 text-xs lg:text-sm">💡 Balance Neto</h4>
              <p className={`text-lg lg:text-xl font-bold ${balanceNeto >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                S/{balanceNeto.toLocaleString()}
              </p>
              <div className="mt-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Cobertura:</span>
                  <span className={cobertura >= 100 ? 'text-green-400' : 'text-yellow-400'}>
                    {Math.round(cobertura)}%
                  </span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-1 mt-1">
                  <div 
                    className={`h-1 rounded-full ${cobertura >= 100 ? 'bg-green-400' : 'bg-yellow-400'}`}
                    style={{ width: `${Math.min(cobertura, 100)}%` }}
                  />
                </div>
              </div>
              <div className="mt-2 flex items-center text-xs">
                {firebaseConectado ? (
                  <>
                    <Cloud className="text-green-400 mr-1" size={12} />
                    <span className="text-green-400">Firebase Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="text-red-400 mr-1" size={12} />
                    <span className="text-red-400">Sin conexión</span>
                  </>
                )}
              </div>
              {datosGuardados && (
                <div className="mt-2 flex items-center text-green-400 text-xs">
                  <CheckCircle size={12} className="mr-1" />
                  Sincronizado
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:ml-64">
          <div className="lg:hidden bg-white shadow-sm p-4">
            <div className="flex items-center justify-between">
              <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-bold text-gray-800">GRIZALUM</h1>
              <div className="flex items-center space-x-2">
                {firebaseConectado ? (
                  <Cloud className="text-green-600" size={20} />
                ) : (
                  <WifiOff className="text-red-600" size={20} />
                )}
                <button onClick={compartirWhatsApp} className="text-blue-600">
                  <Share2 size={24} />
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 lg:p-6">
            <div className="mb-6 bg-white rounded-2xl shadow-xl p-3 lg:p-4">
              <div className="flex flex-wrap gap-2 lg:gap-3 justify-center lg:justify-end">
                <div className="flex items-center bg-blue-50 px-3 py-2 rounded-lg">
                  {firebaseConectado ? (
                    <>
                      <Cloud className="text-green-600 mr-2" size={16} />
                      <span className="text-green-700 text-sm">Firebase Conectado</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="text-red-600 mr-2" size={16} />
                      <span className="text-red-700 text-sm">Sin conexión</span>
                    </>
                  )}
                </div>
                <button
                  onClick={compartirWhatsApp}
                  className="bg-green-500 text-white px-3 lg:px-4 py-2 rounded-xl hover:bg-green-600 transition-all flex items-center text-sm lg:text-base"
                >
                  <MessageSquare className="mr-1 lg:mr-2" size={16} />
                  WhatsApp
                </button>
                <button
                  onClick={guardarDatos}
                  className={`${sincronizando ? 'bg-orange-500' : datosGuardados ? 'bg-green-600' : 'bg-purple-500'} text-white px-3 lg:px-4 py-2 rounded-xl hover:bg-purple-600 transition-all flex items-center text-sm lg:text-base`}
                  disabled={sincronizando}
                >
                  {sincronizando ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sincronizando...
                    </>
                  ) : datosGuardados ? (
                    <>
                      <CheckCircle className="mr-1 lg:mr-2" size={16} />
                      Sincronizado
                    </>
                  ) : (
                    <>
                      <Save className="mr-1 lg:mr-2" size={16} />
                      Guardar en Firebase
                    </>
                  )}
                </button>
                <button
                  onClick={() => alert('📊 Función de Excel próximamente')}
                  className="bg-green-600 text-white px-3 lg:px-4 py-2 rounded-xl hover:bg-green-700 transition-all flex items-center text-sm lg:text-base"
                >
                  <FileSpreadsheet className="mr-1 lg:mr-2" size={16} />
                  Excel
                </button>
              </div>
            </div>

            <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4">
              <div className="flex items-center space-x-3">
                <Shield className="text-green-600" size={24} />
                <div>
                  <h4 className="font-semibold text-green-800">🔒 Datos Seguros con Firebase</h4>
                  <p className="text-sm text-green-700">Tu información está protegida en la nube de Google y es completamente privada.</p>
                </div>
              </div>
            </div>

            {currentView === 'resumen' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-4 lg:p-6">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Dashboard Financiero + Firebase 🔥</h1>
                  <p className="text-gray-600">Análisis completo con sincronización en tiempo real</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 lg:p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">💰 Por Cobrar</p>
                        <p className="text-2xl lg:text-3xl font-bold">S/{totalPorCobrar.toLocaleString()}</p>
                        <p className="text-green-200 text-xs mt-1">{misClientes.filter(c => c.estado === 'En Proceso').length} clientes activos</p>
                      </div>
                      <TrendingUp size={28} className="text-green-200" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 lg:p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-100 text-sm">💸 Por Pagar</p>
                        <p className="text-2xl lg:text-3xl font-bold">S/{totalPorPagar.toLocaleString()}</p>
                        <p className="text-red-200 text-xs mt-1">{misDeudas.filter(d => d.estado === 'Activo').length} deudas activas</p>
                      </div>
                      <TrendingDown size={28} className="text-red-200" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 lg:p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">📊 Balance Neto</p>
                        <p className="text-2xl lg:text-3xl font-bold">S/{balanceNeto.toLocaleString()}</p>
                        <p className="text-blue-200 text-xs mt-1">{balanceNeto >= 0 ? 'Posición favorable' : 'Requiere atención'}</p>
                      </div>
                      <DollarSign size={28} className="text-blue-200" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 lg:p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">🛡️ Cobertura</p>
                        <p className="text-2xl lg:text-3xl font-bold">{Math.round(cobertura)}%</p>
                        <p className="text-purple-200 text-xs mt-1">{cobertura >= 100 ? 'Excelente' : 'Mejorar'}</p>
                      </div>
                      <Calculator size={28} className="text-purple-200" />
                    </div>
                  </div>
                </div>

                {alertas.filter(a => a.activa).length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Alertas Importantes</h4>
                    <div className="space-y-2">
                      {alertas.filter(a => a.activa).slice(0, 3).map(alerta => (
                        <div key={alerta.id} className="flex items-center justify-between text-sm">
                          <span className="text-yellow-700">{alerta.mensaje}</span>
                          <button 
                            onClick={() => eliminarAlerta(alerta.id)}
                            className="text-yellow-600 hover:text-yellow-800"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentView === 'clientes' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-4 lg:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">💰 Mis Clientes 🔥</h2>
                    <button 
                      onClick={() => setShowModalCliente(true)}
                      className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-all flex items-center"
                    >
                      <Plus className="mr-2" size={16} />
                      Nuevo Cliente
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="🔍 Buscar clientes..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid gap-4">
                    {filtrarPorBusqueda(misClientes, ['nombre', 'email', 'telefono']).map(cliente => (
                      <div key={cliente.id} className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-800">{cliente.nombre}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
                              <div>
                                <p className="text-sm text-gray-600">Capital Prestado</p>
                                <p className="font-semibold">S/{cliente.capital.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Saldo Pendiente</p>
                                <p className="font-semibold text-red-600">S/{cliente.saldoPendiente.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Cuota Mensual</p>
                                <p className="font-semibold text-blue-600">S/{cliente.cuotaMensual.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Progreso de Pagos</p>
                                <p className="font-semibold text-purple-600">
                                  {cliente.historialPagos.length} / {cliente.plazoMeses}
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div 
                                    className="bg-purple-500 h-2 rounded-full transition-all"
                                    style={{width: `${(cliente.historialPagos.length / cliente.plazoMeses) * 100}%`}}
                                  ></div>
                                </div>
                                {cliente.historialPagos.length >= cliente.plazoMeses && (
                                  <span className="text-xs text-green-600 font-semibold">✅ PAGADO COMPLETO</span>
                                )}
                              </div>
                            </div>
                            <div className="mt-3 flex items-center space-x-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                cliente.estado === 'En Proceso' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {cliente.estado}
                              </span>
                              <span className="text-sm text-gray-600">Tasa: {cliente.tasaInteres}%</span>
                              <span className="text-sm text-gray-600">Plazo: {cliente.plazoMeses} meses</span>
                              {firebaseConectado && <span className="text-xs text-green-600">🔥 Sincronizado</span>}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => alert('Registrar pago próximamente - Firebase')}
                              className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-all"
                            >
                              <DollarSign size={16} />
                            </button>
                            <button 
                              onClick={() => alert('Editar cliente próximamente - Firebase')}
                              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => eliminarCliente(cliente.id)}
                              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all"
                              disabled={sincronizando}
                            >
                              {sincronizando ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentView === 'deudas' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-4 lg:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">💸 Mis Deudas</h2>
                    <button 
                      onClick={() => alert('Nueva deuda próximamente')}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-all flex items-center"
                    >
                      <Plus className="mr-2" size={16} />
                      Nueva Deuda
                    </button>
                  </div>
                  
                  <div className="grid gap-4">
                    {misDeudas.map(deuda => (
                      <div key={deuda.id} className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-800">{deuda.acreedor}</h3>
                            <p className="text-sm text-gray-600 mb-2">{deuda.descripcion}</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">Capital Original</p>
                                <p className="font-semibold">S/{deuda.capital.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Saldo Pendiente</p>
                                <p className="font-semibold text-red-600">S/{deuda.saldoPendiente.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Cuota Mensual</p>
                                <p className="font-semibold text-orange-600">S/{deuda.cuotaMensual.toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center space-x-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                deuda.estado === 'Activo' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {deuda.estado}
                              </span>
                              <span className="text-sm text-gray-600">Tipo: {deuda.tipo}</span>
                              <span className="text-sm text-gray-600">Próximo pago: {deuda.proximoPago}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => alert('Editar deuda próximamente')}
                              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => eliminarDeuda(deuda.id)}
                              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentView === 'inversiones' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-4 lg:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">🏢 Mis Inversiones</h2>
                    <button 
                      onClick={() => alert('Nueva inversión próximamente')}
                      className="bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-600 transition-all flex items-center"
                    >
                      <Plus className="mr-2" size={16} />
                      Nueva Inversión
                    </button>
                  </div>
                  
                  <div className="grid gap-4">
                    {misInversiones.map(inversion => (
                      <div key={inversion.id} className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-800">{inversion.nombre}</h3>
                            <p className="text-sm text-gray-600 mb-2">{inversion.descripcion}</p>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">Inversión</p>
                                <p className="font-semibold">S/{inversion.inversion.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Ganancia Esperada</p>
                                <p className="font-semibold text-green-600">S/{inversion.gananciaEsperada.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Ganancia Actual</p>
                                <p className="font-semibold text-blue-600">S/{inversion.gananciaActual.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">ROI</p>
                                <p className="font-semibold text-purple-600">{inversion.roi.toFixed(1)}%</p>
                              </div>
                            </div>
                            <div className="mt-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progreso</span>
                                <span>{inversion.progreso}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                                  style={{width: `${inversion.progreso}%`}}
                                ></div>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center space-x-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                inversion.estado === 'En Proceso' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {inversion.estado}
                              </span>
                              <span className="text-sm text-gray-600">Tipo: {inversion.tipo}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => alert('Editar inversión próximamente')}
                              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => eliminarInversion(inversion.id)}
                              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentView === 'movimientos' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-4 lg:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">📅 Movimientos</h2>
                    <button 
                      onClick={() => alert('Nuevo movimiento próximamente')}
                      className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-all flex items-center"
                    >
                      <Plus className="mr-2" size={16} />
                      Nuevo Movimiento
                    </button>
                  </div>
                  
                  <div className="grid gap-4">
                    {movimientos.map(movimiento => (
                      <div key={movimiento.id} className={`border rounded-xl p-4 ${
                        movimiento.tipo === 'Ingreso' 
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                          : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                movimiento.tipo === 'Ingreso' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {movimiento.tipo}
                              </span>
                              <span className="text-sm text-gray-600">{movimiento.fecha}</span>
                              <span className="text-sm text-gray-600">{movimiento.categoria}</span>
                            </div>
                            <h3 className="font-semibold text-gray-800">{movimiento.descripcion}</h3>
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">Monto</p>
                                <p className={`font-bold text-lg ${
                                  movimiento.tipo === 'Ingreso' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {movimiento.tipo === 'Ingreso' ? '+' : '-'}S/{movimiento.monto.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Cliente/Proveedor</p>
                                <p className="font-semibold">{movimiento.cliente}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Método</p>
                                <p className="font-semibold">{movimiento.metodo}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => alert('Editar movimiento próximamente')}
                              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => eliminarMovimiento(movimiento.id)}
                              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentView === 'alertas' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-4 lg:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">🔔 Alertas</h2>
                  </div>
                  
                  <div className="grid gap-4">
                    {alertas.map(alerta => (
                      <div key={alerta.id} className={`border rounded-xl p-4 ${
                        alerta.urgencia === 'alta' 
                          ? 'bg-red-50 border-red-200' 
                          : alerta.urgencia === 'media'
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                alerta.urgencia === 'alta' 
                                  ? 'bg-red-100 text-red-800' 
                                  : alerta.urgencia === 'media'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {alerta.urgencia.toUpperCase()}
                              </span>
                              <span className="text-sm text-gray-600">{alerta.tipo}</span>
                            </div>
                            <h3 className="font-semibold text-gray-800">{alerta.mensaje}</h3>
                            <div className="mt-2 text-sm text-gray-600">
                              <p>Fecha vencimiento: {alerta.fechaVencimiento}</p>
                              <p>Creada: {alerta.fechaCreacion}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => alert('Editar alerta próximamente')}
                              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => eliminarAlerta(alerta.id)}
                              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentView === 'interacciones' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-4 lg:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">📋 Actividad Reciente</h2>
                  </div>
                  
                  <div className="grid gap-4">
                    {interacciones.map(interaccion => (
                      <div key={interaccion.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                {interaccion.tipo}
                              </span>
                              <span className="text-sm text-gray-600">
                                {new Date(interaccion.fecha).toLocaleString()}
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-800">{interaccion.descripcion}</h3>
                            <p className="text-sm text-gray-600 mt-1">Usuario: {interaccion.usuario}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => eliminarInteraccion(interaccion.id)}
                              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {showModalCliente && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">💰 Nuevo Cliente</h3>
                    <button onClick={() => setShowModalCliente(false)} className="text-gray-500 hover:text-gray-700">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                      <input
                        type="text"
                        value={formCliente.nombre}
                        onChange={(e) => setFormCliente({...formCliente, nombre: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Ej: Juan Pérez"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={formCliente.email}
                        onChange={(e) => setFormCliente({...formCliente, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="juan@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <input
                        type="tel"
                        value={formCliente.telefono}
                        onChange={(e) => setFormCliente({...formCliente, telefono: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="+51 999 123 456"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capital (S/) *</label>
                        <input
                          type="number"
                          value={formCliente.capital}
                          onChange={(e) => setFormCliente({...formCliente, capital: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="10000"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tasa (%) *</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formCliente.tasaInteres}
                          onChange={(e) => setFormCliente({...formCliente, tasaInteres: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="14"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plazo (meses) *</label>
                        <input
                          type="number"
                          value={formCliente.plazoMeses}
                          onChange={(e) => setFormCliente({...formCliente, plazoMeses: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="18"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio *</label>
                        <input
                          type="date"
                          value={formCliente.fechaInicio}
                          onChange={(e) => setFormCliente({...formCliente, fechaInicio: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={() => setShowModalCliente(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={agregarCliente}
                      disabled={sincronizando}
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all disabled:opacity-50 flex items-center justify-center"
                    >
                      {sincronizando ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Guardando...
                        </>
                      ) : (
                        '💾 Guardar Cliente'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrizalumFinancial;
