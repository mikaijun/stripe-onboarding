import { NextResponse } from "next/server";
import { stripe } from "../../../lib/utils";

export async function POST(req: Request) {
  if (req.method === "POST") {
    const json = (await req.json()) as any
    try {
      const { account } = json;

      const accountLink = await stripe.accountLinks.create({
        account: account,
        refresh_url: `http://localhost:3000/refresh/${account}`,
        return_url: `http://localhost:3000/return/${account}`,
        type: "account_onboarding",
      });
      console.log(accountLink)
      return NextResponse.json({url: accountLink.url})
    } catch (error) {
      console.log(error)
      return NextResponse.json({error: error })
    }
  }
}
