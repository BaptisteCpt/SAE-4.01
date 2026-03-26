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

import AjoutMoe from '../components/AjoutMOE.jsx'

beforeEach(() => {
  pushMock.mockClear()
  backMock.mockClear()
  fireMock.mockClear()

  global.fetch = jest.fn((url) => {
    if (url === '/api/cre_moe') {
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

describe('AjoutMoe', () => {
  test("affiche une alerte si les champs sont vides", async () => {
    render(<AjoutMoe />)

    fireEvent.click(screen.getByRole('button', { name: /Valider/i }))

    await waitFor(() => {
      expect(fireMock).toHaveBeenCalled()
    })
  })

  test("crée un maître d'oeuvre puis redirige", async () => {
    render(<AjoutMoe />)

    fireEvent.change(screen.getByPlaceholderText(/^Nom\.\.\.$/i), {
      target: { value: 'Bernard' },
    })
    fireEvent.change(screen.getByPlaceholderText(/^Prénom\.\.\.$/i), {
      target: { value: 'Luc' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Valider/i }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/cre_moe',
        expect.objectContaining({
          method: 'POST',
        })
      )
    })

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalled()
    })
  })

  test('revient en arrière avec Annuler', () => {
    render(<AjoutMoe />)

    fireEvent.click(screen.getByRole('button', { name: /Annuler/i }))

    expect(backMock).toHaveBeenCalled()
  })
})