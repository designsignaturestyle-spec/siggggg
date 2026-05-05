import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  LogOut,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  CheckCircle2,
  Circle,
  Users,
  Inbox,
  CheckCheck,
  Calendar,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import formatApiError from "../lib/apiError";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function StatusBadge({ status }) {
  const isNew = status === "new";
  return (
    <span
      data-testid={`lead-status-${status}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] tracking-[0.22em] uppercase ${
        isNew
          ? "bg-[#C5A059] text-white"
          : "bg-[#2D2D2D]/10 text-[#2D2D2D] border border-[#2D2D2D]/20"
      }`}
    >
      {isNew ? <Circle size={8} className="fill-white" /> : <CheckCheck size={10} strokeWidth={2} />}
      {isNew ? "New" : "Contacted"}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, testId }) {
  return (
    <div
      data-testid={testId}
      className="bg-white border border-[#E5DFD3] p-6 flex items-center gap-5"
    >
      <span className="w-12 h-12 grid place-items-center border border-[#C5A059] text-[#C5A059]">
        <Icon size={18} strokeWidth={1.5} />
      </span>
      <div>
        <div className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B]">
          {label}
        </div>
        <div className="font-display text-3xl text-[#2D2D2D] mt-0.5">{value}</div>
      </div>
    </div>
  );
}

const buildWaLink = (phone, name) => {
  const cleaned = String(phone || "").replace(/\D/g, "");
  // Ensure India country code prefix if it's a 10-digit number
  const withCC = cleaned.length === 10 ? `91${cleaned}` : cleaned;
  const msg = `Hello ${name || "there"}, thank you for reaching out to Signature Style Interiors. I'm following up on your recent inquiry — would you be available for a quick chat?`;
  return `https://wa.me/${withCC}?text=${encodeURIComponent(msg)}`;
};

