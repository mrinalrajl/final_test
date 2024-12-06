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
      <h1>Reports from My Analysis</h1>
      <div className="charts-grid">
        <div className="chart-box">
          <h2>Lead Generative AI (Doughnut)</h2>
          {chartData.doughnut && <Doughnut data={chartData.doughnut} options={options} />}
          <h2>Key Developments</h2>
          <ul>
            <li>Integration of multimodal capabilities across platforms</li>
            <li>Enhanced cloud-native infrastructure for model deployment</li>
            <li>Improved performance metrics in language understanding</li>
            <li>Advanced security measures for responsible AI implementation</li>
            <li>Increased focus on model efficiency and resource optimization</li>
        </ul>
        </div>
        
        <div className="chart-box">
          <h2>Gen AI Model Performance Trends (Percentage)</h2>
          {chartData.line && <Line data={chartData.line} />}
          <h2>Future Outlook</h2>
          <ul>
            <li>Expanding applications across more industry sectors</li>
            <li>Growing focus on sustainable AI development</li>
            <li>Increased emphasis on model interpretability</li>
            <li>Development of more specialized industry-specific models</li>
            <li>Enhanced integration with existing business processes</li>
        </ul>
        </div>

        <div className="chart-box">
          <h2>Gen AI Industry Adoption (Percentage)</h2>
          {chartData.bar && <Bar data={chartData.bar} />}
          <h2>Implementation Challenges</h2>
          <ul>
            <li>Addressing the "black box" problem in AI decision-making</li>
            <li>Refining contextual understanding and nuance</li>
            <li>Balancing computational requirements with performance</li>
            <li>Ensuring ethical AI deployment and governance</li>
            <li>Managing data privacy and security concerns</li>
        </ul>
        </div>
      </div>
    </div>
  );
}

export default Reports;
