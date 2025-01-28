# Shortify

Shortify is an innovative social media application designed for sharing and discovering short videos. It integrates powerful Machine Learning and Natural Language Processing techniques, providing personalized recommendations and bilingual sentiment analysis capabilities.

---

### All the files are in the Secondary branch.

## Installation and Running the Application

### Prerequisites:
- Ensure you have Node.js and Python installed on your system.
- MongoDB setup for storing user and video data.
- Git installed to clone the repository.

### Steps to Install and Run:
1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```
2. Navigate to the working directory:
   ```bash
   cd <repository_folder>
   ```
3. Install the dependencies for the Next.js application:
   ```bash
   npm install
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
5. Navigate to the `recommendation_model_final` directory (Flask app for recommendations):
   ```bash
   cd recommendation_model_final
   ```
6. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
7. Run the Flask application for recommendation system:
   ```bash
   python modelapp.py
   ```
8. Navigate to the `English_model_final` directory (Flask app for sentiment analysis of English Comments):
   ```bash
   cd ../English_model_final
   ```
9. Navigate to the `Hindi_model_final` directory (Flask app for sentiment analysis of Hindi Comments):
   ```bash
   cd ../Hindi_model_final
   ```

10. Run the both Flask applications for sentiment analysis:
    ```bash
    python app.py
    ```
11. Ensure all four servers (Next.js and the three Flask apps) are running simultaneously.

---

## Application Workflow

### User Interaction - Liking a Video
When a user likes a video, the application:
1. Extracts tags associated with the video.
2. Updates the user’s profile in MongoDB by adding these tags to a dedicated field in the user object.
3. These tags are used to enhance recommendations and improve personalization.

---

## Techniques Used

### Recommendation System:
The recommendation system leverages cosine similarity to:
- Compare the user’s favorite tags with all available videos.
- Fetch and display videos best suited to the user’s preferences.

### Sentiment Analysis Model:
- The sentiment analysis backend is built using a BiLSTM (Bidirectional Long Short-Term Memory) Recurrent Neural Network.
- It achieves high accuracy in sentiment classification.
- The model is bilingual, supporting both English and Hindi languages.

---

## Features

### 1. Homepage:
Displays all videos in a random order for discovery and exploration.

### 2. Trending:
Shows videos sorted in descending order of likes, highlighting popular content.

### 3. Liked Videos:
Contains a personalized collection of videos liked by the user.

### 4. Profile:
- Displays all videos uploaded by the user.
- Includes a sentiment analysis graph that visualizes feedback on uploaded content.

### 5. Search Bar:
Enables users to search for specific videos by typing a query. The relevant videos are fetched and displayed.

---

## Tech Stack

### Frontend:
- **Next.js**: Used to build the user interface, ensuring a responsive and interactive experience.

### Backend:
- **Flask**: Powers the recommendation system and sentiment analysis model with robust API endpoints.

### Database:
- **MongoDB**: Stores user profiles, video metadata, and tags for seamless data management.

### Machine Learning:
- **Python**: For implementing the BiLSTM sentiment analysis model and cosine similarity algorithm.

### Cloud Storage:
- **AWS S3**: Utilized for storing video files efficiently and securely.

---

## Contribution
We welcome contributions! If you'd like to add features, fix bugs, or improve the codebase, feel free to open an issue or submit a pull request.

---



## Contact
For any queries or support, please reach out to [adikulkarni2003@gmail.com, arnavkhadkatkar@gmail.com, neelnishasebait@gmail.com].
