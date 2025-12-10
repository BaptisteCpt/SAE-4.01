import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Page from '../creation_de_chantier/page.jsx'
import Page2 from '../creation_de_chantier/crea_chantier/page.jsx'


const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

beforeEach(() => {
  pushMock.mockClear();
  global.fetch = jest.fn();
});

describe('Page de création de client', () => {
    test("affiche un message d'erreur si champs vide", async () => {
        render(<Page />);

        fireEvent.change(screen.getByPlaceholderText(/Nom.../i), { target: { value: "" }});
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
        render(<Page2 />);

        fireEvent.change(screen.getByPlaceholderText(/Adresse.../i), { target: { value: "" }});
        fireEvent.change(screen.getByPlaceholderText(/Ville.../i), { target: { value: "" }});
        fireEvent.change(screen.getByPlaceholderText(/Code Postal.../i), { target: { value: "" }});

        fireEvent.click(screen.getByRole("button", { name: /Finaliser la Création/i }));

        expect(await screen.findByText(/Veuillez compléter les champs manquants/i)).toBeInTheDocument();   
    });
});