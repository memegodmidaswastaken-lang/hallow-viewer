const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async (event) => {
  const { moderator_username, target_username, new_title } = JSON.parse(event.body);

  const { data: mod, error: modErr } = await supabase.from('users').select('*').eq('username', moderator_username).single();
  if (!mod || mod.role !== 'moderator') return { statusCode: 403, body: JSON.stringify({ error: "Not authorized" }) };

  const { data, error } = await supabase.from('users').update({ title: new_title }).eq('username', target_username);
  if (error) return { statusCode: 400, body: JSON.stringify({ error: error.message }) };
  return { statusCode: 200, body: JSON.stringify(data) };
};
