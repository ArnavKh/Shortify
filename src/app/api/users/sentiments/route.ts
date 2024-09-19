import { NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL_ENGLISH = 'http://127.0.0.1:5000/predict'; // Flask API URL for English sentiment analysis
const API_BASE_URL_HINDI = 'http://127.0.0.1:5001/predict_hindi'; // Flask API URL for Hindi sentiment analysis

// Helper function to send English sentence to Flask API
async function getSentimentFromEnglishAPI(sentence: string) {
  try {
    console.log('Sending English request with data:', { sentence });
    const response = await axios.post(API_BASE_URL_ENGLISH, { sentence });
    console.log('English API response:', response.data);
    return response.data.predicted_sentiment;
  } catch (error) {
    console.error('Failed to fetch English sentiment:', error);
    throw new Error('Failed to fetch English sentiment');
  }
}


// Helper function to send Hindi sentence to Flask API
async function getSentimentFromHindiAPI(sentence: string) {
  try {
    console.log('Sending Hindi request with data:', { sentence });
    const response = await axios.post(API_BASE_URL_HINDI, { sentence });
    console.log('Hindi API response:', response.data);
    return response.data.predicted_sentiment;
  } catch (error) {
    console.error('Failed to fetch Hindi sentiment:', error);
    throw new Error('Failed to fetch Hindi sentiment');
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Received body:', body);
    const { englishComments, hindiComments } = body;

    // Validate the input
    if (!Array.isArray(englishComments) || !Array.isArray(hindiComments)) {
      return NextResponse.json({ error: 'Invalid input format' }, { status: 400 });
    }

    // Initialize counters for sentiments
    const sentimentCounts = {
      positive: 0,
      neutral: 0,
      negative: 0
    };

    // Process English comments one by one and count sentiments
    for (const comment of englishComments) {
      if (comment) {
        console.log(comment)
        const sentiment = await getSentimentFromEnglishAPI(comment); // Adjusted to comment.comment
        console.log('English comment sentiment:', sentiment);
        if (sentiment === 'positive') sentimentCounts.positive += 1;
        else if (sentiment === 'neutral') sentimentCounts.neutral += 1;
        else if (sentiment === 'negative') sentimentCounts.negative += 1;
      }
    }

    // Process Hindi comments one by one and count sentiments
    for (const comment of hindiComments) {
      if (comment) {
        const sentiment = await getSentimentFromHindiAPI(comment); // Adjusted to comment.comment
        console.log('Hindi comment sentiment:', sentiment);
        if (sentiment === 'positive') sentimentCounts.positive += 1;
        else if (sentiment === 'neutral') sentimentCounts.neutral += 1;
        else if (sentiment === 'negative') sentimentCounts.negative += 1;
      }
    }

    // Return the results as a JSON response
    console.log('Final sentiment counts:', sentimentCounts);
    return NextResponse.json(sentimentCounts);
  } catch (error) {
    console.error('Error processing sentiment analysis: ', error);
    return NextResponse.json({ error: 'Failed to process sentiment analysis' }, { status: 500 });
  }
}
