const SUPABASE_URL = "INSERISCI_URL";

const SUPABASE_KEY = "INSERISCI_ANON_KEY";


const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
