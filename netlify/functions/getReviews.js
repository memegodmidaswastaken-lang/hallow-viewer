const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async () => {
  const { data, error } = await supabase.from('reviews').select(`*, user_id (username)`);
  if (error) return { statusCode: 400, body: JSON.stringify({ error: error.message }) };
  return { statusCode: 200, body: JSON.stringify(data) };
};
