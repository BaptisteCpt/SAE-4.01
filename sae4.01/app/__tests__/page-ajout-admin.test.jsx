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
}))

jest.mock('sweetalert2', () => ({
  fire: (...args) => fireMock(...args),
}))

import AjoutAdmin from '../components/AjoutAdmin.jsx'

beforeEach(() => {
  pushMock.mockClear()
  backMock.mockClear()
  fireMock.mockClear()

  global.fetch = jest.fn((url) => {
    if (url === '/api/cre_admin') {
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

describe('AjoutAdmin', () => {
  test('affiche une alerte si les champs sont vides', async () => {
    render(<AjoutAdmin />)

    fireEvent.click(screen.getByRole('button', { name: /Valider/i }))

    await waitFor(() => {
      expect(fireMock).toHaveBeenCalled()
    })
  })

  test("envoie le formulaire puis redirige", async () => {
    render(<AjoutAdmin />)

    fireEvent.change(screen.getByPlaceholderText(/^Nom\.\.\.$/i), {
      target: { value: 'Dupont' },
    })
    fireEvent.change(screen.getByPlaceholderText(/^Prénom\.\.\.$/i), {
      target: { value: 'Jean' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Valider/i }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/cre_admin',
        expect.objectContaining({
          method: 'POST',
        })
      )
    })

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalled()
    })
  })

  test('revient en arrière quand on clique sur Annuler', () => {
    render(<AjoutAdmin />)

    fireEvent.click(screen.getByRole('button', { name: /Annuler/i }))

    expect(backMock).toHaveBeenCalled()
  })
})