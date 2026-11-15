import { useRef, useState } from 'react';
import { Feather, Pause, Play, Maximize } from 'lucide-react';
import { StoryCanvas } from './story-canvas';
import { Button } from '@/components/ui/button';
import type { ExampleStory } from '@/lib/stories';
export function ReelPlayer({ story, autoPlay = true }: { story: ExampleStory; autoPlay?: boolean }) {
  const [playing, setPlaying] = useState(autoPlay), [time, setTime] = useState(2), [position, setPosition] = useState(2);
  const root = useRef<HTMLDivElement>(null);
  const toggle = () => { if (playing) setTime(position); setPlaying(!playing); };
  const fullscreen = async () => {
    if (!root.current) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await root.current.requestFullscreen();
  };
  return <div className="reel-player" ref={root}>
    <StoryCanvas story={story.id} playing={playing} time={time} onTime={setPosition} label={`${story.title}, animated Canvas illustration`} />
    <div className="player-overlay" />
    <div className="player-top"><span className="player-wordmark"><Feather />fableframe</span><span className="format">9:16 · 15 SEC</span></div>
    <div className="player-bottom"><p className="player-story-title">{story.title}</p><div className="player-controls">
      <Button variant="ghost" size="icon" onClick={toggle} aria-label={playing ? 'Pause preview' : 'Play preview'} title={playing ? 'Pause' : 'Play'}>{playing ? <Pause /> : <Play />}</Button>
      <span>{`0:${String(Math.floor(position)).padStart(2, '0')}`}</span>
      <input aria-label="Preview timeline" type="range" min={0} max={14.99} step={0.1} value={position} onChange={e => { const n = Number(e.target.value); setTime(n); setPosition(n); }} />
      <span>0:15</span><Button variant="ghost" size="icon" onClick={() => void fullscreen()} aria-label="Fullscreen preview" title="Fullscreen"><Maximize /></Button>
    </div></div>
  </div>;
}