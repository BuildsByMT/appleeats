// Supabase Client Configuration
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mock-appleeats.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'mock-anon-key-appleeats';

// Initialize Supabase Client
let supabase = null;

try {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('[Supabase] Initialized client targeting:', SUPABASE_URL);
} catch (err) {
  console.warn('[Supabase] Client initialization warning:', err.message);
}

module.exports = {
  supabase,
  SUPABASE_URL,
  SUPABASE_ANON_KEY
};
