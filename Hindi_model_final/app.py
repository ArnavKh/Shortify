from flask import Flask, request, jsonify
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import tensorflow as tf
import pickle
import re
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
import nltk

nltk.download('stopwords')
nltk.download('wordnet')

app = Flask(__name__)

model_path = 'bidirectional_lstm_hindi_model.h5'
loaded_model = load_model(model_path)
loaded_model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

with open('tokenizer.pickle', 'rb') as handle:
    tokenizer = pickle.load(handle)
    
class_labels = ['negative', 'neutral', 'positive']

hindi_stopwords = set([
    'और', 'के', 'यह', 'भी', 'में', 'है', 'से', 'पर', 'एक', 'को', 'हम','कि', 'तथ्य', 'किए', 'तथा', 'साथ'
])

def handle_negation(text):
    negation_words = ['नहीं', 'मत', 'कभी नहीं', 'बिलकुल नहीं']
    words = text.split()
    negation = False
    processed_words = []
    for word in words:
        if word in negation_words:
            negation = True
            processed_words.append(word)
        else:
            if negation:
                processed_words.append(f"{word}_NEG")
                negation = False
            else:
                processed_words.append(word)
    return ' '.join(processed_words)

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^\w\s\u0900-\u097F]', '', text)
    text = re.sub(r'\|', '', text)
    text = re.sub(r'\d+', '', text)
    return ' '.join(word for word in text.split() if word not in hindi_stopwords)

@app.route('/predict_hindi', methods=['POST'])
def predict_sentiment():
    try:
        data = request.json
        sentence = data.get('sentence')
        cleaned_input = clean_text(sentence)
        test_texts_handled = handle_negation(cleaned_input)

        input_sequence = tokenizer.texts_to_sequences([test_texts_handled])
        padded_input = pad_sequences(input_sequence, maxlen=100, padding='pre')

        predictions = loaded_model.predict(padded_input)
        predicted_class = class_labels[int(predictions.argmax(axis=-1)[0])]
        has_negation = any(word.endswith("_NEG") for word in test_texts_handled.split())

       
        if has_negation:
            if predicted_class == 'positive':
                final_label = 'negative'
            elif predicted_class == 'negative':
                final_label = 'positive'
            elif predicted_class == 'neutral':
                final_label = 'negative'
            else:
                final_label = predicted_class
        else:
            final_label = predicted_class
        prediction_probabilities = predictions[0].tolist()

        response = {
            'input': sentence,
            'predicted_sentiment': final_label,
            'prediction_probabilities': prediction_probabilities
        }
        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 400


if __name__ == '__main__':
    app.run(port=5001,debug=True)