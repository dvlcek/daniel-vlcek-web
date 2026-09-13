import {
  ImageResponse,
} from "next/og";

export const socialImageSize = {
  width: 1200,
  height: 630,
};

export function createSocialImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",

          display: "flex",
          flexDirection: "column",

          position: "relative",
          overflow: "hidden",

          padding: "72px 78px",

          background:
            "linear-gradient(135deg, #020608 0%, #061015 55%, #020608 100%)",

          color: "#ffffff",

          fontFamily:
            "Arial, Helvetica, sans-serif",
        }}
      >
        {/* AMBIENT ORANGE GLOW */}

        <div
          style={{
            position: "absolute",

            right: "-140px",
            bottom: "-190px",

            width: "560px",
            height: "560px",

            display: "flex",

            borderRadius: "999px",

            background:
              "rgba(255, 90, 31, 0.12)",
          }}
        />

        {/* TOP BRAND */}

        <div
          style={{
            display: "flex",
            alignItems: "center",

            gap: "15px",

            fontSize: "20px",
            fontWeight: 700,

            letterSpacing: "4px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",

              display: "flex",

              borderRadius: "999px",

              background: "#FF5A1F",
            }}
          />

          DANIEL VLKO
        </div>

        {/* MAIN CONTENT */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",

            marginTop: "auto",
            marginBottom: "auto",

            maxWidth: "960px",
          }}
        >
          <div
            style={{
              display: "flex",

              fontSize: "68px",
              fontWeight: 500,

              lineHeight: 1.04,

              letterSpacing: "-3px",
            }}
          >
            Software Developer
          </div>

          <div
            style={{
              display: "flex",

              marginTop: "6px",

              fontSize: "68px",
              fontWeight: 500,

              lineHeight: 1.04,

              letterSpacing: "-3px",

              color: "#FF6730",
            }}
          >
            &amp; Automation Architect
          </div>

          <div
            style={{
              display: "flex",

              marginTop: "32px",

              fontSize: "22px",
              fontWeight: 400,

              lineHeight: 1.5,

              color:
                "rgba(255,255,255,0.56)",
            }}
          >
            Custom software · Automation · AI systems · Digital platforms
          </div>
        </div>

        {/* BOTTOM */}

        <div
          style={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            fontSize: "17px",

            color:
              "rgba(255,255,255,0.38)",
          }}
        >
          <div
            style={{
              display: "flex",
            }}
          >
            Building systems for a more efficient tomorrow.
          </div>

          <div
            style={{
              display: "flex",

              color:
                "rgba(255,255,255,0.74)",
            }}
          >
            danielvlko.com
          </div>
        </div>
      </div>
    ),
    {
      ...socialImageSize,
    },
  );
}