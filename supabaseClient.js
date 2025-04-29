// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qwwolplytjytipjvooru.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3d29scGx5dGp5dGlwanZvb3J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MDcxOTIsImV4cCI6MjA2MTQ4MzE5Mn0.w_RplDyj2RHEhDOHvD6iWfkUXknbwZjCGFdrR1vd9cI'; // Replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
