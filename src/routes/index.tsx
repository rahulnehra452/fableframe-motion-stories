import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowRight, ArrowDownLeft, Sparkles, WandSparkles, Clock3, Mic, Captions, Music2, Rabbit, Sailboat, Cloud, PencilLine, Clapperboard, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExampleGallery } from '@/components/example-gallery';
import { ReelPlayer } from '@/components/reel-player';
import { SetupDialog } from '@/components/setup-dialog';
import { stories, voices } from '@/lib/stories';
import { pageHead } from '@/lib/metadata';
import { submissionSchema } from '@/lib/reel-schema';
import type { StoryKind } from '@/lib/illustration';
export const Route = createFileRoute('/')({
  head: () => pageHead('Creator studio', 'Turn a little idea into a whimsical, hand-illustrated animated story. Explore real procedural animation in the Fableframe creator studio.'),
  component: Index,
});
function Index() {
  const [prompt, setPrompt] = useState(stories[0]?.prompt ?? ''), [duration, setDuration] = useState<12 | 15 | 18>(15);
  const [voice, setVoice] = useState(voices[0]?.id ?? ''), [captions, setCaptions] = useState(true), [music, setMusic] = useState(false);
  const [selected, setSelected] = useState<StoryKind>('moon'), [setup, setSetup] = useState(false);
  const story = stories.find(s => s.id === selected) ?? stories[0];
  const choose = (id: StoryKind) => { const s = stories.find(s => s.id === id); if (!s) return; setSelected(id); setPrompt(s.prompt); };
  const surprise = () => { const index = stories.findIndex(s => s.id === selected); const next = stories[(index + 1) % stories.length]; if (next) choose(next.id); };
  const generate = () => {
    const result = submissionSchema.safeParse({ prompt, duration, voice, captions, music });
    if (!result.success) { toast.error('Give your story a little more detail', { description: 'Please write between 12 and 1,200 characters.' }); return; }
    setSetup(true);
  };
  if (!story) return null;
  return <AppShell><div className="workspace">
    <div className="studio-intro"><div><div className="eyebrow"><Sparkles />YOUR IMAGINATION, IN MOTION</div><h1 className="display">Every little idea <em>has a story.</em></h1><p className="intro-copy">A curious character. A little adventure. Something wonderfully unexpected.</p></div><div className="sketch-note">a little idea goes a long way<ArrowDownLeft strokeWidth={1} /></div></div>
    <div className="studio-grid"><section className="prompt-section" aria-label="Story settings">
      <div className="section-heading"><div className="step-label"><span className="step-number">1</span><h2>Start with a little imagination</h2></div><span className="subtle-tag">The story is yours</span></div>
      <div className="prompt-editor"><textarea aria-label="Your story prompt" maxLength={1200} value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Once upon a time, a very small…" /><div className="editor-footer"><Button variant="ghost" onClick={surprise}><WandSparkles />Surprise me</Button><span>{prompt.length} / 1,200</span></div></div>
      <div className="suggestions"><span>A little inspiration:</span><Button variant="outline" className="suggestion" onClick={() => choose('moon')}><Rabbit />A moon-stealing rabbit</Button><Button variant="outline" className="suggestion" onClick={() => choose('boat')}><Sailboat />A fox’s first voyage</Button><Button variant="outline" className="suggestion" onClick={() => choose('cloud')}><Cloud />A daydreaming bear</Button></div>
      <div className="section-heading setting-header"><div className="step-label"><span className="step-number">2</span><h2>Make it your own</h2></div></div>
      <div className="settings-row"><div><label className="setting-label"><Clock3 />Story length</label><div className="duration-group" role="group" aria-label="Story length">{([12, 15, 18] as const).map(n => <Button key={n} variant="ghost" data-active={duration === n} aria-pressed={duration === n} onClick={() => setDuration(n)}>{n} sec</Button>)}</div></div><div><label className="setting-label" htmlFor="narrator"><Mic />Narrator</label><Select value={voice} onValueChange={setVoice}><SelectTrigger id="narrator" className="voice-trigger"><SelectValue /></SelectTrigger><SelectContent>{voices.map(v => <SelectItem key={v.id} value={v.id}>{v.name}<span className="voice-description">{v.detail}</span></SelectItem>)}</SelectContent></Select></div></div>
      <div className="toggle-row"><label className="toggle-setting" htmlFor="captions"><Captions />Story captions<Switch id="captions" checked={captions} onCheckedChange={setCaptions} aria-label="Story captions" /></label><label className="toggle-setting" htmlFor="music"><Music2 />Background music<Switch id="music" checked={music} onCheckedChange={setMusic} aria-label="Background music" /></label></div>
      <Button className="generate-button" onClick={generate} disabled={prompt.trim().length === 0}><Sparkles />Bring my story to life<span className="cost">1 credit</span><ArrowRight className="arrow" /></Button>
      <p className="generation-note"><ShieldCheck />Only a finished story uses a credit. No credits charged in guest mode.</p>
    </section><aside className="preview-section" aria-label="Story preview"><div className="preview-heading"><span>A glimpse of the magic</span><span className="live-badge"><span className="live-dot" />PROCEDURAL SAMPLE</span></div><ReelPlayer key={story.id} story={story} /><p className="preview-caption"><PencilLine />Hand-drawn spirit <span>·</span><Clapperboard />Reel-ready format</p></aside></div>
    <ExampleGallery />
  </div><SetupDialog open={setup} onOpenChange={setSetup} /></AppShell>;
}
