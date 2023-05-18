import React from 'react';
import parse from '../../parse';
import Stars from '../stars_module/Stars.jsx';
import './reviewStyle.css';

function ReviewTile({ review }) {
  // console.log('Review Tile: ', review);
  const reviewDate = new Date(review.date);
  const [helpCount, setHelpCount] = React.useState(review.helpfulness);
  const fullBody = review.body;
  const [longBody, setLongBody] = React.useState(fullBody.slice(0, 250));
  const [showButton, setShowButton] = React.useState(true);
  const upvote = () => {
    parse.put(`reviews/${review.review_id}/helpful`)
      .then(() => { console.log('Client marked review as helpful'); })
      .catch((err) => { console.log('Client put error :', err); });
  };
  const [currentReviewStars, setCurrentReviewStars] = React.useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  React.useEffect(() => {
    setCurrentReviewStars({
      ...currentReviewStars,
      [review.rating]: 1,
    });
  }, []);

  return (
    <div className="review-tile" data-testid="review-tile">
      <div>
        <span className="review-tile-stars">
          <Stars ratings={currentReviewStars} size={20} interactive={false} cb={() => {}} />
        </span>
        <span className="review-tile-date">{`By: ${review.reviewer_name} Date: ${reviewDate.toDateString()}`}</span>
      </div>
      <div data-testid="review-summary" className="review-summary">{review.summary}</div>
      <div>
        {(fullBody.length < 250 && <div className="review-body" data-testid="review-body">{fullBody}</div>) || (fullBody.length > 250
        && (
        <>
          <div className="review-body" data-testid="review-body">{longBody}</div>
          {showButton && <button type="button" onClick={() => { setLongBody(fullBody); setShowButton(false); }}>More</button>}
        </>
        ))}
      </div>
      <div className="review-recommendation">{review.recommend && <div>{`${'\u2714'} I recommend this product`}</div>}</div>
      <div>{review.response && <div>{`Reponse: ${review.response}`}</div>}</div>
      <div>{review.photos && (review.photos.map((photo) => (<img className="review-image" alt="" src={photo.url} key={photo.url} />)))}</div>
      <div className="review-tile-footer">
        <span>Was this Review Helpful? </span>
        <span
          onClick={() => {
            upvote();
            setHelpCount(helpCount + 1);
          }}
          style={{ cursor: 'pointer', textDecorationLine: 'underline' }}
          role="presentation"
          data-testid="helpful-link"
        >
          Yes
        </span>
        <span>{` (${helpCount})`}</span>
      </div>
    </div>
  );
}

export default ReviewTile;
