import { init, query } from '../../_lib/db';

export default async function handler(req, res) {
  await init();
  const { id } = req.query;

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
          where d.id = $1
          group by d.id`,
        [id]
      );
      if (!rows.length) return res.status(404).json({ error: 'Drama not found' });
      const row = rows[0];
      row.likes = Number(row.likes || 0);
      res.status(200).json(row);
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch drama' });
    }
    return;
  }

  if (req.method === 'PUT') {
    try {
      const { title, description, thumbnail, lang } = req.body || {};
      // Build dynamic update
      const fields = [];
      const values = [];
      let idx = 1;
      if (title !== undefined) { fields.push(`title = $${++idx}`); values.push(title); }
      if (description !== undefined) { fields.push(`description = $${++idx}`); values.push(description); }
      if (thumbnail !== undefined) { fields.push(`thumbnail = $${++idx}`); values.push(thumbnail); }
      if (lang !== undefined) { fields.push(`lang = $${++idx}`); values.push(lang); }
      if (!fields.length) return res.status(400).json({ error: 'No fields to update' });
      await query(`update dramas set ${fields.join(', ')} where id = $1`, [id, ...values]);
      const { rows } = await query(
        `select id, title, description, thumbnail, lang, upload_date as "uploadDate" from dramas where id = $1`,
        [id]
      );
      if (!rows.length) return res.status(404).json({ error: 'Drama not found' });
      res.status(200).json(rows[0]);
    } catch (e) {
      res.status(500).json({ error: 'Failed to update drama' });
    }
    return;
  }

  if (req.method === 'DELETE') {
    try {
      const result = await query(`delete from dramas where id = $1`, [id]);
      res.status(200).json({ ok: true, id });
    } catch (e) {
      res.status(500).json({ error: 'Failed to delete drama' });
    }
    return;
  }

  res.setHeader('Allow', 'GET, PUT, DELETE');
  res.status(405).json({ error: 'Method Not Allowed' });
}
