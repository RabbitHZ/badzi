"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

interface StyleOption {
  id: string
  name: string
  description: string
  preview: string
  price: number | "free"
}

const STYLE_OPTIONS: StyleOption[] = [
  {
    id: "default",
    name: "Default",
    description: "Simple and clean basic style",
    preview: "https://bazzi-server-464152216340.asia-northeast3.run.app/api/badges/preview?url=https://github.com&label=Views&color=0d6efd&fontSize=12&styleType=default",
    price: "free",
  },
  {
    id: "maple",
    name: "Maple",
    description: "Warm maple-inspired style",
    preview: "https://bazzi-server-464152216340.asia-northeast3.run.app/api/badges/preview?url=https://github.com&label=Views&color=0d6efd&fontSize=12&styleType=maple",
    price: 3,
  },
  {
    id: "rabbit",
    name: "Rabbit",
    description: "Cute rabbit-themed style",
    preview: "https://bazzi-server-464152216340.asia-northeast3.run.app/api/badges/preview?url=https://github.com&label=Views&color=0d6efd&fontSize=12&styleType=rabbit",
    price: 3,
  },
]

export default function StorePage() {
  const router = useRouter()

  const handleSelectStyle = (styleId: string) => {
    router.push(`/?styleType=${styleId}`)
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/images/gradient-background.jpg)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Badge Generator</span>
            </Link>

            <div className="flex items-center gap-3 mb-2">
              <svg
                width="40"
                height="40"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="44" height="44" rx="10" fill="white" fillOpacity="0.9" />
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
              <h1 className="text-3xl font-bold text-white">Custom Bazzi Store</h1>
            </div>
            <p className="text-white/60">Choose your style and create a unique badge</p>
          </div>

          {/* Style Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STYLE_OPTIONS.map((style) => (
              <div
                key={style.id}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:bg-white/15 transition-all group"
              >
                {/* Preview */}
                <div className="mb-4 p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center min-h-24">
                  <img
                    src={style.preview}
                    alt={`${style.name} style preview`}
                    className="max-w-full h-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white font-semibold text-lg">{style.name}</h3>
                  <span className={`font-bold text-lg ${style.price === "free" ? "text-green-400" : "text-white"}`}>
                    {style.price === "free" ? "Free" : `$${style.price}`}
                  </span>
                </div>
                <p className="text-white/60 text-sm mb-4">{style.description}</p>

                {/* Action Button - Only show for paid styles */}
                {style.price !== "free" && (
                  <button
                    onClick={() => handleSelectStyle(style.id)}
                    className="w-full py-2 px-4 rounded-lg bg-white/20 text-white font-medium text-sm hover:bg-white/30 transition-all"
                  >
                    Buy This Style
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Coming Soon Section */}
          <div className="mt-12 p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center">
            <h2 className="text-white/80 font-semibold text-lg mb-2">More styles coming soon</h2>
            <p className="text-white/50 text-sm">
              New styles will be available here when they are ready
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
