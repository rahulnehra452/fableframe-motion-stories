import { Link, createFileRoute } from '@tanstack/react-router';
import { Plus, Sparkles } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { StoryCanvas } from '@/components/story-canvas';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/lib/metadata';
export const Route = createFileRoute('/creations')({ head: () => pageHead('My creations', 'Your illustrated stories, saved in one place. Revisit, watch, and download your Fableframe creations.'), component: Creations });
function Creations() { return <AppShell><div className="workspace"><div className="eyebrow"><Sparkles />YOUR LITTLE COLLECTION</div><h1 className="page-title">My creations</h1><p className="page-description">Every story starts with a little spark.</p><div className="empty-state"><div className="empty-illustration"><StoryCanvas story="boat" time={3} /></div><h2>Your story shelf is waiting.</h2><p>Saved creations need a connected account. For now, explore the sample stories or dream up your first little adventure.</p><div className="flex gap-3 flex-wrap justify-center"><Button asChild><Link to="/"><Plus />Create a story</Link></Button><Button asChild variant="outline"><Link to="/examples">Explore examples</Link></Button></div></div></div></AppShell>; }