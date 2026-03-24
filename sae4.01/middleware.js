import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const PERMISSIONS = {
  "/accueil_admin": ["admin"],
  "/pageAdminChantier": ["admin"],
  "/pageAdminModel": ["admin"],
  "/pageAjoutAdmin": ["admin"],
  "/pageAjoutArti": ["admin"],
  "/pageAjoutCom": ["admin"],
  "/pageAjoutModel": ["admin"],
  "/pageAjoutMoe": ["admin"],
  "/pageListeModel": ["admin"],
  "/pageListeUtilisateurs": ["admin"],
  "/pageModifAdmin": ["admin"],
  "/pageModifArti": ["admin"],
  "/pageModifChantier": ["admin"],
  "/pageModifCom": ["admin"],
  "/pageModifModel": ["admin"],
  "/pageModifMoe": ["admin"],
  "/accueil_commerciale": ["commercial"],
  "/creation_de_chantier": ["commercial"],
  "/page_client": ["commercial"],
  "/page_model": ["maitre Oeuvre", "commercial"],
  "/accueil_maitre": ["maitre Oeuvre"],
  "/suivi": ["maitre Oeuvre"],
  "/personnalisation": ["maitre Oeuvre"],
  "/facture": ["maitre Oeuvre"],
  "/affectation": ["maitre Oeuvre"],
  "/AnalyseEtapes": ["maitre Oeuvre"],
  "/appel": ["maitre Oeuvre"],
  "/accueil_artisan": ["artisan"],
  "/generer_facture_artisan": ["artisan"],
  "/liste_chantiers_artisan": ["artisan"],
  "/voir_facture_artisan": ["artisan"],
};

export async function middleware(request) {
  const token = request.cookies.get("session")?.value;
  const pathname = request.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);

    const regle = Object.entries(PERMISSIONS).find(([route]) =>
      pathname.startsWith(route)
    );

    if (regle && !regle[1].includes(payload.role)) {
      const accueilParRole = {
        admin: "/accueil_admin",
        commercial: "/accueil_commerciale",
        "maitre Oeuvre": "/accueil_maitre",
        artisan: "/accueil_artisan",
      };

      const redirect = accueilParRole[payload.role] ?? "/";
      return NextResponse.redirect(new URL(redirect, request.url));
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-role", payload.role);
    requestHeaders.set("x-user-login", payload.login);
    requestHeaders.set("x-user-nom", payload.nom ?? "");
    requestHeaders.set("x-user-prenom", payload.prenom ?? "");

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch (err) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/accueil_admin",
    "/pageAdminChantier",
    "/pageAdminModel",
    "/pageAjoutAdmin",
    "/pageAjoutArti",
    "/pageAjoutCom",
    "/pageAjoutModel",
    "/pageAjoutMoe",
    "/pageListeModel",
    "/pageListeUtilisateurs",
    "/pageModifAdmin",
    "/pageModifArti",
    "/pageModifChantier",
    "/pageModifCom",
    "/pageModifModel",
    "/pageModifMoe",
    "/accueil_commerciale",
    "/creation_de_chantier",
    "/creation_de_chantier/:path+",
    "/page_client",
    "/page_model",
    "/accueil_maitre",
    "/suivi",
    "/personnalisation",
    "/facture",
    "/facture/:path+",
    "/affectation",
    "/AnalyseEtapes",
    "/appel",
    "/accueil_artisan",
    "/generer_facture_artisan",
    "/liste_chantiers_artisan",
    "/voir_facture_artisan",
    "/voir_facture_artisan/:path+",
  ],
};
