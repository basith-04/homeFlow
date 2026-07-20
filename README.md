# homeFlow

A household management app built to track day-to-day spending, groceries, utilities, and trips — and eventually predict them.

> 🏠 Currently live and in active use at home.

---

## What it is

homeFlow is a full-stack web app for managing a household's finances and purchases. It started as a simple data collection tool and is being built out in phases toward smart predictions and household automation.

**Stack:** React + Vite (frontend) · Express + PostgreSQL (backend) · Deployed on Vercel (frontend) + Fly.io (backend)

---

## Current Status

Core tracking is live and used daily by my family. Two modules were scoped but never finished, and one known bug affects household creation. Development on new features was paused for ~7 weeks while purchase data accumulated — now resuming with Phase 2.

**Known issues:**
- `createHousehold` fails — insert omits `invite_code`, which is `NOT NULL UNIQUE` in the schema. No household creation/invite flow exists in the UI either.
- Trips module is a UI shell — only listing and viewing trips works. Create/edit/delete trip and add/edit/remove trip expense endpoints are unimplemented.
- `fuel.jsx` page exists but is empty.

---

## Roadmap

### Phase 1 — Data Collection & Core CRUD *(complete for daily-use scope)*

The foundation. Getting clean, structured data into the system before anything intelligent can be built on top of it.

- [x] User auth (register / login with JWT)
- [x] Household model (schema in place)
- [x] Grocery purchases — log item, quantity, unit, price, date (full CRUD)
- [x] General expenses — log utilities (electricity, water, gas, internet) with category (full CRUD)
- [x] Edit and delete entries
- [x] Filter by date range (today / this week / this month)
- [x] Dashboard with monthly spend summary
- [ ] Fix `createHousehold` invite_code bug
- [ ] Household invite / join flow
- [ ] Trips & outings — currently view-only; create/edit/delete not implemented
- [ ] Item catalog management

---

### Phase 2 — Intelligence & Predictions *(in progress)*

Real purchase history has been collected (100+ logged purchases across ~2 months) and is being used to build the first prediction feature. Family tracking habits are bursty rather than consistent — some weeks fully logged, some sparse — so the approach is built to tolerate that rather than wait for it to change.

- [ ] **Smart shopping list / restock predictions** — median gap between purchases per item, computed only for items with a minimum purchase history (e.g. 3+ logged purchases); items below that threshold show "not enough data yet" instead of a guess
- [ ] Stock estimation based on purchase history and average consumption
- [ ] Spend forecasting for end-of-month trajectory
- [ ] Usage analytics — charts and trends by category, item, and household member
- [ ] Price tracking — flag when a regularly bought item's price is higher than usual
- [ ] Seasonal patterns across months
- [ ] Budget recommendations from historical averages

---

### Future — Household Features

Longer-term features beyond finance tracking:

- Chore scheduling and tracking
- Shared to-do lists per household
- Bill reminders and recurring expense alerts
- Multi-member spend attribution
- Export reports (PDF / CSV)
- Mobile app (PWA or native)

---

## Project Structure