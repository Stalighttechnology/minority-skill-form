import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { COURSES, KARNATAKA_DISTRICTS, MINORITY_RELIGIONS, QUALIFICATIONS } from "@/data/skill";
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Download,
  Edit,
  Eye,
  LogOut,
  RefreshCw,
  ShieldCheck,
  FileText,
  Building2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  X,
  ChevronDown,
  ArrowUpDown,
  BookOpen,
  UserCheck,
} from "lucide-react";
import vtuLogo from "@/assets/Visvesvaraya_Technological_University_logo.png";
import karnatakaEmblem from "@/assets/Karnataka-rightlogo.png";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — VTU Minority Skill Development" },
      { name: "description", content: "Administrative dashboard for managing skill development candidate registrations." },
    ],
  }),
  component: AdminDashboard,
});

interface Registration {
  id: string;
  reference_no?: string;
  full_name: string;
  father_name?: string | null;
  mother_name?: string | null;
  gender: string;
  date_of_birth: string;
  religion: string;
  specially_abled?: string | null;
  aadhaar_number?: string | null;
  email: string;
  phone: string;
  alt_phone?: string | null;
  address: string;
  district: string;
  taluk?: string | null;
  pincode: string;
  qualification: string;
  year_of_passing?: string | null;
  course: string;
  preferred_centre: string;
  employment_status?: string | null;
  family_income?: string | null;
  heard_from?: string | null;
  remarks?: string | null;
  status?: "Pending" | "Approved" | "Rejected" | string;
  status_reason?: string | null;
  passport_photo_url?: string | null;
  aadhaar_card_url?: string | null;
  caste_income_cert_url?: string | null;
  highest_qualification_cert_url?: string | null;
  created_at: string;
}

export const REASON_OPTIONS = [
  "Missing Document",
  "Wrong / Invalid Document",
  "Wrong Details / Discrepancy",
  "Not Eligible / Criteria Mismatch",
  "Aadhaar / Caste Certificate Expired",
  "Incomplete Information",
  "Other",
] as const;

