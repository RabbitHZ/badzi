"use client"

import type React from "react"
import { Check, Copy } from "lucide-react"
import { useState, useEffect } from "react"

interface Toast {
  id: number
  message: string
  visible: boolean
  showIcon: boolean
}

type StyleType = "default" | "maple" | "rabbit"

interface BadgeFormData {
  url: string
  label: string
  color: string
  styleType: StyleType
}

interface ResultData {
  badgeUrl: string
  htmlCode: string
  markdownCode: string
  imageUrl: string
}

interface ImageLoadState {
  loading: boolean
  error: boolean
  loaded: boolean
  svgContent: string | null
}

interface ShowcaseBadge {
  label: string
  value: string
  caption: string
  accent: string
  position: string
}

const PASTEL_COLORS = [
  "#a5d8ff", "#74c0fc", "#99e9f2", "#66d9e8",
  "#b2f2bb", "#8ce99a", "#96f2d7", "#63e6be",
  "#ffc9c9", "#ffa8a8", "#fcc2d7", "#eebefa",
  "#d0bfff", "#b197fc", "#bac8ff", "#91a7ff",
  "#ffd8a8", "#ffec99", "#fff3bf", "#ffe066",
]

const VIVID_COLORS = [
  "#3b82f6", "#0d6efd", "#0ea5e9", "#06b6d4",
  "#22c55e", "#10b981", "#14b8a6", "#198754",
  "#ef4444", "#f43f5e", "#ec4899", "#d946ef",
  "#a855f7", "#8b5cf6", "#6366f1", "#4f46e5",
  "#f97316", "#f59e0b", "#eab308", "#000000",
]

const SHOWCASE_BADGES: ShowcaseBadge[] = [
  { label: "profile", value: "ready", caption: "README badge", accent: "#9b8cff", position: "top-left" },
  { label: "visits", value: "1.2k", caption: "Live counter", accent: "#5bc6ff", position: "top-right" },
  { label: "made with", value: "Badzi", caption: "Your own style", accent: "#f59dcb", position: "center" },
  { label: "open source", value: "git", caption: "Project link", accent: "#9fe5a7", position: "bottom-left" },
  { label: "today", value: "+42", caption: "A little momentum", accent: "#ffc46b", position: "bottom-right" },
]

function copyToClipboard(text: string, label: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log(`${label} copied to clipboard:`, text)
    })
    .catch((err) => {
      console.error("Could not copy text: ", err)
    })
}

function BadgeOrbitPreview() {
  // Only render the absolutely-positioned cards after mount. Before hydration
  // the styled-jsx rules aren't applied yet, so the cards would briefly stack
  // in the top-left corner and then snap into place. Gating on `mounted`
  // guarantees the broken pre-style state is never shown.
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5

    event.currentTarget.style.setProperty("--pointer-rotate-x", `${-y * 9}deg`)
    event.currentTarget.style.setProperty("--pointer-rotate-y", `${x * 12}deg`)
    event.currentTarget.style.setProperty("--glow-x", `${(x + 0.5) * 100}%`)
    event.currentTarget.style.setProperty("--glow-y", `${(y + 0.5) * 100}%`)
  }

  const resetPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--pointer-rotate-x", "0deg")
    event.currentTarget.style.setProperty("--pointer-rotate-y", "0deg")
    event.currentTarget.style.setProperty("--glow-x", "50%")
    event.currentTarget.style.setProperty("--glow-y", "50%")
  }

  return (
    <div
      className="badge-orbit"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      aria-label="Interactive badge examples. Add a URL to create your own badge."
    >
      <div className="badge-orbit__heading">
        <span className="badge-orbit__eyebrow">A profile, in motion</span>
        <h2>Make your README feel lived in.</h2>
        <p>Move your cursor through the badges, then add a URL to make one yours.</p>
      </div>

      {mounted && (
        <div className="badge-orbit__constellation" aria-hidden="true">
          {SHOWCASE_BADGES.map((badge) => (
            <div className={`orbit-card orbit-card--${badge.position}`} key={badge.label}>
              <div className="orbit-card__badge">
                <span style={{ backgroundColor: badge.accent }}>{badge.label}</span>
                <strong>{badge.value}</strong>
              </div>
              <span className="orbit-card__caption">{badge.caption}</span>
            </div>
          ))}
        </div>
      )}

      <div className="badge-orbit__guide" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}

