import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import campusBg from "@/assets/about-bg1-1.jpg";
import { COURSES, MINORITY_RELIGIONS, CENTRES, QUALIFICATIONS, KARNATAKA_DISTRICTS, DISTRICT_TALUKS } from "@/data/skill";

export const Route = createFileRoute("/")({
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
  mother_name: z.string().trim().max(120).optional().or(z.literal("")),
  gender: z.string().min(1, "Select gender"),
  date_of_birth: z.string().min(1, "Select your date of birth"),
  religion: z.string().min(1, "Select your community"),
  specially_abled: z.enum(["Yes", "No"], { message: "Please select if specially abled" }),
  aadhaar_number: z
    .string()
    .trim()
    .regex(/^[0-9]{12}$/, "Aadhaar number must be exactly 12 digits (numbers only)"),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().regex(/^[0-9]{10}$/, "Enter a 10-digit mobile number"),
  alt_phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Enter a 10-digit number")
    .optional()
    .or(z.literal("")),
  address: z.string().trim().min(5, "Enter your address").max(500),
  district: z.string().min(1, "Select your district"),
  taluk: z.string().min(1, "Select your taluk"),
  pincode: z.string().trim().regex(/^[0-9]{6}$/, "Enter a 6-digit pincode"),
  qualification: z.string().min(1, "Select your qualification"),
  year_of_passing: z.string().trim().min(2, "Enter your year of passing").max(10),
  course: z.string().min(1, "Select a course"),
  preferred_training_location: z.string().min(1, "Select your preferred training location"),
  employment_status: z.string().optional().or(z.literal("")),
  family_income: z.string().optional().or(z.literal("")),
  heard_from: z.string().optional().or(z.literal("")),
  remarks: z.string().trim().max(600).optional().or(z.literal("")),
  declaration: z.literal(true, { message: "You must accept the declaration" }),
  passport_photo: z.string().min(1, "Passport size photo is required"),
  aadhaar_card: z.string().min(1, "Aadhaar Card is required"),
  caste_income_cert: z.string().min(1, "Caste & Income certificate is required"),
  highest_qualification_cert: z.string().min(1, "Highest qualification certificate is required"),
});

