import React, { useState } from 'react';
import axios from 'axios';
import StarRatings from 'react-star-ratings';

function RatingAndPhotoUpload() {
  const [rating, setRating] = useState(0);
  const [file, setFile] = useState(null);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('rating', rating);
    await axios.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <StarRatings
          rating={rating}
          starRatedColor="gold"
          changeRating={handleRatingChange}
          numberOfStars={5}
          name='rating'
        />
      </div>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default RatingAndPhotoUpload;
