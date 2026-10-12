export type PosCategory = { id: string; name: string; color: string; order: number }
export type AddOn = { id: string; name: string; pricePaise: number; enabled: boolean }
export type ProductSize = { id: string; name: string; surchargePaise: number; enabled: boolean }
export type PosProduct = {
  id: string; name: string; sku: string; description: string; image: string; categoryId: string; basePricePaise: number; extraScoopPricePaise: number
  sizes: ProductSize[]; flavours: string[]; servings: string[]; toppings: AddOn[]; sauces: AddOn[]; extras: AddOn[]
  available: boolean; featured: boolean; badge: string; stockTracking: boolean; stockQty: number; lowStockThreshold: number
}
export type SchemeKind = 'percent' | 'fixed' | 'buy_x_get_y' | 'combo_price' | 'quantity_percent' | 'happy_hour'
export type Scheme = {
  id: string; name: string; description: string; kind: SchemeKind; value: number; enabled: boolean
  productIds: string[]; categoryIds: string[]; minimumSubtotalPaise: number; buyQty: number; getQty: number
  comboPricePaise: number; maximumDiscountPaise: number; startsOn: string; endsOn: string; priority: number; stackable: boolean
  couponCode?: string; startsAt?: string; endsAt?: string
}
export type PosSettings = {
  shopName: string; logoText: string; contact: string; currency: 'INR'; taxEnabled: boolean; taxRateBps: number
  receiptFooter: string; theme: 'chocolate' | 'vanilla' | 'berry'; accent: string
  motion: 'restrained' | 'expressive'; cardStyle: 'editorial' | 'compact'; density: 'comfortable' | 'compact'
  inventoryEnabled: boolean; loyaltyEnabled: boolean; pointsPer100Paise: number
  defaultOrderType: 'Dine In' | 'Takeaway'; menuHeadline: string; menuSubtitle: string
}
export type Customisation = { flavour: string; serving: string; size: string; scoops: number; addons: AddOn[]; note: string }
export type BillLine = {
  id: string; productId: string; name: string; image: string; categoryId: string; quantity: number
  options: Customisation; unitPricePaise: number; snapshotCreatedAt: string
}
export type BillTotals = { subtotalPaise: number; discounts: Array<{ schemeId: string; name: string; amountPaise: number; detail: string }>; discountPaise: number; taxPaise: number; totalPaise: number }
export type ReceiptLine = { name: string; quantity: number; options: string[]; unitPricePaise: number; lineTotalPaise: number }
export type CompletedBill = {
  id: string; billNumber: string; completedAt: string; shopName: string; contact: string; customerName: string
  lines: ReceiptLine[]; totals: BillTotals; paymentMethod: 'Cash' | 'UPI' | 'Card'; tenderedPaise?: number; changePaise?: number; receiptFooter: string
  orderType: 'Dine In' | 'Takeaway'; kitchenStatus: 'New' | 'Preparing' | 'Ready' | 'Completed'; paymentReference: string
}
export type HeldBill = { id: string; billNumber: string; heldAt: string; customerName: string; lines: BillLine[] }
export type InventoryMovement = { id: string; productId: string; productName: string; delta: number; reason: string; createdAt: string }
export type LoyaltyCustomer = { id: string; name: string; phone: string; points: number; lastVisit: string }
export type DraftBill = { billNumber: string; customerName: string; lines: BillLine[] }
export type PosData = { version: 1; products: PosProduct[]; categories: PosCategory[]; schemes: Scheme[]; settings: PosSettings; heldBills: HeldBill[]; history: CompletedBill[]; draftBill: DraftBill; nextBillNumber: number; inventoryMovements: InventoryMovement[]; loyaltyCustomers: LoyaltyCustomer[] }

