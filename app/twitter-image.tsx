import { ImageResponse } from 'next/og'

// Same visual as the Open Graph image, declared inline so Next.js can read
// the route's runtime/segment config directly (re-exports trigger a warning).
export const runtime = 'nodejs'
export const alt = 'Badzi — GitHub README Badge & Profile View Counter'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#0D1117',
          color: '#E6EDF3',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 48 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: 72,
              borderRadius: 18,
              background: '#E6EDF3',
              color: '#0D1117',
              fontSize: 44,
              fontWeight: 800,
            }}
          >
            B
          </div>
          <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.02em' }}>Badzi</div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 78,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
          }}
        >
          <span>Your README</span>
          <span>has visitors.</span>
        </div>

        <div style={{ display: 'flex', marginTop: 32, fontSize: 32, color: '#8B949E' }}>
          Live view-counter badges for your GitHub README &amp; profile.
        </div>

        <div style={{ display: 'flex', marginTop: 44 }}>
          <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', fontSize: 26 }}>
            <div style={{ background: '#3A3A3A', color: '#fff', padding: '14px 20px' }}>Views</div>
            <div style={{ background: '#007EC6', color: '#fff', padding: '14px 20px' }}>1.2k</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
