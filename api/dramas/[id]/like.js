import { init, query } from '../../../_lib/db';

export default async function handler(req, res) {
  await init();
  const { id } = req.query;

  if (req.method === 'POST') {
    try {
      const { userId } = req.body || {};
      if (!userId) return res.status(400).json({ error: 'userId required' });
      // Try insert; on conflict do nothing
      await query(
        `insert into likes (drama_id, user_id) values ($1, $2) on conflict do nothing`,
        [id, userId]
      );
      const { rows } = await query(`select count(*)::int as likes from likes where drama_id = $1`, [id]);
      res.status(200).json({ likes: rows[0]?.likes || 0 });
    } catch (e) {
      res.status(500).json({ error: 'Failed to like drama' });
    }
    return;
  }

  res.setHeader('Allow', 'POST');
  res.status(405).json({ error: 'Method Not Allowed' });
}