const images = {
  strawberry: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=1100&q=85',
  chocolate: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1100&q=85',
  pistachio: 'https://images.unsplash.com/photo-1501446529957-6226bd447c46?auto=format&fit=crop&w=1100&q=85',
  cone: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=1100&q=85',
  sundae: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?auto=format&fit=crop&w=1100&q=85',
  shake: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=1100&q=85',
  cake: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1100&q=85',
}
const categories: PosCategory[] = [
  { id: 'single', name: 'Single Scoops', color: '#f1c1b8', order: 0 },
  { id: 'double', name: 'Double & Triple', color: '#dcb9a1', order: 1 },
  { id: 'cups-cones', name: 'Cups & Cones', color: '#d8e2c7', order: 2 },
  { id: 'sundaes', name: 'Sundaes', color: '#e9b9c8', order: 3 },
  { id: 'shakes', name: 'Milkshakes', color: '#d7c3a6', order: 4 },
  { id: 'cakes', name: 'Ice Cream Cakes', color: '#e5d6b9', order: 5 },
  { id: 'family', name: 'Family Packs', color: '#c5d5c6', order: 6 },
  { id: 'combos', name: 'Combos', color: '#edc5aa', order: 7 },
]
const sizes = (): ProductSize[] => [
  { id: 'petite', name: 'Petite', surchargePaise: 0, enabled: true },
  { id: 'classic', name: 'Classic', surchargePaise: 8000, enabled: true },
  { id: 'grande', name: 'Grande', surchargePaise: 16000, enabled: true },
]
const extras = (): { toppings: AddOn[]; sauces: AddOn[]; extras: AddOn[] } => ({
  toppings: [{ id: 'brownie', name: 'Brownie bites', pricePaise: 4000, enabled: true }, { id: 'almonds', name: 'Toasted almonds', pricePaise: 3000, enabled: true }, { id: 'berry', name: 'Fresh berries', pricePaise: 4500, enabled: true }],
  sauces: [{ id: 'choc-sauce', name: 'Dark chocolate sauce', pricePaise: 2500, enabled: true }, { id: 'caramel', name: 'Salted caramel', pricePaise: 2500, enabled: true }, { id: 'coulis', name: 'Berry coulis', pricePaise: 3000, enabled: true }],
  extras: [{ id: 'wafer', name: 'Waffle wafer', pricePaise: 3500, enabled: true }, { id: 'cream', name: 'Whipped cream', pricePaise: 3000, enabled: true }],
})
const flavours = ['Madagascar Vanilla', 'Strawberry Cloud', 'Midnight Chocolate', 'Pistachio Dream', 'Salted Caramel', 'Mango Sorbet']
const product = (id: string, name: string, description: string, image: string, categoryId: string, price: number, badge = '', servings = ['Cup', 'Cone']): PosProduct => ({
  id, name, sku: id.toUpperCase(), description, image, categoryId, basePricePaise: price * 100, extraScoopPricePaise: 6000, sizes: sizes(), flavours: [...flavours], servings,
  ...extras(), available: true, featured: ['strawberry-cloud', 'pistachio-dream', 'rose-berry-sundae'].includes(id), badge, stockTracking: true, stockQty: 40, lowStockThreshold: 8,
})

