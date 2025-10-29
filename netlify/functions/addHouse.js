const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async (event) => {
  const { lat, lng, rating, glutenFree, sugarFree, lactoseFree, other, description, user_id, imageBase64, imageName } = JSON.parse(event.body);

  let imageUrl = null;
  if (imageBase64 && imageName) {
    const { data, error } = await supabase.storage.from('house-images').upload(imageName, Buffer.from(imageBase64, 'base64'), { upsert: true });
    if (error) return { statusCode: 400, body: JSON.stringify({ error: error.message }) };
    const { publicUrl } = supabase.storage.from('house-images').getPublicUrl(imageName);
    imageUrl = publicUrl;
  }

  const { data, error } = await supabase.from('houses').insert([{
    lat, lng, rating, glutenFree, sugarFree, lactoseFree, other, description, user_id, image: imageUrl
  }]);

  if (error) return { statusCode: 400, body: JSON.stringify({ error: error.message }) };
  return { statusCode: 200, body: JSON.stringify(data) };
};
