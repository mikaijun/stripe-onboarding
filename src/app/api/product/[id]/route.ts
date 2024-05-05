import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const json = await request.json();
  const unit_amount = Number(json.price);

  if (!Number.isInteger(unit_amount)) {
    return NextResponse.json(
      { message: "金額は整数で入力してください" },
      { status: 400 }
    );
  }

  if (0 >= unit_amount) {
    return NextResponse.json(
      { message: "金額は0より大きい金額で入力してください" },
      { status: 400 }
    );
  }

  try {
    // 親(プラットフォーム管理者)のStripeのAPIキーを使ってStripeのクライアントを作成。
    // Stripeの子(利用者)のIDを指定してStripeのクライアントを作成することで、そのアカウントに対しての操作が可能になる
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
      stripeAccount: params.id,
    });

    // Stripeの商品を作成
    // see: https://stripe.com/docs/api/products/create
    const product = await stripe.products.create({
      name: json?.name || "請求の件",
    });

    // 商品の価格を設定
    // see: https://stripe.com/docs/api/prices/create
    const price = await stripe.prices.create({
      currency: "JPY",
      unit_amount,
      product: product.id,
    });

    // Stripeの支払いリンクを作成。これを子(利用者)から第三者(納付者)に送信することで、支払いを受け付けることができる
    // see: https://docs.stripe.com/connect/payment-links?locale=ja-JP
    const link = await stripe.paymentLinks.create(
      { line_items: [{ price: price.id, quantity: 1 }] },
      { stripeAccount: params.id }
    );

    return NextResponse.json({ link }, { status: 200 });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
