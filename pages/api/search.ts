import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { token, url, method, data } = req.body;

  const headers = new Headers();
  headers.append('Authorization', 'ApiKey ' + token);
  headers.append('Content-Type', 'application/json');

  const response = await fetch(url, {
    method: method,
    headers: headers,
    body: JSON.stringify(data),
  });

  const json = await response.json();
  res.status(response.status).json(json);
};
