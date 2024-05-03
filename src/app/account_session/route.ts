import { stripe } from '../../lib/utils';
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  if (req.method === 'POST') {
    const json = (await req.json()) as any
    try {
      const accountSession = await stripe.accountSessions.create({
        account: json.account,
        components: {
          account_onboarding: { enabled: true },
        }
      });
      console.log(accountSession)
      return NextResponse.json({client_secret: accountSession.client_secret})
    } catch (error) {
      return NextResponse.json({error: error})
    }
  }
}