export const DEFAULT_POS_DATA: PosData = {
  version: 1,
  categories,
  products: [
    product('strawberry-cloud', 'Strawberry Cloud', 'Strawberry, vanilla bean & a little daydream.', images.strawberry, 'single', 220, 'Bestseller'),
    product('midnight-chocolate', 'Midnight Chocolate', 'Deep cocoa with brownie pieces and fudge.', images.chocolate, 'double', 240, 'House favourite'),
    product('pistachio-dream', 'Pistachio Dream', 'Pistachio cream, toasted nuts, soft crunch.', images.pistachio, 'single', 260, 'Staff pick'),
    product('honeycomb-crunch', 'Honeycomb Crunch Cone', 'Golden honeycomb, salted caramel ribbons.', images.cone, 'cups-cones', 265, 'Just arrived', ['Cone']),
    product('rose-berry-sundae', 'Rose & Berry Sundae', 'Berry compote, vanilla scoops, pink petals.', images.sundae, 'sundaes', 390, 'Signature', ['Glass sundae cup']),
    product('vanilla-milkshake', 'Vanilla Bean Shake', 'Thick, dreamy and finished with a cloud.', images.shake, 'shakes', 320, '', ['Tall glass']),
    product('birthday-cake', 'Birthday Cake', 'Vanilla layers, berry ribbons, candles optional.', images.cake, 'cakes', 1450, 'Celebration', ['Whole cake']),
    product('happy-box', 'The Happy Family Box', 'Four scoops, two sauces, a box full of good.', images.strawberry, 'family', 890, 'For sharing', ['Family box']),
    product('waffle-scoop-combo', 'Waffle & a Scoop', 'One warm waffle, one happy scoop.', images.cone, 'combos', 360, 'Combo', ['Waffle plate']),
  ],
  schemes: [
    { id: 'scoop-pair', name: 'Scoop Pair', description: 'Buy two scoops and save on the pair.', kind: 'percent', value: 10, enabled: true, productIds: [], categoryIds: ['single', 'double', 'cups-cones'], minimumSubtotalPaise: 40000, buyQty: 2, getQty: 0, comboPricePaise: 0, maximumDiscountPaise: 12000, startsOn: '', endsOn: '', priority: 1, stackable: false },
    { id: 'sundae-shake', name: 'Sundae + Shake', description: 'A little something to sip with your sundae.', kind: 'combo_price', value: 0, enabled: true, productIds: ['rose-berry-sundae', 'vanilla-milkshake'], categoryIds: [], minimumSubtotalPaise: 0, buyQty: 2, getQty: 0, comboPricePaise: 62000, maximumDiscountPaise: 0, startsOn: '', endsOn: '', priority: 2, stackable: false },
    { id: 'family-treat', name: 'Family Table Treat', description: 'Buy one family box, get a second eligible box free.', kind: 'buy_x_get_y', value: 0, enabled: true, productIds: ['happy-box'], categoryIds: [], minimumSubtotalPaise: 0, buyQty: 1, getQty: 1, comboPricePaise: 0, maximumDiscountPaise: 0, startsOn: '', endsOn: '', priority: 3, stackable: false },
    { id: 'scoop10-coupon', name: 'SCOOP10 welcome coupon', description: 'Take 10% off a qualifying demo bill with coupon code SCOOP10.', kind: 'percent', value: 10, enabled: true, productIds: [], categoryIds: [], minimumSubtotalPaise: 0, buyQty: 1, getQty: 0, comboPricePaise: 0, maximumDiscountPaise: 10000, startsOn: '', endsOn: '', priority: 4, stackable: true, couponCode: 'SCOOP10' },
  ],
  settings: {
    shopName: 'Scoop POS', logoText: 'SCOOP', contact: 'demo@scooppos.example', currency: 'INR', taxEnabled: false, taxRateBps: 500,
    receiptFooter: 'Thank you for making our day a little sweeter.', theme: 'chocolate', accent: '#c67d72', motion: 'restrained', cardStyle: 'editorial', density: 'comfortable', inventoryEnabled: true, loyaltyEnabled: true, pointsPer100Paise: 1, defaultOrderType: 'Takeaway', menuHeadline: 'A little happiness in every scoop.', menuSubtitle: 'Made for the moments that deserve something sweet.',
  },
  heldBills: [], history: [], inventoryMovements: [], loyaltyCustomers: [], draftBill: { billNumber: 'SC-001001', customerName: '', lines: [] }, nextBillNumber: 1001,
}

