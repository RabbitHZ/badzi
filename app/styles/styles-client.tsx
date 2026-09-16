"use client"

import { useCallback, useEffect, useState } from "react"
import { PageShell } from "@/components/page-shell"
import { useAuth } from "@/contexts/auth-context"
import { apiGet, apiMutate, badgeUrl } from "@/lib/api"
import type { BadgeStyle, BadgeStyleRequest } from "@/lib/types"

// Preset styles shown to everyone (no auth required).
const PRESETS: Pick<BadgeStyle, "label" | "color" | "styleType">[] = [
  { label: "Views", color: "007EC6", styleType: "default" },
  { label: "Downloads", color: "4C1", styleType: "default" },
  { label: "Stars", color: "DFB317", styleType: "default" },
  { label: "Build", color: "E05D44", styleType: "default" },
  { label: "Maple", color: "FF9500", styleType: "maple" },
  { label: "Rabbit", color: "ED87B8", styleType: "rabbit" },
]

const STYLE_TYPES = ["default", "flat", "plastic", "maple", "rabbit"]
const BLANK: BadgeStyleRequest = {
  name: "",
  styleType: "default",
  color: "007EC6",
  label: "Views",
  icon: "",
  fontSize: 11,
}

export function StylesPageClient() {
  const { user, token } = useAuth()

  const [myStyles, setMyStyles] = useState<BadgeStyle[]>([])
  const [loadingMy, setLoadingMy] = useState(false)
  const [myError, setMyError] = useState<string | null>(null)

  const [editing, setEditing] = useState<BadgeStyle | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<BadgeStyleRequest>(BLANK)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const loadMyStyles = useCallback(async () => {
    if (!token) return
    setLoadingMy(true)
    setMyError(null)
    try {
      const data = await apiGet<BadgeStyle[]>("/api/badge-styles", { token })
      setMyStyles(data)
    } catch {
      setMyError("Couldn't load your styles.")
    } finally {
      setLoadingMy(false)
    }
  }, [token])

  useEffect(() => {
    if (user && token) loadMyStyles()
  }, [user, token, loadMyStyles])

  function openNew() {
    setEditing(null)
    setForm(BLANK)
    setSaveError(null)
    setFormOpen(true)
  }

  function openEdit(s: BadgeStyle) {
    setEditing(s)
    setForm({
      name: s.name,
      styleType: s.styleType,
      color: s.color,
      label: s.label,
      icon: s.icon,
      fontSize: s.fontSize,
    })
    setSaveError(null)
    setFormOpen(true)
  }

  function closeForm() {
    setEditing(null)
    setFormOpen(false)
    setSaveError(null)
  }

  async function handleSave() {
    if (!token) return
    setSaving(true)
    setSaveError(null)
    try {
      if (editing) {
        await apiMutate<BadgeStyle>("PUT", `/api/badge-styles/${editing.id}`, form, { token })
      } else {
        await apiMutate<BadgeStyle>("POST", "/api/badge-styles", form, { token })
      }
      await loadMyStyles()
      setFormOpen(false)
      setEditing(null)
      setSaveError(null)
    } catch {
      setSaveError("Save failed. Check your input and try again.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!token) return
    if (!confirm("Delete this style?")) return
    try {
      await apiMutate<void>("DELETE", `/api/badge-styles/${id}`, undefined, { token })
      setMyStyles((prev) => prev.filter((s) => s.id !== id))
    } catch {
      alert("Delete failed.")
    }
  }

  return (
    <PageShell
      title="Styles"
      intro="Browse badge presets. Sign in to create and manage your own styles."
    >
      {/* ── Preset gallery ── */}
      <section>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Presets</h2>
        <div className="card-grid">
          {PRESETS.map((s) => (
            <PresetCard key={s.label + s.styleType} style={s} />
          ))}
        </div>
      </section>

      {/* ── My styles (authenticated) ── */}
      {user && (
        <section style={{ marginTop: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>My Styles</h2>
            <button type="button" className="btn btn-primary" style={{ padding: "7px 14px", fontSize: 13 }} onClick={openNew}>
              + New
            </button>
          </div>

          {loadingMy && <p className="state">Loading…</p>}
          {myError && <p className="state">{myError}</p>}
          {!loadingMy && !myError && myStyles.length === 0 && (
            <p className="state">No custom styles yet. Create one above.</p>
          )}

          {myStyles.length > 0 && (
            <div className="card-grid">
              {myStyles.map((s) => (
                <MyStyleCard
                  key={s.id}
                  style={s}
                  onEdit={() => openEdit(s)}
                  onDelete={() => handleDelete(s.id)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Create / Edit form ── */}
      {user && formOpen && (
        <StyleForm
          form={form}
          editing={editing}
          saving={saving}
          error={saveError}
          onChange={(k, v) => setForm((f) => ({ ...f, [k]: v }))}
          onSave={handleSave}
          onCancel={closeForm}
        />
      )}
    </PageShell>
  )
}

/* ── Sub-components ── */

function PresetCard({
  style,
}: {
  style: Pick<BadgeStyle, "label" | "color" | "styleType">
}) {
  return (
    <div className="card">
      <div className="card-badge">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={badgeUrl(
            { url: "username", label: style.label, color: style.color, styleType: style.styleType },
            true
          )}
          alt={`${style.label} badge`}
          height={28}
        />
      </div>
      <h3>{style.label}</h3>
      <p>styleType: {style.styleType}</p>
    </div>
  )
}

function MyStyleCard({
  style,
  onEdit,
  onDelete,
}: {
  style: BadgeStyle
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="card">
      <div className="card-badge">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={badgeUrl(
            { url: "username", label: style.label, color: style.color, styleType: style.styleType },
            true
          )}
          alt={`${style.name} badge`}
          height={28}
        />
      </div>
      <h3>{style.name}</h3>
      <p>styleType: {style.styleType} · #{style.color}</p>
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button type="button" className="btn" style={{ flex: 1, padding: "7px 0", fontSize: 13 }} onClick={onEdit}>
          Edit
        </button>
        <button
          type="button"
          className="btn"
          style={{ flex: 1, padding: "7px 0", fontSize: 13, color: "#f87171", borderColor: "#f87171" }}
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

function StyleForm({
  form,
  editing,
  saving,
  error,
  onChange,
  onSave,
  onCancel,
}: {
  form: BadgeStyleRequest
  editing: BadgeStyle | null
  saving: boolean
  error: string | null
  onChange: (key: keyof BadgeStyleRequest, value: string | number) => void
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        padding: 16,
      }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        className="card"
        style={{ width: "100%", maxWidth: 420, gap: 14, position: "relative" }}
      >
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>
          {editing ? "Edit Style" : "New Style"}
        </h2>

        <Field label="Name">
          <input
            className="form-input"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="My style"
          />
        </Field>

        <Field label="Label">
          <input
            className="form-input"
            value={form.label}
            onChange={(e) => onChange("label", e.target.value)}
            placeholder="Views"
          />
        </Field>

        <Field label="Style type">
          <select
            className="form-input"
            value={form.styleType}
            onChange={(e) => onChange("styleType", e.target.value)}
          >
            {STYLE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>

        <Field label="Color (hex)">
          <input
            className="form-input"
            value={form.color}
            onChange={(e) => onChange("color", e.target.value.replace("#", ""))}
            placeholder="007EC6"
            maxLength={6}
          />
        </Field>

        <Field label="Icon">
          <input
            className="form-input"
            value={form.icon}
            onChange={(e) => onChange("icon", e.target.value)}
            placeholder="github (optional)"
          />
        </Field>

        <Field label="Font size">
          <input
            className="form-input"
            type="number"
            min={8}
            max={24}
            value={form.fontSize}
            onChange={(e) => onChange("fontSize", Number(e.target.value))}
          />
        </Field>

        {/* Preview */}
        <div className="card-badge" style={{ padding: "10px 0" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={badgeUrl(
              { url: "username", label: form.label, color: form.color, styleType: form.styleType },
              true
            )}
            alt="preview"
            height={28}
          />
        </div>

        {error && <p style={{ margin: 0, color: "#f87171", fontSize: 13 }}>{error}</p>}

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={onSave}
            disabled={saving || !form.name}
          >
            {saving ? "Saving…" : editing ? "Save changes" : "Create"}
          </button>
          <button type="button" className="btn" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>{label}</label>
      {children}
    </div>
  )
}
