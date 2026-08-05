const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const rawSupabaseUrl = process.env.SUPABASE_URL || process.env.SUPABASE_URl;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

if (!rawSupabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase config. Set SUPABASE_URL and SUPABASE_ANON_KEY (or SUPABASE_KEY) in your .env file.",
  );
}

const supabaseUrl = rawSupabaseUrl
  .replace(/\/rest\/v1\/?$/, "")
  .replace(/\/$/, "");

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
