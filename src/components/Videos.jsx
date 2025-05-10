const Videos = ({ videos }) => {
  if (!videos || videos.length === 0) return null;

  return (
      <div>
        {videos.map((vid, index) => {
          const videoId = vid.ruta_video.split('v=')[1]?.split('&')[0];

          return (
            <div key={index}>
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={`Video ${index + 1}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          );
        })}
      </div>
  );
};

export default Videos;
