# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/login and create a new project
3. Choose a project name (e.g., "crewmates-app")
4. Set a database password (save this securely)
5. Choose a region close to your users

## 2. Database Schema Setup

Run the following SQL in your Supabase SQL editor:

```sql
-- Create the crewmates table
CREATE TABLE crewmates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL CHECK (length(name) > 0),
  speed INTEGER NOT NULL CHECK (speed >= 0 AND speed <= 100),
  color TEXT NOT NULL,
  category TEXT, -- for stretch features
  success_metric TEXT, -- for stretch features
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE crewmates ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for this demo)
-- In production, you'd want more restrictive policies
CREATE POLICY "Allow all operations on crewmates" ON crewmates
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create an index for faster queries
CREATE INDEX idx_crewmates_created_at ON crewmates(created_at DESC);
CREATE INDEX idx_crewmates_color ON crewmates(color);

-- Optional: Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_crewmates_updated_at
    BEFORE UPDATE ON crewmates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## 3. Get Your API Keys

1. Go to your project settings
2. Navigate to "API" section
3. Copy your:
   - Project URL
   - Anon (public) key

## 4. Environment Setup

1. Copy `.env.example` to `.env.local`:

   **Windows (PowerShell):**

   ```powershell
   Copy-Item .env.example .env.local
   ```

   **Mac/Linux:**

   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials in `.env.local`:
   ```
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## 5. Test the Connection

Once you've set up your environment variables, you can test the connection by:

1. Starting the development server: `npm run dev`
2. Opening the browser console
3. The app will attempt to connect to Supabase when you navigate to different pages

## Database Table Structure

| Column         | Type      | Description                                    |
| -------------- | --------- | ---------------------------------------------- |
| id             | UUID      | Primary key, auto-generated                    |
| name           | TEXT      | Crewmate name (required)                       |
| speed          | INTEGER   | Speed value 0-100 (required)                   |
| color          | TEXT      | Crewmate color (required)                      |
| category       | TEXT      | Category for stretch features (optional)       |
| success_metric | TEXT      | Success metric for stretch features (optional) |
| created_at     | TIMESTAMP | Auto-set creation time                         |
| updated_at     | TIMESTAMP | Auto-updated modification time                 |

## Security Notes

- The current setup allows all operations for simplicity
- In production, implement proper Row Level Security policies
- Consider adding user authentication if needed
- Validate data on both client and server side
