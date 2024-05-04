import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
      stripeAccount: params.id,
    });
    const product = await stripe.products.create({
      name: "Gold Plan",
    });

    const price = await stripe.prices.create({
      currency: "usd",
      unit_amount: 1000,
      product: product.id,
    });

    const link = await stripe.paymentLinks.create(
      { line_items: [{ price: price.id, quantity: 1 }] },
      { stripeAccount: params.id }
    );

    return NextResponse.json({ link }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
