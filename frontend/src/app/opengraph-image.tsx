import { ImageResponse } from "next/og";

// Static social-share card (LinkedIn / X / Slack previews).
export const alt = "VeriSpin — Provably Fair On-Chain Lottery";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0c0a09",
          backgroundImage:
            "radial-gradient(circle at 0% 100%, rgba(245,158,11,0.28), transparent 45%), radial-gradient(circle at 100% 0%, rgba(244,63,94,0.28), transparent 45%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #f59e0b, #f43f5e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "34px",
            }}
          >
            🎯
          </div>
          <div style={{ display: "flex", fontSize: "34px", fontWeight: 800, color: "#fff" }}>
            Veri<span style={{ color: "#fbbf24" }}>Spin</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "76px",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.05,
            letterSpacing: "-2px",
          }}
        >
          <span>Provably fair draws,</span>
          <span style={{ color: "#fb7185" }}>verifiably random.</span>
        </div>

        <div style={{ display: "flex", fontSize: "30px", color: "#94a3b8", marginTop: "36px" }}>
          A decentralized lottery powered by Chainlink VRF V2.5
        </div>

        <div style={{ display: "flex", gap: "16px", marginTop: "44px" }}>
          {["Next.js", "ethers.js", "Chainlink VRF", "Ethereum Sepolia"].map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#cbd5e1",
                fontSize: "24px",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
