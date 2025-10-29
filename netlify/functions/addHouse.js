import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.https://rcfftyvlmqxjdpxxiapl.supabase.co,
  process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjZmZ0eXZsbXF4amRweHhpYXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3Njc2MzEsImV4cCI6MjA3NzM0MzYzMX0.zyXjgwYdyYYMy94EChbWioasrUWRsx8CPuShkRa-3ms
);

export async function handler(event) {
  const { lat, lng, rating, glutenFree, sugarFree, lactoseFree, other, description, user_id, imageBase64, imageName } = JSON.parse(event.body);

  let image_url = null;

  if (imageBase64) {
    const { data, error } = await supabase.storage
      .from('house-images')
      .upload(imageName, Buffer.from(imageBase64, 'base64'), { upsert: true });

    if (error) return { statusCode: 400, body: JSON.stringify({ error: error.message }) };
    image_url = supabase.storage.from('house-images').getPublicUrl(imageName).data.publicUrl;
  }

  const { data, error } = await supabase
    .from('houses')
    .insert([{ lat, lng, rating, glutenFree, sugarFree, lactoseFree, other, description, user_id, image: image_url }]);

  if (error) return { statusCode: 400, body: JSON.stringify({ error: error.message }) };

  return { statusCode: 200, body: JSON.stringify(data) };
}
