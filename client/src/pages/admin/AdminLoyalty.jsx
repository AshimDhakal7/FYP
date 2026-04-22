import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const defaultForm = {
  enabled: true,
  fullPaymentRewardPoints: 100,
  normalCancellationPenalty: 40,
  lateCancellationPenalty: 120,
  lateCancellationWindowHours: 2,
  redeemThresholdPoints: 1000,
  redeemDiscountPercent: 60,
  fullPaymentOnlyRedemption: true,
  preventNegativeBalance: true,
  awardOnlyOncePerBooking: true,
  penaltyOnlyOncePerBooking: true,
  userFacingDescription:
    "Earn loyalty points on full payment bookings and redeem rewards on eligible future bookings.",
  cancellationPolicyNote:
    "Normal cancellation deducts points. Late cancellation within the configured time window deducts more points.",
  redemptionNote:
    "Redeem points on full-payment bookings to unlock a discount.",
};

export default function AdminLoyalty() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState(defaultForm);

  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    "";

  const authHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await fetch(`${API_BASE}/api/admin/loyalty-settings`, {
        headers: authHeaders(),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load loyalty settings");
      }

      setForm({
        enabled: !!data.enabled,
        fullPaymentRewardPoints: Number(data.fullPaymentRewardPoints ?? 100),
        normalCancellationPenalty: Number(
          data.normalCancellationPenalty ?? 40
        ),
        lateCancellationPenalty: Number(data.lateCancellationPenalty ?? 120),
        lateCancellationWindowHours: Number(
          data.lateCancellationWindowHours ?? 2
        ),
        redeemThresholdPoints: Number(data.redeemThresholdPoints ?? 1000),
        redeemDiscountPercent: Number(data.redeemDiscountPercent ?? 60),
        fullPaymentOnlyRedemption: !!data.fullPaymentOnlyRedemption,
        preventNegativeBalance: !!data.preventNegativeBalance,
        awardOnlyOncePerBooking: !!data.awardOnlyOncePerBooking,
        penaltyOnlyOncePerBooking: !!data.penaltyOnlyOncePerBooking,
        userFacingDescription: data.userFacingDescription || "",
        cancellationPolicyNote: data.cancellationPolicyNote || "",
        redemptionNote: data.redemptionNote || "",
      });
    } catch (err) {
      console.error("LOAD ADMIN LOYALTY SETTINGS ERROR:", err);
      setError(err.message || "Failed to load loyalty settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const onChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const res = await fetch(`${API_BASE}/api/admin/loyalty-settings`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Failed to save loyalty settings");
      }

      setSuccess("Loyalty settings updated successfully.");
      setForm({
        enabled: !!data.enabled,
        fullPaymentRewardPoints: Number(data.fullPaymentRewardPoints ?? 100),
        normalCancellationPenalty: Number(
          data.normalCancellationPenalty ?? 40
        ),
        lateCancellationPenalty: Number(data.lateCancellationPenalty ?? 120),
        lateCancellationWindowHours: Number(
          data.lateCancellationWindowHours ?? 2
        ),
        redeemThresholdPoints: Number(data.redeemThresholdPoints ?? 1000),
        redeemDiscountPercent: Number(data.redeemDiscountPercent ?? 60),
        fullPaymentOnlyRedemption: !!data.fullPaymentOnlyRedemption,
        preventNegativeBalance: !!data.preventNegativeBalance,
        awardOnlyOncePerBooking: !!data.awardOnlyOncePerBooking,
        penaltyOnlyOncePerBooking: !!data.penaltyOnlyOncePerBooking,
        userFacingDescription: data.userFacingDescription || "",
        cancellationPolicyNote: data.cancellationPolicyNote || "",
        redemptionNote: data.redemptionNote || "",
      });
    } catch (err) {
      console.error("SAVE ADMIN LOYALTY SETTINGS ERROR:", err);
      setError(err.message || "Failed to save loyalty settings");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setResetting(true);
      setError("");
      setSuccess("");

      const res = await fetch(`${API_BASE}/api/admin/loyalty-settings/reset`, {
        method: "POST",
        headers: authHeaders(),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Failed to reset loyalty settings");
      }

      setForm({
        enabled: !!data.enabled,
        fullPaymentRewardPoints: Number(data.fullPaymentRewardPoints ?? 100),
        normalCancellationPenalty: Number(
          data.normalCancellationPenalty ?? 40
        ),
        lateCancellationPenalty: Number(data.lateCancellationPenalty ?? 120),
        lateCancellationWindowHours: Number(
          data.lateCancellationWindowHours ?? 2
        ),
        redeemThresholdPoints: Number(data.redeemThresholdPoints ?? 1000),
        redeemDiscountPercent: Number(data.redeemDiscountPercent ?? 60),
        fullPaymentOnlyRedemption: !!data.fullPaymentOnlyRedemption,
        preventNegativeBalance: !!data.preventNegativeBalance,
        awardOnlyOncePerBooking: !!data.awardOnlyOncePerBooking,
        penaltyOnlyOncePerBooking: !!data.penaltyOnlyOncePerBooking,
        userFacingDescription: data.userFacingDescription || "",
        cancellationPolicyNote: data.cancellationPolicyNote || "",
        redemptionNote: data.redemptionNote || "",
      });

      setSuccess("Loyalty settings reset to defaults.");
    } catch (err) {
      console.error("RESET ADMIN LOYALTY SETTINGS ERROR:", err);
      setError(err.message || "Failed to reset loyalty settings");
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen rounded-[28px] bg-[linear-gradient(180deg,_rgba(2,6,23,0.98)_0%,_rgba(8,15,35,0.98)_100%)] p-6 text-white">
        <div className="flex justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200/30 border-t-emerald-400" />
            <p className="text-sm text-slate-400">Loading loyalty settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen rounded-[28px] bg-[linear-gradient(180deg,_rgba(2,6,23,0.98)_0%,_rgba(8,15,35,0.98)_100%)] text-white">
      <div className="rounded-[28px] border border-cyan-500/10 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.10),_transparent_35%),linear-gradient(180deg,rgba(2,6,23,0.96),rgba(9,18,38,0.98))] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-300/80">
            Admin Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Loyalty Settings
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Configure the platform-wide loyalty rules. Owners can view loyalty effects,
            but only admin controls the policy.
          </p>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Status"
            value={form.enabled ? "Enabled" : "Disabled"}
            tone={form.enabled ? "green" : "red"}
          />
          <MetricCard
            label="Reward Rule"
            value={`+${form.fullPaymentRewardPoints}`}
            tone="green"
          />
          <MetricCard
            label="Redeem Rule"
            value={`${form.redeemThresholdPoints} → ${form.redeemDiscountPercent}%`}
            tone="purple"
          />
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-rose-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-300">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSave}
          className="rounded-[32px] border border-emerald-400/10 bg-[linear-gradient(180deg,rgba(14,27,51,0.92),rgba(9,22,44,0.92))] p-5 shadow-[0_0_30px_rgba(16,185,129,0.08)] sm:p-6"
        >
          <div className="grid gap-6 xl:grid-cols-2">
            <SectionCard title="Core Loyalty Rules" subtitle="Main reward and redemption logic">
              <ToggleRow
                label="Loyalty Enabled"
                checked={form.enabled}
                onChange={(checked) => onChange("enabled", checked)}
              />

              <NumberField
                label="Full Payment Reward Points"
                value={form.fullPaymentRewardPoints}
                onChange={(value) => onChange("fullPaymentRewardPoints", value)}
              />

              <NumberField
                label="Redeem Threshold Points"
                value={form.redeemThresholdPoints}
                onChange={(value) => onChange("redeemThresholdPoints", value)}
              />

              <NumberField
                label="Redeem Discount Percent"
                value={form.redeemDiscountPercent}
                onChange={(value) => onChange("redeemDiscountPercent", value)}
              />

              <ToggleRow
                label="Allow Redemption on Full Payment Only"
                checked={form.fullPaymentOnlyRedemption}
                onChange={(checked) =>
                  onChange("fullPaymentOnlyRedemption", checked)
                }
              />
            </SectionCard>

            <SectionCard title="Penalty Rules" subtitle="Cancellation penalty behavior">
              <NumberField
                label="Normal Cancellation Penalty"
                value={form.normalCancellationPenalty}
                onChange={(value) =>
                  onChange("normalCancellationPenalty", value)
                }
              />

              <NumberField
                label="Late Cancellation Penalty"
                value={form.lateCancellationPenalty}
                onChange={(value) => onChange("lateCancellationPenalty", value)}
              />

              <NumberField
                label="Late Cancellation Window (hours)"
                value={form.lateCancellationWindowHours}
                onChange={(value) =>
                  onChange("lateCancellationWindowHours", value)
                }
              />

              <ToggleRow
                label="Prevent Negative Balance"
                checked={form.preventNegativeBalance}
                onChange={(checked) =>
                  onChange("preventNegativeBalance", checked)
                }
              />

              <ToggleRow
                label="Award Reward Only Once Per Booking"
                checked={form.awardOnlyOncePerBooking}
                onChange={(checked) =>
                  onChange("awardOnlyOncePerBooking", checked)
                }
              />

              <ToggleRow
                label="Apply Penalty Only Once Per Booking"
                checked={form.penaltyOnlyOncePerBooking}
                onChange={(checked) =>
                  onChange("penaltyOnlyOncePerBooking", checked)
                }
              />
            </SectionCard>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <TextAreaField
              label="User Facing Description"
              value={form.userFacingDescription}
              onChange={(value) => onChange("userFacingDescription", value)}
            />

            <TextAreaField
              label="Cancellation Policy Note"
              value={form.cancellationPolicyNote}
              onChange={(value) => onChange("cancellationPolicyNote", value)}
            />

            <TextAreaField
              label="Redemption Note"
              value={form.redemptionNote}
              onChange={(value) => onChange("redemptionNote", value)}
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={resetting}
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {resetting ? "Resetting..." : "Reset Defaults"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MetricCard({ label, value, tone = "green" }) {
  const tones = {
    green: "text-emerald-300",
    purple: "text-purple-300",
    red: "text-rose-300",
  };

  return (
    <div className="rounded-[24px] bg-white/5 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-4 text-3xl font-bold ${tones[tone]}`}>{value}</p>
    </div>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,35,58,0.96),rgba(14,28,49,0.96))] p-5 sm:p-6">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

function NumberField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/50"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange }) {
  return (
    <label className="block rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,35,58,0.96),rgba(14,28,49,0.96))] p-5 sm:p-6">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>
      <textarea
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/50"
      />
    </label>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-8 w-14 rounded-full transition ${
          checked ? "bg-emerald-500" : "bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
            checked ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}