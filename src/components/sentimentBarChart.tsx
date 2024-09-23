import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { ChartOptions } from 'chart.js'; // Import ChartOptions type

// Register the components for ChartJS
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface SentimentBarChartProps {
  sentimentData: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

const SentimentBarChart: React.FC<SentimentBarChartProps> = ({ sentimentData }) => {
  const data = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        label: "Sentiment Count",
        data: [sentimentData.positive, sentimentData.neutral, sentimentData.negative],
        backgroundColor: ["#5fab13", "#d9bb34", "#bf1134"],
      },
    ],
  };

  const options: ChartOptions<'bar'> = { // Specify 'bar' type explicitly for ChartOptions
    indexAxis: 'y', // This makes the bar horizontal
    scales: {
      x: {
        beginAtZero: true,
        max: Math.max(sentimentData.positive, sentimentData.neutral, sentimentData.negative) + 1,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full h-48">
      <Bar data={data} options={options} className="w-12" />
    </div>
  );  
};

export default SentimentBarChart;
