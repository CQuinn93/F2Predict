-- Add match_number column to predictions table
-- This allows tracking predictions for knockout matches that don't have match_id
-- (since knockout brackets are generated per-user based on their predictions)

-- Add match_number column (nullable for existing records, will be populated)
ALTER TABLE predictions 
ADD COLUMN IF NOT EXISTS match_number INTEGER;

-- Create index for faster lookups by match_number
CREATE INDEX IF NOT EXISTS idx_predictions_match_number ON predictions(match_number);

-- Update existing predictions with match_number from matches table
UPDATE predictions p
SET match_number = m.match_number
FROM matches m
WHERE p.match_id = m.id 
  AND p.match_number IS NULL;

-- Add comment explaining the column
COMMENT ON COLUMN predictions.match_number IS 'Official FIFA match number (1-72 for group stage, 73+ for knockout stages). Used as primary identifier for user-specific knockout matches where match_id may not exist.';

-- Note: The unique constraint on (user_id, match_id, prediction_type) will remain
-- For knockout predictions, we'll use match_number as the primary identifier
-- We may want to add a new unique constraint: (user_id, match_number, prediction_type)
-- But match_id will still be used for group stage matches for referential integrity
