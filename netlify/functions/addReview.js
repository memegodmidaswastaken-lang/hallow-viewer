const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async (event) => {
  const { house_id, user_id, review } = JSON.parse(event.body);

  const { data, error } = await supabase.from('reviews').insert([{ house_id, user_id, review }]);
  if (error) return { statusCode: 400, body: JSON.stringify({ error: error.message }) };

  return { statusCode: 200, body: JSON.stringify(data) };
};
