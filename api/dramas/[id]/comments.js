import { init, query, genId } from '../../../_lib/db';

export default async function handler(req, res) {
  await init();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const { rows } = await query(
        `select id,
                user_name as "user",
                text,
                created_at as "createdAt"
           from comments
          where drama_id = $1
          order by created_at desc`,
        [id]
      );
      res.status(200).json(rows);
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const { user, text } = req.body || {};
      if (!text) return res.status(400).json({ error: 'text is required' });
      const commentId = genId();
      const { rows } = await query(
        `insert into comments (id, drama_id, user_name, text)
         values ($1, $2, $3, $4)
         returning id, user_name as "user", text, created_at as "createdAt"`,
        [commentId, id, user || 'Anon', text]
      );
      res.status(201).json(rows[0]);
    } catch (e) {
      res.status(500).json({ error: 'Failed to add comment' });
    }
    return;
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).json({ error: 'Method Not Allowed' });
}
