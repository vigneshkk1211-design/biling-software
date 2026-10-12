import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import App from './App'
import { PosProvider } from './PosContext'

const backing = new Map<string, string>()
const renderPos = () => render(<PosProvider><App /></PosProvider>)

beforeEach(() => {
  backing.clear()
  vi.stubGlobal('localStorage', { getItem: (key: string) => backing.get(key) ?? null, setItem: (key: string, value: string) => backing.set(key, value), clear: () => backing.clear() })
  Object.defineProperty(window, 'matchMedia', { configurable: true, value: () => ({ matches: true, addListener: vi.fn(), removeListener: vi.fn() }) })
})
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

describe('Ice cream POS counter', () => {
  it('customises a product and adds a paise-priced line to the active bill', () => {
    renderPos()
    fireEvent.click(screen.getByRole('button', { name: 'Customise Strawberry Cloud' }))
    fireEvent.click(screen.getByRole('button', { name: /Grande/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Choose 2 scoops' }))
    fireEvent.click(screen.getByRole('checkbox', { name: /Brownie bites/ }))
    fireEvent.click(screen.getByRole('button', { name: /Add to bill/ }))
    expect(screen.getAllByText('Strawberry Cloud').length).toBeGreaterThan(0)
    expect(document.body.textContent).toContain('Brownie bites')
    expect(document.body.textContent).toContain('480.00')
  })

  it('applies the eligible scoop scheme in deterministic order', () => {
    renderPos()
    fireEvent.click(screen.getByRole('button', { name: 'Quick add Strawberry Cloud' }))
    fireEvent.click(screen.getByRole('button', { name: 'Quick add Strawberry Cloud' }))
    expect(screen.getByText('Scoop Pair')).toBeTruthy()
    expect(document.body.textContent).toContain('44.00')
    expect(document.body.textContent).toContain('396.00')
  })

  it('holds a bill and resumes it without losing its number or customisations', () => {
    renderPos()
    fireEvent.click(screen.getByRole('button', { name: 'Quick add Strawberry Cloud' }))
    fireEvent.click(screen.getByRole('button', { name: 'Hold bill' }))
    expect(screen.getByText('SC-001002')).toBeTruthy()
    fireEvent.click(screen.getAllByRole('button', { name: /Held bills/ })[0])
    fireEvent.click(screen.getByRole('button', { name: /Resume/ }))
    expect(screen.getByText('SC-001001')).toBeTruthy()
    expect(screen.getAllByText('Strawberry Cloud').length).toBeGreaterThan(0)
  })

  it('blocks insufficient cash and produces a local receipt after a valid demo payment', () => {
    renderPos()
    fireEvent.click(screen.getByRole('button', { name: 'Quick add Strawberry Cloud' }))
    fireEvent.click(screen.getByRole('button', { name: 'Proceed to payment' }))
    fireEvent.change(screen.getByLabelText('AMOUNT RECEIVED'), { target: { value: '100' } })
    expect((screen.getByRole('button', { name: 'Confirm demo payment' }) as HTMLButtonElement).disabled).toBe(true)
    fireEvent.change(screen.getByLabelText('AMOUNT RECEIVED'), { target: { value: '500' } })
    expect(document.body.textContent).toContain('280.00')
    fireEvent.click(screen.getByRole('button', { name: 'Confirm demo payment' }))
    expect(screen.getByRole('dialog', { name: 'Receipt SC-001001' })).toBeTruthy()
    expect(document.body.textContent).toContain('NOT A STATUTORY TAX INVOICE')
    expect(screen.getByText('SC-001002')).toBeTruthy()
  })

  it('uses a safe simulated UPI flow with no provider screen or card inputs', () => {
    renderPos()
    fireEvent.click(screen.getByRole('button', { name: 'Quick add Pistachio Dream' }))
    fireEvent.click(screen.getByRole('button', { name: 'Proceed to payment' }))
    fireEvent.click(screen.getByRole('button', { name: /UPI/ }))
    expect(screen.getByText(/No QR code or payment provider is connected/)).toBeTruthy()
    expect(screen.queryByLabelText(/card number/i)).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Confirm demo payment' }))
    expect(screen.getByRole('dialog', { name: 'Receipt SC-001001' })).toBeTruthy()
  })

  it('edits a product price without changing a line already added to the bill', () => {
    renderPos()
    fireEvent.click(screen.getByRole('button', { name: 'Quick add Strawberry Cloud' }))
    fireEvent.click(screen.getByRole('button', { name: 'Product Management' }))
    fireEvent.click(screen.getByRole('button', { name: 'Edit Strawberry Cloud' }))
    fireEvent.change(screen.getByLabelText('Base price / INR'), { target: { value: '300' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save product' }))
    fireEvent.click(screen.getByRole('button', { name: 'New Bill' }))
    expect(document.body.textContent).toContain('220.00')
    fireEvent.click(screen.getByRole('button', { name: 'Quick add Strawberry Cloud' }))
    expect(document.body.textContent).toContain('300.00')
  })

  it('saves appearance and POS draft data to browser-local storage', () => {
    renderPos()
    fireEvent.click(screen.getByRole('button', { name: 'Admin Settings' }))
    fireEvent.change(screen.getByLabelText('Shop display name'), { target: { value: 'Vanilla Room' } })
    fireEvent.click(screen.getByRole('button', { name: 'New Bill' }))
    fireEvent.click(screen.getByRole('button', { name: 'Quick add Strawberry Cloud' }))
    const saved = JSON.parse(backing.get('scoop-co-pos-demo-v1') || '{}')
    expect(saved.settings.shopName).toBe('Vanilla Room')
    expect(saved.draftBill.lines).toHaveLength(1)
  })

  it('shows the active scheme editor and lets the operator disable a scheme', () => {
    renderPos()
    fireEvent.click(screen.getByRole('button', { name: 'Offers & Schemes' }))
    const card = screen.getByText('Scoop Pair').closest('article')
    if (!card) throw new Error('Scheme card missing')
    fireEvent.click(within(card).getByRole('checkbox'))
    expect(screen.getByText('3 ACTIVE / 4 TOTAL')).toBeTruthy()
  })

  it('validates a coupon before including its percentage discount', () => {
    renderPos()
    fireEvent.click(screen.getByRole('button', { name: 'Quick add Strawberry Cloud' }))
    fireEvent.change(screen.getByLabelText('Demo coupon code'), { target: { value: 'scoop10' } })
    fireEvent.click(screen.getByRole('button', { name: 'APPLY' }))
    expect(document.body.textContent).toContain('198.00')
    expect(document.body.textContent).toContain('SCOOP10 welcome coupon')
  })

  it('shows the active bill on the in-app customer display', () => {
    renderPos()
    fireEvent.click(screen.getByRole('button', { name: 'Quick add Strawberry Cloud' }))
    fireEvent.click(screen.getByRole('button', { name: 'Customer Display' }))
    expect(document.body.textContent).toContain('YOUR SCOOP / BILL SC-001001')
    expect(document.body.textContent).toContain('220.00')
  })

  it('updates stock and the kitchen queue after one completed demo sale', () => {
    renderPos()
    fireEvent.click(screen.getByRole('button', { name: 'Quick add Strawberry Cloud' }))
    fireEvent.click(screen.getByRole('button', { name: 'Proceed to payment' }))
    fireEvent.change(screen.getByLabelText('AMOUNT RECEIVED'), { target: { value: '500' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirm demo payment' }))
    fireEvent.click(screen.getByRole('button', { name: 'Start new bill' }))
    fireEvent.click(screen.getByRole('button', { name: 'Inventory' }))
    const strawberryRow = screen.getAllByText('Strawberry Cloud').find(item => item.closest('.inventory-list'))?.closest('article')
    expect(strawberryRow?.textContent).toContain('39')
    fireEvent.click(screen.getByRole('button', { name: 'Kitchen' }))
    fireEvent.click(screen.getByRole('button', { name: 'Start preparing' }))
    expect(document.body.textContent).toContain('Preparing')
  })

  it('earns local loyalty points and applies a reward to a later bill', () => {
    renderPos()
    fireEvent.click(screen.getByRole('button', { name: 'Quick add Birthday Cake' }))
    fireEvent.change(screen.getByPlaceholderText('Walk-in guest'), { target: { value: 'Mira' } })
    fireEvent.click(screen.getByRole('button', { name: 'Proceed to payment' }))
    fireEvent.change(screen.getByLabelText('AMOUNT RECEIVED'), { target: { value: '1500' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirm demo payment' }))
    fireEvent.click(screen.getByRole('button', { name: 'Start new bill' }))
    fireEvent.click(screen.getByRole('button', { name: 'Quick add Strawberry Cloud' }))
    fireEvent.change(screen.getByPlaceholderText('Walk-in guest'), { target: { value: 'Mira' } })
    fireEvent.click(screen.getByRole('button', { name: /Use up to 10 rewards points/ }))
    expect(document.body.textContent).toContain('210.00')
  })

  it('blocks demo payment for an item made unavailable after adding it', () => {
    renderPos()
    fireEvent.click(screen.getByRole('button', { name: 'Quick add Strawberry Cloud' }))
    fireEvent.click(screen.getByRole('button', { name: 'Product Management' }))
    const productRow = screen.getByText('Strawberry Cloud').closest('article')
    if (!productRow) throw new Error('Product row missing')
    fireEvent.click(within(productRow).getByRole('button', { name: 'Available' }))
    fireEvent.click(screen.getByRole('button', { name: 'New Bill' }))
    fireEvent.click(screen.getByRole('button', { name: 'Proceed to payment' }))
    fireEvent.change(screen.getByLabelText('AMOUNT RECEIVED'), { target: { value: '500' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirm demo payment' }))
    expect(screen.queryByRole('dialog', { name: 'Receipt SC-001001' })).toBeNull()
    expect(document.body.textContent).toContain('Remove unavailable or deleted items')
  })
})
