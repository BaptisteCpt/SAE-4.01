import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Page from '/app/page.jsx'
import { useRouter } from 'next/navigation';


jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
  }));

// Pour acceder à la route
const pushMock = jest.fn();
useRouter.mockReturnValue({ push: pushMock });
 
describe('Page de connexion', () => {

    // Test identifiants Invalides
    test("affiche un message d'erreur si identifiants invalides", async() => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ error: "Identifiants invalides" })
          })
        );

        render(<Page />);

        // Rempli les champs identifiants et mot de passe avec des valeurs de tests
        fireEvent.change(screen.getByPlaceholderText(/Votre Identifiant.../i), {
          target: { value: "fakeUser" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Votre mot de passe.../i), {
          target: { value: "wrongpass" },
        });

        // Simule un click sur le bouton connexion
        fireEvent.click(screen.getByRole("button", { name: /Connexion/i }));

        // On espère avoir le text dans le document
        expect(await screen.findByText(/identifiants invalides/i)).toBeInTheDocument();        
    });


    // Test Mot de passe vide
    test("affiche un message d'erreur si mot de passe vide", async() => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ error: "Identifiants invalides" })
          })
        );
        render(<Page />);

        // Rempli les champs identifiants et mot de passe avec des valeurs de tests
        fireEvent.change(screen.getByPlaceholderText(/Votre Identifiant.../i), {
          target: { value: "fakeUser" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Votre mot de passe.../i), {
          target: { value: "" },
        });

        // Simule un click sur le bouton connexion
        fireEvent.click(screen.getByRole("button", { name: /Connexion/i }));

        // On espère avoir le text dans le document
        expect(await screen.findByText(/Veuillez entrer un Login ou Mot de passe/i)).toBeInTheDocument();  
    });

    // Test Login vide
    test("affiche un message d'erreur si Login vide", async() => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ error: "Identifiants invalides" })
          })
        );

        render(<Page />);

        // Rempli les champs identifiants et mot de passe avec des valeurs de tests
        fireEvent.change(screen.getByPlaceholderText(/Votre Identifiant.../i), {
          target: { value: "" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Votre mot de passe.../i), {
          target: { value: "wrongpass" },
        });

        // Simule un click sur le bouton connexion
        fireEvent.click(screen.getByRole("button", { name: /Connexion/i }));

        // On espère avoir le text dans le document
        expect(await screen.findByText(/Veuillez entrer un Login ou Mot de passe/i)).toBeInTheDocument();
    });

    // Test Login et Mot de passe correct
    test("Redirige sur la page acceuil", async () => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
          })
        );

        render(<Page />);

        // Rempli les champs identifiants et mot de passe avec des valeurs de tests
        fireEvent.change(screen.getByPlaceholderText(/Votre Identifiant.../i), {
          target: { value: "admin" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Votre mot de passe.../i), {
          target: { value: "admin" },
        });

        // Simule un click sur le bouton connexion
        fireEvent.click(screen.getByRole("button", { name: /Connexion/i }));
        
        // On attends de voir si la redirection se fait
        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith("/accueil_admin"); // Vérifie que la redirection a eu lieu
          });
    });
})