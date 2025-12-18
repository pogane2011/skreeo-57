import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Función para generar PDF de datos técnicos del UAS
export const generarPDFDatosTecnicos = (drone: any, operadora: any) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Logo y título
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246); // Azul Skreeo
  doc.text('SKREEO', 15, 15);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('FICHA TÉCNICA DEL UAS', 15, 25);

  // Fecha generación
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, 240, 15);

  // Información Operadora
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Operadora: ${operadora?.nombre || 'N/A'}`, 15, 35);
  doc.text(`AESA: ${operadora?.numero_aesa || 'N/A'}`, 15, 42);

  // Información del UAS
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text('DATOS DEL UAS', 15, 55);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const datosUAS = [
    ['Marca/Modelo:', drone.marca_modelo || '-'],
    ['Alias:', drone.alias || '-'],
    ['Categoría:', drone.categoria || '-'],
    ['Nº Matrícula:', drone.num_matricula || '-'],
    ['Nº Serie:', drone.num_serie || '-'],
    ['Póliza Seguro:', drone.poliza ? new Date(drone.poliza).toLocaleDateString('es-ES') : '-'],
  ];

  let yPos = 63;
  datosUAS.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 15, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 60, yPos);
    yPos += 7;
  });

  // Datos Económicos
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text('DATOS ECONÓMICOS', 110, 55);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const datosEcon = [
    ['Precio Adquisición:', drone.precio ? `${drone.precio.toFixed(2)} €` : '-'],
    ['Fecha Compra:', drone.fecha_compra ? new Date(drone.fecha_compra).toLocaleDateString('es-ES') : '-'],
    ['TCO/Hora:', drone.tco_por_hora ? `${drone.tco_por_hora.toFixed(2)} €` : '-'],
  ];

  yPos = 63;
  datosEcon.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 110, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 160, yPos);
    yPos += 7;
  });

  // Datos Operacionales
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text('DATOS OPERACIONALES', 200, 55);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const saludPercent = drone.vida_util > 0 
    ? Math.round((drone.horas_voladas / drone.vida_util) * 100)
    : 0;
  const saludRestante = 100 - saludPercent;
  
  const datosOper = [
    ['Horas Voladas:', `${(drone.horas_voladas || 0).toFixed(1)} h`],
    ['Vida Útil:', `${(drone.vida_util || 0).toFixed(0)} h`],
    ['Salud:', `${saludRestante}%`],
    ['Estado:', drone.estado === 'activo' ? 'Activo' : 'Inactivo'],
  ];

  yPos = 63;
  datosOper.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 200, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 240, yPos);
    yPos += 7;
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('© 2025 Skreeo - Gestión Profesional de Flotas', 15, 200);

  // Descargar
  doc.save(`UAS_${drone.marca_modelo.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Función para generar PDF de historial de vuelos
export const generarPDFHistorialVuelos = (drone: any, operadora: any, vuelos: any[]) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Cabecera
  doc.setFontSize(18);
  doc.setTextColor(59, 130, 246);
  doc.text('HISTORIAL DE VUELOS', 15, 15);

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Operadora: ${operadora?.nombre || 'N/A'} - AESA: ${operadora?.numero_aesa || 'N/A'}`, 15, 23);
  doc.text(`UAS: ${drone.marca_modelo} - Matrícula: ${drone.num_matricula}`, 15, 29);
  
  doc.setTextColor(100, 100, 100);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, 240, 15);

  // Tabla de vuelos
  const tableData = vuelos.map(v => [
    new Date(v.fecha).toLocaleDateString('es-ES'),
    v.localizacion || '-',
    v.hora_despegue || '-',
    v.hora_aterrizaje || '-',
    formatDuration(v.duracion),
    v.aterrizajes_dia?.toString() || '0',
    v.aterrizajes_noche?.toString() || '0',
    v.funcion || '-',
    v.actividad || '-',
    v.observaciones || 'N/A',
  ]);

  autoTable(doc, {
    startY: 38,
    head: [[
      'Fecha',
      'Localización',
      'Hora\nDespegue',
      'Hora\nAterrizaje',
      'Duración',
      'Aterrizajes\nDía',
      'Aterrizajes\nNoche',
      'Función\nPiloto',
      'Actividad',
      'Observaciones'
    ]],
    body: tableData,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 25 },
      2: { cellWidth: 18 },
      3: { cellWidth: 18 },
      4: { cellWidth: 18 },
      5: { cellWidth: 18 },
      6: { cellWidth: 18 },
      7: { cellWidth: 20 },
      8: { cellWidth: 30 },
      9: { cellWidth: 'auto' },
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
  });

  // Resumen al final
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total de vuelos: ${vuelos.length}`, 15, finalY);
  
  const totalHoras = vuelos.reduce((acc, v) => {
    const dur = parseDuration(v.duracion);
    return acc + dur;
  }, 0);
  doc.text(`Horas totales: ${(totalHoras / 60).toFixed(2)} h`, 70, finalY);

  const totalCosto = vuelos.reduce((acc, v) => acc + (v.coste_tco_dron || 0), 0);
  doc.text(`Coste total TCO: ${totalCosto.toFixed(2)} €`, 130, finalY);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('© 2025 Skreeo - Gestión Profesional de Flotas', 15, 200);

  doc.save(`Vuelos_${drone.marca_modelo.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Función para generar CSV de vuelos
export const generarCSVVuelos = (drone: any, vuelos: any[]) => {
  const headers = [
    'Fecha',
    'Localización',
    'Hora Despegue',
    'Hora Aterrizaje',
    'Duración',
    'Aterrizajes Día',
    'Aterrizajes Noche',
    'Función Piloto',
    'Actividad',
    'Observaciones',
    'TCO (€)'
  ];

  const rows = vuelos.map(v => [
    new Date(v.fecha).toLocaleDateString('es-ES'),
    v.localizacion || '',
    v.hora_despegue || '',
    v.hora_aterrizaje || '',
    formatDuration(v.duracion),
    v.aterrizajes_dia || '0',
    v.aterrizajes_noche || '0',
    v.funcion || '',
    v.actividad || '',
    v.observaciones || '',
    (v.coste_tco_dron || 0).toFixed(2)
  ]);

  const csvContent = [
    headers.join(';'),
    ...rows.map(row => row.join(';'))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `Vuelos_${drone.marca_modelo.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Función para generar PDF de mantenimiento
export const generarPDFMantenimiento = (drone: any, operadora: any, mantenimientos: any[]) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Cabecera
  doc.setFontSize(18);
  doc.setTextColor(59, 130, 246);
  doc.text('LIBRO DE MANTENIMIENTO', 15, 15);

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Operadora: ${operadora?.nombre || 'N/A'} - AESA: ${operadora?.numero_aesa || 'N/A'}`, 15, 23);
  doc.text(`UAS: ${drone.marca_modelo} - Matrícula: ${drone.num_matricula}`, 15, 29);
  
  doc.setTextColor(100, 100, 100);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, 240, 15);

  // Tabla de mantenimientos
  const tableData = mantenimientos.map(m => [
    new Date(m.fecha).toLocaleDateString('es-ES'),
    m.horas_vuelo || '-',
    m.descripcion || '-',
    m.precio ? `${parseFloat(m.precio).toFixed(2)} €` : '-',
  ]);

  autoTable(doc, {
    startY: 38,
    head: [['Fecha', 'Horas de Vuelo', 'Descripción', 'Precio']],
    body: tableData,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 35 },
      2: { cellWidth: 150 },
      3: { cellWidth: 30, halign: 'right' },
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
  });

  // Resumen
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total de registros: ${mantenimientos.length}`, 15, finalY);
  
  const costoTotal = mantenimientos.reduce((acc, m) => acc + (parseFloat(m.precio) || 0), 0);
  doc.text(`Coste total mantenimiento: ${costoTotal.toFixed(2)} €`, 70, finalY);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('© 2025 Skreeo - Gestión Profesional de Flotas', 15, 200);

  doc.save(`Mantenimiento_${drone.marca_modelo.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Utilidades
const formatDuration = (duracion: any): string => {
  if (!duracion) return '0h 0m';
  
  if (typeof duracion === 'string') {
    const match = duracion.match(/(\d+):(\d+):(\d+)/);
    if (match) {
      const hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      return `${hours}h ${minutes}m`;
    }
  }
  
  return duracion;
};

const parseDuration = (duracion: any): number => {
  if (!duracion) return 0;
  
  if (typeof duracion === 'string') {
    const match = duracion.match(/(\d+):(\d+):(\d+)/);
    if (match) {
      const hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      return hours * 60 + minutes;
    }
  }
  
  return 0;
};
