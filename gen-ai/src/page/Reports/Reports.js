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
  Legend
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
    pie: null,
    doughnut: null,
    bar: null,
    line: null
  });

  

  useEffect(() => {
    setChartData({
      doughnut: {
        labels: [
          'GPT-4',
          'DALL-E 3',
          'Claude 2',
          'Stable Diffusion',
          'Llama 2',
          'Mistral Mixtral',
          'MidJourney',
          'Google Gemini',
          'LangChain',
          'Hugging Face'
        ],
        datasets: [{
          data: [95, 92, 90, 88, 85, 84, 82, 80, 78, 75],
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
            '#e74c3c'
          ]
        }]
      },
      bar: {
        labels: ['Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education'],
        datasets: [{
          label: 'Industry Adoption Rate',
          data: [78, 85, 65, 72, 58],
          backgroundColor: 'rgba(135, 206, 235, 0.6)',
          borderColor: 'rgba(135, 206, 235, 1)',
          borderWidth: 1
        }]
      },
      line: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'AI Model Performance Growth',
          data: [65, 75, 85, 89, 92, 95],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          fill: false
        }]
      }
    });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right'
      }
    }
  };

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