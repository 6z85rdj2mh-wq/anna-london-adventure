const SUPABASE_URL = "https://usrlanvyuaaemdxhhuvg.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzcmxhbnZ5dWFhZW1keGhodXZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2NDMzNTksImV4cCI6MjEwMDIxOTM1OX0.9VZfPoyYwbE4rv48LYHx0orpda4Jd5G7P8n1tVT9nPw";


const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
console.log("Supabase collegato:", supabaseClient);
