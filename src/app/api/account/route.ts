import { NextResponse } from 'next/server';
import {stripe} from '../../../lib/utils';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const account = await stripe.accounts.create({});

      return NextResponse.json({ account: account.id })
    } catch (error) {
      return NextResponse.json({ error: error })
    }
  }
}