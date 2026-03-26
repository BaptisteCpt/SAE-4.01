import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => ({
    get: () => 1,
  }),
}));


jest.mock("../../context/ChantierContext.jsx", () => ({
  useChantier: () => ({
    data: {
      nom: "",
      prenom: "",
      noclient: 1,
      adresse: "",
      ville: "",
      code_postal: "",
      adresse_du_chantier: "",
      villeChantier: "",
      code_postal_chantier: "",
      modele_maison: "",
    },
    setData: jest.fn(),
  }),
}));




import ClientForm from '../components/ClientForm.jsx';
import ChantierForm from '../components/ChantierForm.jsx';

beforeEach(() => {
  pushMock.mockClear();

  global.fetch = jest.fn((url) => {
    if (url === '/api/liste_maitre') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ nomoe: "dupont1", nommoe: "Dupont", prenommoe: "Jean" }]),
      });
    }
    if (url === '/api/modele_maison') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ nomodele: "modeleA", nommodele: "Modèle A" }]),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    });
  });
});



describe('Page de création de client', () => {
    test("affiche un message d'erreur si champs vide", async () => {
        render(<ClientForm />);

        fireEvent.change(screen.getByPlaceholderText(/^Nom.../i), { target: { value: "" }});
        fireEvent.change(screen.getByPlaceholderText(/Prénom.../i), { target: { value: "" }});
        fireEvent.change(screen.getByPlaceholderText(/Adresse.../i), { target: { value: "" }});
        fireEvent.change(screen.getByPlaceholderText(/Ville.../i), { target: { value: "" }});
        fireEvent.change(screen.getByPlaceholderText(/Code Postal.../i), { target: { value: "" }});

        fireEvent.click(screen.getByRole("button", { name: /Continuer/i }));

        expect(await screen.findByText(/Veuillez compléter les champs manquants/i)).toBeInTheDocument();   
    });
});

describe('Page de création du chantier', () => {
    test("affiche un message d'erreur si champs vide", async () => {
        render(<ChantierForm />);


        const adresseInput = await screen.findByPlaceholderText(/Adresse.../i);
        fireEvent.change(adresseInput, { target: { value: "" } });
        fireEvent.change(screen.getByPlaceholderText(/Ville.../i), { target: { value: "" }});
        fireEvent.change(screen.getByPlaceholderText(/Code Postal.../i), { target: { value: "" }});

        fireEvent.click(screen.getByRole("button", { name: /Finaliser la Création/i }));

        expect(await screen.findByText(/Veuillez compléter tous les champs manquants/i)).toBeInTheDocument();   
    });
});