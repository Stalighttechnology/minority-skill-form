import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { COURSES, MINORITY_RELIGIONS, WEB_LINKS } from "@/data/skill";
import heroBg from "@/assets/hero-bg.jpg";
import skillImg from "@/assets/skill-learn-lead.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skill Development @VTU — Minority Skill Training Programme" },
      {
        name: "description",
        content:
          "VTU Skill Development Centres offer free job-oriented training for minority community candidates. View proposed courses and apply online.",
      },
      { property: "og:title", content: "Skill Development @VTU" },
      {
        property: "og:description",
        content:
          "Free job-oriented skill training at VTU Skill Development Centres for minority community candidates across Karnataka.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section
        className="relative flex min-h-[320px] items-center justify-center bg-navy-deep bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-navy-deep/70" />
        <h1 className="relative px-4 text-center font-display text-3xl font-bold text-navy-foreground sm:text-5xl">
          Skill Development @VTU
        </h1>
      </section>

      <section className="bg-navy-deep py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[280px_1fr]">
          <aside>
            <h2 className="mb-6 font-display text-3xl font-bold text-navy-foreground">
              Web Links:
            </h2>
            <div className="space-y-4">
              {WEB_LINKS.map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="link-pill">
                  {l.label}
                </a>
              ))}
              <a
                href="https://vtu.ac.in/wp-content/uploads/2025/06/VTU-SDC.pdf"
                target="_blank"
                rel="noreferrer"
                className="link-pill"
              >
                Download Brochure
              </a>
              <Link to="/register" className="btn-lime w-full">
                Apply Now
              </Link>
            </div>
          </aside>

          <article className="bg-card p-6 shadow-panel sm:p-10">
            <img
              src={skillImg}
              alt="Students training at a VTU Skill Development Centre"
              width={1200}
              height={700}
              className="mx-auto mb-8 w-full max-w-2xl"
            />
            <div className="space-y-4 text-justify text-[0.95rem] leading-relaxed text-foreground/85">
              <p>
                <em>Technology</em> is the application of scientific knowledge to the realistic
                challenges posed by industry and human life. There is a huge impact of changing
                technologies on career, industry and profession. Engineering skill is ability and
                capacity acquired through understanding the nuts and bolts of technology that help
                in smooth adaption for carrying out job functions.
              </p>
              <p>
                VTU-Skill Development Centres set up across various campuses of Visvesvaraya
                Technological University offer the required skills to potential faculties and
                students of VTU. They provide a platform to get exposed to advanced technologies
                either for research, consultancy or training to do a particular task or 'ready to
                perform skills' for a particular Job Role.
              </p>
              <p>
                At VTU-SDCs, additional capabilities can be acquired by the students alongside the
                academic qualification that make them job ready by fulfilling the expectations of
                the industry. Further the faculties are empowered with latest knowledge and advances
                in technologies that are crucial for imparting the value-added education in their
                domains.
              </p>
              <p>
                Through re-skilling @VTU students are exposed to learning new skills outside
                existing skill sets. By up-skilling, the students and faculties are provided with
                more advanced skills through additional education and training by collaborating and
                investing significantly in industrial and corporate initiatives.
              </p>
              <p>
                All the Skilling activities of VTU-SDCs focus on enhancing the employability of
                students of Visvesvaraya Technological University that result in capacity building
                with productivity and make the faculties more competent in knowledge &amp; research.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="section-title text-center sm:text-4xl">Proposed Training Programme</h2>
          <p className="mx-auto mt-3 max-w-3xl text-center text-sm text-muted-foreground">
            The following skill development courses are proposed under the Minority Project for
            candidates belonging to notified minority communities.
          </p>

          <div className="mt-8 overflow-hidden rounded-lg border border-border shadow-panel">
            <table className="w-full text-left text-sm">
              <thead className="bg-card text-navy">
                <tr>
                  <th className="px-4 py-4 text-center font-semibold">Sl. No</th>
                  <th className="px-4 py-4 font-semibold">Proposed Courses</th>
                  <th className="px-4 py-4 font-semibold">Qualification Criteria</th>
                </tr>
              </thead>
              <tbody>
                {COURSES.map((c, i) => (
                  <tr key={c.id} className={i % 2 === 0 ? "bg-muted" : "bg-card"}>
                    <td className="px-4 py-4 text-center text-navy">{c.id}</td>
                    <td className="px-4 py-4 font-medium text-navy">{c.name}</td>
                    <td className="px-4 py-4 text-navy/80">{c.criteria}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 rounded-lg bg-muted p-6">
            <h3 className="font-display text-xl font-bold text-navy">
              Castes covered under the Minority Project
            </h3>
            <ol className="mt-4 grid gap-2 text-sm text-foreground/85 sm:grid-cols-3">
              {MINORITY_RELIGIONS.map((r, i) => (
                <li key={r}>
                  {i + 1}. {r}
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-10 text-center">
            <Link to="/register" className="btn-primary">
              Register for a Course
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
