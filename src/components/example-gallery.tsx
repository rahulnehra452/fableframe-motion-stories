import { Link } from '@tanstack/react-router';
import { ArrowUpRight, Play, ArrowRight } from 'lucide-react';
import { StoryCanvas } from './story-canvas';
import { Button } from '@/components/ui/button';
import { stories } from '@/lib/stories';
export function ExampleGallery({ heading = true }: { heading?: boolean }) {
  return <section className={heading ? 'inspiration' : ''}>
    {heading && <div className="inspiration-head"><div><h2>A spark for your next story</h2><p>Small worlds. Endless possibilities.</p></div><Link to="/examples">Explore examples <ArrowRight /></Link></div>}
    <div className="example-grid">{stories.map(story => <article className="example-item" key={story.id}>
      <Link to="/examples/$storyId" params={{ storyId: story.id }} aria-label={`Watch ${story.title}`}><div className="example-art"><StoryCanvas story={story.id} time={2.5} label={story.title} /><span className="example-duration">15 seconds</span><span className="example-play inline-flex items-center justify-center"><Play /></span></div></Link>
      <div className="example-meta"><div><p className="example-label">{story.category}</p><h3>{story.title}</h3></div><Button variant="ghost" size="icon" asChild title={`Open ${story.title}`}><Link to="/examples/$storyId" params={{ storyId: story.id }} aria-label={`Open ${story.title}`}><ArrowUpRight /></Link></Button></div>
    </article>)}</div>
  </section>;
}