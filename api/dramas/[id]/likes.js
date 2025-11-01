import { init, query } from '../../../_lib/db';

export default async function handler(req, res) {
  await init();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const { rows } = await query(
        `select count(*)::int as likes from likes where drama_id = $1`,
        [id]
      );
      const likes = rows[0]?.likes || 0;
      res.status(200).json({ likes });
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch likes' });
    }
    return;
  }

  res.setHeader('Allow', 'GET');
  res.status(405).json({ error: 'Method Not Allowed' });
}
