const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async (event) => {
  const { username, password } = JSON.parse(event.body);

  if (!username || !password) return { statusCode: 400, body: JSON.stringify({ error: "Missing fields" }) };

  // Hash password
  const bcrypt = require('bcryptjs');
  const hash = bcrypt.hashSync(password, 10);

  // Insert user
  const { data, error } = await supabase.from('users').insert([{ username, password: hash }]);

  if (error) return { statusCode: 400, body: JSON.stringify({ error: error.message }) };
  return { statusCode: 200, body: JSON.stringify({ message: "User registered" }) };
};
