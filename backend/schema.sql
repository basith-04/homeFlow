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


-- ============================================================
-- CHANGELOG
-- ============================================================
-- 2026-05-07  Initial schema documented (grocery, general expense)
-- 2026-05-15  General expense module migrated: dropped old expenses table (item_id based),
--             added expense_categories table, rebuilt expenses with proper id + category_id
-- ============================================================
