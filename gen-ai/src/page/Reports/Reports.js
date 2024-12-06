import React, { useEffect, useState } from 'react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Reports.css';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Reports() {
  const [chartData, setChartData] = useState({
    doughnut: null,
    bar: null,
    line: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch chart data from the backend
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);

        const response = await fetch('http://localhost:3000/api/register');
        if (!response.ok) {
          throw new Error('Failed to fetch data from the server');
        }

        const data = await response.json();

        // Process the data from the backend into chart-compatible format
        setChartData({
          doughnut: {
            labels: data.doughnut.labels,
            datasets: [
              {
                data: data.doughnut.values,
                backgroundColor: [
                  '#4a235a',
                  '#2ecc71',
                  '#27ae60',
                  '#e91e63',
                  '#f1c40f',
                  '#e67e22',
                  '#9b59b6',
                  '#ff69b4',
                  '#f39c12',
                  '#e74c3c',
                ],
              },
            ],
          },
          bar: {
            labels: data.bar.labels,
            datasets: [
              {
                label: 'Industry Adoption Rate',
                data: data.bar.values,
                backgroundColor: 'rgba(135, 206, 235, 0.6)',
                borderColor: 'rgba(135, 206, 235, 1)',
                borderWidth: 1,
              },
            ],
          },
          line: {
            labels: data.line.labels,
            datasets: [
              {
                label: 'AI Model Performance Growth',
                data: data.line.values,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: false,
              },
            ],
          },
        });

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  if (loading) {
    return <div className="reports-container">Loading...</div>;
  }

  if (error) {
    return <div className="reports-container">Error: {error}</div>;
  }

  return (
    <div className="reports-container">
      <h1>Reports Dashboard</h1>
      <div className="charts-grid">
        <div className="chart-box">
          <h2>Lead Generative AI (Doughnut)</h2>
          {chartData.doughnut && <Doughnut data={chartData.doughnut} options={options} />}
        </div>
        <div className="chart-box">
          <h2>AI Industry Adoption</h2>
          {chartData.bar && <Bar data={chartData.bar} />}
        </div>
        <div className="chart-box">
          <h2>AI Model Performance Trends</h2>
          {chartData.line && <Line data={chartData.line} />}
        </div>
      </div>
    </div>
  );
}

export default Reports;
