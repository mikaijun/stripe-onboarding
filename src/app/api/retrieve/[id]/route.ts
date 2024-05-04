import { NextResponse } from "next/server";
import { stripe } from "../../../../lib/utils";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const account = await stripe.accounts.retrieve(params.id);

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