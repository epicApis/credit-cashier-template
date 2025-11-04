-- Migration number: 0001 	 2024-12-27T22:04:18.794Z
CREATE TABLE IF NOT EXISTS Stock (
    Hash BLOB PRIMARY KEY UNIQUE NOT NULL,
    Credit INTEGER NOT NULL DEFAULT 0,
    Migration BLOB NOT NULL,
    Privilege BLOB NOT NULL DEFAULT 0x00
);
-- Insert some sample data into our Stock table.
INSERT INTO Stock (Hash, Credit, Migration, Privilege)
VALUES (
        X'ABCDEF1234567890',
        100,
        X'0000000000000001',
        X'00'
    ),
    (
        X'FEDCBA0987654321',
        200,
        X'0000000000000002',
        X'00'
    ),
    (
        X'001122334455667788',
        300,
        X'0000000000000003',
        X'00'
    );