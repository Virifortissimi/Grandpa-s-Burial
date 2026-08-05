import React from 'react';
import { Music } from 'lucide-react';

export default function AudioSection({ songs, songRefs, onSongPlay }) {
  return (
    <section className="section songs-section">
      <div className="section-heading">
        <p className="eyebrow">Songs of Comfort</p>
        <h2>Music for reflection</h2>
      </div>
      <div className="song-grid" data-aos="smooth-up">
        {songs.map((song, index) => (
          <article className="song-card" key={song.src}>
            <div>
              <Music size={20} />
              <span><strong>{song.title}</strong><small>{song.subtitle}</small></span>
            </div>
            <audio
              ref={(element) => { songRefs.current[index] = element; }}
              controls
              preload="metadata"
              src={song.src}
              onPlay={() => onSongPlay(index)}
            >
              <a href={song.src}>Play {song.title}</a>
            </audio>
          </article>
        ))}
      </div>
    </section>
  );
}
