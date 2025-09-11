/*
  # Create match history tables

  1. New Tables
    - `resumes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `content` (text)
      - `parsed_skills` (text array)
      - `parsed_experience` (text array)
      - `parsed_education` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `job_descriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `company` (text)
      - `description` (text)
      - `keywords` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `match_results`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `resume_id` (uuid, references resumes)
      - `job_id` (uuid, references job_descriptions)
      - `overall_score` (numeric)
      - `keyword_match_score` (numeric)
      - `keyword_matched` (text array)
      - `keyword_missing` (text array)
      - `skills_match_score` (numeric)
      - `skills_matched` (text array)
      - `skills_missing` (text array)
      - `experience_match_score` (numeric)
      - `experience_relevance` (numeric)
      - `suggestions` (text array)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  content text NOT NULL,
  parsed_skills text[] DEFAULT '{}',
  parsed_experience text[] DEFAULT '{}',
  parsed_education text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create job_descriptions table
CREATE TABLE IF NOT EXISTS job_descriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  company text NOT NULL,
  description text NOT NULL,
  keywords text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create match_results table
CREATE TABLE IF NOT EXISTS match_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id uuid REFERENCES resumes(id) ON DELETE CASCADE,
  job_id uuid REFERENCES job_descriptions(id) ON DELETE CASCADE,
  overall_score numeric NOT NULL DEFAULT 0,
  keyword_match_score numeric NOT NULL DEFAULT 0,
  keyword_matched text[] DEFAULT '{}',
  keyword_missing text[] DEFAULT '{}',
  skills_match_score numeric NOT NULL DEFAULT 0,
  skills_matched text[] DEFAULT '{}',
  skills_missing text[] DEFAULT '{}',
  experience_match_score numeric NOT NULL DEFAULT 0,
  experience_relevance numeric NOT NULL DEFAULT 0,
  suggestions text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(resume_id, job_id)
);

-- Enable Row Level Security
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;

-- Create policies for resumes
CREATE POLICY "Users can view own resumes"
  ON resumes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes"
  ON resumes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
  ON resumes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
  ON resumes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for job_descriptions
CREATE POLICY "Users can view own job descriptions"
  ON job_descriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own job descriptions"
  ON job_descriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own job descriptions"
  ON job_descriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own job descriptions"
  ON job_descriptions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for match_results
CREATE POLICY "Users can view own match results"
  ON match_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own match results"
  ON match_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own match results"
  ON match_results
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own match results"
  ON match_results
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_job_descriptions_user_id ON job_descriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_match_results_user_id ON match_results(user_id);
CREATE INDEX IF NOT EXISTS idx_match_results_resume_job ON match_results(resume_id, job_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_resumes_updated_at
  BEFORE UPDATE ON resumes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_descriptions_updated_at
  BEFORE UPDATE ON job_descriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();