export const makeId = (prefix: string) => `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`}`
export const toPaise = (rupees: number) => Math.round(rupees * 100)
export const money = (paise: number, currency: string = 'INR') => new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 2 }).format(paise / 100)
export const validImageUrl = (value: unknown): value is string => {
  if (typeof value !== 'string' || !value.trim()) return false
  try { const url = new URL(value); return url.protocol === 'https:' || url.protocol === 'http:' } catch { return false }
}
const percentDiscount = (amount: number, percent: number) => Math.floor((amount * Math.round(percent * 100) + 5000) / 10000)
const isActive = (scheme: Scheme, today: string, time: string) => scheme.enabled && (!scheme.startsOn || today >= scheme.startsOn) && (!scheme.endsOn || today <= scheme.endsOn) && (scheme.kind !== 'happy_hour' || ((!scheme.startsAt || time >= scheme.startsAt) && (!scheme.endsAt || time <= scheme.endsAt)))
const appliesTo = (scheme: Scheme, line: BillLine) => (!scheme.productIds.length || scheme.productIds.includes(line.productId)) && (!scheme.categoryIds.length || scheme.categoryIds.includes(line.categoryId))

export function calculateBill(lines: BillLine[], schemes: Scheme[], settings: PosSettings, at = new Date(), couponCode = '', loyaltyDiscountPaise = 0): BillTotals {
  const subtotalPaise = lines.reduce((sum, line) => sum + line.unitPricePaise * line.quantity, 0)
  const today = `${at.getFullYear()}-${String(at.getMonth() + 1).padStart(2, '0')}-${String(at.getDate()).padStart(2, '0')}`
  const discounts: BillTotals['discounts'] = []
  let remainingPaise = subtotalPaise
  const time = `${String(at.getHours()).padStart(2, '0')}:${String(at.getMinutes()).padStart(2, '0')}`
  const ordered = schemes.filter(scheme => isActive(scheme, today, time) && subtotalPaise >= scheme.minimumSubtotalPaise && (!scheme.couponCode || scheme.couponCode.trim().toUpperCase() === couponCode.trim().toUpperCase())).sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id))
  for (const scheme of ordered) {
    const eligible = lines.filter(line => appliesTo(scheme, line))
    const eligibleGross = eligible.reduce((sum, line) => sum + line.unitPricePaise * line.quantity, 0)
    const quantity = eligible.reduce((sum, line) => sum + line.quantity, 0)
    let discount = 0
    let detail = ''
    if (!eligible.length || remainingPaise <= 0) continue
    switch (scheme.kind) {
      case 'percent': case 'happy_hour':
        discount = percentDiscount(eligibleGross, scheme.value); detail = scheme.kind === 'happy_hour' ? `${scheme.value}% happy-hour offer` : `${scheme.value}% off eligible items`; break
      case 'quantity_percent':
        if (quantity >= Math.max(1, scheme.buyQty)) discount = percentDiscount(eligibleGross, scheme.value)
        detail = `${scheme.value}% off at ${scheme.buyQty}+ eligible item${scheme.buyQty === 1 ? '' : 's'}`; break
      case 'fixed': discount = toPaise(scheme.value); detail = `${money(discount)} off eligible items`; break
      case 'buy_x_get_y': {
        const group = scheme.buyQty + scheme.getQty
        const freeCount = group > 0 ? Math.floor(quantity / group) * scheme.getQty : 0
        const cheapest = eligible.flatMap(line => Array.from({ length: line.quantity }, () => line.unitPricePaise)).sort((a, b) => a - b).slice(0, freeCount).reduce((sum, price) => sum + price, 0)
        discount = cheapest; detail = `Buy ${scheme.buyQty}, get ${scheme.getQty} eligible item${scheme.getQty === 1 ? '' : 's'}`; break
      }
      case 'combo_price': {
        const unitPrices = (productId: string) => eligible.filter(line => line.productId === productId).flatMap(line => Array.from({ length: line.quantity }, () => line.unitPricePaise)).sort((a, b) => b - a)
        const perProduct = Math.ceil(scheme.buyQty / scheme.productIds.length)
        const units = scheme.productIds.length > 1
          ? Math.min(...scheme.productIds.map(productId => Math.floor(unitPrices(productId).length / Math.max(1, perProduct))))
          : scheme.buyQty > 0 ? Math.floor(quantity / scheme.buyQty) : 0
        const eligibleUnitPrices = scheme.productIds.length > 1
          ? scheme.productIds.flatMap(productId => unitPrices(productId).slice(0, units * perProduct))
          : eligible.flatMap(line => Array.from({ length: line.quantity }, () => line.unitPricePaise)).sort((a, b) => b - a).slice(0, units * scheme.buyQty)
        const selectedGross = eligibleUnitPrices.reduce((sum, price) => sum + price, 0)
        discount = Math.max(0, selectedGross - units * scheme.comboPricePaise); detail = `${units} bundle${units === 1 ? '' : 's'} at ${money(scheme.comboPricePaise)} each`; break
      }
    }
    if (scheme.maximumDiscountPaise > 0) discount = Math.min(discount, scheme.maximumDiscountPaise)
    discount = Math.max(0, Math.min(discount, eligibleGross, remainingPaise))
    if (!discount) continue
    discounts.push({ schemeId: scheme.id, name: scheme.name, amountPaise: discount, detail })
    remainingPaise -= discount
    if (!scheme.stackable) break
  }
  if (!discounts.length && loyaltyDiscountPaise > 0 && subtotalPaise > 0) {
    const reward = Math.min(Math.max(0, Math.floor(loyaltyDiscountPaise)), remainingPaise)
    if (reward) discounts.push({ schemeId: 'loyalty-redemption', name: 'Scoop rewards', amountPaise: reward, detail: 'Points redeemed · local demo reward' })
  }
  const discountPaise = discounts.reduce((sum, row) => sum + row.amountPaise, 0)
  const taxPaise = settings.taxEnabled ? percentDiscount(Math.max(0, subtotalPaise - discountPaise), settings.taxRateBps / 100) : 0
  return { subtotalPaise, discounts, discountPaise, taxPaise, totalPaise: Math.max(0, subtotalPaise - discountPaise + taxPaise) }
}

export function validatePosData(value: unknown): { ok: true; data: PosData } | { ok: false; error: string } {
  try {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Expected a Scoop & Co. POS data export.')
    const data = structuredClone(value) as PosData
    data.inventoryMovements ??= []
    data.loyaltyCustomers ??= []
    data.settings.inventoryEnabled ??= true
    data.settings.loyaltyEnabled ??= true
    data.settings.pointsPer100Paise ??= 1
    data.settings.defaultOrderType ??= 'Takeaway'
    data.settings.menuHeadline ??= 'A little happiness in every scoop.'
    data.settings.menuSubtitle ??= 'Made for the moments that deserve something sweet.'
    data.products.forEach(item => { item.sku ??= item.id.toUpperCase(); item.stockTracking ??= false; item.stockQty ??= 0; item.lowStockThreshold ??= 5; item.extraScoopPricePaise ??= 0 })
    for (const line of [...(data.draftBill?.lines || []), ...(data.heldBills || []).flatMap(bill => bill.lines || [])]) line.options.note ??= ''
    data.history?.forEach(bill => { bill.orderType ??= 'Takeaway'; bill.kitchenStatus ??= 'New'; bill.paymentReference ??= `DEMO-${bill.billNumber}` })
    if (data.version !== 1 || !Array.isArray(data.products) || !Array.isArray(data.categories) || !Array.isArray(data.schemes) || !Array.isArray(data.heldBills) || !Array.isArray(data.history) || !data.settings || !data.draftBill || !Array.isArray(data.draftBill.lines) || !Array.isArray(data.inventoryMovements) || !Array.isArray(data.loyaltyCustomers) || typeof data.draftBill.customerName !== 'string' || !data.draftBill.billNumber?.trim()) throw new Error('The POS export is missing a required section.')
    const unique = (items: Array<{ id: string }>) => items.every(item => item && typeof item.id === 'string' && item.id.trim()) && new Set(items.map(item => item.id)).size === items.length
    if (!unique(data.products) || !unique(data.categories) || !unique(data.schemes) || !unique(data.heldBills) || !unique(data.history)) throw new Error('Every product, category, scheme and bill needs a unique ID.')
    if (!data.categories.length || data.categories.some(category => !category.name?.trim() || !Number.isInteger(category.order))) throw new Error('Categories need names and a valid display order.')
    const finite = (amount: unknown) => typeof amount === 'number' && Number.isSafeInteger(amount) && amount >= 0
    if (data.products.some(item => !item.name?.trim() || !item.sku?.trim() || !item.description?.trim() || !validImageUrl(item.image) || !data.categories.some(category => category.id === item.categoryId) || !finite(item.basePricePaise) || !finite(item.extraScoopPricePaise) || !finite(item.stockQty) || !finite(item.lowStockThreshold) || !item.sizes.length || item.sizes.some(size => !size.name.trim() || !finite(size.surchargePaise)) || !Array.isArray(item.flavours) || !item.flavours.length || item.flavours.some(flavour => !flavour.trim()) || !Array.isArray(item.servings) || !item.servings.length || typeof item.available !== 'boolean' || typeof item.stockTracking !== 'boolean' || [...item.toppings, ...item.sauces, ...item.extras].some(addon => !addon.name.trim() || !finite(addon.pricePaise)))) throw new Error('A product contains a missing field, image, category or invalid price.')
    if (new Set(data.products.map(item => item.sku.toLowerCase())).size !== data.products.length) throw new Error('Product SKUs must be unique.')
    if (data.schemes.some(scheme => !scheme.name?.trim() || !['percent', 'fixed', 'buy_x_get_y', 'combo_price', 'quantity_percent', 'happy_hour'].includes(scheme.kind) || !finite(scheme.minimumSubtotalPaise) || !finite(scheme.maximumDiscountPaise) || !Number.isFinite(scheme.value) || scheme.value < 0 || (['percent', 'quantity_percent', 'happy_hour'].includes(scheme.kind) && scheme.value > 100) || (scheme.kind === 'buy_x_get_y' && (!Number.isInteger(scheme.buyQty) || scheme.buyQty < 1 || !Number.isInteger(scheme.getQty) || scheme.getQty < 1)) || (scheme.kind === 'quantity_percent' && (!Number.isInteger(scheme.buyQty) || scheme.buyQty < 1)) || (scheme.kind === 'combo_price' && (!Number.isInteger(scheme.buyQty) || scheme.buyQty < 2 || !finite(scheme.comboPricePaise))))) throw new Error('A scheme has an invalid name, discount, quantity or price.')
    if (data.schemes.some(scheme => scheme.productIds.some(id => !data.products.some(item => item.id === id)) || scheme.categoryIds.some(id => !data.categories.some(item => item.id === id)) || (scheme.startsOn && scheme.endsOn && scheme.startsOn > scheme.endsOn) || (scheme.kind === 'happy_hour' && (!/^\d{2}:\d{2}$/.test(scheme.startsAt || '') || !/^\d{2}:\d{2}$/.test(scheme.endsAt || '') || (scheme.startsAt || '') >= (scheme.endsAt || ''))))) throw new Error('A scheme refers to a missing product or category, or has invalid dates.')
    const couponCodes = data.schemes.map(scheme => scheme.couponCode?.trim().toUpperCase()).filter(Boolean)
    if (new Set(couponCodes).size !== couponCodes.length) throw new Error('Coupon codes must be unique.')
    if (data.loyaltyCustomers.some(customer => !customer.id?.trim() || !customer.name?.trim() || !Number.isSafeInteger(customer.points) || customer.points < 0) || data.inventoryMovements.some(movement => !movement.id?.trim() || !movement.productId?.trim() || !Number.isSafeInteger(movement.delta) || !movement.reason?.trim())) throw new Error('A customer or inventory movement contains invalid data.')
    const s = data.settings
    if (!s.shopName?.trim() || !s.logoText?.trim() || !['INR'].includes(s.currency) || !['chocolate', 'vanilla', 'berry'].includes(s.theme) || !/^#[\da-f]{6}$/i.test(s.accent) || !['restrained', 'expressive'].includes(s.motion) || !['editorial', 'compact'].includes(s.cardStyle) || !['comfortable', 'compact'].includes(s.density) || !['Dine In', 'Takeaway'].includes(s.defaultOrderType) || !s.menuHeadline.trim() || !s.menuSubtitle.trim() || !Number.isInteger(s.taxRateBps) || s.taxRateBps < 0 || s.taxRateBps > 10000 || typeof s.taxEnabled !== 'boolean' || typeof s.inventoryEnabled !== 'boolean' || typeof s.loyaltyEnabled !== 'boolean' || !Number.isSafeInteger(s.pointsPer100Paise) || s.pointsPer100Paise < 0) throw new Error('Shop or appearance settings are invalid.')
    if (!Number.isSafeInteger(data.nextBillNumber) || data.nextBillNumber < 1) throw new Error('The next bill number is invalid.')
    for (const line of [...data.draftBill.lines, ...data.heldBills.flatMap(bill => bill.lines), ...data.history.flatMap(bill => bill.lines)]) if (!Number.isInteger(line.quantity) || line.quantity < 1 || !finite(line.unitPricePaise) || (('lineTotalPaise' in line) && !finite(line.lineTotalPaise))) throw new Error('A saved bill contains an invalid line item.')
    return { ok: true, data }
  } catch (error) { return { ok: false, error: error instanceof Error ? error.message : 'POS data could not be validated.' } }
}

export function createBillLine(product: PosProduct, customization: Customisation): BillLine {
  const size = product.sizes.find(item => item.id === customization.size && item.enabled)
  const addonsPaise = customization.addons.reduce((sum, addon) => sum + addon.pricePaise, 0)
  return {
    id: makeId('line'), productId: product.id, name: product.name, image: product.image, categoryId: product.categoryId,
    quantity: 1, options: customization, unitPricePaise: product.basePricePaise + (size?.surchargePaise ?? 0) + Math.max(0, customization.scoops - 1) * product.extraScoopPricePaise + addonsPaise,
    snapshotCreatedAt: new Date().toISOString(),
  }
}

export function emptyCustomisation(product: PosProduct): Customisation {
  return { flavour: product.flavours[0] ?? 'Vanilla', serving: product.servings[0] ?? 'Cup', size: product.sizes.find(size => size.enabled)?.id ?? '', scoops: 1, addons: [], note: '' }
}
