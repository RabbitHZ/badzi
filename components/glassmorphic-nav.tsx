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

interface BadgeFormData {
  url: string
  label: string
  color: string
  fontSize: number
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

const COLOR_PALETTE = [
  "#cfe2ff",
  "#9ec5fe",
  "#6ea8fe",
  "#3d8bfd",
  "#0d6efd",
  "#0a58ca",
  "#084298",
  "#052c65",
  "#198754",
  "#d1e7dd",
  "#7dd3fc",
  "#fbbf24",
  "#f87171",
  "#a855f7",
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

export function GlassmorphicNav() {
  const [toast, setToast] = useState<Toast | null>(null)
  const [formData, setFormData] = useState<BadgeFormData>({
    url: "",
    label: "Views",
    color: "#0d6efd",
    fontSize: 12,
  })
  const [resultData, setResultData] = useState<ResultData | null>(null)
  const [showColorPalette, setShowColorPalette] = useState(false)
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
        fontSize: formData.fontSize.toString(),
      }).toString()

      const endpoint = isPreview ? '/api/badges/preview' : '/api/badges'
      const badgeUrl = `https://bazzi-server-464152216340.asia-northeast3.run.app${endpoint}?${params}`
      const finalBadgeUrl = `https://bazzi-server-464152216340.asia-northeast3.run.app/api/badges?${params}`
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
    <div className="relative w-full max-w-7xl mx-auto px-4">
      <div className="flex gap-8 items-start justify-center">
        {/* LEFT BOX: Create Your Badge Form */}
        <div className="w-96 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
          <h2 className="text-white font-bold text-xl mb-6">Create Your Badge</h2>

          {/* Info Box */}
          <div className="mb-6 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
            <p className="text-green-300 text-xs leading-relaxed">
              If you would like to have your count start at some other value, please open an{" "}
              <a href="#" className="underline hover:text-green-200">
                issue
              </a>{" "}
              and I will update it for you ASAP.
            </p>
          </div>

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

            {/* Font Size Input */}
            <div>
              <label className="text-white/80 text-sm font-medium block mb-2">Font Size</label>
              <input
                type="number"
                name="fontSize"
                value={formData.fontSize}
                onChange={handleInputChange}
                min="8"
                max="24"
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-all"
              />
            </div>

            <div>
              <label className="text-white/80 text-sm font-medium block mb-2">Color</label>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  value={formData.color}
                  onChange={handleColorInputChange}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-all font-mono text-sm"
                />
                <div
                  className="w-10 h-10 rounded-lg border border-white/20 shadow-lg cursor-pointer hover:border-white/40 transition-all"
                  style={{ backgroundColor: formData.color }}
                  onClick={() => setShowColorPalette(!showColorPalette)}
                />
              </div>

              {showColorPalette && (
                <div className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg">
                  <div className="grid grid-cols-4 gap-2">
                    {COLOR_PALETTE.map((color) => (
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
          <div className="w-96 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl max-h-[700px] overflow-y-auto">
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
          <div className="w-96 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center min-h-96">
            <p className="text-white/60 text-center text-sm">Enter a URL to see the badge preview here</p>
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

      <style jsx>{`
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
      `}</style>
    </div>
  )
}
