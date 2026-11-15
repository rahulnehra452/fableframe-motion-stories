import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { renderStory, type StoryKind } from '@/lib/illustration';
export type StoryCanvasHandle = { canvas: () => HTMLCanvasElement | null };
type Props = { story?: StoryKind; playing?: boolean; time?: number; onTime?: (t: number) => void; className?: string; label?: string };
export const StoryCanvas = forwardRef<StoryCanvasHandle, Props>(function StoryCanvas({ story = 'moon', playing = false, time = 2, onTime, className, label = 'Procedurally illustrated story' }, ref) {
  const canvas = useRef<HTMLCanvasElement>(null), callback = useRef(onTime);
  callback.current = onTime;
  useImperativeHandle(ref, () => ({ canvas: () => canvas.current }), []);
  useEffect(() => {
    const el = canvas.current, c = el?.getContext('2d'); if (!el || !c) return;
    let frame = 0, origin = 0, lastNotify = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const draw = (stamp: number) => {
      if (!origin) origin = stamp;
      const t = playing ? (time + (stamp - origin) / 1000) % 15 : time;
      renderStory(c, t, el.width, el.height, story);
      if (playing && stamp - lastNotify > 150) { callback.current?.(t); lastNotify = stamp; }
      if (playing && !reduced) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw); return () => cancelAnimationFrame(frame);
  }, [story, playing, time]);
  return <canvas ref={canvas} width={720} height={1280} className={className ?? 'story-canvas'} role="img" aria-label={label} />;
});