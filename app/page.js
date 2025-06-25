import React, { useState } from 'react';
import { 
  Home, TrendingUp, TrendingDown, Building, Plus, Menu, X, 
  DollarSign, Calendar, Calculator, History, Share2, Cloud, FileSpreadsheet
} from 'lucide-react';

const GrizalumFinancial = () => {
  const [currentView, setCurrentView] = useState('resumen');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [misClientes, setMisClientes] = useState([
    {
      id: 1,
      nombre: 'Antonio',
      capital: 10000,
      cuotaMensual: 633.30,
      saldoPendiente: 11399.40,
      estado: 'Activo',
      telefono: '+51 999 123 456'
    }
  ]);

  const [misDeudas, setMisDeudas] = useState([
    {
      id: 1,
      acreedor: 'Banco Santander',
      capital: 50000,
      cuotaMensual: 3189.57,
      saldoPendiente: 57412.26,
      estado: 'Activo'
    }
  ]);

  const [misInversiones, setMisInversiones] = useState([
    {
      id: 1,
      nombre: 'Máquina Importada',
      inversion: 12000,
      gananciaEsperada: 2500,
      estado: 'En Proceso',
      roi: 20.8
    }
  ]);

  const [movimientos, setMovimientos] = useState([
    {
      id: 1,
      fecha: '2025-06-24',
      tipo: 'Ingreso',
      descripcion: 'Pago de Antonio',
      monto: 633.30
    }
  ]);
  
  const [showModal, setShowModal] = useState('');
  const [formData, setFormData] = useState({});

  // Cálculos
  const totalPorCobrar = misClientes.reduce((acc, c) => acc + c.saldoPendiente, 0);
  const totalPorPagar = misDeudas.reduce((acc, d) => acc + d.saldoPendiente, 0);
  const totalInversiones = misInversiones.reduce((acc, i) => acc + i.inversion, 0);
  const balanceNeto = totalPorCobrar - totalPorPagar;
  const flujoMensual = misClientes.reduce((acc, c) => acc + c.cuotaMensual, 0) - misDeudas.reduce((acc, d) => acc + d.cuotaMensual, 0);

  const agregarCliente = () => {
    if (!formData.nombre || !formData.capital) return;
    
    const nuevoCliente = {
      id: Date.now(),
      nombre: formData.nombre,
      capital: parseFloat(formData.capital),
      cuotaMensual: parseFloat(formData.capital) * 0.063,
      saldoPendiente: parseFloat(formData.capital) * 1.14,
      estado: 'Activo',
      telefono: formData.telefono || ''
    };
    
    setMisClientes([...misClientes, nuevoCliente]);
    setFormData({});
    setShowModal('');
    alert('Cliente agregado exitosamente');
  };

  const agregarDeuda = () => {
    if (!formData.acreedor || !formData.capital) return;
    
    const nuevaDeuda = {
      id: Date.now(),
      acreedor: formData.acreedor,
      capital: parseFloat(formData.capital),
      cuotaMensual: parseFloat(formData.capital) * 0.063,
      saldoPendiente: parseFloat(formData.capital) * 1.14,
      estado: 'Activo'
    };
    
    setMisDeudas([...misDeudas, nuevaDeuda]);
    setFormData({});
    setShowModal('');
    alert('Deuda agregada exitosamente');
  };

  const agregarInversion = () => {
    if (!formData.nombre || !formData.inversion) return;
    
    const nuevaInversion = {
      id: Date.now(),
      nombre: formData.nombre,
      inversion: parseFloat(formData.inversion),
      gananciaEsperada: parseFloat(formData.ganancia) || 0,
      estado: 'En Proceso',
      roi: ((parseFloat(formData.ganancia) || 0) / parseFloat(formData.inversion)) * 100
    };
    
    setMisInversiones([...misInversiones, nuevaInversion]);
    setFormData({});
    setShowModal('');
    alert('Inversión agregada exitosamente');
  };

  const compartirLink = () => {
    const data = JSON.stringify({ misClientes, misDeudas, misInversiones });
    navigator.clipboard.writeText(window.location.href + '?data=' + btoa(data));
    alert('Enlace copiado al portapapeles');
  };

  const descargarExcel = () => {
    const data = [
      ['REPORTE GRIZALUM'],
      ['Balance Neto', balanceNeto],
      ['Total por Cobrar', totalPorCobrar],
      ['Total por Pagar', totalPorPagar],
      [''],
      ['CLIENTES'],
      ['Nombre', 'Capital', 'Saldo'],
      ...misClientes.map(c => [c.nombre, c.capital, c.saldoPendiente])
    ];
    
    const csv = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporte-grizalum.csv';
    a.click();
    alert('Archivo descargado');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform lg:translate-x-0`}>
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold">GRIZALUM</h1>
          <p className="text-sm text-slate-300">Control Financiero</p>
        </div>

        <nav className="mt-6">
          {[
            { id: 'resumen', label: 'Resumen', icon: Home },
            { id: 'clientes', label: 'Clientes', icon: TrendingUp },
            { id: 'deudas', label: 'Deudas', icon: TrendingDown },
            { id: 'inversiones', label: 'Inversiones', icon: Building },
            { id: 'movimientos', label: 'Movimientos', icon: Calendar }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left ${currentView === item.id ? 'bg-blue-600' : 'hover:bg-slate-700'}`}
            >
              <item.icon className="mr-3" size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Balance</h4>
            <p className={`text-lg font-bold ${balanceNeto >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              S/{balanceNeto.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        <header className="lg:hidden bg-white p-4 shadow">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
        </header>

        <div className="p-6">
          {/* Action Buttons */}
          <div className="mb-6 bg-white rounded-xl p-4 shadow">
            <div className="flex gap-3 justify-end">
              <button onClick={compartirLink} className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
                <Share2 className="mr-2" size={16} />
                Compartir
              </button>
              <button onClick={() => alert('Guardado')} className="bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center">
                <Cloud className="mr-2" size={16} />
                Guardar
              </button>
              <button onClick={descargarExcel} className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center">
                <FileSpreadsheet className="mr-2" size={16} />
                Excel
              </button>
            </div>
          </div>

          {/* Resumen */}
          {currentView === 'resumen' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow">
                <h1 className="text-2xl font-bold mb-2">Situación Financiera</h1>
                <p className="text-gray-600">Control de ingresos y gastos</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-green-500 text-white p-6 rounded-xl">
                  <p className="text-sm opacity-80">Me Deben</p>
                  <p className="text-2xl font-bold">S/{totalPorCobrar.toLocaleString()}</p>
                </div>
                <div className="bg-red-500 text-white p-6 rounded-xl">
                  <p className="text-sm opacity-80">Yo Debo</p>
                  <p className="text-2xl font-bold">S/{totalPorPagar.toLocaleString()}</p>
                </div>
                <div className="bg-blue-500 text-white p-6 rounded-xl">
                  <p className="text-sm opacity-80">Balance</p>
                  <p className="text-2xl font-bold">S/{balanceNeto.toLocaleString()}</p>
                </div>
                <div className="bg-purple-500 text-white p-6 rounded-xl">
                  <p className="text-sm opacity-80">Flujo Mensual</p>
                  <p className="text-2xl font-bold">S/{flujoMensual.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Clientes */}
          {currentView === 'clientes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Mis Clientes</h2>
                <button 
                  onClick={() => setShowModal('cliente')}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <Plus className="mr-2" size={20} />
                  Nuevo
                </button>
              </div>

              <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">Cliente</th>
                      <th className="px-6 py-3 text-left">Capital</th>
                      <th className="px-6 py-3 text-left">Cuota</th>
                      <th className="px-6 py-3 text-left">Saldo</th>
                      <th className="px-6 py-3 text-left">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misClientes.map(cliente => (
                      <tr key={cliente.id} className="border-t">
                        <td className="px-6 py-4">{cliente.nombre}</td>
                        <td className="px-6 py-4">S/{cliente.capital.toLocaleString()}</td>
                        <td className="px-6 py-4">S/{cliente.cuotaMensual.toLocaleString()}</td>
                        <td className="px-6 py-4">S/{cliente.saldoPendiente.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                            {cliente.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Deudas */}
          {currentView === 'deudas' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Mis Deudas</h2>
                <button 
                  onClick={() => setShowModal('deuda')}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <Plus className="mr-2" size={20} />
                  Nueva
                </button>
              </div>

              <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">Acreedor</th>
                      <th className="px-6 py-3 text-left">Capital</th>
                      <th className="px-6 py-3 text-left">Cuota</th>
                      <th className="px-6 py-3 text-left">Saldo</th>
                      <th className="px-6 py-3 text-left">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misDeudas.map(deuda => (
                      <tr key={deuda.id} className="border-t">
                        <td className="px-6 py-4">{deuda.acreedor}</td>
                        <td className="px-6 py-4">S/{deuda.capital.toLocaleString()}</td>
                        <td className="px-6 py-4">S/{deuda.cuotaMensual.toLocaleString()}</td>
                        <td className="px-6 py-4">S/{deuda.saldoPendiente.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                            {deuda.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Inversiones */}
          {currentView === 'inversiones' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Mis Inversiones</h2>
                <button 
                  onClick={() => setShowModal('inversion')}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <Plus className="mr-2" size={20} />
                  Nueva
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {misInversiones.map(inversion => (
                  <div key={inversion.id} className="bg-white rounded-xl p-6 shadow">
                    <h3 className="font-bold text-lg mb-2">{inversion.nombre}</h3>
                    <div className="space-y-2">
                      <p><span className="text-gray-600">Inversión:</span> S/{inversion.inversion.toLocaleString()}</p>
                      <p><span className="text-gray-600">Ganancia:</span> S/{inversion.gananciaEsperada.toLocaleString()}</p>
                      <p><span className="text-gray-600">ROI:</span> {inversion.roi.toFixed(1)}%</p>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                        {inversion.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Movimientos */}
          {currentView === 'movimientos' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Movimientos</h2>
              
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">Fecha</th>
                      <th className="px-6 py-3 text-left">Tipo</th>
                      <th className="px-6 py-3 text-left">Descripción</th>
                      <th className="px-6 py-3 text-left">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimientos.map(mov => (
                      <tr key={mov.id} className="border-t">
                        <td className="px-6 py-4">{mov.fecha}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            mov.tipo === 'Ingreso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {mov.tipo}
                          </span>
                        </td>
                        <td className="px-6 py-4">{mov.descripcion}</td>
                        <td className="px-6 py-4 font-bold">S/{mov.monto.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {showModal === 'cliente' && 'Nuevo Cliente'}
                {showModal === 'deuda' && 'Nueva Deuda'}
                {showModal === 'inversion' && 'Nueva Inversión'}
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
                    placeholder="Nombre"
                    value={formData.nombre || ''}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Capital"
                    value={formData.capital || ''}
                    onChange={(e) => setFormData({...formData, capital: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Teléfono"
                    value={formData.telefono || ''}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  />
                </>
              )}

              {showModal === 'deuda' && (
                <>
                  <input
                    type="text"
                    placeholder="Acreedor"
                    value={formData.acreedor || ''}
                    onChange={(e) => setFormData({...formData, acreedor: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Capital"
                    value={formData.capital || ''}
                    onChange={(e) => setFormData({...formData, capital: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  />
                </>
              )}

              {showModal === 'inversion' && (
                <>
                  <input
                    type="text"
                    placeholder="Nombre del proyecto"
                    value={formData.nombre || ''}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Inversión"
                    value={formData.inversion || ''}
                    onChange={(e) => setFormData({...formData, inversion: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Ganancia esperada"
                    value={formData.ganancia || ''}
                    onChange={(e) => setFormData({...formData, ganancia: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  />
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
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold"
              >
                Guardar
              </button>
              <button
                onClick={() => setShowModal('')}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
};

export default GrizalumFinancial;
