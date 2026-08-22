import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { COURSES, MINORITY_RELIGIONS, CENTRES, QUALIFICATIONS } from "@/data/skill";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Registration Form — VTU Minority Skill Development Training" },
      {
        name: "description",
        content:
          "Apply online for free VTU skill development training under the Minority Project. Choose your course and preferred training centre.",
      },
      { property: "og:title", content: "VTU Skill Training Registration" },
      {
        property: "og:description",
        content:
          "Online application form for VTU Skill Development Centres — Minority Project training courses.",
      },
    ],
  }),
  component: RegisterPage,
});

const schema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(120),
  father_name: z.string().trim().max(120).optional().or(z.literal("")),
  gender: z.string().min(1, "Select gender"),
  date_of_birth: z.string().min(1, "Select your date of birth"),
  religion: z.string().min(1, "Select your community"),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().regex(/^[0-9]{10}$/, "Enter a 10-digit mobile number"),
  alt_phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Enter a 10-digit number")
    .optional()
    .or(z.literal("")),
  address: z.string().trim().min(5, "Enter your address").max(500),
  district: z.string().trim().min(2, "Enter your district").max(80),
  taluk: z.string().trim().max(80).optional().or(z.literal("")),
  pincode: z.string().trim().regex(/^[0-9]{6}$/, "Enter a 6-digit pincode"),
  qualification: z.string().min(1, "Select your qualification"),
  year_of_passing: z.string().trim().max(10).optional().or(z.literal("")),
  course: z.string().min(1, "Select a course"),
  preferred_centre: z.string().min(1, "Select a training centre"),
  employment_status: z.string().optional().or(z.literal("")),
  family_income: z.string().optional().or(z.literal("")),
  heard_from: z.string().optional().or(z.literal("")),
  remarks: z.string().trim().max(600).optional().or(z.literal("")),
  declaration: z.literal(true, { message: "You must accept the declaration" }),
});

