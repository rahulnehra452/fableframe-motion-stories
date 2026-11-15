import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { Cloud, Mic, PencilLine } from 'lucide-react';
import { StoryCanvas } from './story-canvas';
export function SetupDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="setup-dialog">
    <div className="dialog-art"><StoryCanvas story="cloud" time={3} /></div>
    <DialogTitle>A little setup before the magic</DialogTitle>
    <DialogDescription className="leading-relaxed">Live story generation is not connected yet. No credits were charged and no generation job was created.</DialogDescription>
    <ul className="setup-list"><li><Cloud />Lovable Cloud for accounts and saved creations</li><li><PencilLine />Gemini for story planning and animation code</li><li><Mic />ElevenLabs and an isolated video renderer</li></ul>
    <Button asChild><Link to="/examples" onClick={() => onOpenChange(false)}>Watch a working example</Link></Button>
    <Button asChild variant="outline"><Link to="/account" onClick={() => onOpenChange(false)}>View connection status</Link></Button>
  </DialogContent></Dialog>;
}