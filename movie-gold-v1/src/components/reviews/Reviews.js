import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Reviews = ({ getMovieData, movie, reviews, setReviews }) => {
  const { moviesId } = useParams();
  const [reviewInput, setReviewInput] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      await getMovieData(moviesId);

      // Get reviews from movie.reviewIds directly
      if (movie?.reviewIds?.length > 0) {
        const reviewBodies = movie.reviewIds.map((r) => ({
          body: r.body,
          id: r.id?.timestamp || Math.random()
        }));
        setReviews(reviewBodies.reverse());
      } else {
        setReviews([]);
      }
    };
    fetchData();
  }, [moviesId, movie]); // listen to movie as well so it works when it changes

  const handleSubmit = async (event) => {
    event.preventDefault();
    const reviewBody = reviewInput.trim();
    if (!reviewBody) return;

    try {
      const response = await fetch(`https://e25fa662b590.ngrok-free.app/api/v1/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reviewBody, imdbId: moviesId })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server responded with error: ${text}`);
      }

      const newReview = await response.json();
      setReviews(prev => [newReview, ...(prev || [])]);
      setReviewInput("");
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', padding: '2rem', boxSizing: 'border-box' }}>
      <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {movie?.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            style={{
              width: '80%',
              maxWidth: '300px',
              borderRadius: '1rem',
              border: '4px solid gold'
            }}
          />
        ) : (
          <p>Loading poster...</p>
        )}
      </div>

      <div style={{ flex: '2', paddingLeft: '2rem', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ marginBottom: '1rem' }}>{movie?.title || 'Loading title...'}</h2>
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <textarea
            name="review"
            placeholder="Write your review here..."
            required
            value={reviewInput}
            onChange={(e) => setReviewInput(e.target.value)}
            style={{
              width: '100%',
              height: '120px',
              resize: 'none',
              padding: '1rem',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              marginBottom: '1rem'
            }}
          ></textarea>
          <button
            type="submit"
            style={{
              padding: '0.6rem 1.2rem',
              fontSize: '1rem',
              borderRadius: '8px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Submit Review
          </button>
        </form>

        <div>
          <h3 style={{ marginBottom: '1rem', color: 'white' }}>Reviews</h3>
          {reviews && reviews.length > 0 ? (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {reviews.map((review, index) => (
                <li
                  key={review.id || index}
                  style={{
                    backgroundColor: '#222',
                    padding: '1rem',
                    marginBottom: '1rem',
                    borderRadius: '8px',
                    color: 'white',
                    fontStyle: 'italic'
                  }}
                >
                  {review.body}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'white' }}>No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
