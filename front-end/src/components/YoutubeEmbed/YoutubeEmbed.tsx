import React from 'react';
import styles from './YoutubeEmbed.module.css';

/*
 This component is adapted from 
 https://dev.to/bravemaster619/simplest-way-to-embed-a-youtube-video-in-your-react-app-3bk2
*/

type VideoProps = {
  embedId: string;
};

const YoutubeEmbed: React.FunctionComponent<VideoProps> = ({
  embedId,
}: VideoProps) => {
  return (
    <div className={styles['video-responsive']}>
      <iframe
        width="853"
        height="480"
        src={`https://www.youtube.com/embed/${embedId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
      />
    </div>
  );
};

export default YoutubeEmbed;
