import { useParams } from "react-router-dom";
import "./Trailer.css"; // Import a separate CSS file for styles

const Trailer = () => {
  const { ytTrailerId } = useParams();

  return (
    <div className="trailer-wrapper">
      <iframe
        className="trailer-video"
        src={`https://www.youtube.com/embed/${ytTrailerId}?autoplay=1&rel=0&modestbranding=1`}
        title="YouTube Trailer"
        frameBorder="0"
        allow="autoplay; encrypted-media; fullscreen"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default Trailer;