const EMPTY = {
  full_name: "",
  father_name: "",
  gender: "",
  date_of_birth: "",
  religion: "",
  email: "",
  phone: "",
  alt_phone: "",
  address: "",
  district: "",
  taluk: "",
  pincode: "",
  qualification: "",
  year_of_passing: "",
  course: "",
  preferred_centre: "",
  employment_status: "",
  family_income: "",
  heard_from: "",
  remarks: "",
  declaration: false,
};

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="field-label">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function RegisterPage() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (key: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const selectedCourse = COURSES.find((c) => c.name === form.course);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError("");
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const { error } = await supabase.from("registrations").insert(parsed.data);
    setSubmitting(false);
    if (error) {
      setServerError("We could not submit your application. Please try again.");
      return;
    }
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="bg-navy-deep py-10">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-display text-2xl font-bold text-navy-foreground sm:text-4xl">
            Minority Skill Development Training — Registration
          </h1>
          <p className="mt-3 text-sm text-navy-foreground/75">
            Free job-oriented training at VTU Skill Development Centres for candidates from notified
            minority communities: Muslim, Christian, Jain, Sikh, Buddhist and Parsi.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 py-12">
        {done ? (
          <div className="rounded-lg border border-border bg-card p-10 text-center shadow-panel">
            <h2 className="section-title">Application submitted</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Thank you. Your registration has been recorded. The VTU Skill Development Centre team
              will contact you on the mobile number provided.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/" className="btn-primary">
                Back to Skill Development
              </Link>
              <button
                type="button"
                className="btn-lime"
                onClick={() => {
                  setForm(EMPTY);
                  setDone(false);
                }}
              >
                Submit another response
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            noValidate
            className="space-y-10 rounded-lg border border-border bg-card p-6 shadow-panel sm:p-10"
          >
            <fieldset className="space-y-5">
              <legend className="section-title mb-3">1. Personal details</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" required error={errors['full_name']}>
                  <input
                    className="field-input"
                    value={form.full_name}
                    onChange={(e) => set("full_name", e.target.value)}
                    maxLength={120}
                  />
                </Field>
                <Field label="Father's / Guardian's name" error={errors['father_name']}>
                  <input
                    className="field-input"
                    value={form.father_name}
                    onChange={(e) => set("father_name", e.target.value)}
                    maxLength={120}
                  />
                </Field>
                <Field label="Gender" required error={errors['gender']}>
                  <select
                    className="field-input"
                    value={form.gender}
                    onChange={(e) => set("gender", e.target.value)}
                  >
                    <option value="">Choose</option>
                    {["Female", "Male", "Other"].map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Date of birth" required error={errors['date_of_birth']}>
                  <input
                    type="date"
                    className="field-input"
                    value={form.date_of_birth}
                    onChange={(e) => set("date_of_birth", e.target.value)}
                  />
                </Field>
                <Field label="Minority community (caste)" required error={errors['religion']}>
                  <select
                    className="field-input"
                    value={form.religion}
                    onChange={(e) => set("religion", e.target.value)}
                  >
                    <option value="">Choose your community</option>
                    {MINORITY_RELIGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Employment status" error={errors['employment_status']}>
                  <select
                    className="field-input"
                    value={form.employment_status}
                    onChange={(e) => set("employment_status", e.target.value)}
                  >
                    <option value="">Choose</option>
                    {["Student", "Unemployed", "Employed", "Self-employed"].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </fieldset>

            <fieldset className="space-y-5">
              <legend className="section-title mb-3">2. Contact details</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Email address" required error={errors['email']}>
                  <input
                    type="email"
                    className="field-input"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    maxLength={255}
                  />
                </Field>
                <Field label="Mobile number" required error={errors['phone']}>
                  <input
                    inputMode="numeric"
                    className="field-input"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  />
                </Field>
                <Field label="Alternate mobile number" error={errors['alt_phone']}>
                  <input
                    inputMode="numeric"
                    className="field-input"
                    value={form.alt_phone}
                    onChange={(e) => set("alt_phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  />
                </Field>
                <Field label="Pincode" required error={errors['pincode']}>
                  <input
                    inputMode="numeric"
                    className="field-input"
                    value={form.pincode}
                    onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  />
                </Field>
                <Field label="District" required error={errors['district']}>
                  <input
                    className="field-input"
                    value={form.district}
                    onChange={(e) => set("district", e.target.value)}
                    maxLength={80}
                  />
                </Field>
                <Field label="Taluk" error={errors['taluk']}>
                  <input
                    className="field-input"
                    value={form.taluk}
                    onChange={(e) => set("taluk", e.target.value)}
                    maxLength={80}
                  />
                </Field>
              </div>
              <Field label="Full postal address" required error={errors['address']}>
                <textarea
                  rows={3}
                  className="field-input"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  maxLength={500}
                />
              </Field>
            </fieldset>

            <fieldset className="space-y-5">
              <legend className="section-title mb-3">3. Education &amp; course selection</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Highest qualification" required error={errors['qualification']}>
                  <select
                    className="field-input"
                    value={form.qualification}
                    onChange={(e) => set("qualification", e.target.value)}
                  >
                    <option value="">Choose</option>
                    {QUALIFICATIONS.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Year of passing" error={errors['year_of_passing']}>
                  <input
                    inputMode="numeric"
                    className="field-input"
                    value={form.year_of_passing}
                    onChange={(e) =>
                      set("year_of_passing", e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                  />
                </Field>
                <Field label="Course applied for" required error={errors['course']}>
                  <select
                    className="field-input"
                    value={form.course}
                    onChange={(e) => set("course", e.target.value)}
                  >
                    <option value="">Choose a course</option>
                    {COURSES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.id}. {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Preferred training centre" required error={errors['preferred_centre']}>
                  <select
                    className="field-input"
                    value={form.preferred_centre}
                    onChange={(e) => set("preferred_centre", e.target.value)}
                  >
                    <option value="">Choose a centre</option>
                    {CENTRES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              {selectedCourse && (
                <p className="rounded-md bg-muted px-4 py-3 text-sm text-navy">
                  Qualification criteria for <strong>{selectedCourse.name}</strong>:{" "}
                  {selectedCourse.criteria}
                </p>
              )}
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Annual family income" error={errors['family_income']}>
                  <select
                    className="field-input"
                    value={form.family_income}
                    onChange={(e) => set("family_income", e.target.value)}
                  >
                    <option value="">Choose</option>
                    {["Below ₹1,00,000", "₹1,00,000 – ₹2,50,000", "₹2,50,000 – ₹5,00,000", "Above ₹5,00,000"].map(
                      (i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ),
                    )}
                  </select>
                </Field>
                <Field label="How did you hear about this programme?" error={errors['heard_from']}>
                  <select
                    className="field-input"
                    value={form.heard_from}
                    onChange={(e) => set("heard_from", e.target.value)}
                  >
                    <option value="">Choose</option>
                    {["College / Institution", "VTU website", "Social media", "Friends / Family", "Newspaper", "Other"].map(
                      (h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ),
                    )}
                  </select>
                </Field>
              </div>
              <Field label="Remarks (optional)" error={errors['remarks']}>
                <textarea
                  rows={3}
                  className="field-input"
                  value={form.remarks}
                  onChange={(e) => set("remarks", e.target.value)}
                  maxLength={600}
                />
              </Field>
            </fieldset>

            <div className="space-y-4">
              <label className="flex items-start gap-3 text-sm text-foreground/85">
                <input
                  type="checkbox"
                  checked={form.declaration}
                  onChange={(e) => set("declaration", e.target.checked)}
                  className="mt-1 size-4 accent-[oklch(0.31_0.11_263)]"
                />
                <span>
                  I declare that the information furnished above is true to the best of my knowledge
                  and that I belong to one of the notified minority communities. *
                </span>
              </label>
              {errors['declaration'] && (
                <p className="text-xs text-destructive">{errors['declaration']}</p>
              )}
              {serverError && <p className="text-sm text-destructive">{serverError}</p>}
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit application"}
                </button>
                <button type="button" className="btn-lime" onClick={() => setForm(EMPTY)}>
                  Clear form
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
