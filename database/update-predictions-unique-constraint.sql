-- Update predictions table to support match_number as primary identifier for knockout stages
-- This allows user-specific knockout matches where match_id may be NULL

-- Remove the old unique constraint if it exists
ALTER TABLE predictions 
DROP CONSTRAINT IF EXISTS predictions_user_id_match_id_prediction_type_key;

-- Add match_number to unique constraint
-- This allows: (user_id, match_number, prediction_type) to be unique
-- For group stage: match_id + match_number both populated
-- For knockout: match_number populated, match_id may be NULL
-- match_number is now the primary identifier for all predictions
ALTER TABLE predictions
ADD CONSTRAINT predictions_user_id_match_number_prediction_type_key 
UNIQUE (user_id, match_number, prediction_type);

-- Make match_number NOT NULL for new records (but allow existing NULLs during migration)
-- We'll handle this in application logic by ensuring match_number is always provided

-- Also ensure match_number is NOT NULL going forward (but allow NULL for migration)
-- Actually, let's keep it nullable initially for backwards compatibility
-- We'll enforce it in application logic

-- Create composite index for faster lookups
CREATE INDEX IF NOT EXISTS idx_predictions_user_match_number 
ON predictions(user_id, match_number, prediction_type);

-- Update comment
COMMENT ON TABLE predictions IS 'User predictions. For group stage: match_id + match_number both set. For knockout: match_number set, match_id may be NULL (brackets generated per user).';
