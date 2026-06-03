"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import RoleGuard from "@/components/RoleGuard";
import GeneratePdfButton from "@/components/GeneratePdfButton";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import { supabase } from "@/lib/supabase";
import {
  convertQuotationToInvoice,
  getQuotation,
  getInvoice,
  formatCurrency,
  formatDate,
  getStatusBadgeClass,
  updateQuotationStatus,
} from "@/lib/invoice-utils";
import type { InvoiceStatus, QuotationStatus, QuotationWithRelations, InvoiceWithRelations } from "@/lib/types/invoice";

export default function QuotationDetailPage() {
  const { id } = useParams();
  const [quotation, setQuotation] = useState<QuotationWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [deleteQuotationId, setDeleteQuotationId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      if (!id) return;
      const q = await getQuotation(id as string);
      setQuotation(q);
    } catch (e) {
      console.error("Failed to load quotation:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, [id]);

  const statusOptions: QuotationStatus[] = ["draft", "sent", "approved", "rejected"];

  const total = quotation ? formatCurrency(Number(quotation.amount || 0)) : "";

  async function handleStatusChange(nextStatus: QuotationStatus) {
    if (!quotation) return;
    setSaving(true);
    try {
      await updateQuotationStatus(quotation.id, nextStatus);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("activities").insert([
          {
            user_id: user.id,
            user_name: user.email || "Unknown",
            action:
              nextStatus === "approved"
                ? `Quotation Approved ${quotation.quotation_number}`
                : `Quotation status updated to ${nextStatus} (${quotation.quotation_number})`,
            client_id: quotation.client_id,
            quotation_id: quotation.id,
          } as const,
        ]);
      }

      const refreshed = await getQuotation(quotation.id);
      setQuotation(refreshed);
    } catch (e) {
      console.error("Failed to update quotation status:", e);
      alert("Failed to update quotation status");
    }
    setSaving(false);
  }

  async function handleConvert() {
    if (!quotation) return;
    if (quotation.status !== "approved") {
      alert("Convert to invoice only when quotation is Approved.");
      return;
    }

    setSaving(true);
    try {
      const invoice = (await convertQuotationToInvoice(quotation.id)) as InvoiceWithRelations;
      setQuotation((cur) => (cur ? { ...cur, status: "approved" } : cur));
      // Activity already logged in util for conversion.
      // Navigate to the created invoice
      window.location.href = `/invoices/${invoice.id}`;
    } catch (e) {
      console.error("Failed to convert quotation:", e);
      alert("Failed to convert quotation");
    }
    setSaving(false);
  }

  async function handleDeleteQuotation() {
    if (!deleteQuotationId) return;
    setSaving(true);
    try {
      await supabase.from("quotations").delete().eq("id", deleteQuotationId);
      setQuotation(null);
      setDeleteQuotationId(null);
    } catch (e) {
      console.error("Failed to delete quotation:", e);
      alert("Failed to delete quotation");
    }
    setSaving(false);
  }

  return (
    <RoleGuard allowedRoles={["admin", "member"]}>
      <div style={{ maxWidth: "1100px", animation: "fadeUp 0.5s ease both" }}>
        {loading ? (
          <div style={{ padding: "40px" }}>Loading quotation…</div>
        ) : !quotation ? (
          <div className="card" style={{ padding: "48px", textAlign: "center", color: "var(--text-tertiary)" }}>
            Quotation not found.
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "18px" }}>
              <div className="section-label" style={{ marginBottom: "8px" }}>
                Sales
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "14px", alignItems: "flex-start" }}>
                <div>
                  <h1 style={{ fontFamily: "var(--font-display)", fontSize: "30px", fontWeight: 700 }}>
                    {quotation.quotation_number}
                  </h1>
                  <p style={{ color: "var(--text-secondary)", marginTop: "6px" }}>
                    {quotation.client?.company_name || "Unknown Client"}
                    {quotation.project?.name ? ` • ${quotation.project.name}` : ""}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <span className={`badge ${getStatusBadgeClass(quotation.status)}`}>{quotation.status}</span>
                  <GeneratePdfButton type="quotation" data={quotation} />
                  <button
                    className="btn btn-primary"
                    style={{ padding: "10px 14px" }}
                    onClick={() => void handleConvert()}
                    disabled={saving}
                  >
                    Convert → Invoice
                  </button>
                  <button className="btn" style={{ padding: "10px 14px" }} onClick={() => setDeleteQuotationId(quotation.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "14px" }}>
              <div className="card" style={{ padding: "22px" }}>
                <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
                  <div>
                    <div style={{ color: "var(--text-tertiary)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>
                      Created
                    </div>
                    <div>{formatDate(quotation.created_at)}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--text-tertiary)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>
                      Total Quoted Amount
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 800, color: "var(--accent)" }}>
                      {total}
                    </div>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div style={{ color: "var(--text-tertiary)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>
                      Scope / Notes
                    </div>
                    <div style={{ color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>
                      {quotation.services || quotation.description || quotation.notes || "—"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: "22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "16px" }}>Quotation Items</div>
                    <div style={{ color: "var(--text-secondary)", marginTop: "4px", fontSize: "13px" }}>Line items included in this quotation</div>
                  </div>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                    <select className="input" value={quotation.status} onChange={(e) => void handleStatusChange(e.target.value as QuotationStatus)} disabled={saving} style={{ minWidth: "180px" }}>
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {quotation.items?.length ? (
                  <div style={{ display: "grid", gap: "10px" }}>
                    {quotation.items.map((it) => (
                      <div key={it.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "12px", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                        <div>
                          <div style={{ fontWeight: 800 }}>{it.title}</div>
                          {it.description ? <div style={{ color: "var(--text-tertiary)", fontSize: "13px", marginTop: "4px" }}>{it.description}</div> : null}
                        </div>
                        <div>Qty {it.quantity}</div>
                        <div>₹{Number(it.unit_price || 0).toLocaleString("en-IN")}</div>
                        <div style={{ fontWeight: 900 }}>₹{Number(it.total || 0).toLocaleString("en-IN")}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: "var(--text-tertiary)" }}>No items.</div>
                )}
              </div>
            </div>

            <ConfirmDeleteModal
              open={Boolean(deleteQuotationId)}
              title="Delete quotation"
              description="This will permanently delete the quotation and its items."
              confirmLabel="Delete quotation"
              loading={saving}
              onConfirm={handleDeleteQuotation}
              onCancel={() => setDeleteQuotationId(null)}
            />
          </>
        )}
      </div>
    </RoleGuard>
  );
}

