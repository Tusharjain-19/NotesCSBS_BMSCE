-- Drop the existing resource_type enum and recreate with new values
-- First, we need to drop the column, recreate the enum, then add it back

-- Create a new enum type with the required values
CREATE TYPE resource_type_new AS ENUM ('notes', 'cie1', 'cie2', 'cie3', 'see');

-- Add a temporary column with the new type
ALTER TABLE resources ADD COLUMN type_new resource_type_new;

-- Migrate existing data
UPDATE resources SET type_new = 
  CASE 
    WHEN type::text = 'notes' THEN 'notes'::resource_type_new
    WHEN type::text = 'question_papers' THEN 'see'::resource_type_new
    ELSE 'notes'::resource_type_new
  END;

-- Make the new column NOT NULL
ALTER TABLE resources ALTER COLUMN type_new SET NOT NULL;

-- Drop the old column
ALTER TABLE resources DROP COLUMN type;

-- Rename the new column
ALTER TABLE resources RENAME COLUMN type_new TO type;

-- Drop the old enum type
DROP TYPE resource_type;

-- Rename the new enum type
ALTER TYPE resource_type_new RENAME TO resource_type;