from flask import Flask, jsonify, request
from pymongo import MongoClient
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import re
from bson import ObjectId


app = Flask(__name__)

## MongoDb connection
client = MongoClient("mongodb+srv://TeamShortify:shortify123@cluster0.uip93.mongodb.net/")
db = client['test']

## collections

likes_vid = db['users']
tags_vid = db['videos']

def serialize_video(video):
    video['_id'] = str(video['_id'])  # Convert ObjectId to string
    return video

def get_likes_vid_df():
    # Fetching the data
    likes_data = list(likes_vid.find({}, {'_id': 1, 'likedVideosID': 1}))
    
    # Convert to DataFrame
    likes_vid_df = pd.DataFrame(likes_data)
    
    # Explode the 'likedVideosID' column to create a row for each video ID
    
    likes_vid_df = likes_vid_df.explode('likedVideosID')
    
      # Print to verify content
    return likes_vid_df


def get_tags_vid_df():
    # Fetching only the '_id' and 'Tags' fields
    tags_data = list(tags_vid.find({}, {'_id': 1, 'Tags': 1}))  # Empty {} query for all documents
    if tags_data:
        tags_vid_df = pd.DataFrame(tags_data)
    else:
        tags_vid_df = pd.DataFrame(columns=['_id', 'Tags'])  # Empty DataFrame with required columns
    # print(tags_vid_df)  # Print to verify content
    return tags_vid_df


def create_user_profile(user_id, likes_df, video_tag_matrix, tags_df):
    liked_videos = likes_df[likes_df['_id']== ObjectId(user_id)]['likedVideosID']
    print(liked_videos)
    if liked_videos.empty:
        return None 
    
    print(type(liked_videos))
    liked_videos = liked_videos.apply(lambda x: ObjectId(x) if not isinstance(x, ObjectId) else x)
    print(tags_df['_id'][0])
    liked_indices = tags_df[tags_df['_id'].isin((liked_videos))].index
    print(liked_indices)
    if liked_indices.empty:
        return None  

    liked_vectors = video_tag_matrix[liked_indices]
    user_profile_sparse = liked_vectors.mean(axis=0)
    user_profile = np.asarray(user_profile_sparse).flatten()
    return user_profile

def recommend_videos(user_id, likes_df, tags_df, video_tag_matrix):
    
    user_profile = create_user_profile(user_id, likes_df, video_tag_matrix, tags_df)
    if user_profile is None:
        return []

    user_profile = user_profile.reshape(1, -1)
    similarities = cosine_similarity(user_profile, video_tag_matrix).flatten()

    similarity_df = pd.DataFrame({
        'video_id': tags_df['_id'],
        'similarity': similarities
    })
    
   

    liked_videos = likes_df[likes_df['_id'] == ObjectId(user_id)]['likedVideosID']
    liked_videos = liked_videos.apply(lambda x: ObjectId(x) if not isinstance(x, ObjectId) else x)
    similarity_df = similarity_df[~similarity_df['video_id'].isin(liked_videos)]
    similarity_df = similarity_df.sort_values(by='similarity', ascending=False)
    
    recommendations_id = similarity_df.head(len(similarity_df))['video_id'].tolist()
    print(recommendations_id)
    recommend_videos = []
    for i in range(len(recommendations_id)):
        recommend_videos.append(tags_vid.find({'_id':recommendations_id[i]}))
    recommend_videos = list(recommend_videos)
    # recommended_videos = list(tags_vid.find({'_id': {'$in': recommendations_id}}))

    # # Serialize each video object to make it JSON serializable
    serialized_videos = [serialize_video(video) for video in recommend_videos]
    print(serialized_videos)
    return serialized_videos



@app.route('/recommendations/<string:user_id>', methods=['GET'])
def get_recommendations(user_id):
    likes_df = get_likes_vid_df()
    tags_df = get_tags_vid_df()
    print(likes_df.shape)
    # print(user_id)
    tfidf = TfidfVectorizer(stop_words='english')
    for i in range(len(tags_df)):
        tags_df['Tags'][i] = tags_df['Tags'][i].lower()
        tags_df['Tags'][i] = re.sub(r'[^a-z\s]','',tags_df['Tags'][i])
        
    video_tag_matrix = tfidf.fit_transform(tags_df['Tags'])
    
    recommended_videos = recommend_videos(user_id, likes_df, tags_df, video_tag_matrix)
    print(recommend_videos)
    return jsonify({'recommended_videos': recommended_videos})

if __name__ == "__main__":
    app.run(port=5002, debug=True)