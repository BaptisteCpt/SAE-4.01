import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import Swal from "sweetalert2";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const PERMISSIONS = {
  "/accueil_admin": ["admin"],
  "/accueil_commerciale": ["commercial"],
  "/creation_de_chantier": ["commercial"],
  "/page_client": ["commercial"],
  "/page_model": ["maitre Oeuvre", "commercial"],
  "/accueil_maitre": ["maitre Oeuvre"],
  "/suivi": ["maitre Oeuvre"],
  "/personnalisation": ["maitre Oeuvre"],
  "/facture": ["maitre Oeuvre"],
  "/artisan": ["maitre Oeuvre"],
  "/AnalyseEtapes": ["maitre Oeuvre"],
  "/appel": ["maitre Oeuvre"],
};

export async function middleware(request) {
  const token = request.cookies.get("session")?.value;
  const pathname = request.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);

    const regle = Object.entries(PERMISSIONS).find(([route]) =>
      pathname.startsWith(route)
    );

    if (regle && !regle[1].includes(payload.role)) {
      const accueilParRole = {
        "admin":        "/accueil_admin",
        "commercial":   "/accueil_commerciale",
        "maitre Oeuvre": "/accueil_maitre",
      };
    
      const redirect = accueilParRole[payload.role] ?? "/";
      return NextResponse.redirect(new URL(redirect, request.url));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/accueil_admin",
    "/accueil_commerciale",
    "/creation_de_chantier",
    "/page_client",
    "/page_model",
    "/accueil_maitre",
    "/suivi",
    "/personnalisation",
    "/facture",
    "/facture/:path+",
    "/artisan",
    "/AnalyseEtapes",
    "/appel",
  ],
};
