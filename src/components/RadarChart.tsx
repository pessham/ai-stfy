import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { StrengthCategory } from '../types/strengthTypes';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  data: StrengthCategory[];
}

export const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(category => category.name),
    datasets: [
      {
        label: 'あなたのストレングス',
        data: data.map(category => category.score),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        fill: true,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          backdropColor: 'transparent',
          color: 'rgba(0, 0, 0, 0.6)'
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return <Radar data={chartData} options={options} />;
};
