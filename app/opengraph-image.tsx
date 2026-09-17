import { ImageResponse } from "next/og";

export const alt = "Rechnungly — A4-Rechnung im Browser";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4efe6",
          color: "#1c1915",
          padding: 72,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, textTransform: "uppercase", color: "#2f4a3c" }}>
          Rechnungly
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 72, lineHeight: 1.05 }}>A4-Rechnung. Im Browser.</div>
          <div style={{ fontSize: 32, color: "#5c564c" }}>Für Freelancer in DE, AT und CH. Ohne Konto.</div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#2f4a3c" }}>PDF · USt./MWST-Chips · 9 EUR / 30 Tage</div>
      </div>
    ),
    { ...size },
  );
}