export default function AdminDashboard() {
  const { admin, logout, getToken } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | new | contacted
  const [search, setSearch] = useState("");

  const authHeaders = useMemo(
    () => ({ Authorization: `Bearer ${getToken()}` }),
    [getToken]
  );

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [leadsRes, statsRes] = await Promise.all([
        axios.get(`${API}/admin/leads`, { headers: authHeaders }),
        axios.get(`${API}/admin/stats`, { headers: authHeaders }),
      ]);
      setLeads(leadsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      if (err?.response?.status === 401) {
        logout();
        navigate("/admin/login", { replace: true });
        return;
      }
      toast.error(formatApiError(err?.response?.data?.detail, "Failed to load leads."));
    } finally {
      setLoading(false);
    }
  }, [authHeaders, logout, navigate]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const toggleStatus = async (lead) => {
    const nextStatus = lead.status === "new" ? "contacted" : "new";
    try {
      const { data } = await axios.patch(
        `${API}/admin/leads/${lead.id}/status`,
        { status: nextStatus },
        { headers: authHeaders }
      );
      setLeads((ls) => ls.map((l) => (l.id === lead.id ? { ...l, status: data.status } : l)));
      setStats((s) =>
        s
          ? {
              ...s,
              new: s.new + (nextStatus === "new" ? 1 : -1),
              contacted: s.contacted + (nextStatus === "contacted" ? 1 : -1),
            }
          : s
      );
      toast.success(
        nextStatus === "contacted" ? "Marked as contacted." : "Reopened as new."
      );
    } catch (err) {
      toast.error(formatApiError(err?.response?.data?.detail, "Could not update status."));
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Signed out.");
    navigate("/admin/login", { replace: true });
  };

  const filtered = useMemo(() => {
    let list = leads;
    if (filter !== "all") {
      list = list.filter((l) => (l.status || "new") === filter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (l) =>
          (l.name || "").toLowerCase().includes(q) ||
          (l.phone || "").toLowerCase().includes(q) ||
          (l.project_type || "").toLowerCase().includes(q) ||
          (l.budget_range || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [leads, filter, search]);

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(iso);
    }
  };

  return (
    <main data-testid="admin-dashboard" className="min-h-screen bg-[#FAF6EC]">
      {/* Top bar */}
      <header className="bg-white border-b border-[#E5DFD3]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 grid place-items-center border border-[#C5A059] text-[#C5A059] font-display text-xl">
              S
            </span>
            <div className="leading-tight">
              <div className="font-display text-lg text-[#2D2D2D]">Admin Dashboard</div>
              <div className="text-[9px] tracking-[0.3em] uppercase text-[#C5A059]">
                {admin?.email}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              data-testid="admin-refresh"
              onClick={fetchAll}
              disabled={loading}
              className="w-10 h-10 grid place-items-center border border-[#E5DFD3] text-[#2D2D2D] hover:border-[#C5A059] hover:text-[#C5A059] transition-colors disabled:opacity-50"
              title="Refresh"
              aria-label="Refresh"
            >
              <RefreshCw size={16} strokeWidth={1.5} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              data-testid="admin-logout"
              onClick={handleLogout}
              className="flex items-center gap-2 border border-[#E5DFD3] hover:border-[#C5A059] hover:text-[#C5A059] text-[#2D2D2D] px-4 py-2.5 text-[11px] tracking-[0.22em] uppercase transition-colors"
            >
              <LogOut size={14} strokeWidth={1.5} />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            icon={Users}
            label="Total leads"
            value={stats?.total ?? "—"}
            testId="stat-total"
          />
          <StatCard
            icon={Inbox}
            label="New"
            value={stats?.new ?? "—"}
            testId="stat-new"
          />
          <StatCard
            icon={CheckCheck}
            label="Contacted"
            value={stats?.contacted ?? "—"}
            testId="stat-contacted"
          />
          <StatCard
            icon={Calendar}
            label="This week"
            value={stats?.this_week ?? "—"}
            testId="stat-week"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-6">
          <div className="flex gap-2">
            {["all", "new", "contacted"].map((f) => (
              <button
                key={f}
                data-testid={`filter-${f}`}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 text-[11px] tracking-[0.22em] uppercase border transition-colors ${
                  filter === f
                    ? "bg-[#2D2D2D] text-[#FAF6EC] border-[#2D2D2D]"
                    : "bg-white text-[#2D2D2D] border-[#E5DFD3] hover:border-[#C5A059] hover:text-[#C5A059]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative md:w-80">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]"
              strokeWidth={1.5}
            />
            <input
              data-testid="admin-search"
              type="text"
              placeholder="Search name, phone, project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-[#E5DFD3] focus:border-[#C5A059] outline-none pl-11 pr-4 py-3 text-sm text-[#2D2D2D] transition-colors"
            />
          </div>
        </div>

        {/* Leads table (desktop) */}
        <div
          data-testid="admin-leads-table"
          className="hidden lg:block bg-white border border-[#E5DFD3] overflow-hidden"
        >
          <table className="w-full text-sm">
            <thead className="bg-[#FAF6EC] border-b border-[#E5DFD3]">
              <tr className="text-left text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B]">
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Project</th>
                <th className="px-5 py-4">Budget</th>
                <th className="px-5 py-4">Submitted</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center text-[#6B6B6B] font-display text-xl"
                  >
                    No leads match the current filter.
                  </td>
                </tr>
              )}
              {filtered.map((l) => (
                <tr
                  key={l.id}
                  data-testid={`lead-row-${l.id}`}
                  className="border-b border-[#E5DFD3] hover:bg-[#FAF6EC]/50 transition-colors align-top"
                >
                  <td className="px-5 py-4">
                    <StatusBadge status={l.status || "new"} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-display text-lg text-[#2D2D2D]">{l.name}</div>
                    {l.message && (
                      <div className="text-xs text-[#6B6B6B] mt-1 max-w-xs line-clamp-2">
                        "{l.message}"
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <a
                      href={`tel:${l.phone}`}
                      className="text-[#2D2D2D] hover:text-[#C5A059] transition-colors inline-flex items-center gap-2"
                    >
                      <Phone size={12} strokeWidth={1.5} />
                      {l.phone}
                    </a>
                  </td>
                  <td className="px-5 py-4 text-[#2D2D2D]">{l.project_type}</td>
                  <td className="px-5 py-4 text-[#2D2D2D]">{l.budget_range}</td>
                  <td className="px-5 py-4 text-xs text-[#6B6B6B] whitespace-nowrap">
                    {formatDate(l.created_at)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        data-testid={`lead-whatsapp-${l.id}`}
                        href={buildWaLink(l.phone, l.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white px-4 py-2 text-[10px] tracking-[0.22em] uppercase transition-colors"
                      >
                        <MessageCircle size={12} strokeWidth={1.8} />
                        Reply
                      </a>
                      <button
                        data-testid={`lead-toggle-${l.id}`}
                        onClick={() => toggleStatus(l)}
                        className="inline-flex items-center gap-2 border border-[#E5DFD3] hover:border-[#C5A059] hover:text-[#C5A059] text-[#2D2D2D] px-3 py-2 text-[10px] tracking-[0.22em] uppercase transition-colors"
                      >
                        {l.status === "contacted" ? (
                          <>
                            <Circle size={12} strokeWidth={1.5} />
                            Reopen
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={12} strokeWidth={1.5} />
                            Mark done
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="lg:hidden space-y-4">
          {filtered.length === 0 && !loading && (
            <div className="bg-white border border-[#E5DFD3] p-10 text-center text-[#6B6B6B] font-display text-xl">
              No leads match the current filter.
            </div>
          )}
          {filtered.map((l) => (
            <div
              key={l.id}
              data-testid={`lead-card-${l.id}`}
              className="bg-white border border-[#E5DFD3] p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-display text-xl text-[#2D2D2D]">{l.name}</div>
                  <div className="text-xs text-[#6B6B6B] mt-0.5">
                    {formatDate(l.created_at)}
                  </div>
                </div>
                <StatusBadge status={l.status || "new"} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-[9px] tracking-[0.3em] uppercase text-[#6B6B6B]">Phone</div>
                  <a href={`tel:${l.phone}`} className="text-[#2D2D2D]">{l.phone}</a>
                </div>
                <div>
                  <div className="text-[9px] tracking-[0.3em] uppercase text-[#6B6B6B]">Budget</div>
                  <div className="text-[#2D2D2D]">{l.budget_range}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-[9px] tracking-[0.3em] uppercase text-[#6B6B6B]">Project</div>
                  <div className="text-[#2D2D2D]">{l.project_type}</div>
                </div>
                {l.message && (
                  <div className="col-span-2">
                    <div className="text-[9px] tracking-[0.3em] uppercase text-[#6B6B6B]">Message</div>
                    <div className="text-sm text-[#2D2D2D] italic">"{l.message}"</div>
                  </div>
                )}
              </div>
              <div className="mt-5 flex gap-2">
                <a
                  href={buildWaLink(l.phone, l.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white px-4 py-3 text-[10px] tracking-[0.22em] uppercase transition-colors"
                >
                  <MessageCircle size={12} strokeWidth={1.8} />
                  WhatsApp
                </a>
                <button
                  onClick={() => toggleStatus(l)}
                  className="flex-1 inline-flex items-center justify-center gap-2 border border-[#E5DFD3] hover:border-[#C5A059] hover:text-[#C5A059] text-[#2D2D2D] px-4 py-3 text-[10px] tracking-[0.22em] uppercase transition-colors"
                >
                  {l.status === "contacted" ? "Reopen" : "Mark done"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
