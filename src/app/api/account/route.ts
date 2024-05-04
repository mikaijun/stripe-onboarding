import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST() {
  try {
    // 親(プラットフォーム管理者)のStripeのAPIキーを使ってStripeのクライアントを作成
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

    // 子(利用者)のStripeアカウントを作成。ユニークなID(string)を生成するのが目的
    // see: https://docs.stripe.com/api/accounts/create
    const account = await stripe.accounts.create({});
    const accountId = account.id;

    // Stripeのアカウントリンクを作成
    // ここからStripeのアカウントを連携させる(初めてStripeを利用する場合はアカウント作成も行う
    // see: https://docs.stripe.com/api/account_links/create
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/refresh/${accountId}`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/return/${accountId}`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url }, { status: 200 });
  } catch (error) {
    throw new Error();
  }
}
