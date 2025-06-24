import React, { useState } from 'react';
import { 
  Home, TrendingUp, TrendingDown, Building, Plus, Menu, X, 
  DollarSign, Calendar, AlertCircle, Edit, Calculator
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
      estado: 'Activo',
      proximoCobro: '2025-07-24',
      telefono: '+51 999 123 456'
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

  const calcularPrestamo = (capital, tasa, plazo) => {
    const tasaMensual = tasa / 100 / 12;
    const cuotaMensual = (capital * tasaMensual * Math.pow(1 + tasaMensual, plazo)) /
