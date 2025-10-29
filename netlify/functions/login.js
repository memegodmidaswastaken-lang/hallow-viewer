import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.https://rcfftyvlmqxjdpxxiapl.supabase.co, 
  process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjZmZ0eXZsbXF4amRweHhpYXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3Njc2MzEsImV4cCI6MjA3NzM0MzYzMX0.zyXjgwYdyYYMy94EChbWioasrUWRsx8CPuShkRa-3ms
);

export async function handler(event) {
  const { username, password } = JSON.parse(event.body);

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !data) return { statusCode: 400, body: JSON.stringify({ error: "Invalid username" }) };

  const valid = bcrypt.compareSync(password, data.password);
  if (!valid) return { statusCode: 400, body: JSON.stringify({ error: "Invalid password" }) };

  return { statusCode: 200, body: JSON.stringify(data) };
}
