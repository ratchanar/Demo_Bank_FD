# XYZ Bank Fixed Deposit Management Demo

A beginner-friendly fixed-deposit register built with plain HTML, CSS, and JavaScript. The interface uses a professional blue-and-white design and includes fictional sample data.

> **Important:** This is an educational demo, not a production banking system. Do not enter real customer or financial information.

## Features

- Fixed deposit register with Deposit ID, Customer ID, Principal, Annual Interest Rate, Term, Interest, Maturity Amount, Maturity Date, and Status
- Four fictional sample records
- Simple-interest and maturity-amount calculations
- Input validation for required fields and positive principal, interest rate, and term
- Dashboard totals for principal, interest, and maturity amount
- Search and edit/delete controls
- Approaching-maturity report for the next 7, 30, 60, or 90 days
- CSV export for opening the register in spreadsheet software
- Responsive blue-and-white interface

## Run locally

1. Download or clone this repository.
2. Keep `index.html`, `styles.css`, and `app.js` in the same folder.
3. Double-click `index.html` to open it in a modern browser.
4. Use the fictional sample records to test the application.

No installation, server, database, or third-party library is required.

## Calculations

Simple interest:

```text
Interest = Principal × Annual Interest Rate (%) × Term in Years ÷ 100
```

Maturity amount:

```text
Maturity Amount = Principal + Interest
```

Example: Principal ₹100,000, annual rate 7%, and term 2 years gives interest of ₹14,000 and a maturity amount of ₹114,000.

## Project files

- `index.html` — page structure, input form, dashboard, register, and report
- `styles.css` — colours, layout, responsive styling, and visual design
- `app.js` — sample records, validation, calculations, dashboard, maturity report, and CSV export
- `README.md` — project description and setup instructions
- `LICENSE` — MIT license for this educational sample
- `.gitignore` — excludes common local/editor files from Git

## Data storage and limitations

This is a front-end prototype. It has no authentication, server, database, encryption, or audit trail. Changes are kept in the current page session and may be lost when the page is refreshed or closed. The interest formula is simple interest and may not match real bank products, which can use compounding, specific day-count conventions, tax rules, and other terms.

## GitHub upload

Create a new repository on GitHub, then either upload the extracted files through **Add file → Upload files**, or use Git from a terminal:

```bash
git init
git add .
git commit -m "Add XYZ Bank fixed deposit demo"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the example remote URL with the URL of your own GitHub repository. Do not upload real customer data, credentials, or banking records.
