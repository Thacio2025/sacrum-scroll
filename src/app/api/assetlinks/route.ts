import { NextResponse } from "next/server";

/**
 * Digital Asset Links para TWA (Trusted Web Activity).
 * Android usa isso para verificar que o app da Play Store pode abrir sacrumscroll.com.
 * Defina no Netlify (ou .env.local):
 *   TWA_PACKAGE_NAME = package do app Android (ex: com.sacrumscroll.app)
 *   TWA_SHA256_FINGERPRINTS = fingerprint(s) separados por vírgula (ex: AA:BB:...)
 * Depois de rodar "bubblewrap init" e "bubblewrap build", use o fingerprint do keystore.
 */
export async function GET() {
  const packageName = process.env.TWA_PACKAGE_NAME;
  const fingerprints = process.env.TWA_SHA256_FINGERPRINTS;

  if (!packageName || !fingerprints) {
    return NextResponse.json([], {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  const sha256List = fingerprints.split(",").map((s) => s.trim()).filter(Boolean);
  const statement = {
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: packageName,
      sha256_cert_fingerprints: sha256List,
    },
  };

  return NextResponse.json([statement], {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
