import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
    const account = await stripe.accounts.create({});

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `http://localhost:3000/refresh/${account.id}`,
      return_url: `http://localhost:3000/return/${account.id}`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url }, { status: 200 });
  } catch (error) {
    throw new Error();
  }
}
