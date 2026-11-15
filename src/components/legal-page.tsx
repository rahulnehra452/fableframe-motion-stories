import { AppShell } from './app-shell';
export function LegalPage({ title, sections }: { title: string; sections: { title: string; text: string }[] }) {
  return <AppShell><div className="workspace legal-body"><div className="eyebrow">FABLEFRAME</div><h1 className="page-title">{title}</h1><div className="legal-notice">Draft for legal review. These terms are not final and must be reviewed before commercial launch. Operator details and jurisdiction are pending.</div>{sections.map(s => <section key={s.title}><h2>{s.title}</h2><p>{s.text}</p></section>)}</div></AppShell>;
}