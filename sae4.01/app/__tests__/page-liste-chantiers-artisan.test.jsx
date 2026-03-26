import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

import ListeChantiersArtisan from "../components/ListeChantiersArtisan.jsx";

describe("ListeChantiersArtisan", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("affiche le bouton voir facture quand nofacture existe", async () => {
    // On simule un chantier avec une étape qui possède déjà une facture.
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              nochantier: 1,
              adressechantier: "Rue A",
              cpchantier: "31000",
              villechantier: "Toulouse",
              datecreation: "2026-02-01",
              etapes: [
                {
                  noetape: 2,
                  nometape: "Peinture",
                  reservee: true,
                  nofacture: 42,
                },
              ],
            },
          ]),
      })
    );

    // On rend la liste pour un artisan.
    render(<ListeChantiersArtisan login="artisan1" />);

    // On ouvre la ligne chantier pour afficher les détails des étapes.
    const row = await screen.findByText("1");
    fireEvent.click(row.closest("tr"));

    // Le bouton "Voir la facture" doit être présent et naviguer vers la bonne URL.
    const voirBtn = await screen.findByRole("button", {
      name: /voir la facture/i,
    });
    fireEvent.click(voirBtn);

    // Résultat attendu : redirection vers la route de consultation artisan.
    expect(pushMock).toHaveBeenCalledWith("/voir_facture_artisan/42");
  });

  test("affiche le bouton créer facture quand nofacture est null", async () => {
    // On simule un chantier avec une étape sans facture.
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              nochantier: 9,
              adressechantier: "Rue B",
              cpchantier: "69000",
              villechantier: "Lyon",
              datecreation: "2026-02-10",
              etapes: [
                {
                  noetape: 5,
                  nometape: "Toiture",
                  reservee: false,
                  nofacture: null,
                },
              ],
            },
          ]),
      })
    );

    render(<ListeChantiersArtisan login="artisan2" />);

    // On déplie la ligne chantier pour voir le bouton d'action.
    const row = await screen.findByText("9");
    fireEvent.click(row.closest("tr"));

    // Le bouton "Créer la facture" doit renvoyer vers la page de création pré-remplie.
    const creerBtn = await screen.findByRole("button", {
      name: /créer la facture/i,
    });
    fireEvent.click(creerBtn);

    // Résultat attendu : URL avec chantier + étape en query params.
    expect(pushMock).toHaveBeenCalledWith(
      "/generer_facture_artisan?chantier=9&etape=5"
    );
  });
});
