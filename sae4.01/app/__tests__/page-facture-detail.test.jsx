import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import FactureDetail from "../components/FactureDetail.jsx";

describe("FactureDetail", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("affiche un état de chargement puis la facture", async () => {
    // On simule une réponse API valide contenant une facture complète.
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            nofacture: 12,
            datefacture: "2026-03-10",
            montantfacture: 1500,
            nbjourstravail: 4,
            noetape: 3,
            datereglfacture: null,
            nochantier: 18,
            etape_chantier: {
              etape: { nometape: "Peinture" },
              chantier: {
                adressechantier: "10 rue des tests",
                cpchantier: "75000",
                villechantier: "Paris",
              },
            },
          }),
      })
    );

    // On rend le composant avec un nofacture valide.
    render(<FactureDetail nofacture="12" />);

    // Résultat attendu immédiat : état de chargement affiché.
    expect(screen.getByText(/chargement/i)).toBeInTheDocument();
    // Résultat attendu après résolution fetch : les données facture apparaissent.
    expect(await screen.findByText("FACTURE")).toBeInTheDocument();
    expect(screen.getByText(/Total TTC/i)).toBeInTheDocument();
    // Résultat attendu : l'appel API contient le bon nofacture et credentials.
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/factures_by_num?nofacture=12",
      expect.objectContaining({ credentials: "include" })
    );
  });

  test("affiche un message d'accès refusé si API renvoie Interdit", async () => {
    // On simule une facture non autorisée pour l'utilisateur courant.
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Interdit" }),
      })
    );

    render(<FactureDetail nofacture="99" />);

    // Résultat attendu : le composant affiche un message d'accès refusé.
    expect(await screen.findByText(/accès refusé/i)).toBeInTheDocument();
  });

  test("affiche un message si nofacture manquant", async () => {
    // Cas bord : le composant est rendu sans numéro de facture exploitable.
    render(<FactureDetail nofacture="" />);

    // Résultat attendu : message d'erreur utilisateur (pas de crash).
    await waitFor(() => {
      expect(screen.getByText(/facture introuvable/i)).toBeInTheDocument();
    });
  });
});
