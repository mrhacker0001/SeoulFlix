import { init, query } from '../../../_lib/db';

export default async function handler(req, res) {
  await init();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const { rows } = await query(
        `select id,
                season,
                episode,
                video_id as "videoId",
                upload_date as "uploadDate"
           from episodes
          where drama_id = $1
          order by coalesce(season,'') asc, coalesce(episode,'') asc`,
        [id]
      );
      res.status(200).json(rows);
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch episodes' });
    }
    return;
  }

  res.setHeader('Allow', 'GET');
  res.status(405).json({ error: 'Method Not Allowed' });
}
