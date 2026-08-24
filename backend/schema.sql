-- ============================================================
-- HomeFlow Database Schema
-- Project: HomeFlow — Household Management App
-- Stack: PostgreSQL + Express + React
-- Last Updated: 2026-05-31
-- ============================================================
-- Run in order. Tables are sequenced by foreign key dependency.
-- ============================================================


-- ========================
-- CORE
-- ========================

CREATE TABLE households (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    invite_code VARCHAR(20) NOT NULL UNIQUE,
    created_at  TIMESTAMP DEFAULT now()
);

CREATE TABLE users (
    id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    household_id  INTEGER,
    created_at    TIMESTAMP DEFAULT now(),
    CONSTRAINT users_household_id_fkey
        FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE SET NULL
);


-- ========================
-- GROCERY MODULE
-- ========================

CREATE TABLE grocery_categories (
    id   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE items (
    id           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name         VARCHAR(150) NOT NULL,
    category_id  INTEGER,
    default_unit VARCHAR(20) NOT NULL DEFAULT 'kg',
    created_at   TIMESTAMP DEFAULT now(),
    CONSTRAINT items_category_id_fkey
        FOREIGN KEY (category_id) REFERENCES grocery_categories(id) ON DELETE SET NULL
);

CREATE TABLE grocery_purchases (
    id             INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    item_id        INTEGER NOT NULL,
    household_id   INTEGER NOT NULL,
    user_id        INTEGER NOT NULL,
    quantity       NUMERIC(10, 2) NOT NULL,
    unit           VARCHAR(20) NOT NULL,
    amount         NUMERIC(10, 2) NOT NULL,
    price_per_unit NUMERIC(10, 2) GENERATED ALWAYS AS (amount / quantity) STORED,
    date           DATE NOT NULL DEFAULT CURRENT_DATE,
    notes          TEXT,
    created_at     TIMESTAMP DEFAULT now(),
    CONSTRAINT grocery_purchases_item_id_fkey
        FOREIGN KEY (item_id) REFERENCES items(id),
    CONSTRAINT grocery_purchases_household_id_fkey
        FOREIGN KEY (household_id) REFERENCES households(id),
    CONSTRAINT grocery_purchases_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES users(id)
);


-- ========================
-- GENERAL EXPENSE MODULE
-- ========================

CREATE TABLE expense_categories (
    id   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO expense_categories (name) VALUES
    ('Electricity'),
    ('Water'),
    ('Gas'),
    ('Internet');

CREATE TABLE expenses (
    id           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    household_id INTEGER NOT NULL,
    logged_by    INTEGER,
    category_id  INTEGER NOT NULL,
    description  TEXT,
    amount       NUMERIC(10, 2) NOT NULL,
    date         DATE DEFAULT CURRENT_DATE,
    created_at   TIMESTAMP DEFAULT now(),
    CONSTRAINT expenses_household_id_fkey
        FOREIGN KEY (household_id) REFERENCES households(id),
    CONSTRAINT expenses_logged_by_fkey
        FOREIGN KEY (logged_by) REFERENCES users(id),
    CONSTRAINT expenses_category_id_fkey
        FOREIGN KEY (category_id) REFERENCES expense_categories(id)
);


-- ========================
-- TRIP MODULE
-- ========================

-- type: 'trip' (multi-day) or 'outing' (single day)
-- categories: food, transport, stay, entry, shopping, other

CREATE TABLE trips (
    id           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    household_id INTEGER NOT NULL,
    name         VARCHAR(100) NOT NULL,
    destination  VARCHAR(100),
    type         VARCHAR(20) NOT NULL DEFAULT 'trip',
    start_date   DATE NOT NULL,
    end_date     DATE,
    created_by   INTEGER,
    created_at   TIMESTAMP DEFAULT now(),
    CONSTRAINT trips_household_id_fkey
        FOREIGN KEY (household_id) REFERENCES households(id),
    CONSTRAINT trips_created_by_fkey
        FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE trip_expenses (
    id           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    trip_id      INTEGER NOT NULL,
    category     VARCHAR(20) NOT NULL,
    amount       NUMERIC(10, 2) NOT NULL,
    note         TEXT,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_by   INTEGER,
    created_at   TIMESTAMP DEFAULT now(),
    CONSTRAINT trip_expenses_trip_id_fkey
        FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    CONSTRAINT trip_expenses_created_by_fkey
        FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT trip_expenses_category_check
        CHECK (category IN ('food', 'transport', 'stay', 'entry', 'shopping', 'other'))
);

ALTER TABLE "items" ADD COLUMN "local_name" varchar(150);
-- ============================================================
-- CHANGELOG
-- ============================================================
-- 2026-05-07  Initial schema documented (grocery, general expense)
-- 2026-05-15  General expense module migrated: dropped old expenses table (item_id based),
--             added expense_categories table, rebuilt expenses with proper id + category_id
-- 2026-05-22  Added Trips module: trips + trip_expenses tables
-- ============================================================
