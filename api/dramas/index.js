import { init, query } from '../../_lib/db';

export default async function handler(req, res) {
  await init();

  if (req.method === 'GET') {
    try {
      const { rows } = await query(
        `select d.id,
                d.title,
                d.description,
                d.thumbnail,
                d.lang,
                d.upload_date as "uploadDate",
                coalesce(count(l.user_id), 0) as likes
           from dramas d
           left join likes l on l.drama_id = d.id
          group by d.id
          order by d.upload_date desc nulls last`
      );
      res.status(200).json(rows.map(r => ({
        ...r,
        likes: Number(r.likes || 0)
      })));
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch dramas' });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const { title, description, thumbnail, lang } = req.body || {};
      if (!title || !description || !thumbnail) {
        return res.status(400).json({ error: 'title, description, thumbnail are required' });
      }
      const id = Math.random().toString(36).slice(2, 10);
      const { rows } = await query(
        `insert into dramas (id, title, description, thumbnail, lang)
         values ($1, $2, $3, $4, $5)
         returning id, title, description, thumbnail, lang, upload_date as "uploadDate"`,
        [id, title, description, thumbnail, lang || 'uz']
      );
      const drama = rows[0];
      drama.likes = 0;
      res.status(201).json(drama);
    } catch (e) {
      res.status(500).json({ error: 'Failed to create drama' });
    }
    return;
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).json({ error: 'Method Not Allowed' });
}
