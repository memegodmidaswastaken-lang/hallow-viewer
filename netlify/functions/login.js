const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async (event) => {
  const { username, password } = JSON.parse(event.body);

  const { data, error } = await supabase.from('users').select('*').eq('username', username).single();
  if (error || !data) return { statusCode: 400, body: JSON.stringify({ error: "Invalid username" }) };

  const match = bcrypt.compareSync(password, data.password);
  if (!match) return { statusCode: 400, body: JSON.stringify({ error: "Invalid password" }) };

  return { statusCode: 200, body: JSON.stringify(data) };
};
