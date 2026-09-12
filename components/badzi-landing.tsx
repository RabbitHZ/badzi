"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import "./badzi-landing.css"

/* ===================== Types & Data ===================== */

type Shape = "split" | "pill"
type Lang = "en" | "ko"

interface Palette {
  name: string
  bg: string
  solid?: string
}

interface StyleType {
  id: "default" | "maple" | "rabbit"
  l: string
  r: string
  locked: boolean
}

const PALETTES: Record<Shape, Palette[]> = {
  split: [
    { name: "blue", bg: "#007EC6" },
    { name: "green", bg: "#4C1" },
    { name: "yellow", bg: "#DFB317" },
    { name: "orange", bg: "#FE7D37" },
    { name: "red", bg: "#E05D44" },
    { name: "pink", bg: "#FF69B4" },
    { name: "purple", bg: "#7A3DF5" },
    { name: "grey", bg: "#9F9F9F" },
  ],
  pill: [
    { name: "blue", bg: "#2F6FE4" },
    { name: "indigo", bg: "#4A48D8" },
    { name: "green", bg: "#3FA85C" },
    { name: "magenta", bg: "#B93BD6" },
    { name: "orange", bg: "linear-gradient(180deg,#F29A3C,#E2701A)", solid: "#E2701A" },
    { name: "sky", bg: "#4FA3E8" },
    { name: "yellow", bg: "#F2C84B" },
    { name: "lavender", bg: "#C79BE8" },
    { name: "pink", bg: "#ED87B8" },
  ],
}

// Style types are a decorative pair. Maple and Rabbit are locked.
const TYPES: StyleType[] = [
  { id: "default", l: "", r: "", locked: false },
  { id: "maple", l: "🍁", r: "🍁", locked: true },
  { id: "rabbit", l: "🐰", r: "🥕", locked: true },
]

interface Strings {
  h1: string
  sub: string
  make: string
  label: string
  shape: string
  type: string
  labelDefault: string
  copy: string
  copied: string
  unlock: string
  lockmsg: string
  shapes: Record<Shape, string>
  types: Record<StyleType["id"], string>
  nav: string[]
  signin: string
  useBadge: string
  readmeCap: string
  readmeTagline: string
  readmeAbout: string
  readmeFeaturesTitle: string
  readmeFeatures: string[]
  readmeQuickstart: string
  words: string[]
}

const I18N: Record<Lang, Strings> = {
  en: {
    h1: "Your README<br>has visitors.",
    sub: "Paste a URL. Pick a style. Copy the markdown.",
    make: "Make the badge",
    label: "Label",
    shape: "Shape",
    type: "Type",
    labelDefault: "Views",
    copy: "Copy",
    copied: "Copied",
    unlock: "Unlock",
    lockmsg:
      "Maple and Rabbit are paid styles. Preview them here, then unlock in the Shop to copy the markdown.",
    shapes: { split: "Split", pill: "Pill" },
    types: { default: "Default", maple: "Maple", rabbit: "Rabbit" },
    nav: ["Styles", "Shop", "Pricing", "Docs"],
    signin: "Sign in",
    useBadge: "Use this badge",
    readmeCap: "This badge updates on every view.",
    readmeTagline: "A tiny toolkit for tracking what your project actually gets used.",
    readmeAbout:
      "my-project drops live counters and status badges into any README, so your visitors, stars, and build health are visible at a glance — no dashboards, no setup.",
    readmeFeaturesTitle: "Features",
    readmeFeatures: [
      "Real-time view and visitor counters",
      "Works in any Markdown file or website",
      "Themeable colors and badge styles",
    ],
    readmeQuickstart: "Quickstart",
    words: ["Views", "Today", "Stars", "Build", "Streak", "Commits", "Forks", "Clones", "License", "Uptime", "Issues", "Since"],
  },
  ko: {
    h1: "당신의 README에도<br>방문자가 있습니다.",
    sub: "URL을 붙여넣고, 색을 고르고, 마크다운을 복사하세요.",
    make: "뱃지 만들기",
    label: "라벨",
    shape: "형태",
    type: "타입",
    labelDefault: "조회수",
    copy: "복사",
    copied: "복사됨",
    unlock: "잠금 해제",
    lockmsg:
      "Maple과 Rabbit은 유료 스타일입니다. 미리보기는 자유롭게 하시고, 마크다운 복사는 Shop에서 잠금을 해제한 뒤 가능합니다.",
    shapes: { split: "분할형", pill: "알약형" },
    types: { default: "기본", maple: "메이플", rabbit: "래빗" },
    nav: ["스타일", "상점", "요금제", "문서"],
    signin: "로그인",
    useBadge: "이 뱃지 사용하기",
    readmeCap: "이 뱃지는 조회될 때마다 갱신됩니다.",
    readmeTagline: "내 프로젝트가 실제로 얼마나 쓰이는지 추적하는 작은 도구 모음입니다.",
    readmeAbout:
      "my-project는 어떤 README에도 실시간 카운터와 상태 뱃지를 얹어, 방문자·스타·빌드 상태를 한눈에 보여줍니다. 대시보드도, 복잡한 설정도 필요 없습니다.",
    readmeFeaturesTitle: "기능",
    readmeFeatures: [
      "실시간 조회수 및 방문자 카운터",
      "모든 마크다운 파일과 웹사이트에서 동작",
      "색상과 뱃지 스타일 커스터마이즈",
    ],
    readmeQuickstart: "빠른 시작",
    words: ["조회수", "오늘", "스타", "빌드", "연속", "커밋", "포크", "클론", "라이선스", "업타임", "이슈", "시작"],
  },
}

