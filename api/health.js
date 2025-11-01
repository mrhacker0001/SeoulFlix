import { init } from './_lib/db';

export default async function handler(req, res) {
  try {
    await init();
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'DB not initialized' });
  }
}
