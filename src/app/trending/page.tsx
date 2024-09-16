"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  description: string;
}

export default function TrendingVideos() {

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Trending Videos</h1>
      {"likedVideos".length === 0 ? (
        <p className="text-gray-400">You haven't liked any videos yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
        </div>
      )}
    </div>
  );
}
