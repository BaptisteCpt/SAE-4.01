import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import SearchableSelect from '../components/SearchableSelect.jsx'

describe('SearchableSelect', () => {
  const options = [
    { id: 1, label: 'Dupont Jean' },
    { id: 2, label: 'Martin Claire' },
    { id: 3, label: 'Bernard Luc' },
  ]

  test('filtre les options à la saisie', async () => {
    const onChangeMock = jest.fn()

    render(
      <SearchableSelect
        options={options}
        value=""
        onChange={onChangeMock}
        getOptionValue={(option) => option.id}
        getOptionLabel={(option) => option.label}
        placeholder="Choisir..."
      />
    )

    const input = screen.getByPlaceholderText(/Choisir.../i)

    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'mart' } })

    expect(await screen.findByText('Martin Claire')).toBeInTheDocument()
    expect(screen.queryByText('Dupont Jean')).not.toBeInTheDocument()
  })

  test('appelle onChange quand on sélectionne une option', async () => {
    const onChangeMock = jest.fn()

    render(
      <SearchableSelect
        options={options}
        value=""
        onChange={onChangeMock}
        getOptionValue={(option) => option.id}
        getOptionLabel={(option) => option.label}
        placeholder="Choisir..."
      />
    )

    const input = screen.getByPlaceholderText(/Choisir.../i)

    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'dup' } })

    fireEvent.mouseDown(await screen.findByText('Dupont Jean'))

    expect(onChangeMock).toHaveBeenCalledWith(1)
  })

  test('affiche "Aucun résultat" si aucune option ne correspond', async () => {
    const onChangeMock = jest.fn()

    render(
      <SearchableSelect
        options={options}
        value=""
        onChange={onChangeMock}
        getOptionValue={(option) => option.id}
        getOptionLabel={(option) => option.label}
        placeholder="Choisir..."
      />
    )

    const input = screen.getByPlaceholderText(/Choisir.../i)

    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'zzz' } })

    expect(await screen.findByText('Aucun résultat')).toBeInTheDocument()
  })
})