export const COURSES = [
  { id: 1, name: "AWS Cloud Foundation & Solution Architect", criteria: "Pursuing Diploma/Degree" },
  { id: 2, name: "Application Developer Web & Mobile", criteria: "12th, Pursuing Diploma/Degree" },
  { id: 3, name: "Fashion Designer", criteria: "SSLC" },
  { id: 4, name: "Retail Sales Executive", criteria: "SSLC" },
  { id: 5, name: "Data Entry Operator", criteria: "2nd PUC" },
  { id: 6, name: "IT Customer Care Executive", criteria: "SSLC" },
] as const;

export const MINORITY_RELIGIONS = [
  "Muslim",
  "Christian",
  "Jain",
  "Sikh",
  "Buddhist",
  "Parsi",
] as const;

export const CENTRES = [
  "VTU - SDC@Belagavi",
  "VTU - SDC@Talakal",
  "VTU - SDC@Muddenhalli",
  "VTU - NASD@Dandeli",
  "VTU - SDC@Kalaburagi",
  "VTU - SDC@Mysuru",
  "VTU - SDC@Davanagere",
  "VTU - SDC@Bengaluru",
] as const;

export const QUALIFICATIONS = [
  "SSLC",
  "12th / 2nd PUC",
  "ITI",
  "Pursuing Diploma",
  "Diploma",
  "Pursuing Degree",
  "Degree",
  "Post Graduate",
] as const;

export const WEB_LINKS = CENTRES.map((c) => ({ label: c, href: "https://vtu.ac.in/skill-development-at-vtu/" }));
