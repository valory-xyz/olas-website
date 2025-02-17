import { OLAS_API_URL } from 'common-util/constants';

export default async function handler(req, res) {
  try {
    const response = await fetch(`${OLAS_API_URL}/${req.query.endpoint}`);
    const result = await response.json();

    res.status(200).json({ data: result.data });
  } catch (error) {
    console.error('Error fetching olas data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
