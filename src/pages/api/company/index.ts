import prismadb from '../../../../lib/prismadb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const companies = await prismadb.company.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json(companies);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Company name is required' });
      }

      const company = await prismadb.company.create({
        data: {
          name,
        },
      });

      return res.status(201).json(company);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
} 