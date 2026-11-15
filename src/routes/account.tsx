import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { UserRound, CircleDashed, ExternalLink } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { SetupDialog } from '@/components/setup-dialog';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/lib/metadata';
export const Route = createFileRoute('/account')({ head: () => pageHead('Account & settings', 'Manage your Fableframe account, credits, usage, and generation service connections.'), component: Account });
function Account() {
  const [open, setOpen] = useState(false);
  return <AppShell><div className="workspace account-layout"><div className="eyebrow"><UserRound />YOUR CREATIVE CORNER</div><h1 className="page-title">Account & settings</h1><p className="page-description">A home for your stories.</p>
    <section className="settings-band"><h2>Your account</h2><div><div className="status-line"><CircleDashed />Guest studio</div><p>Accounts are unavailable until Lovable Cloud is connected. You can watch and download all three procedural samples without signing in.</p><Button onClick={() => setOpen(true)} variant="outline">Account setup</Button></div></section>
    <section className="settings-band"><h2>Credits & billing</h2><div><div className="status-line"><CircleDashed />No active plan</div><p>No credits have been issued or charged. One successfully delivered story will use one credit. Pricing and payments are not configured.</p><Button asChild variant="outline"><Link to="/examples">Download a free sample</Link></Button></div></section>
    <section className="settings-band"><h2>Generation services</h2><div className="space-y-3"><div className="status-line"><CircleDashed />Gemini — not connected</div><div className="status-line"><CircleDashed />ElevenLabs — not connected</div><div className="status-line"><CircleDashed />Production video renderer — not deployed</div><p>Live generation remains off until these services and persistent job storage are ready. The local renderer and setup requirements are documented in the project.</p><Button asChild variant="link" className="px-0"><a href="https://docs.lovable.dev/features/cloud" target="_blank" rel="noreferrer">About Lovable Cloud<ExternalLink /></a></Button></div></section>
  </div><SetupDialog open={open} onOpenChange={setOpen} /></AppShell>;
}