import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#8c4f63",
        borderRadius: 96,
        fontFamily: "serif",
        fontStyle: "italic",
        fontSize: 300,
        color: "#ffffff",
      }}
    >
      M
    </div>,
    { ...size },
  );
}
