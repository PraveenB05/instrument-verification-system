-- ===================================================================
-- SIH26036 - Online Weighing & Measuring Instrument Verification System
-- PostgreSQL Database Schema
-- ===================================================================

-- 1. DROP EXISTING TABLES (IF RE-CREATING)
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS verification_requests CASCADE;
DROP TABLE IF EXISTS instruments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. USERS TABLE
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('INSTRUMENT_OWNER', 'OFFICER', 'ADMIN')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. INSTRUMENTS TABLE
CREATE TABLE instruments (
    id BIGSERIAL PRIMARY KEY,
    instrument_number VARCHAR(50) UNIQUE NOT NULL,
    instrument_type VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    owner_id BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL CHECK (status IN ('REGISTERED', 'PENDING_VERIFICATION', 'VERIFIED', 'REJECTED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_instrument_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. VERIFICATION REQUESTS TABLE
CREATE TABLE verification_requests (
    id BIGSERIAL PRIMARY KEY,
    instrument_id BIGINT NOT NULL,
    officer_id BIGINT,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    inspection_result VARCHAR(20) CHECK (inspection_result IN ('PASS', 'FAIL')),
    remarks TEXT,
    status VARCHAR(30) NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    reviewed_at TIMESTAMP,
    CONSTRAINT fk_verification_instrument FOREIGN KEY (instrument_id) REFERENCES instruments(id) ON DELETE CASCADE,
    CONSTRAINT fk_verification_officer FOREIGN KEY (officer_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. CERTIFICATES TABLE
CREATE TABLE certificates (
    id BIGSERIAL PRIMARY KEY,
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    instrument_id BIGINT UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('VALID', 'EXPIRED')),
    qr_code_data TEXT NOT NULL,
    CONSTRAINT fk_certificate_instrument FOREIGN KEY (instrument_id) REFERENCES instruments(id) ON DELETE CASCADE
);

-- ===================================================================
-- SAMPLE SEED DATA
-- ===================================================================

-- Insert Default Demo Users (Password stored as plain/hash for simplicity in college prototype)
INSERT INTO users (id, name, email, password, role) VALUES
(1, 'System Administrator', 'admin@example.com', 'admin123', 'ADMIN'),
(2, 'Officer Ramesh Kumar', 'officer@example.com', 'officer123', 'OFFICER'),
(3, 'ABC Stores (Ravi)', 'owner@example.com', 'owner123', 'INSTRUMENT_OWNER')
ON CONFLICT (email) DO NOTHING;

-- Insert Sample Instruments
INSERT INTO instruments (id, instrument_number, instrument_type, location, owner_id, status) VALUES
(1, 'WM001', 'Digital Weighing Machine', 'Salem', 3, 'PENDING_VERIFICATION'),
(2, 'WM002', 'Electronic Weighing Scale', 'Chennai', 3, 'REGISTERED')
ON CONFLICT (instrument_number) DO NOTHING;

-- Insert Sample Pending Verification Request
INSERT INTO verification_requests (id, instrument_id, officer_id, status, request_date) VALUES
(1, 1, NULL, 'PENDING', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;