const EMPTY = {
  full_name: "",
  father_name: "",
  mother_name: "",
  gender: "",
  date_of_birth: "",
  religion: "",
  specially_abled: "No",
  aadhaar_number: "",
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
  preferred_training_location: "",
  employment_status: "",
  family_income: "",
  heard_from: "",
  remarks: "",
  declaration: false,
  passport_photo: "",
  aadhaar_card: "",
  caste_income_cert: "",
  highest_qualification_cert: "",
};

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean | undefined;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className={error ? "has-error animate-pulse-subtle" : ""}>
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
  const [generatedRefNo, setGeneratedRefNo] = useState("");
  const [serverError, setServerError] = useState("");

  const [duplicateModalInfo, setDuplicateModalInfo] = useState<{
    isOpen: boolean;
    referenceNo?: string;
    appliedDate?: string;
    candidateName?: string;
    aadhaarLast4?: string;
  } | null>(null);

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
      
      // Auto-scroll to the first validation error field
      setTimeout(() => {
        const firstErrorElement = document.querySelector(".has-error");
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const d = parsed.data;

    // Check for duplicate Aadhaar number submission
    try {
      const cleanedAadhaar = d.aadhaar_number.trim();
      const { data: existingApp, error: dupCheckErr } = await (supabase.from("vtu_minority_registrations") as any)
        .select("id, reference_no, full_name, created_at, aadhaar_number")
        .eq("aadhaar_number", cleanedAadhaar)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (dupCheckErr) {
        console.warn("Duplicate check warning:", dupCheckErr);
      }

      if (existingApp) {
        setSubmitting(false);
        setDuplicateModalInfo({
          isOpen: true,
          referenceNo: (existingApp as any).reference_no || `VTU-MSD-${(existingApp as any).id.slice(0, 8)}`,
          appliedDate: (existingApp as any).created_at
            ? new Date((existingApp as any).created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "Earlier",
          candidateName: (existingApp as any).full_name || d.full_name,
          aadhaarLast4: cleanedAadhaar.slice(-4),
        });
        return;
      }
    } catch (checkErr) {
      console.error("Duplicate check error:", checkErr);
    }

    // Generate continuous sequential reference number: VTU2026MSD001, VTU2026MSD002, etc.
    let newRefNo = "";
    try {
      const { count } = await supabase
        .from("vtu_minority_registrations")
        .select("*", { count: "exact", head: true });
      const nextSeq = (count || 0) + 1;
      const currentYear = new Date().getFullYear();
      newRefNo = `VTU${currentYear}MSD${String(nextSeq).padStart(3, "0")}`;
    } catch {
      const currentYear = new Date().getFullYear();
      newRefNo = `VTU${currentYear}MSD001`;
    }

    // Upload candidate documents to Supabase Storage bucket 'registrations'
    const uploadDocToStorage = async (base64OrData: string, docKey: string): Promise<string> => {
      if (!base64OrData) return "";
      if (base64OrData.startsWith("http")) return base64OrData;
      try {
        const matches = base64OrData.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          const mime = matches[1];
          const b64 = matches[2];
          const ext = mime === "application/pdf" ? "pdf" : mime.split("/")[1] || "jpg";
          const fileName = `${newRefNo || Date.now()}_${docKey}_${Date.now()}.${ext}`;
          
          // Convert base64 to Blob
          const byteCharacters = atob(b64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: mime });

          const { error: upErr } = await supabase.storage
            .from("registrations")
            .upload(fileName, blob, { contentType: mime, upsert: true });

          if (!upErr) {
            const { data: pubData } = supabase.storage
              .from("registrations")
              .getPublicUrl(fileName);
            return pubData.publicUrl;
          } else {
            console.warn("Storage upload fallback for " + docKey, upErr);
          }
        }
      } catch (err) {
        console.warn("Storage upload exception for " + docKey, err);
      }
      return base64OrData; // fallback
    };

    const [uploadedPhoto, uploadedAadhaar, uploadedCaste, uploadedQual] = await Promise.all([
      uploadDocToStorage(d.passport_photo, "photo"),
      uploadDocToStorage(d.aadhaar_card, "aadhaar"),
      uploadDocToStorage(d.caste_income_cert, "caste"),
      uploadDocToStorage(d.highest_qualification_cert, "qualification"),
    ]);

    const { error, data } = await supabase.from("vtu_minority_registrations").insert({
      reference_no: newRefNo,
      full_name: d.full_name,
      father_name: d.father_name || null,
      mother_name: d.mother_name || null,
      gender: d.gender,
      date_of_birth: d.date_of_birth,
      religion: d.religion,
      specially_abled: d.specially_abled || "No",
      aadhaar_number: d.aadhaar_number || null,
      email: d.email,
      phone: d.phone,
      alt_phone: d.alt_phone || null,
      address: d.address,
      district: d.district,
      taluk: d.taluk || null,
      pincode: d.pincode,
      qualification: d.qualification,
      year_of_passing: d.year_of_passing || null,
      course: d.course,
      preferred_centre: d.preferred_training_location,
      employment_status: d.employment_status || null,
      family_income: d.family_income || null,
      heard_from: d.heard_from || null,
      remarks: d.remarks || null,
      passport_photo_url: uploadedPhoto || null,
      aadhaar_card_url: uploadedAadhaar || null,
      caste_income_cert_url: uploadedCaste || null,
      highest_qualification_cert_url: uploadedQual || null,
      declaration: true,
      status: "Pending",
    } as any);
    
    setSubmitting(false);

    if (error) {
      console.error("Supabase submission error:", error);
      setServerError(`Submission failed: ${error.message || "Please check your database table or permissions in Supabase"}`);
      return;
    }

    setGeneratedRefNo(newRefNo);
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Title section directly below the navbar */}
      <section className="bg-navy-deep py-5 sm:py-7 border-b border-navy-deep/20 shadow-xs">
        <div className="mx-auto max-w-4xl px-3 sm:px-6 text-center">
          <h1 className="font-display text-lg sm:text-2xl md:text-3xl font-bold text-navy-foreground tracking-tight leading-snug">
            Minority Skill Development Training - Registration Form
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-navy-foreground/90 font-medium">
            Free job-oriented training programmes for candidates from notified minority communities:
          </p>
          {/* Minority Communities formatted as 3 and 3 in 2 clean rows */}
          <div className="mt-3.5 flex flex-col items-center gap-2.5">
            {/* Row 1: Muslim, Christian, Jain */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3.5 py-1 rounded-full border border-white/15 min-w-[105px] sm:min-w-[120px] justify-center">
                <span className="h-2 w-2 rounded-full bg-lime shrink-0 shadow-xs" />
                <span className="text-xs sm:text-sm font-semibold text-white">Muslim</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3.5 py-1 rounded-full border border-white/15 min-w-[105px] sm:min-w-[120px] justify-center">
                <span className="h-2 w-2 rounded-full bg-lime shrink-0 shadow-xs" />
                <span className="text-xs sm:text-sm font-semibold text-white">Christian</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3.5 py-1 rounded-full border border-white/15 min-w-[105px] sm:min-w-[120px] justify-center">
                <span className="h-2 w-2 rounded-full bg-lime shrink-0 shadow-xs" />
                <span className="text-xs sm:text-sm font-semibold text-white">Jain</span>
              </div>
            </div>

            {/* Row 2: Sikh, Buddhist, Parsi */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3.5 py-1 rounded-full border border-white/15 min-w-[105px] sm:min-w-[120px] justify-center">
                <span className="h-2 w-2 rounded-full bg-lime shrink-0 shadow-xs" />
                <span className="text-xs sm:text-sm font-semibold text-white">Sikh</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3.5 py-1 rounded-full border border-white/15 min-w-[105px] sm:min-w-[120px] justify-center">
                <span className="h-2 w-2 rounded-full bg-lime shrink-0 shadow-xs" />
                <span className="text-xs sm:text-sm font-semibold text-white">Buddhist</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3.5 py-1 rounded-full border border-white/15 min-w-[105px] sm:min-w-[120px] justify-center">
                <span className="h-2 w-2 rounded-full bg-lime shrink-0 shadow-xs" />
                <span className="text-xs sm:text-sm font-semibold text-white">Parsi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus photo banner below the title section */}
      <div className="relative w-full h-36 sm:h-56 md:h-72 lg:h-96 overflow-hidden border-b border-gray-200 shadow-inner">
        <img
          src={campusBg}
          alt="VTU Belagavi campus"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <main className="mx-auto max-w-4xl px-3 sm:px-6 py-6 sm:py-10">
        {done ? (
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-10 text-center shadow-panel animate-in fade-in zoom-in-95 max-w-xl mx-auto">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mb-4 shadow-xs">
              <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="section-title text-xl sm:text-2xl text-emerald-800">
              Application Submitted Successfully
            </h2>

            <p className="mt-4 text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you for applying. Your registration details and documents have been recorded successfully under the <strong>VTU Minority Skill Development Programme</strong>. The Skill Development Centre team will review your application and contact you on your registered phone number.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                className="btn-primary w-full sm:w-auto"
                onClick={() => {
                  setForm(EMPTY);
                  setGeneratedRefNo("");
                  setDone(false);
                }}
              >
                Submit another application
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            noValidate
            className="space-y-8 sm:space-y-10 rounded-xl border border-border bg-card p-4 sm:p-8 md:p-10 shadow-panel"
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
                    placeholder="Enter full name"
                  />
                </Field>
                <Field label="Father's / Guardian's name" error={errors['father_name']}>
                  <input
                    className="field-input"
                    value={form.father_name}
                    onChange={(e) => set("father_name", e.target.value)}
                    maxLength={120}
                    placeholder="Enter father / guardian name"
                  />
                </Field>
                <Field label="Mother's name" error={errors['mother_name']}>
                  <input
                    className="field-input"
                    value={form.mother_name}
                    onChange={(e) => set("mother_name", e.target.value)}
                    maxLength={120}
                    placeholder="Enter mother's name"
                  />
                </Field>
                <Field label="Gender" required error={errors['gender']}>
                  <select
                    className="field-input"
                    value={form.gender}
                    onChange={(e) => set("gender", e.target.value)}
                  >
                    <option value="">Choose Gender</option>
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
                <Field label="Aadhaar Number" required error={errors['aadhaar_number']}>
                  <input
                    inputMode="numeric"
                    className="field-input"
                    value={form.aadhaar_number}
                    onKeyDown={(e) => {
                      // Allow navigation and deletion keys
                      if (
                        ["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight"].includes(e.key) ||
                        (e.ctrlKey && ["a", "c", "v", "x"].includes(e.key.toLowerCase()))
                      ) {
                        return;
                      }
                      // Block any non-digit
                      if (!/^[0-9]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => set("aadhaar_number", e.target.value.replace(/\D/g, "").slice(0, 12))}
                    placeholder="Enter 12-digit Aadhaar number"
                    maxLength={12}
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
                <Field label="Specially abled (PWD)" required error={errors['specially_abled']}>
                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                      <input
                        type="radio"
                        name="specially_abled"
                        value="Yes"
                        checked={form.specially_abled === "Yes"}
                        onChange={() => set("specially_abled", "Yes")}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                      <input
                        type="radio"
                        name="specially_abled"
                        value="No"
                        checked={form.specially_abled === "No"}
                        onChange={() => set("specially_abled", "No")}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <span>No</span>
                    </label>
                  </div>
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
                  <select
                    className="field-input"
                    value={form.district}
                    onChange={(e) => {
                      set("district", e.target.value);
                      set("taluk", "");
                    }}
                  >
                    <option value="">Choose District</option>
                    {KARNATAKA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Taluk" required error={errors['taluk']}>
                  <select
                    className="field-input"
                    value={form.taluk}
                    onChange={(e) => set("taluk", e.target.value)}
                    disabled={!form.district}
                  >
                    <option value="">Choose Taluk</option>
                    {form.district &&
                      DISTRICT_TALUKS[form.district]?.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                  </select>
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
                <Field label="Year of passing" required error={errors['year_of_passing']}>
                  <input
                    inputMode="numeric"
                    className="field-input"
                    value={form.year_of_passing}
                    onChange={(e) => set("year_of_passing", e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="e.g. 2022"
                    maxLength={4}
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
                        {c.id}. {c.name} ({c.criteria})
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Preferred training location" required error={errors['preferred_training_location']}>
                  <select
                    className="field-input"
                    value={form.preferred_training_location}
                    onChange={(e) => set("preferred_training_location", e.target.value)}
                  >
                    <option value="">Choose Training Location</option>
                    {KARNATAKA_DISTRICTS.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              {selectedCourse && (
                <p className="rounded-md bg-muted px-4 py-3 text-sm text-navy">
                  Qualification criteria for <strong>{selectedCourse.name}</strong>:{" "}
                  <span className="font-semibold">{selectedCourse.criteria}</span>
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

            <fieldset className="space-y-5">
              <legend className="section-title mb-3">4. Document Uploads (Max 1MB each)</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                {[
                  { key: "passport_photo", label: "Passport size photo", accept: "image/*" },
                  { key: "aadhaar_card", label: "Aadhaar Card", accept: ".pdf,image/*" },
                  {
                    key: "caste_income_cert",
                    label: "Caste & Income certificate (Should be valid as on date)",
                    accept: ".pdf,image/*",
                  },
                  {
                    key: "highest_qualification_cert",
                    label: "Highest qualification certificate",
                    accept: ".pdf,image/*",
                  },
                ].map((item) => {
                  const currentFileName = form[item.key as keyof typeof form]
                    ? (form[item.key as keyof typeof form] as string).split("\\").pop() || "File chosen"
                    : "No file chosen";

                  return (
                    <Field key={item.key} label={item.label} required error={errors[item.key]}>
                      <div className="relative flex items-center gap-3 rounded-lg border border-input bg-card p-3 shadow-xs transition-all hover:border-ring">
                        <label className="inline-flex cursor-pointer items-center justify-center rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground hover:bg-accent transition-colors select-none shrink-0">
                          Choose File
                          <input
                            type="file"
                            accept={item.accept}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 1024 * 1024) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    [item.key]: "File size exceeds 1MB limit",
                                  }));
                                  set(item.key, "");
                                } else {
                                  setErrors((prev) => {
                                    const copy = { ...prev };
                                    delete copy[item.key];
                                    return copy;
                                  });

                                  // Convert to Data URL / Base64 so it can be saved, previewed, and fetched
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    set(item.key, reader.result as string);
                                  };
                                  reader.onerror = () => {
                                    set(item.key, file.name);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }
                            }}
                          />
                        </label>
                        <span className="text-xs text-muted-foreground truncate select-none">
                          {currentFileName}
                        </span>
                        {form[item.key as keyof typeof form] && (
                          <button
                            type="button"
                            onClick={() => {
                              set(item.key, "");
                              setErrors((prev) => {
                                const copy = { ...prev };
                                delete copy[item.key];
                                return copy;
                              });
                            }}
                            className="ml-auto text-xs text-destructive hover:underline font-semibold"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </Field>
                  );
                })}
              </div>
            </fieldset>

            <div className={`space-y-4 ${errors['declaration'] ? 'has-error' : ''}`}>
              <label className="flex items-start gap-3 text-sm text-foreground/85 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.declaration}
                  onChange={(e) => set("declaration", e.target.checked)}
                  className="mt-1 size-4 accent-[oklch(0.31_0.11_263)] cursor-pointer"
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
              <div className="pt-2">
                <button type="submit" className="btn-primary w-full sm:w-auto" disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit application"}
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      {/* Duplicate Aadhaar / Application Already Submitted Modal */}
      {duplicateModalInfo?.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-5 text-white flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-xl shrink-0">
                  ⚠️
                </div>
                <div>
                  <h3 className="text-lg font-bold leading-tight">
                    Application Already Submitted
                  </h3>
                  <p className="text-xs text-amber-100 mt-0.5">
                    Minority Skill Development Programme — VTU
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDuplicateModalInfo(null)}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg p-1.5 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-slate-700">
              <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200/80 text-sm space-y-2">
                <p className="font-semibold text-amber-950">
                  This Aadhaar number has already been used to submit an application.
                </p>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  You cannot submit another application using the same Aadhaar number. Please check your existing application or contact the administrator if you believe this is an error.
                </p>
              </div>

              {/* Existing Details Card */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5 text-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-200">
                  Existing Registration Details
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-slate-500 block">Candidate Name:</span>
                    <strong className="text-slate-900 text-sm">{duplicateModalInfo.candidateName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Aadhaar (Ending):</span>
                    <strong className="text-slate-900 font-mono">•••• •••• {duplicateModalInfo.aadhaarLast4 || "••••"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Reference Number:</span>
                    <span className="inline-block font-mono font-bold text-navy bg-white px-2 py-0.5 rounded border border-slate-200 mt-0.5">
                      {duplicateModalInfo.referenceNo}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Submission Date:</span>
                    <strong className="text-slate-900">{duplicateModalInfo.appliedDate}</strong>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <span>ℹ️</span>
                <span>For any queries or corrections, please contact the VTU Minority Project coordinator.</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setDuplicateModalInfo(null)}
                className="px-5 py-2.5 bg-navy text-white text-xs font-semibold rounded-xl hover:bg-navy-deep transition-colors shadow-xs"
              >
                Understood / Close
              </button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}

