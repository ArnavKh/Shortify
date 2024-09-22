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


model_path = 'bidirectional_lstm_model.h5'
loaded_model = load_model(model_path)
loaded_model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

with open('tokenizer.pickle', 'rb') as handle:
    tokenizer = pickle.load(handle)

lemmatizer = WordNetLemmatizer()



class_labels = ['negative', 'neutral', 'positive']


def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    tokens = text.split()
    filtered_tokens = [lemmatizer.lemmatize(word) for word in tokens if word not in stopwords.words('english') or word in ['not']]
    return ' '.join(filtered_tokens)


@app.route('/predict', methods=['POST'])
def predict_sentiment():
    try:
        data = request.json
        sentence = data.get('sentence')
        cleaned_input = clean_text(sentence)

        input_sequence = tokenizer.texts_to_sequences([cleaned_input])
        padded_input = pad_sequences(input_sequence, maxlen=100, padding='pre')

        predictions = loaded_model.predict(padded_input)
        predicted_class = class_labels[int(predictions.argmax(axis=-1)[0])]
        prediction_probabilities = predictions[0].tolist()

        response = {
            'input': sentence,
            'predicted_sentiment': predicted_class,
            'prediction_probabilities': prediction_probabilities
        }
        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 400


if __name__ == '__main__':
    app.run(port = 5000, debug=True)
