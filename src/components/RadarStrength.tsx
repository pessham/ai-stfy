import { FC } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { StrengthScore } from '../utils/calculateScores';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface Props {
  scores: StrengthScore[];
}

export const RadarStrength: FC<Props> = ({ scores }) => {
  const labels = scores.map(s => s.name);
  const values = scores.map(s => s.score);

  const data = {
    labels,
    datasets: [
      {
        label: 'あなたの強みスコア',
        data: values,
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)'
      }
    ]
  };

  const options = {
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: { stepSize: 2 },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        pointLabels: {
          font: {
            size: 14
          }
        }
      }
    },
    plugins: {
      legend: { display: false }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div className="w-full max-w-xl aspect-square mx-auto">
      <Radar data={data} options={options} />
    </div>
  );
}
