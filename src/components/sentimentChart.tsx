// SentimentChart.tsx
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SentimentChartProps {
  sentimentData: {
    positive: number;
    neutral: number;
    negative: number;
  };
  videoName: string;
}

const SentimentChart: React.FC<SentimentChartProps> = ({ sentimentData, videoName }) => {
  const data = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        label: `Sentiments for ${videoName}`,
        data: [sentimentData.positive, sentimentData.neutral, sentimentData.negative],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 206, 86, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 206, 86, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Sentiment Analysis for ${videoName}`,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default SentimentChart;