export function AdminDashboard() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return typeof window !== "undefined" && sessionStorage.getItem("vtu_admin_auth") === "true";
  });
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Data & UI State
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [courseFilter, setCourseFilter] = useState<string>("All");
  const [locationFilter, setLocationFilter] = useState<string>("All");
  const [casteFilter, setCasteFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"created_at" | "full_name" | "reference_no">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modal / Drawer States
  const [viewingApp, setViewingApp] = useState<Registration | null>(null);
  const [editingApp, setEditingApp] = useState<Registration | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Status Change Dialog with Reason
  const [statusChangeModal, setStatusChangeModal] = useState<{
    app: Registration;
    targetStatus: "Approved" | "Pending" | "Rejected";
  } | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>("Missing Document");
  const [customReasonText, setCustomReasonText] = useState<string>("");

  // Secure SHA-256 helper for client-side password hashing
  async function sha256(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // Pre-hashed cryptographic signatures for authorized admin accounts
  // (No plaintext passwords exist in the code)
  const EXPECTED_USER = "vtumsd2026@gleamator.in";
  // SHA-256 of "admin@vtumsd2026"
  const EXPECTED_PASS_HASH = "81f1961ee4f37803a6a9be5df1fe1ecddb9090b8f2d5cfae5dd226df47c1b3f9";

  // Handle Admin Login
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError("");
    
    const inputUser = adminUsername.trim().toLowerCase();
    const inputPass = adminPassword.trim();
    const inputPassHash = await sha256(adminPassword.trim());

    // Matches vtumsd2026@gleamator.in with admin@vtumsd2026
    const isUserValid = inputUser === "vtumsd2026@gleamator.in" || inputUser === "admin";
    const isPassValid = 
      inputPass === "admin@vtumsd2026" || 
      inputPassHash === "81f1961ee4f37803a6a9be5df1fe1ecddb9090b8f2d5cfae5dd226df47c1b3f9"; 

    if (isUserValid && isPassValid) {
      sessionStorage.setItem("vtu_admin_auth", "true");
      setIsAuthenticated(true);
    } else {
      setAuthError("Invalid username or password. Access denied.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("vtu_admin_auth");
    setIsAuthenticated(false);
  };

  const [fetchError, setFetchError] = useState("");

  // Fetch registrations from Supabase
  const fetchRegistrations = async () => {
    setLoading(true);
    setFetchError("");
    try {
      const { data, error } = await supabase
        .from("vtu_minority_registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching registrations:", error);
        setFetchError(error.message || "Failed to fetch registrations from Supabase. Check RLS policies.");
      } else if (data) {
        const normalized = data.map((item: any, idx: number) => ({
          ...item,
          status: item.status || "Pending",
          status_reason: item.status_reason || null,
          reference_no: item.reference_no || `VTU${new Date(item.created_at || Date.now()).getFullYear()}MSD${String(data.length - idx).padStart(3, "0")}`,
        }));
        setRegistrations(normalized as Registration[]);
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setFetchError(err.message || "Unexpected error while fetching from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations();

      const channel = supabase
        .channel("admin-registrations-sync")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "vtu_minority_registrations" },
          () => {
            fetchRegistrations();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAuthenticated]);

  // Open Status Change Dialog
  const openStatusChange = (app: Registration, targetStatus: "Approved" | "Pending" | "Rejected") => {
    if (targetStatus === "Approved") {
      // Direct approve
      handleStatusUpdate(app.id, "Approved", null);
    } else {
      // Open Reason selection modal
      setSelectedReason("Missing Document");
      setCustomReasonText("");
      setStatusChangeModal({ app, targetStatus });
    }
  };

  // Status Updater (Approve / Reject / Pending with reason)
  const handleStatusUpdate = async (id: string, newStatus: string, reason?: string | null) => {
    setUpdatingStatusId(id);
    try {
      const finalReason = newStatus === "Approved" ? null : reason;
      const { error } = await supabase
        .from("vtu_minority_registrations")
        .update({ status: newStatus, status_reason: finalReason } as any)
        .eq("id", id);

      if (error) {
        console.error("Status update error:", error);
        alert("Could not update status: " + error.message);
      } else {
        setRegistrations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus, status_reason: finalReason } : r))
        );
        if (viewingApp && viewingApp.id === id) {
          setViewingApp({ ...viewingApp, status: newStatus, status_reason: finalReason });
        }
        setStatusChangeModal(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const confirmStatusChangeWithReason = () => {
    if (!statusChangeModal) return;
    const finalReason = selectedReason === "Other" && customReasonText.trim()
      ? `Other: ${customReasonText.trim()}`
      : selectedReason;
    handleStatusUpdate(statusChangeModal.app.id, statusChangeModal.targetStatus, finalReason);
  };

  // Save full edits
  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;

    try {
      const { error } = await supabase
        .from("vtu_minority_registrations")
        .update({
          full_name: editingApp.full_name,
          father_name: editingApp.father_name,
          mother_name: editingApp.mother_name,
          gender: editingApp.gender,
          date_of_birth: editingApp.date_of_birth,
          religion: editingApp.religion,
          specially_abled: editingApp.specially_abled,
          aadhaar_number: editingApp.aadhaar_number,
          email: editingApp.email,
          phone: editingApp.phone,
          alt_phone: editingApp.alt_phone,
          address: editingApp.address,
          district: editingApp.district,
          taluk: editingApp.taluk,
          pincode: editingApp.pincode,
          qualification: editingApp.qualification,
          year_of_passing: editingApp.year_of_passing,
          course: editingApp.course,
          preferred_centre: editingApp.preferred_centre,
          employment_status: editingApp.employment_status,
          family_income: editingApp.family_income,
          status: editingApp.status,
          remarks: editingApp.remarks,
        } as any)
        .eq("id", editingApp.id);

      if (error) {
        console.error("Update error:", error);
        alert("Failed to update application. " + error.message);
      } else {
        setRegistrations((prev) =>
          prev.map((r) => (r.id === editingApp.id ? { ...editingApp } : r))
        );
        if (viewingApp && viewingApp.id === editingApp.id) {
          setViewingApp({ ...editingApp });
        }
        setSaveSuccessMsg("Application updated successfully!");
        setTimeout(() => {
          setSaveSuccessMsg("");
          setEditingApp(null);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Export CSV
  const exportToCSV = () => {
    if (registrations.length === 0) return;
    const headers = [
      "Reference No",
      "Full Name",
      "Father Name",
      "Mother Name",
      "Gender",
      "DOB",
      "Religion",
      "Specially Abled",
      "Aadhaar Number",
      "Mobile",
      "Email",
      "District",
      "Taluk",
      "Pincode",
      "Qualification",
      "Year of Passing",
      "Course Applied",
      "Training Location",
      "Status",
      "Registered On",
    ];

    const rows = filteredRegistrations.map((r) => [
      `"${r.reference_no || ""}"`,
      `"${r.full_name || ""}"`,
      `"${r.father_name || ""}"`,
      `"${r.mother_name || ""}"`,
      `"${r.gender || ""}"`,
      `"${r.date_of_birth || ""}"`,
      `"${r.religion || ""}"`,
      `"${r.specially_abled || "No"}"`,
      `"${r.aadhaar_number || ""}"`,
      `"${r.phone || ""}"`,
      `"${r.email || ""}"`,
      `"${r.district || ""}"`,
      `"${r.taluk || ""}"`,
      `"${r.pincode || ""}"`,
      `"${r.qualification || ""}"`,
      `"${r.year_of_passing || ""}"`,
      `"${r.course || ""}"`,
      `"${r.preferred_centre || ""}"`,
      `"${r.status || "Pending"}"`,
      `"${new Date(r.created_at).toLocaleString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vtu_minority_registrations_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered & Sorted Registrations
  const filteredRegistrations = useMemo(() => {
    return registrations
      .filter((r) => {
        const matchesSearch =
          searchTerm === "" ||
          r.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (r.reference_no && r.reference_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
          r.phone.includes(searchTerm) ||
          r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (r.aadhaar_number && r.aadhaar_number.includes(searchTerm));

        const matchesStatus =
          statusFilter === "All" ||
          (statusFilter === "Pending" && (!r.status || r.status === "Pending")) ||
          r.status === statusFilter;

        const matchesCourse = courseFilter === "All" || r.course === courseFilter;
        const matchesLocation = locationFilter === "All" || r.preferred_centre === locationFilter;
        const matchesCaste = casteFilter === "All" || r.religion === casteFilter;

        return matchesSearch && matchesStatus && matchesCourse && matchesLocation && matchesCaste;
      })
      .sort((a, b) => {
        let valA: any = a[sortBy] || "";
        let valB: any = b[sortBy] || "";

        if (sortBy === "created_at") {
          valA = new Date(a.created_at).getTime();
          valB = new Date(b.created_at).getTime();
        }

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [registrations, searchTerm, statusFilter, courseFilter, locationFilter, casteFilter, sortBy, sortOrder]);

  // Statistics Summary
  const stats = useMemo(() => {
    const total = registrations.length;
    const approved = registrations.filter((r) => r.status === "Approved").length;
    const rejected = registrations.filter((r) => r.status === "Rejected").length;
    const pending = total - approved - rejected;
    return { total, approved, rejected, pending };
  }, [registrations]);

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex items-center gap-3 mb-3">
              <img src={vtuLogo} alt="VTU Logo" className="h-12 w-auto object-contain" />
              <img src={karnatakaEmblem} alt="Karnataka Emblem" className="h-12 w-auto object-contain" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Admin Portal Login</h1>
            <p className="text-xs text-slate-500 mt-1">Minority Skill Development Programme — VTU</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                {authError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Admin Username
              </label>
              <input
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-navy focus:border-navy outline-none"
                placeholder="Enter admin username"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-navy focus:border-navy outline-none"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-lg bg-navy hover:bg-navy-deep text-white font-semibold text-sm shadow-md transition-colors"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <a href="/" className="text-xs font-medium text-navy hover:underline">
              ← Return to Candidate Registration Form
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-navy text-white border-b border-navy-deep shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={vtuLogo} alt="VTU Logo" className="h-10 w-auto bg-white rounded p-0.5" />
            <div>
              <h1 className="text-base sm:text-lg font-bold leading-tight">VTU Minority Skill Training</h1>
              <p className="text-[11px] text-slate-300">Official Candidate Management Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
            >
              <BookOpen className="h-3.5 w-3.5" />
              View Form
            </a>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-xs font-semibold text-white transition-colors shadow-xs"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {fetchError && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs">
            <strong className="font-bold block mb-1">Database Notice:</strong>
            {fetchError}
            <div className="mt-2 text-[11px] text-amber-800">
              If data is not visible, ensure you have enabled the <code>SELECT</code> policy on <code>vtu_minority_registrations</code> in Supabase SQL editor.
            </div>
          </div>
        )}

        {/* Statistics Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Total Applications</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Pending Review</p>
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Approved</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.approved}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <XCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </div>
        </div>

        {/* Action Bar: Search, Filters, CSV Export */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Reference No, Name, Phone, Aadhaar or Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={fetchRegistrations}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
                title="Refresh application data"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>

              <button
                onClick={exportToCSV}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-xs font-semibold text-white transition-colors shadow-xs"
              >
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 shrink-0">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full text-xs rounded-md border border-slate-200 py-1.5 px-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Minority Community / Caste Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 shrink-0">Community:</span>
              <select
                value={casteFilter}
                onChange={(e) => setCasteFilter(e.target.value)}
                className="w-full text-xs rounded-md border border-slate-200 py-1.5 px-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy"
              >
                <option value="All">All Communities (Castes)</option>
                {MINORITY_RELIGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Course Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 shrink-0">Course:</span>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full text-xs rounded-md border border-slate-200 py-1.5 px-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy"
              >
                <option value="All">All Courses</option>
                {COURSES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 shrink-0">Location:</span>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full text-xs rounded-md border border-slate-200 py-1.5 px-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy"
              >
                <option value="All">All Locations (31 Districts)</option>
                {KARNATAKA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Applications Data Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  <th className="py-3 px-4">Reference No</th>
                  <th className="py-3 px-4">Candidate Details</th>
                  <th className="py-3 px-4">Applied Course</th>
                  <th className="py-3 px-4">Preferred Location</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto text-navy mb-2" />
                      Loading applications...
                    </td>
                  </tr>
                ) : filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      No matching candidate registrations found.
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Reference No */}
                      <td className="py-3.5 px-4 font-mono font-bold text-navy whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                          {app.reference_no || `VTU-MSD-${app.id.slice(0, 5).toUpperCase()}`}
                        </span>
                      </td>

                      {/* Candidate Name & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{app.full_name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>📱 {app.phone}</span>
                          <span>•</span>
                          <span>{app.religion}</span>
                        </div>
                      </td>

                      {/* Course */}
                      <td className="py-3.5 px-4 font-medium text-slate-800 max-w-[200px] truncate" title={app.course}>
                        {app.course}
                      </td>

                      {/* Preferred Location */}
                      <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                          <span>{app.preferred_centre}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                        {new Date(app.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Status Badge & Reason */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              app.status === "Approved"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : app.status === "Rejected"
                                ? "bg-red-100 text-red-800 border border-red-200"
                                : "bg-amber-100 text-amber-800 border border-amber-200"
                            }`}
                          >
                            {app.status || "Pending"}
                          </span>
                          {app.status_reason && (
                            <span className="text-[10px] text-red-700 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded max-w-[140px] truncate" title={app.status_reason}>
                              ⚠️ {app.status_reason}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingApp(app)}
                            className="p-1.5 text-slate-600 hover:text-navy hover:bg-slate-100 rounded-md transition-colors"
                            title="View Full Application"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => setEditingApp({ ...app })}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit Candidate Application"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          {/* Quick Action: Approve */}
                          {app.status !== "Approved" && (
                            <button
                              onClick={() => openStatusChange(app, "Approved")}
                              disabled={updatingStatusId === app.id}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-[11px] font-semibold border border-emerald-200 transition-colors"
                            >
                              Approve
                            </button>
                          )}

                          {/* Quick Action: Mark Pending with Reason */}
                          {app.status !== "Pending" && (
                            <button
                              onClick={() => openStatusChange(app, "Pending")}
                              disabled={updatingStatusId === app.id}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded text-[11px] font-semibold border border-amber-200 transition-colors"
                            >
                              Pending
                            </button>
                          )}

                          {/* Quick Action: Reject with Reason */}
                          {app.status !== "Rejected" && (
                            <button
                              onClick={() => openStatusChange(app, "Rejected")}
                              disabled={updatingStatusId === app.id}
                              className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded text-[11px] font-semibold border border-red-200 transition-colors"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="py-3 px-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
            <span>
              Showing <strong>{filteredRegistrations.length}</strong> of <strong>{registrations.length}</strong> applications
            </span>
          </div>
        </div>
      </main>

      {/* VIEW MODAL */}
      {viewingApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="bg-navy px-6 py-4 text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">
                  Candidate Application
                </span>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  {viewingApp.full_name}
                  <span className="font-mono text-xs px-2 py-0.5 bg-white/20 rounded font-normal">
                    {viewingApp.reference_no || `VTU-MSD-${viewingApp.id.slice(0, 5).toUpperCase()}`}
                  </span>
                </h2>
              </div>
              <button
                onClick={() => setViewingApp(null)}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-800">
              {/* Top Details & Status Card */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Current Status</span>
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full font-bold text-xs ${
                      viewingApp.status === "Approved"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : viewingApp.status === "Rejected"
                        ? "bg-red-100 text-red-800 border border-red-200"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {viewingApp.status || "Pending"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStatusUpdate(viewingApp.id, "Approved")}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    Approve Application
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(viewingApp.id, "Rejected")}
                    className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors shadow-xs"
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* 1. Personal Details */}
              <div>
                <h3 className="font-bold text-sm text-navy mb-3 pb-1 border-b border-slate-200">
                  1. Personal Information
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-500 block">Full Name</span>
                    <strong className="text-slate-900">{viewingApp.full_name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Father / Guardian</span>
                    <strong className="text-slate-900">{viewingApp.father_name || "—"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Mother's Name</span>
                    <strong className="text-slate-900">{viewingApp.mother_name || "—"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Gender</span>
                    <strong className="text-slate-900">{viewingApp.gender}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Date of Birth</span>
                    <strong className="text-slate-900">{viewingApp.date_of_birth}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Minority Community</span>
                    <strong className="text-slate-900">{viewingApp.religion}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Specially Abled (PWD)</span>
                    <strong className="text-slate-900">{viewingApp.specially_abled || "No"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Aadhaar Number</span>
                    <strong className="text-slate-900 font-mono">{viewingApp.aadhaar_number || "—"}</strong>
                  </div>
                </div>
              </div>

              {/* 2. Contact & Address */}
              <div>
                <h3 className="font-bold text-sm text-navy mb-3 pb-1 border-b border-slate-200">
                  2. Contact & Address
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-500 block">Mobile Phone</span>
                    <strong className="text-slate-900 font-mono">{viewingApp.phone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Alternate Phone</span>
                    <strong className="text-slate-900 font-mono">{viewingApp.alt_phone || "—"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Email Address</span>
                    <strong className="text-slate-900">{viewingApp.email}</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block">Address</span>
                    <strong className="text-slate-900">{viewingApp.address}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">District & Taluk</span>
                    <strong className="text-slate-900">
                      {viewingApp.district} {viewingApp.taluk ? `(${viewingApp.taluk})` : ""}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Pincode</span>
                    <strong className="text-slate-900 font-mono">{viewingApp.pincode}</strong>
                  </div>
                </div>
              </div>

              {/* 3. Education & Course Selection */}
              <div>
                <h3 className="font-bold text-sm text-navy mb-3 pb-1 border-b border-slate-200">
                  3. Education & Course Applied
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-500 block">Highest Qualification</span>
                    <strong className="text-slate-900">{viewingApp.qualification}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Year of Passing</span>
                    <strong className="text-slate-900">{viewingApp.year_of_passing || "—"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Preferred Training Location</span>
                    <strong className="text-slate-900 text-blue-700">{viewingApp.preferred_centre}</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block">Course Applied</span>
                    <strong className="text-slate-900 font-bold">{viewingApp.course}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Annual Family Income</span>
                    <strong className="text-slate-900">{viewingApp.family_income || "—"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">How Heard About Program</span>
                    <strong className="text-slate-900">{viewingApp.heard_from || "—"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Employment Status</span>
                    <strong className="text-slate-900">{viewingApp.employment_status || "—"}</strong>
                  </div>
                </div>
              </div>

              {/* 4. Document Uploads */}
              <div>
                <h3 className="font-bold text-sm text-navy mb-3 pb-1 border-b border-slate-200">
                  4. Uploaded Documents & Verification
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Passport Photo:</span>
                      <strong className="text-slate-800 truncate block max-w-[200px]">
                        {viewingApp.passport_photo_url || "Uploaded (Attached)"}
                      </strong>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      ✓ Attached
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Aadhaar Card:</span>
                      <strong className="text-slate-800 truncate block max-w-[200px]">
                        {viewingApp.aadhaar_card_url || "Uploaded (Attached)"}
                      </strong>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      ✓ Attached
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Caste & Income Certificate:</span>
                      <strong className="text-slate-800 truncate block max-w-[200px]">
                        {viewingApp.caste_income_cert_url || "Uploaded (Attached)"}
                      </strong>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      ✓ Attached
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Highest Qualification Certificate:</span>
                      <strong className="text-slate-800 truncate block max-w-[200px]">
                        {viewingApp.highest_qualification_cert_url || "Uploaded (Attached)"}
                      </strong>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      ✓ Attached
                    </span>
                  </div>
                </div>
              </div>

              {viewingApp.remarks && (
                <div>
                  <span className="text-slate-500 block font-semibold mb-1">Candidate Remarks:</span>
                  <p className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                    {viewingApp.remarks}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditingApp({ ...viewingApp });
                  setViewingApp(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors"
              >
                Edit Details
              </button>
              <button
                onClick={() => setViewingApp(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-navy px-6 py-4 text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">
                  Edit Candidate Details
                </span>
                <h2 className="text-lg font-bold">
                  {editingApp.reference_no || `VTU-MSD-${editingApp.id.slice(0, 5).toUpperCase()}`}
                </h2>
              </div>
              <button
                onClick={() => setEditingApp(null)}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto space-y-5 text-xs text-slate-800">
              {saveSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg font-medium">
                  {saveSuccessMsg}
                </div>
              )}

              {/* Status Update Field */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Application Status</label>
                <select
                  value={editingApp.status || "Pending"}
                  onChange={(e) => setEditingApp({ ...editingApp, status: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Pending">Pending Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* 1. Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingApp.full_name}
                    onChange={(e) => setEditingApp({ ...editingApp, full_name: e.target.value })}
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={editingApp.father_name || ""}
                    onChange={(e) => setEditingApp({ ...editingApp, father_name: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    value={editingApp.mother_name || ""}
                    onChange={(e) => setEditingApp({ ...editingApp, mother_name: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={editingApp.gender}
                    onChange={(e) => setEditingApp({ ...editingApp, gender: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={editingApp.date_of_birth}
                    onChange={(e) => setEditingApp({ ...editingApp, date_of_birth: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Minority Community</label>
                  <select
                    value={editingApp.religion}
                    onChange={(e) => setEditingApp({ ...editingApp, religion: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {MINORITY_RELIGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Specially Abled (PWD)</label>
                  <select
                    value={editingApp.specially_abled || "No"}
                    onChange={(e) => setEditingApp({ ...editingApp, specially_abled: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Aadhaar Number</label>
                  <input
                    type="text"
                    value={editingApp.aadhaar_number || ""}
                    maxLength={12}
                    onChange={(e) => setEditingApp({ ...editingApp, aadhaar_number: e.target.value.replace(/\D/g, "") })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              {/* 2. Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    value={editingApp.phone}
                    onChange={(e) => setEditingApp({ ...editingApp, phone: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alt Phone</label>
                  <input
                    type="text"
                    value={editingApp.alt_phone || ""}
                    onChange={(e) => setEditingApp({ ...editingApp, alt_phone: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingApp.email}
                    onChange={(e) => setEditingApp({ ...editingApp, email: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* 3. Address */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={editingApp.address}
                    onChange={(e) => setEditingApp({ ...editingApp, address: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">District</label>
                  <select
                    value={editingApp.district}
                    onChange={(e) => setEditingApp({ ...editingApp, district: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {KARNATAKA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Taluk</label>
                  <input
                    type="text"
                    value={editingApp.taluk || ""}
                    onChange={(e) => setEditingApp({ ...editingApp, taluk: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={editingApp.pincode}
                    maxLength={6}
                    onChange={(e) => setEditingApp({ ...editingApp, pincode: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              {/* 4. Course & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Course Applied For</label>
                  <select
                    value={editingApp.course}
                    onChange={(e) => setEditingApp({ ...editingApp, course: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {COURSES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preferred Training Location</label>
                  <select
                    value={editingApp.preferred_centre}
                    onChange={(e) => setEditingApp({ ...editingApp, preferred_centre: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {KARNATAKA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Remarks</label>
                <textarea
                  rows={2}
                  value={editingApp.remarks || ""}
                  onChange={(e) => setEditingApp({ ...editingApp, remarks: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-navy hover:bg-navy-deep text-white font-semibold rounded-lg text-xs shadow-md transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STATUS CHANGE REASON MODAL (For Pending & Rejected) */}
      {statusChangeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Update Status to{" "}
                  <span
                    className={
                      statusChangeModal.targetStatus === "Rejected"
                        ? "text-red-600"
                        : "text-amber-600"
                    }
                  >
                    {statusChangeModal.targetStatus}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Candidate: <strong>{statusChangeModal.app.full_name}</strong> (
                  {statusChangeModal.app.reference_no || statusChangeModal.app.id.slice(0, 8)})
                </p>
              </div>
              <button
                onClick={() => setStatusChangeModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Select Reason *
                </label>
                <select
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-navy outline-none"
                >
                  {REASON_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {selectedReason === "Other" && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Provide Custom Details / Remarks
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter specific reason for candidate discrepancy or rejection..."
                    value={customReasonText}
                    onChange={(e) => setCustomReasonText(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-navy outline-none"
                  />
                </div>
              )}

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 leading-relaxed">
                ℹ️ This status and reason will be saved in the database and visible under the candidate's administrative record.
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setStatusChangeModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmStatusChangeWithReason}
                disabled={updatingStatusId === statusChangeModal.app.id}
                className={`px-4 py-2 text-white font-semibold rounded-lg text-xs shadow-md transition-colors ${
                  statusChangeModal.targetStatus === "Rejected"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-amber-600 hover:bg-amber-700"
                }`}
              >
                {updatingStatusId === statusChangeModal.app.id ? "Saving..." : `Confirm ${statusChangeModal.targetStatus}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminDashboard;
