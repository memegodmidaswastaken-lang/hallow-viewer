import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.https://rcfftyvlmqxjdpxxiapl.supabase.co,
  process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjZmZ0eXZsbXF4amRweHhpYXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3Njc2MzEsImV4cCI6MjA3NzM0MzYzMX0.zyXjgwYdyYYMy94EChbWioasrUWRsx8CPuShkRa-3ms
);

export async function handler(event) {
  const { username, newTitle, mod_username } = JSON.parse(event.body);

  // Check if mod_username is moderator
  const { data: modData, error: modErr } = await supabase
    .from('users')
    .select('*')
    .eq('username', mod_username)
    .single();

  if (modErr || modData.role !== "moderator") 
    return { statusCode: 403, body: JSON.stringify({ error: "Not authorized" }) };

  const { data, error } = await supabase
    .from('users')
    .update({ title: newTitle })
    .eq('username', username);

  if (error) return { statusCode: 400, body: JSON.stringify({ error: error.message }) };

  return { statusCode: 200, body: JSON.stringify(data) };
}