interface ScatterItem {
  i: number
  v: string
  c: number
  x: string
  y: string
  r: string
  fd: number
  fdl: number
  sm?: boolean
}

// Two-column layout, so the center stays empty. Only top/bottom bands + edges.
// Top band (y ≲ 14%) is kept clear behind the logo (left) and nav (right)
// so header text never sits on top of a scattered badge.
const SCATTER: ScatterItem[] = [
  { i: 0, v: "1.2k", c: 0, x: "27%", y: "16%", r: "-7deg", fd: 11, fdl: -2 },
  { i: 3, v: "passing", c: 1, x: "37%", y: "5%", r: "4deg", fd: 9, fdl: -5 },
  { i: 2, v: "482", c: 2, x: "50%", y: "13%", r: "-3deg", fd: 13, fdl: -1, sm: true },
  { i: 1, v: "+42", c: 5, x: "61%", y: "5%", r: "8deg", fd: 10, fdl: -7 },
  { i: 8, v: "MIT", c: 7, x: "71%", y: "16%", r: "-5deg", fd: 12, fdl: -3, sm: true },
  { i: 4, v: "63 days", c: 4, x: "63%", y: "34%", r: "-9deg", fd: 14, fdl: -4, sm: true },
  { i: 5, v: "2,918", c: 2, x: "66%", y: "60%", r: "5deg", fd: 9, fdl: -8, sm: true },
  { i: 11, v: "2026", c: 6, x: "95%", y: "40%", r: "6deg", fd: 8, fdl: -6, sm: true },
  { i: 9, v: "100%", c: 1, x: "94%", y: "66%", r: "7deg", fd: 10, fdl: -5, sm: true },
  { i: 6, v: "77", c: 0, x: "4%", y: "90%", r: "-6deg", fd: 13, fdl: -9 },
  { i: 0, v: "9.4k", c: 2, x: "26%", y: "94%", r: "5deg", fd: 11, fdl: -3 },
  { i: 10, v: "3", c: 4, x: "48%", y: "89%", r: "-8deg", fd: 9, fdl: -6, sm: true },
  { i: 7, v: "318", c: 6, x: "70%", y: "95%", r: "2deg", fd: 14, fdl: -1, sm: true },
  { i: 1, v: "+17", c: 5, x: "88%", y: "90%", r: "-5deg", fd: 10, fdl: -4 },
]

const NEIGHBOURS = [
  { k: "build", v: "passing", bg: "#4C1" },
  { k: "license", v: "MIT", bg: "#9F9F9F" },
]

/* ===================== Icons ===================== */

