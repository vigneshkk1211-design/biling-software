# Scoop POS Demo

A desktop-first, frontend-only ice cream billing counter built with React, TypeScript, and Vite. Browse the counter menu, customise a dessert, apply demo schemes, simulate payment, and print a receipt preview. Product, offer, appearance, draft bill, and history data are shared in the app and saved locally by the browser.

## Run locally

```sh
npm install
npm run dev
```

Use the local URL printed by Vite. Check the app with:

```sh
npm test
npm run build
npm run preview
```

## POS features

- Search and filter a touch-friendly menu across eight categories; customise flavour, serving, size, scoop count, add-ons, and an optional serving note.
- Maintain the live bill with stock-aware quantity controls, price snapshots, hold/resume, customer name, line editing/removal, coupons, local reward points, and clear bill.
- Calculate percentage, fixed, buy-X-get-Y, combo-price, quantity, and happy-hour demo schemes in priority order, with optional stacking and configured demo tax.
- Simulate cash, UPI, or card payment. Cash checks tendered amount and change. No provider or real payment data is used.
- View and print demo receipts, browse local bill history, export history to CSV, manage a kitchen queue, and review filtered daily sales reports.
- Use the in-app customer display, inventory movements and low-stock view, local loyalty register, and a configurable visual menu board.
- Add, edit, duplicate, hide, and delete products; add/edit/reorder/delete categories; manage schemes, stock, customer rewards, receipt details, and appearance settings.
- Export and validate a complete JSON configuration, import it after confirmation, or reset demo data.

All prices, discounts, transactions, and receipts are demonstrations. This prototype is not statutory invoicing software. Data is stored in localStorage in this browser and is not shared with another device. Reset or clear browser storage to remove it.

Product photography uses Unsplash and display fonts use Google Fonts, so those assets require an internet connection. The app does not require a backend, account, or payment service.
