import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    // 親(プラットフォーム管理者)のStripeのAPIキーを使ってStripeのクライアントを作成
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

    // 子(利用者)のStripeアカウントを取得
    // see: https://docs.stripe.com/api/accounts/retrieve
    const account = await stripe.accounts.retrieve(params.id);

    // Stripeのアカウント情報が登録されているかどうかを確認。Stripe登録画面で「戻る」をクリックしたらdetails_submittedがfalseになるので、その場合はエラーを返す
    if (account.details_submitted) {
      return NextResponse.json(
        { account, message: "success retrieve" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { account: null, message: "情報入力が未完了です" },
        { status: 400 }
      );
    }
  } catch (e) {
    const error = e as Error;
    return NextResponse.json(
      { account: null, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
