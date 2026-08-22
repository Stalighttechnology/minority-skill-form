export function SiteFooter() {
  return (
    <footer className="bg-navy-deep text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <h3 className="font-display text-lg font-bold">Contact us</h3>
          <p className="mt-3 text-sm leading-relaxed text-navy-foreground/80">
            <strong>Dr. Sandhya R. Anvekar,</strong>
            <br />
            Special Officer
            <br />
            VTU-Skill Development Centres,
            <br />
            Visvesvaraya Technological University
            <br />
            'Jnana Sangama', Belagavi- 590 018.
            <br />
            Karnataka State, India.
          </p>
        </div>
        <div>
          <h3 className="font-display text-lg font-bold">Reach out</h3>
          <p className="mt-3 text-sm leading-relaxed text-navy-foreground/80">
            Cell: 91-8073711611 &amp; 91-9844046719
            <br />
            Landline: 0831-2498157
            <br />
            Email: directorsdc.vtu@gmail.com
          </p>
        </div>
        <div>
          <h3 className="font-display text-lg font-bold">Minority Skill Project</h3>
          <p className="mt-3 text-sm leading-relaxed text-navy-foreground/80">
            Free skill development training for candidates from notified minority
            communities — Muslim, Christian, Jain, Sikh, Buddhist and Parsi.
          </p>
        </div>
      </div>
      <div className="border-t border-navy-foreground/15 py-4 text-center text-xs text-navy-foreground/60">
        © {new Date().getFullYear()} Visvesvaraya Technological University, Belagavi. All rights reserved.
      </div>
    </footer>
  );
}
