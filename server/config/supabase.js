const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const rawSupabaseUrl = process.env.SUPABASE_URL || process.env.SUPABASE_URl;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!rawSupabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase config. Set SUPABASE_URL and SUPABASE_ANON_KEY (or SUPABASE_KEY) in your .env file.",
  );
}

const supabaseUrl = rawSupabaseUrl
  .replace(/\/rest\/v1\/?$/, "")
  .replace(/\/$/, "");

const supabase = createClient(supabaseUrl, supabaseKey);

// Admin client: required for auth.admin.* calls such as creating users.
// The anon key cannot do this. Never send this key to the mobile app.
if (!serviceRoleKey) {
  console.warn(
    "[supabase] SUPABASE_SERVICE_ROLE_KEY is not set. Account creation will fail until it is.",
  );
}

const supabaseAdmin = serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

module.exports = { supabase, supabaseAdmin };
