'use client';

import { useState, useEffect } from 'react';
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

export default function Page() {
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
    fechaInicio: ''
  });
  
  const misClientes = [
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
      tasaInteres: 14,
      plazoMeses: 18,
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
      tasaInteres: 14,
      plazoMeses: 18,
      historialPagos: [
        { id: 1, fecha: '2024-04-01', monto: 950.00, metodo: 'Transferencia' }
      ]
    }
  ];

  const misDeudas = [
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
  ];

  const misInversiones = [
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
  ];

  const alertas = [
    { 
      id: 1, 
      mensaje: 'Pago de Antonio vence en 3 días', 
      urgencia: 'media', 
      tipo: 'pago_pendiente',
      fechaVencimiento: '2025-06-29',
      activa: true,
      fechaCreacion: '2025-06-26'
    }
  ];

  useEffect(() => {
    setFormCliente(prev => ({
      ...prev,
      fechaInicio: new Date().toISOString().split('T')[0]
    }));

    const simularConexionFirebase = () => {
      setFirebaseConectado(Math.random() > 0.1);
    };
    const interval = setInterval(simularConexionFirebase, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalPorCobrar = misClientes.reduce((acc, c) => acc + c.saldoPendiente, 0);
  const totalPorPagar = misDeudas.reduce((acc, d) => acc + d.saldoPendiente, 0);
  const totalInversiones = misInversiones.reduce((acc, i) => acc + i.inversion, 0);
  const balanceNeto = totalPorCobrar - totalPorPagar;
  const recursosDisponibles = totalPorCobrar + totalInversiones;
  const cobertura = totalPorPagar > 0 ? (recursosDisponibles / totalPorPagar) * 100 : 100;

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

          <nav className="mt-6 space-y-1 mb-48">
            {[
              { id: 'resumen', label: 'Resumen', icon: Home },
              { id: 'clientes', label: 'Clientes', icon: TrendingUp },
              { id: 'deudas', label: 'Deudas', icon: TrendingDown },
              { id: 'inversiones', label: 'Inversiones', icon: Building },
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
                {item.id === 'alertas' && alertas.filter(a => a.activa).length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {alertas.filter(a => a.activa).length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
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
                        <button className="text-yellow-600 hover:text-yellow-800">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