export function GlassmorphicNav() {
  const [toast, setToast] = useState<Toast | null>(null)
  const [formData, setFormData] = useState<BadgeFormData>({
    url: "",
    label: "Views",
    color: "#0d6efd",
    styleType: "default",
  })
  const [resultData, setResultData] = useState<ResultData | null>(null)
  const [showColorPalette, setShowColorPalette] = useState(false)
  const [colorTab, setColorTab] = useState<"pastel" | "vivid">("pastel")
  const [isPreview, setIsPreview] = useState(true)
  const [imageLoadState, setImageLoadState] = useState<ImageLoadState>({
    loading: false,
    error: false,
    loaded: false,
    svgContent: null,
  })

  const showToast = (message: string) => {
    const newToast = {
      id: Date.now(),
      message,
      visible: true,
      showIcon: false,
    }
    setToast(newToast)

    setTimeout(() => {
      setToast((prev) => (prev ? { ...prev, showIcon: true } : null))
    }, 200)
  }

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast((prev) => (prev ? { ...prev, visible: false, showIcon: false } : null))
        setTimeout(() => setToast(null), 500)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [toast])

  useEffect(() => {
    if (formData.url) {
      const params = new URLSearchParams({
        url: formData.url,
        label: formData.label || "Views",
        color: formData.color.replace("#", ""),
        styleType: formData.styleType,
      }).toString()

      const endpoint = isPreview ? '/api/badges/preview' : '/api/badges'
      const badgeUrl = `https://badzi-server-725452159926.europe-west1.run.app${endpoint}?${params}`
      const finalBadgeUrl = `https://badzi-server-725452159926.europe-west1.run.app/api/badges?${params}`
      const htmlCode = `<img src="${finalBadgeUrl}" alt="${formData.label}" />`
      const markdownCode = `![${formData.label}](${finalBadgeUrl})`

      setResultData({
        badgeUrl: finalBadgeUrl,
        htmlCode,
        markdownCode,
        imageUrl: badgeUrl,
      })

      // Reset image load state when URL changes
      setImageLoadState({
        loading: true,
        error: false,
        loaded: false,
        svgContent: null,
      })
    } else {
      setResultData(null)
      setImageLoadState({
        loading: false,
        error: false,
        loaded: false,
        svgContent: null,
      })
    }
  }, [formData, isPreview])

  // Fetch SVG content when imageUrl changes
  useEffect(() => {
    if (resultData?.imageUrl) {
      const fetchSvg = async () => {
        try {
          setImageLoadState((prev) => ({
            ...prev,
            loading: true,
            error: false,
            loaded: false,
            svgContent: null,
          }))

          const response = await fetch(resultData.imageUrl)

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const svgText = await response.text()

          setImageLoadState({
            loading: false,
            error: false,
            loaded: true,
            svgContent: svgText,
          })

          console.log("Badge SVG loaded successfully:", resultData.imageUrl)
        } catch (error) {
          console.error("Failed to fetch badge SVG:", error)
          setImageLoadState({
            loading: false,
            error: true,
            loaded: false,
            svgContent: null,
          })
        }
      }

      fetchSvg()
    }
  }, [resultData?.imageUrl])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleColorSelect = (colorValue: string) => {
    setFormData((prev) => ({
      ...prev,
      color: colorValue,
    }))
    setShowColorPalette(false)
  }

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData((prev) => ({
      ...prev,
      color: value,
    }))
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8 sm:mb-10 text-center">
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4">
          <svg
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 h-14 sm:w-16 sm:h-16"
          >
            <rect width="44" height="44" rx="10" fill="white" fillOpacity="0.95" />
            <text
              x="22"
              y="29"
              fontSize="24"
              fontWeight="600"
              fontFamily="system-ui, -apple-system, sans-serif"
              fill="#18181b"
              textAnchor="middle"
            >
              B
            </text>
          </svg>
          <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight">
            Badzi
          </h1>
        </div>
        <p className="text-white/80 text-lg sm:text-xl font-medium px-4">
          Decorate your GitHub Profile — Craft a badge that's uniquely you.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center lg:items-stretch justify-center">
        {/* LEFT BOX: Create Your Badge Form */}
        <div className="w-full max-w-md lg:w-96 p-5 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
          <h2 className="text-white font-bold text-xl mb-6">Create Your Badge</h2>

          <div className="space-y-4">
            {/* URL Input */}
            <div>
              <label className="text-white/80 text-sm font-medium block mb-2">URL you want to track</label>
              <input
                type="text"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder=""
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-all"
              />
            </div>

            {/* Label Input */}
            <div>
              <label className="text-white/80 text-sm font-medium block mb-2">Label</label>
              <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                placeholder="e.g., Total Visits"
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-all"
              />
            </div>

            {/* Style Type Selection */}
            <div>
              <label className="text-white/80 text-sm font-medium block mb-2">Style Type</label>
              <select
                name="styleType"
                value={formData.styleType}
                onChange={(e) => setFormData((prev) => ({ ...prev, styleType: e.target.value as StyleType }))}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 transition-all cursor-pointer"
              >
                <option value="default" className="bg-zinc-800 text-white">Default</option>
                <option value="maple" className="bg-zinc-800 text-white">Maple</option>
                <option value="rabbit" className="bg-zinc-800 text-white">Rabbit</option>
              </select>
            </div>

            <div className={formData.styleType !== "default" ? "opacity-50 pointer-events-none" : ""}>
              <label className="text-white/80 text-sm font-medium block mb-2">
                Color
                {formData.styleType !== "default" && (
                  <span className="ml-2 text-white/50 text-xs font-normal">(Only available for Default style)</span>
                )}
              </label>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  value={formData.color}
                  onChange={handleColorInputChange}
                  disabled={formData.styleType !== "default"}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-all font-mono text-sm disabled:cursor-not-allowed"
                />
                <div
                  className={`w-10 h-10 rounded-lg border border-white/20 shadow-lg transition-all ${
                    formData.styleType === "default" ? "cursor-pointer hover:border-white/40" : "cursor-not-allowed"
                  }`}
                  style={{ backgroundColor: formData.color }}
                  onClick={() => formData.styleType === "default" && setShowColorPalette(!showColorPalette)}
                />
              </div>

              {showColorPalette && formData.styleType === "default" && (
                <div className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg">
                  {/* Tab Buttons */}
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => setColorTab("pastel")}
                      className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
                        colorTab === "pastel"
                          ? "bg-white/20 text-white"
                          : "bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      Pastel
                    </button>
                    <button
                      onClick={() => setColorTab("vivid")}
                      className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
                        colorTab === "vivid"
                          ? "bg-white/20 text-white"
                          : "bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      Vivid
                    </button>
                  </div>
                  {/* Color Grid */}
                  <div className="grid grid-cols-4 gap-2">
                    {(colorTab === "pastel" ? PASTEL_COLORS : VIVID_COLORS).map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={`w-full aspect-square rounded-lg border-2 transition-all ${
                          formData.color === color
                            ? "border-white shadow-lg scale-110"
                            : "border-white/20 hover:border-white/40"
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT BOX: Result Display with Badge Preview */}
        {resultData ? (
          <div className="w-full max-w-md lg:w-96 p-5 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl lg:max-h-[700px] lg:overflow-y-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-xl">Result</h2>
              </div>

              {/* Badge Preview Image */}
              <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/20 flex items-center justify-center min-h-24">
                {imageLoadState.loading && !imageLoadState.loaded && !imageLoadState.error && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <p className="text-white/60 text-xs">Loading badge preview...</p>
                  </div>
                )}
                {imageLoadState.error && (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <p className="text-red-300 text-sm font-medium">Failed to load badge preview</p>
                    <p className="text-white/60 text-xs max-w-xs">
                      Please check if the API is running and the URL is correct.
                    </p>
                    <p className="text-white/40 text-xs mt-1 break-all">{resultData.imageUrl}</p>
                  </div>
                )}
                {imageLoadState.loaded && imageLoadState.svgContent && (
                  <div
                    className="transition-opacity duration-300"
                    dangerouslySetInnerHTML={{ __html: imageLoadState.svgContent }}
                  />
                )}
              </div>
            </div>

            {/* Copy & Paste Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold text-base mb-3">Copy & paste it in your file</h3>
              </div>

              {/* URL */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white text-sm font-medium">URL</label>
                  <button
                    onClick={() => copyToClipboard(resultData.badgeUrl, "URL")}
                    className="p-1 hover:bg-white/10 rounded transition-all"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4 text-white/70 hover:text-white" />
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/20">
                  <code className="text-white/70 text-xs break-all leading-relaxed">{resultData.badgeUrl}</code>
                </div>
              </div>

              {/* Markdown */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white text-sm font-medium">Markdown</label>
                  <button
                    onClick={() => copyToClipboard(resultData.markdownCode, "Markdown")}
                    className="p-1 hover:bg-white/10 rounded transition-all"
                    title="Copy Markdown"
                  >
                    <Copy className="w-4 h-4 text-white/70 hover:text-white" />
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/20">
                  <code className="text-white/70 text-xs break-all leading-relaxed">{resultData.markdownCode}</code>
                </div>
              </div>

              {/* HTML */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white text-sm font-medium">HTML</label>
                  <button
                    onClick={() => copyToClipboard(resultData.htmlCode, "HTML")}
                    className="p-1 hover:bg-white/10 rounded transition-all"
                    title="Copy HTML"
                  >
                    <Copy className="w-4 h-4 text-white/70 hover:text-white" />
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/20">
                  <code className="text-white/70 text-xs break-all leading-relaxed">{resultData.htmlCode}</code>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md lg:w-96 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl min-h-96 overflow-hidden">
            <BadgeOrbitPreview />
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-8 left-1/2 transform -translate-x-1/2 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl transition-all duration-500 ease-out transform-gpu z-20 ${
            toast.visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-8 scale-95"
          }`}
          style={{
            animation: toast.visible
              ? "slideInUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
              : "slideOutDown 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-all duration-300 ease-out ${
                toast.showIcon ? "scale-100 rotate-0" : "scale-0 rotate-180"
              }`}
            >
              <Check
                className={`w-4 h-4 text-white transition-all duration-200 delay-100 ${
                  toast.showIcon ? "opacity-100 scale-100" : "opacity-0 scale-50"
                }`}
              />
            </div>
            <span
              className={`text-white font-medium text-sm transition-all duration-300 delay-75 ${
                toast.visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
              }`}
            >
              {toast.message}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 rounded-b-2xl overflow-hidden">
            <div
              className={`h-full bg-white/30 transition-all duration-2500 ease-linear ${
                toast.visible ? "w-0" : "w-full"
              }`}
              style={{
                animation: toast.visible ? "progressBar 2.5s linear" : "none",
              }}
            />
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideInUp {
          0% {
            opacity: 0;
            transform: translateY(2rem) scale(0.9);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-0.2rem) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideOutDown {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(1rem) scale(0.95);
          }
        }
        
        @keyframes progressBar {
          0% {
            width: 100%;
          }
          100% {
            width: 0%;
          }
        }

        .badge-orbit {
          --pointer-rotate-x: 0deg;
          --pointer-rotate-y: 0deg;
          --glow-x: 50%;
          --glow-y: 50%;
          position: relative;
          isolation: isolate;
          min-height: 384px;
          height: 100%;
          overflow: hidden;
          cursor: crosshair;
          background:
            radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(255, 255, 255, 0.24), transparent 37%),
            linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(76, 65, 174, 0.1));
          transition: background 180ms ease-out;
        }

        /* Fade the whole scene in once styles/layout are ready, so cards
           don't flash from their un-positioned state on first paint. */
        .badge-orbit__constellation {
          opacity: 0;
          animation: orbitReveal 420ms ease-out 60ms forwards;
        }

        @keyframes orbitReveal {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .badge-orbit::before {
          position: absolute;
          inset: 86px -58px -106px;
          z-index: -1;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 50%;
          box-shadow:
            0 0 0 54px rgba(255, 255, 255, 0.035),
            0 0 0 108px rgba(255, 255, 255, 0.02);
          content: "";
        }

        .badge-orbit__heading {
          position: relative;
          z-index: 2;
          padding: 24px 24px 0;
          text-align: left;
          pointer-events: none;
        }

        .badge-orbit__eyebrow {
          display: block;
          margin-bottom: 7px;
          color: rgba(255, 255, 255, 0.62);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.01em;
        }

        .badge-orbit__heading h2 {
          max-width: 250px;
          margin: 0;
          color: white;
          font-size: 22px;
          font-weight: 650;
          letter-spacing: -0.04em;
          line-height: 1.1;
        }

        .badge-orbit__heading p {
          max-width: 245px;
          margin: 9px 0 0;
          color: rgba(255, 255, 255, 0.62);
          font-size: 12px;
          line-height: 1.45;
        }

        .badge-orbit__constellation {
          position: absolute;
          inset: 0;
          transform: perspective(680px) rotateX(var(--pointer-rotate-x)) rotateY(var(--pointer-rotate-y));
          transform-style: preserve-3d;
          transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }

        .orbit-card {
          position: absolute;
          display: flex;
          flex-direction: column;
          gap: 7px;
          width: 146px;
          padding: 11px;
          border: 1px solid rgba(255, 255, 255, 0.52);
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.7));
          box-shadow: 0 14px 28px rgba(24, 17, 76, 0.2), 0 2px 7px rgba(24, 17, 76, 0.1);
          color: #29224a;
          pointer-events: none;
          transform-style: preserve-3d;
          will-change: transform;
          animation-fill-mode: both;
        }

        .orbit-card__badge {
          display: flex;
          width: max-content;
          max-width: 100%;
          overflow: hidden;
          border-radius: 7px;
          box-shadow: 0 2px 5px rgba(35, 27, 86, 0.14);
          font-size: 11px;
          line-height: 1;
        }

        .orbit-card__badge span,
        .orbit-card__badge strong {
          overflow: hidden;
          padding: 6px 7px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .orbit-card__badge span {
          color: #161326;
          font-weight: 600;
        }

        .orbit-card__badge strong {
          background: #29224a;
          color: white;
          font-weight: 650;
        }

        .orbit-card__caption {
          color: rgba(41, 34, 74, 0.62);
          font-size: 10px;
          font-weight: 550;
        }

        .orbit-card--top-left {
          top: 132px;
          left: -34px;
          width: 210px;
          padding: 16px;
          gap: 9px;
          transform: rotate(-10deg) translateZ(42px);
          animation: driftTopLeft 7s ease-in-out infinite;
        }

        .orbit-card--top-right {
          top: 92px;
          right: -42px;
          width: 210px;
          padding: 16px;
          gap: 9px;
          transform: rotate(8deg) translateZ(30px);
          animation: driftTopRight 8s ease-in-out -2s infinite;
        }

        /* Larger type for the two enlarged top cards */
        .orbit-card--top-left .orbit-card__badge,
        .orbit-card--top-right .orbit-card__badge {
          font-size: 15px;
        }

        .orbit-card--top-left .orbit-card__caption,
        .orbit-card--top-right .orbit-card__caption {
          font-size: 12px;
        }

        .orbit-card--center {
          top: 213px;
          left: 116px;
          z-index: 1;
          transform: rotate(-3deg) translateZ(78px);
          animation: driftCenter 6.5s ease-in-out -1.5s infinite;
        }

        .orbit-card--bottom-left {
          bottom: -20px;
          left: 4px;
          transform: rotate(8deg) translateZ(23px);
          animation: driftBottomLeft 7.5s ease-in-out -3s infinite;
        }

        .orbit-card--bottom-right {
          right: -23px;
          bottom: 1px;
          transform: rotate(-8deg) translateZ(46px);
          animation: driftBottomRight 8s ease-in-out -0.5s infinite;
        }

        .badge-orbit__guide {
          position: absolute;
          right: 23px;
          top: 24px;
          display: flex;
          gap: 4px;
          pointer-events: none;
        }

        .badge-orbit__guide span {
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.72);
        }

        @keyframes driftTopLeft {
          0%, 100% { transform: rotate(-10deg) translate3d(0, 0, 42px); }
          50% { transform: rotate(-5deg) translate3d(9px, -11px, 54px); }
        }

        @keyframes driftTopRight {
          0%, 100% { transform: rotate(8deg) translate3d(0, 0, 30px); }
          50% { transform: rotate(2deg) translate3d(-10px, 12px, 49px); }
        }

        @keyframes driftCenter {
          0%, 100% { transform: rotate(-3deg) translate3d(0, 0, 78px); }
          50% { transform: rotate(3deg) translate3d(-4px, -14px, 96px); }
        }

        @keyframes driftBottomLeft {
          0%, 100% { transform: rotate(8deg) translate3d(0, 0, 23px); }
          50% { transform: rotate(3deg) translate3d(12px, -12px, 39px); }
        }

        @keyframes driftBottomRight {
          0%, 100% { transform: rotate(-8deg) translate3d(0, 0, 46px); }
          50% { transform: rotate(-3deg) translate3d(-9px, -12px, 62px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .badge-orbit__constellation,
          .orbit-card {
            animation: none;
            transition: none;
          }
          .badge-orbit__constellation {
            opacity: 1;
          }
        }

        @media (max-width: 840px) {
          .badge-orbit {
            min-height: 352px;
          }
        }
      `}</style>
    </div>
  )
}
