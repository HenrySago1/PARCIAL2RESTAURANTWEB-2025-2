// Archivo: app/src/admin/pages/DashboardPage/index.js

// ¡ESTA ES LA LÍNEA CORRECTA!
import { Box, ContentLayout, HeaderLayout, Typography } from '@strapi/design-system';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

// Registramos los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Este es nuestro componente de React para el Dashboard
const DashboardPage = () => {
  const [reporteData, setReporteData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Usamos useEffect para cargar los datos de tu API de Python
  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        // ¡Llamamos a tu API de Python que simula los +5000 datos!
        const response = await fetch('https://parcial2restaurant-ia-2025-2.onrender.com/api/kpi/ventas-historicas');
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 2. Preparamos los datos para el gráfico
        // Queremos un gráfico de barras del "Bistec Encebollado" a través de las 3 gestiones
        const platoObjetivo = 'Bistec Encebollado';
        const labels = []; // ['2023', '2024', '2025']
        const ventas = []; // [852, 853, 465]

        data.reporte_por_gestion.forEach(gestion => {
          labels.push(gestion.gestion.toString());
          const platoData = gestion.ventas_por_plato.find(p => p.plato === platoObjetivo);
          ventas.push(platoData ? platoData.ventas : 0);
        });

        setReporteData({
          labels: labels,
          datasets: [
            {
              label: `Ventas Históricas de: ${platoObjetivo}`,
              data: ventas,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
          ],
        });
        setLoading(false);

      } catch (e) {
        console.error("Error al cargar KPIs desde la API de Python:", e);
        setError("Error al cargar datos de la API de IA/KPI. ¿El servidor de Python está corriendo?");
        setLoading(false);
      }
    };

    fetchKPIs();
  }, []); // El array vacío significa que se ejecuta 1 vez

  // 3. Renderizamos la página
  return (
    <>
      <HeaderLayout
        title="Dashboard de KPIs"
        subtitle="Reportes y Predicciones del Sistema de Gestión."
      />
      <ContentLayout>
        <Box padding={8} background="neutral0" shadow="tableShadow">
          <Typography variant="beta">
            KPI: Demanda Histórica (Simulación +5000 Datos)
          </Typography>
          
          {loading && <Typography>Cargando reporte...</Typography>}
          {error && <Typography textColor="danger600">{error}</Typography>}
          
          {/* El Gráfico (El "Cuadro") */}
          {reporteData && (
            <Bar
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Ventas por Gestión' },
                },
              }}
              data={reporteData}
            />
          )}

        </Box>
      </ContentLayout>
    </>
  );
};

export default DashboardPage;