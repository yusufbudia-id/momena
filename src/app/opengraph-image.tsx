import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f6f3",
      }}
    >
      <div
        style={{
          fontFamily: "serif",
          fontStyle: "italic",
          fontSize: 96,
          color: "#211d1a",
        }}
      >
        Momena
      </div>
      <div style={{ fontSize: 28, color: "#6b6560", marginTop: 16 }}>
        Platform Undangan Digital
      </div>
    </div>,
    { ...size },
  );
}