// Plain stroked padlock, so it renders identically across platforms
// (Apple's emoji 🔒 looks different on every OS).
function LockIcon() {
  return (
    <svg
      className="lock"
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}

/* ===================== Badge API ===================== */

// Live badge service. The frontend sends url/label/color(hex)/styleType;
// shape (split/pill) is a UI-only concept the server doesn't consume.
const BADGE_API = "https://badzi-server-725452159926.europe-west1.run.app"

// The server wants a bare 6-digit hex. Palettes may hold a gradient in `bg`,
// so prefer `solid` and strip the leading '#'.
function badgeColor(p: Palette): string {
  return (p.solid || p.bg).replace("#", "")
}

// Build the query the badge server understands.
function badgeQuery(url: string, label: string, color: string, styleType: string): string {
  return new URLSearchParams({ url, label, color, styleType }).toString()
}

/* ===================== Helpers ===================== */

// White text is unreadable on a light background. Measure luminance and flip.
function ink(solid: string): string {
  let h = solid.replace("#", "")
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.62 ? "#2C2237" : "#FFFFFF"
}

interface BadgeOpts {
  shape?: Shape
  type?: StyleType
  big?: boolean
}

function badgeHTML(k: string, v: string, p: Palette, shape: Shape, opt: BadgeOpts = {}): string {
  const sh = opt.shape || shape
  const t = opt.type || TYPES[0]
  const cls = "badge " + sh + (opt.big ? " lg" : "")
  const L = t.l ? '<span class="orn">' + t.l + "</span>" : ""
  const R = t.r ? '<span class="orn">' + t.r + "</span>" : ""

  if (sh === "split") {
    return (
      '<span class="' + cls + '">' +
      '<span class="k">' + L + "<span>" + k + "</span></span>" +
      '<span class="v" style="background:' + p.bg + '"><span>' + v + "</span>" + R + "</span>" +
      "</span>"
    )
  }
  const solid = p.solid || p.bg
  return (
    '<span class="' + cls + '" style="background:' + p.bg + ";color:" + ink(solid) + '">' +
    "<span>" + L + "<span>" + k + ": " + v + "</span>" + R + "</span></span>"
  )
}

/* ===================== Component ===================== */

export function BadziLanding() {
  // Language is fixed to English for now (the switcher was removed);
  // the i18n tables are kept so it can be re-enabled later.
  const lang: Lang = "en"
  const [shape, setShape] = useState<Shape>("split")
  const [type, setType] = useState<StyleType>(TYPES[0])
  const [current, setCurrent] = useState<Palette | null>(null)
  const [picked, setPicked] = useState(-1)
  const [urlVal, setUrlVal] = useState("")
  const [labelVal, setLabelVal] = useState("")
  const [copyLabel, setCopyLabel] = useState<string | null>(null)
  // Nothing is shown until the user clicks "Make the badge" with a URL.
  const [generated, setGenerated] = useState(false)
  // Start with .animate present from the very first render (server + client)
  // so the chips paint off-screen and drop in. A timer removes it once the
  // one-shot drop finishes, leaving only the perpetual float.
  const [animate, setAnimate] = useState(true)

  const t = I18N[lang]
  const palette = PALETTES[shape]

  // Restore the persisted shape once on mount.
  useEffect(() => {
    try {
      const ss = localStorage.getItem("badzi_shape") as Shape | null
      if (ss) setShape(ss)
    } catch {}
  }, [])

  // Keep `current` valid whenever the shape (and thus palette) changes.
  useEffect(() => {
    setCurrent((prev) => (prev && palette.includes(prev) ? prev : palette[0]))
  }, [palette])

  // The drop is a one-shot on load; remove .animate once it finishes so only
  // the perpetual float remains (and hover/scale keep working).
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(false), SCATTER.length * 45 + 900)
    return () => clearTimeout(timer)
  }, [])

  const slug = useCallback(() => {
    const v = (urlVal || "username").trim()
    return (
      v.replace(/^https?:\/\//, "").replace(/^github\.com\//, "").replace(/\/+$/, "") || "username"
    )
  }, [urlVal])

  const key = (labelVal || "").trim() || t.labelDefault

  // Live badge URL + markdown + preview, derived from the current selection.
  const { markdown, previewUrl, locked } = useMemo(() => {
    const cur = current || palette[0]
    const query = badgeQuery(slug(), key, badgeColor(cur), type.id)
    const badgeUrl = `${BADGE_API}/api/badges?${query}`
    const previewUrl = `${BADGE_API}/api/badges/preview?${query}`
    if (type.locked) {
      return {
        locked: true,
        badgeUrl,
        previewUrl,
        markdown: "🔒 ![" + key + "](" + BADGE_API + "/api/badges?••••••)",
      }
    }
    return {
      locked: false,
      badgeUrl,
      previewUrl,
      markdown: "![" + key + "](" + badgeUrl + ")",
    }
  }, [current, palette, key, type, slug])

  const changeShape = (s: Shape) => {
    setShape(s)
    try {
      localStorage.setItem("badzi_shape", s)
    } catch {}
    setCurrent(null)
    setPicked(-1)
  }

  const pickChip = (n: number) => {
    const b = SCATTER[n]
    setPicked(n)
    setLabelVal(t.words[b.i])
    setCurrent(palette[b.c % palette.length])
  }

  const pickSwatch = (p: Palette) => {
    setCurrent(p)
    setPicked(-1)
  }

  // "Make the badge" reveals the preview, README badge, and markdown.
  const makeBadge = () => {
    if (urlVal.trim()) setGenerated(true)
  }

  const doCopy = () => {
    if (locked) return
    navigator.clipboard
      .writeText(markdown)
      .then(() => {
        setCopyLabel(t.copied)
        setTimeout(() => setCopyLabel(null), 1600)
      })
      .catch(() => {})
  }

  const cur = current || palette[0]

  // README neighbour badges stay as static demo shields; the user's own
  // badge below them is the live one rendered from the badge server.
  const readmeNeighboursHTML = NEIGHBOURS.map((nb) =>
    badgeHTML(nb.k, nb.v, { name: nb.k, bg: nb.bg }, shape, { shape: "split", type: TYPES[0] })
  ).join("")

  return (
    <div className={animate ? "badzi animate" : "badzi"} lang={lang}>
      <section className="hero">
        <header className="topbar">
          <div className="mark">
            <i>B</i>Badzi
          </div>
          <nav>
            {t.nav.map((n) => (
              <a href="#" key={n}>
                {n}
              </a>
            ))}
            <a href="#" className="signin">
              {t.signin}
            </a>
          </nav>
        </header>

        <div className="stage">
          <div className="grid">
            <div className="col">
              <h1 dangerouslySetInnerHTML={{ __html: t.h1 }} />
              <p className="sub">{t.sub}</p>

              <div className="bar">
                <input
                  type="text"
                  inputMode="url"
                  placeholder="github.com/username"
                  value={urlVal}
                  onChange={(e) => {
                    setUrlVal(e.target.value)
                    setPicked(-1)
                    if (!e.target.value.trim()) setGenerated(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") makeBadge()
                  }}
                />
                <button type="button" onClick={makeBadge}>
                  {t.make}
                </button>
              </div>

              <div className="opts">
                <div className="field">
                  <label htmlFor="badzi-label">{t.label}</label>
                  <input
                    id="badzi-label"
                    type="text"
                    maxLength={16}
                    placeholder={t.labelDefault}
                    value={labelVal}
                    onChange={(e) => {
                      setLabelVal(e.target.value)
                      setPicked(-1)
                    }}
                  />
                </div>

                <div className="field">
                  <span className="lbl">{t.type}</span>
                  <div className="seg" role="group">
                    {TYPES.map((ty) => (
                      <button
                        key={ty.id}
                        type="button"
                        aria-pressed={type.id === ty.id}
                        onClick={() => setType(ty)}
                      >
                        {ty.locked && <LockIcon />}
                        {t.types[ty.id]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="field">
                  <span className="lbl">{t.shape}</span>
                  <div className="seg" role="group">
                    {(["split", "pill"] as Shape[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={shape === s}
                        onClick={() => changeShape(s)}
                      >
                        {t.shapes[s]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="swatch-row">
                  {generated && (
                    <div className="preview">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="preview-badge" src={previewUrl} alt={key} />
                    </div>
                  )}
                  <div className="swatches" role="group">
                    {palette.map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        className="sw"
                        style={{ background: p.bg }}
                        aria-label={p.name}
                        aria-pressed={p === cur}
                        onClick={() => pickSwatch(p)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {generated && (
                <div className="result">
                  <div className={locked ? "snippet locked" : "snippet"}>
                    <code>{markdown}</code>
                    <button type="button" onClick={doCopy}>
                      {copyLabel || (locked ? t.unlock : t.copy)}
                    </button>
                  </div>
                </div>
              )}
              {generated && locked && <p className="lockmsg">{t.lockmsg}</p>}
            </div>

            <aside className="readme">
              <div className="repo">
                <span className="book">📕</span>
                <a href="#">{slug().split("/")[0] || "username"}</a>
                <span>/</span>
                <b>my-project</b>
              </div>
              <div className="body">
                <h2>my-project</h2>
                <p className="tagline">{t.readmeTagline}</p>
                <div className="badges">
                  <span dangerouslySetInnerHTML={{ __html: readmeNeighboursHTML }} />
                  {/* Live badge appears only once the user makes one */}
                  {generated && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="live-badge" src={previewUrl} alt={key} />
                    </>
                  )}
                </div>
                <p>{t.readmeAbout}</p>
                <h3>{t.readmeFeaturesTitle}</h3>
                <ul>
                  {t.readmeFeatures.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <h3>{t.readmeQuickstart}</h3>
                <pre>{"![" + key + "](" + previewUrl + ")"}</pre>
                <div className="cap">
                  <i />
                  <span>{t.readmeCap}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="scatter">
          {SCATTER.map((b, n) => {
            const p = palette[b.c % palette.length]
            return (
              <button
                type="button"
                key={n}
                className={b.sm ? "chip sm-hide" : "chip"}
                aria-pressed={picked === n}
                aria-label={t.useBadge + ": " + t.words[b.i]}
                style={
                  {
                    left: b.x,
                    top: b.y,
                    "--d": n * 45 + "ms",
                    "--fd": b.fd + "s",
                    "--fdelay": b.fdl + "s",
                  } as React.CSSProperties
                }
                onClick={() => pickChip(n)}
              >
                <span className="fl">
                  <span
                    className="rt"
                    style={{ "--r": b.r } as React.CSSProperties}
                    dangerouslySetInnerHTML={{
                      __html: badgeHTML(t.words[b.i], b.v, p, shape, { type: TYPES[0] }),
                    }}
                  />
                </span>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
