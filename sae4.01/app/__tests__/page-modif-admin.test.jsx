import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

const pushMock = jest.fn()
const backMock = jest.fn()
const fireMock = jest.fn(() => Promise.resolve())

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    back: backMock,
  }),
  useSearchParams: () => ({
    get: (key) => {
      if (key === 'id') return '12'
      return null
    },
  }),
}))

jest.mock('sweetalert2', () => ({
  fire: (...args) => fireMock(...args),
}))

import ModifAdmin from '../components/ModifAdmin.jsx'

beforeEach(() => {
  pushMock.mockClear()
  backMock.mockClear()
  fireMock.mockClear()

  global.fetch = jest.fn((url) => {
    if (url === '/api/recup_un_admin') {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              nom: 'admin_test',
              mail: 'admin@test.fr',
            }),
        })
      }

    if (url === '/api/maj_admin') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    }

    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  })
})

describe('ModifAdmin', () => {
  test("charge les données existantes à l'ouverture", async () => {
    render(<ModifAdmin />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/recup_un_admin',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: '12' }),
        })
      )
    })

    const textboxes = screen.getAllByRole('textbox')
    const loginInput = textboxes[0]
    const mailInput = screen.getByPlaceholderText(/Veuillez entrez un nouveau mail/i)

    await waitFor(() => {
      expect(loginInput).toHaveValue('admin_test')
    })

    await waitFor(() => {
      expect(mailInput).toHaveValue('admin@test.fr')
    })
  })

  test('affiche une alerte si le mot de passe est vide', async () => {
    render(<ModifAdmin />)

    const textboxes = screen.getAllByRole('textbox')
    const loginInput = textboxes[0]

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/recup_un_admin',
        expect.any(Object)
      )
    })

    fireEvent.change(loginInput, { target: { value: 'admin_modifie' } })

    fireEvent.click(screen.getByRole('button', { name: /Enregistrer/i }))

    await waitFor(() => {
      expect(fireMock).toHaveBeenCalled()
    })
  })

  test("met à jour l'administrateur puis redirige", async () => {
    render(<ModifAdmin />)

    const textboxes = screen.getAllByRole('textbox')
    const loginInput = textboxes[0]
    const passwordInput = screen.getByPlaceholderText(/Veuillez entrez un nouveau mot de passe/i)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/recup_un_admin',
        expect.any(Object)
      )
    })

    fireEvent.change(loginInput, { target: { value: 'admin_ok' } })
    fireEvent.change(passwordInput, { target: { value: 'secret123' } })

    fireEvent.click(screen.getByRole('button', { name: /Enregistrer/i }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/maj_admin',
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        })
      )
    })

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalled()
    })
  })

  test('revient en arrière avec Annuler', () => {
    render(<ModifAdmin />)

    fireEvent.click(screen.getByRole('button', { name: /Annuler/i }))

    expect(backMock).toHaveBeenCalled()
  })
})