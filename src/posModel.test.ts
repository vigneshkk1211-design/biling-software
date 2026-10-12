import { describe, expect, it } from 'vitest'
import { calculateBill, createBillLine, DEFAULT_POS_DATA, emptyCustomisation, toPaise, validatePosData } from './posModel'

describe('POS bill engine', () => {
  it('uses integer paise for line snapshots and tax arithmetic', () => {
    const data = structuredClone(DEFAULT_POS_DATA)
    const product = data.products[0]
    const line = createBillLine(product, emptyCustomisation(product))
    product.basePricePaise = 30000
    data.settings.taxEnabled = true
    const totals = calculateBill([line], [], data.settings)
    expect(line.unitPricePaise).toBe(22000)
    expect(totals.subtotalPaise).toBe(22000)
    expect(totals.taxPaise).toBe(1100)
    expect(totals.totalPaise).toBe(23100)
    expect(toPaise(10.35)).toBe(1035)
  })

  it('applies the highest-priority qualifying scheme and respects a discount cap', () => {
    const data = structuredClone(DEFAULT_POS_DATA)
    const product = data.products[0]
    const line = createBillLine(product, emptyCustomisation(product))
    line.quantity = 2
    const totals = calculateBill([line], data.schemes, data.settings)
    expect(totals.discounts).toHaveLength(1)
    expect(totals.discounts[0].name).toBe('Scoop Pair')
    expect(totals.discountPaise).toBe(4400)
    data.schemes[0].maximumDiscountPaise = 1000
    expect(calculateBill([line], data.schemes, data.settings).discountPaise).toBe(1000)
  })

  it('calculates combo pricing on the selected bundle quantity', () => {
    const data = structuredClone(DEFAULT_POS_DATA)
    const scheme = data.schemes.find(item => item.kind === 'combo_price')!
    const sundae = data.products.find(item => item.id === 'rose-berry-sundae')!
    const shake = data.products.find(item => item.id === 'vanilla-milkshake')!
    const totals = calculateBill([createBillLine(sundae, emptyCustomisation(sundae)), createBillLine(shake, emptyCustomisation(shake))], [scheme], data.settings)
    expect(totals.discountPaise).toBe(9000)
    expect(totals.totalPaise).toBe(62000)
  })

  it('requires each selected product in a multi-product combo', () => {
    const data = structuredClone(DEFAULT_POS_DATA)
    const scheme = data.schemes.find(item => item.kind === 'combo_price')!
    const sundae = data.products.find(item => item.id === 'rose-berry-sundae')!
    const line = createBillLine(sundae, emptyCustomisation(sundae))
    line.quantity = 2
    expect(calculateBill([line], [scheme], data.settings).discountPaise).toBe(0)
  })

  it('only applies coupon and time-bound rules when their constraints are met', () => {
    const data = structuredClone(DEFAULT_POS_DATA)
    const product = data.products[0]
    const line = createBillLine(product, emptyCustomisation(product))
    const coupon = data.schemes.find(item => item.couponCode === 'SCOOP10')!
    expect(calculateBill([line], [coupon], data.settings).discountPaise).toBe(0)
    expect(calculateBill([line], [coupon], data.settings, new Date('2026-10-12T12:00:00'), 'scoop10').discountPaise).toBe(2200)
    const happyHour = { ...coupon, id: 'happy-hour', couponCode: '', kind: 'happy_hour' as const, value: 15, startsAt: '14:00', endsAt: '16:00' }
    expect(calculateBill([line], [happyHour], data.settings, new Date('2026-10-12T15:00:00')).discountPaise).toBe(3300)
    expect(calculateBill([line], [happyHour], data.settings, new Date('2026-10-12T17:00:00')).discountPaise).toBe(0)
  })

  it('rejects invalid product prices and scheme configurations before import', () => {
    const badPrice = structuredClone(DEFAULT_POS_DATA)
    badPrice.products[0].basePricePaise = -1
    expect(validatePosData(badPrice).ok).toBe(false)
    const badRule = structuredClone(DEFAULT_POS_DATA)
    badRule.schemes[0].value = 110
    expect(validatePosData(badRule).ok).toBe(false)
    expect(validatePosData(DEFAULT_POS_DATA).ok).toBe(true)
  })
})
