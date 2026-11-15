import { Link, useLocation } from '@tanstack/react-router';
import { Feather, Sparkles, UserRound, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ReactNode } from 'react';
export function AppShell({ children }: { children: ReactNode }) {
  const path = useLocation().pathname;
  return <>
    <header className="app-header"><div className="header-inner">
      <Link to="/" className="brand" aria-label="Fableframe studio"><Feather className="brand-symbol" strokeWidth={1.5} />fableframe<span className="sr-only">Studio</span></Link>
      <nav className="header-nav" aria-label="Main navigation">
        <Link to="/" className={`nav-link ${path === '/' ? 'active' : ''}`}>Creator studio</Link>
        <Link to="/creations" className={`nav-link ${path === '/creations' ? 'active' : ''}`}>My creations</Link>
        <Link to="/examples" className={`nav-link ${path.startsWith('/examples') ? 'active' : ''}`}>Explore examples</Link>
      </nav>
      <div className="header-actions"><Link to="/account" className="credit-chip"><Sparkles />Guest studio</Link><Button asChild variant="ghost" size="icon" className="user-icon" title="Account settings"><Link to="/account" aria-label="Account settings"><UserRound /></Link></Button></div>
    </div></header>
    <main>{children}</main>
    <footer className="app-footer"><div className="footer-inner"><span className="footer-tagline">Made for little stories with big imagination.<Heart strokeWidth={1.5} /></span><div className="footer-links"><Link to="/about">About Fableframe</Link><Link to="/terms">Terms</Link><Link to="/privacy">Privacy</Link><Link to="/content-policy">Content policy</Link></div></div></footer>
  </>;
}