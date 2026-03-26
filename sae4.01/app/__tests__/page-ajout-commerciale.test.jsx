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

import AjoutCommerciale from '../components/AjoutCommerciale.jsx'

beforeEach(() => {
  pushMock.mockClear()
  backMock.mockClear()
  fireMock.mockClear()

  global.fetch = jest.fn((url) => {
    if (url === '/api/cre_commercial') {
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

describe('AjoutCommerciale', () => {
  test('affiche une alerte si les champs sont vides', async () => {
    render(<AjoutCommerciale />)

    fireEvent.click(screen.getByRole('button', { name: /Valider/i }))

    await waitFor(() => {
      expect(fireMock).toHaveBeenCalled()
    })
  })

  test('crée un commercial puis redirige', async () => {
    render(<AjoutCommerciale />)

    fireEvent.change(screen.getByPlaceholderText(/^Nom\.\.\.$/i), {
      target: { value: 'Martin' },
    })
    fireEvent.change(screen.getByPlaceholderText(/^Prénom\.\.\.$/i), {
      target: { value: 'Claire' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Valider/i }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/cre_commercial',
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
    render(<AjoutCommerciale />)

    fireEvent.click(screen.getByRole('button', { name: /Annuler/i }))

    expect(backMock).toHaveBeenCalled()
  })
})