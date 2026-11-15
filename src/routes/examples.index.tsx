import { createFileRoute } from '@tanstack/react-router';
import { Sparkles } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { ExampleGallery } from '@/components/example-gallery';
import { pageHead } from '@/lib/metadata';
export const Route = createFileRoute('/examples/')({ head: () => pageHead('Explore examples', 'Discover three handcrafted, fully procedural animated stories: a moon-collecting rabbit, an adventurous fox, and a daydreaming bear.'), component: Examples });
function Examples() { return <AppShell><div className="workspace"><div className="eyebrow"><Sparkles />THE STORY SHELF</div><h1 className="page-title">Small worlds. Wonderful stories.</h1><p className="page-description">A rabbit with a very big wish. A fox on his first voyage. A bear with his head in the clouds.</p><ExampleGallery heading={false} /></div></AppShell>; }