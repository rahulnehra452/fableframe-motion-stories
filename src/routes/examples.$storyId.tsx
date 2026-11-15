import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { useState } from 'react';
import { Copy, Download, ArrowLeft, ArrowRight, Clock3, Film, PencilLine } from 'lucide-react';
import { toast } from 'sonner';
import { AppShell } from '@/components/app-shell';
import { ReelPlayer } from '@/components/reel-player';
import { Button } from '@/components/ui/button';
import { stories } from '@/lib/stories';
import { pageHead } from '@/lib/metadata';
import { sampleAssets } from '@/lib/sample-assets';
export const Route = createFileRoute('/examples/$storyId')({
  loader: ({ params }) => { const story = stories.find(s => s.id === params.storyId); if (!story) throw notFound(); return { story }; },
  head: ({ loaderData }) => pageHead(loaderData?.story.title ?? 'Story example', `Watch ${loaderData?.story.title ?? 'a handcrafted story'}, a real 15-second procedural animation by Fableframe.`),
  component: StoryResult,
});
function StoryResult() {
  const { story } = Route.useLoaderData(); const [downloading, setDownloading] = useState(false);
  const asset = sampleAssets[story.id];
  const download = async () => {
    if (!asset) { toast.error('Sample export is not available yet.'); return; }
    setDownloading(true);
    try { const response = await fetch(asset.url); if (!response.ok) throw new Error('Download unavailable'); const blob = await response.blob(); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${story.id}-fableframe.mp4`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); toast.success('Your sample is ready to download'); }
    catch { toast.error('The download could not be completed. Please try again.'); } finally { setDownloading(false); }
  };
  const copy = async () => { try { await navigator.clipboard.writeText(story.prompt); toast.success('Story prompt copied'); } catch { toast.error('Your browser could not copy the prompt.'); } };
  return <AppShell><div className="workspace"><Button asChild variant="ghost" className="px-0"><Link to="/examples"><ArrowLeft />Back to the story shelf</Link></Button><div className="result-layout"><ReelPlayer key={story.id} story={story} /><section className="result-copy"><div className="eyebrow"><PencilLine />A PROCEDURAL ORIGINAL</div><h1 className="page-title">{story.title}</h1><div className="result-facts"><span><Clock3 />15 seconds</span><span><Film />1080 × 1920 · 30 fps</span></div><p className="page-description">{story.narration}</p><div className="result-prompt"><span className="eyebrow mb-2">THE LITTLE IDEA</span>{story.prompt}</div><div className="result-actions"><Button size="lg" onClick={() => void download()} disabled={downloading}>{downloading ? 'Preparing download…' : <><Download />Download sample MP4</>}</Button><Button variant="outline" onClick={() => void copy()}><Copy />Copy story prompt</Button><Button asChild variant="ghost"><Link to="/">Create your own story<ArrowRight /></Link></Button></div><p className="mt-4 text-xs text-muted-foreground leading-relaxed">Handcrafted procedural sample. Original ambient soundtrack; ElevenLabs narration is not connected.</p></section></div></div></AppShell>;
}