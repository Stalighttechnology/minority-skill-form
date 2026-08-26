export function SiteFooter() {
  return (
    <footer className="bg-navy-deep text-navy-foreground">
      <div className="mx-auto max-w-4xl px-4 py-6 text-center text-xs leading-relaxed text-navy-foreground/70">
        VTU-Skill Development Centres, Visvesvaraya Technological University,
        'Jnana Sangama', Belagavi- 590 018, Karnataka, India.
        <br />
        Email: directorsdc.vtu@gmail.com · Cell: 91-8073711611
        <br />© {new Date().getFullYear()} Visvesvaraya Technological University. All rights reserved.
      </div>
    </footer>
  );
}
