import { useEffect, useState } from "react";
import Link from "next/link";
import RoleGuard from "@/components/RoleGuard";
import { supabase } from "@/lib/supabase";
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/invoice-utils";
import QuotationForm from "@/components/QuotationForm";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import type { QuotationWithRelations, QuotationStatus } from "@/lib/types/invoice";
import type { Client } from "@/lib/types/client";
import type { Project } from "@/lib/types/project";

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<QuotationWithRelations[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteQuotationId, setDeleteQuotationId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [quotationsData, clientsData, projectsData] = await Promise.all([
        getAllQuotations(),
        supabase.from("clients").select("*").order("company_name"),
        supabase.from("projects").select("*").order("name"),
      ]);

      setQuotations(quotationsData);
      setClients(clientsData.data || []);
      setProjects(projectsData.data || []);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadData();
  }, []);

  async function handleCreateQuotation(values: {
    quotation: Omit<QuotationWithRelations, "id" | "created_at" | "updated_at" | "created_by">;
    items: any[];
  }) {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: quotation, error } = await supabase
        .from("quotations")
        .insert([
          {
            ...values.quotation,
            created_by: user.id,
          },
        ])
        .select("*")
        .single();

      if (error || !quotation) {
        alert(error?.message || "Failed to create quotation");
        setSaving(false);
        return;
      }

      // Create quotation items
      if (values.items.length > 0) {
        const itemsWithQuotationId = values.items.map((item, index) => ({
          ...item,
          quotation_id: quotation.id,
          sort_order: index,
        }));

        await supabase.from("quotation_items").insert(itemsWithQuotationId);
      }

      // Log activity
      await supabase.from("activities").insert([
        {
          user_id: user.id,
          user_name: user.email || "Unknown",
          action: `created quotation ${values.quotation.quotation_number}`,
          client_id: values.quotation.client_id,
          quotation_id: quotation.id,
        } as any,
      ]);

      setQuotations((current) => [quotation as QuotationWithRelations, ...current]);
      setShowCreate(false);
    } catch (error) {
      console.error("Failed to create quotation:", error);
      alert("Failed to create quotation");
    }
    setSaving(false);
  }

  async function handleDeleteQuotation() {
    if (!deleteQuotationId) return;

    setSaving(true);
    try {
      const quotation = quotations.find((q) => q.id === deleteQuotationId);

      await supabase.from("quotations").delete().eq("id", deleteQuotationId);

      const { data: { user } } = await supabase.auth.getUser();
      if (user && quotation) {
        await supabase.from("activities").insert([
          {
            user_id: user.id,
            user_name: user.email || "Unknown",
            action: `deleted quotation ${quotation.quotation_number}`,
            client_id: quotation.client_id,
            quotation_id: quotation.id,
          } as any,
        ]);
      }

      setQuotations((current) => current.filter((q) => q.id !== deleteQuotationId));
      setDeleteQuotationId(null);
    } catch (error) {
      console.error("Failed to delete quotation:", error);
      alert("Failed to delete quotation");
    }
    setSaving(false);
  }

  const filteredQuotations = quotations.filter((q) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      q.quotation_number.toLowerCase().includes(query) ||
      q.client?.company_name?.toLowerCase().includes(query) ||
      (q.title || "").toLowerCase().includes(query);
    const matchesStatus = statusFilter === "all" || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalValue = quotations.reduce((sum, q) => sum + Number(q.amount || 0), 0);
  const pendingValue = quotations
    .filter((q) => q.status === "draft" || q.status === "sent")
    .reduce((sum, q) => sum + Number(q.amount || 0), 0);

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div style={{ maxWidth: "1100px", animation: "fadeUp 0.5s ease both" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "18px",
            marginBottom: "28px",
          }}
        >
          <div>
            <div className="section-label" style={{ marginBottom: "8px" }}>
              Sales
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "30px",
                fontWeight: 700,
                letterSpacing: "-0.03em",
              }}
            >
              Quotations
            </h1>
            <p style={{ color: "var(--text-secondary)", marginTop: "4px", fontSize: "14px" }}>
              {quotations.length} quotation{quotations.length !== 1 ? "s" : ""} • Total value: {formatCurrency(totalValue)}
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setShowCreate(true)}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            + New Quotation
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "14px",
            marginBottom: "24px",
          }}
        >
          <div className="card" style={{ padding: "18px 20px" }}>
            <div style={{ fontSize: "11px", color: "var(--text-tertiary)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Total Quotations
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: "var(--accent)" }}>{quotations.length}</div>
          </div>
          <div className="card" style={{ padding: "18px 20px" }}>
            <div style={{ fontSize: "11px", color: "var(--text-tertiary)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Pending
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: "var(--amber)" }}>{quotations.filter((q) => q.status === "draft" || q.status === "sent").length}</div>
          </div>
          <div className="card" style={{ padding: "18px 20px" }}>
            <div style={{ fontSize: "11px", color: "var(--text-tertiary)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Approved
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: "var(--green)" }}>{quotations.filter((q) => q.status === "approved").length}</div>
          </div>
          <div className="card" style={{ padding: "18px 20px" }}>
            <div style={{ fontSize: "11px", color: "var(--text-tertiary)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Pending Value
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: "var(--purple)" }}>{formatCurrency(pendingValue)}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "24px" }}>
          <input className="input" placeholder="Search quotations..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1 }} />
          <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: "150px" }}>
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div style={{ display: "grid", gap: "14px" }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="skeleton" style={{ height: "100px", animationDelay: `${index * 80}ms` }} />
            ))}
          </div>
        ) : filteredQuotations.length === 0 ? (
          <div className="card" style={{ padding: "48px", textAlign: "center" }}>
            <div style={{ fontSize: "24px", marginBottom: "12px" }}>📋</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "18px", marginBottom: "8px" }}>No quotations found</div>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Create your first quotation to get started.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "14px" }}>
            {filteredQuotations.map((quotation) => (
              <Link
                key={quotation.id}
                href={`/quotations/${quotation.id}`}
                className="card"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  padding: "20px 24px",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "16px",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700 }}>{quotation.quotation_number}</div>
                    <span className={`badge ${getStatusBadgeClass(quotation.status)}`}>{quotation.status}</span>
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>{quotation.client?.company_name || "Unknown Client"}</div>
                  {quotation.title && <div style={{ fontSize: "13px", color: "var(--text-tertiary)" }}>{quotation.title}</div>}
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: "var(--accent)" }}>{formatCurrency(Number(quotation.amount))}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>{formatDate(quotation.created_at)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {showCreate && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowCreate(false);
            }}
          >
            <div className="card" style={{ width: "100%", maxWidth: "700px", maxHeight: "90vh", overflow: "auto", padding: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700 }}>Create Quotation</div>
                  <p style={{ color: "var(--text-secondary)", marginTop: "6px", fontSize: "14px" }}>Generate a new quotation for a client</p>
                </div>
                <button
                  onClick={() => setShowCreate(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", fontSize: "24px" }}
                >
                  ×
                </button>
              </div>

              <QuotationForm
                clients={clients}
                projects={projects}
                onSubmit={handleCreateQuotation}
                onCancel={() => setShowCreate(false)}
                submitting={saving}
                submitLabel={saving ? "Creating..." : "Create Quotation"}
              />
            </div>
          </div>
        )}

        <ConfirmDeleteModal
          open={Boolean(deleteQuotationId)}
          title="Delete quotation"
          description="This will permanently delete this quotation. This action cannot be undone."
          confirmLabel="Delete quotation"
          loading={saving}
          onConfirm={handleDeleteQuotation}
          onCancel={() => setDeleteQuotationId(null)}
        />
      </div>
    </RoleGuard>
  );
}

