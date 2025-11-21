import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const text = await request.text()
    const hmac = crypto.createHmac("sha256", process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "")
    const digest = Buffer.from(hmac.update(text).digest("hex"), "utf8")
    const signature = Buffer.from(request.headers.get("x-signature") || "", "utf8")

    if (!crypto.timingSafeEqual(digest, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const payload = JSON.parse(text)
    const eventName = payload.meta.event_name

    if (eventName === "order_created") {
      const { custom_data } = payload.meta
      const userId = custom_data?.user_id
      const credits = Number.parseInt(custom_data?.credits || "0")

      if (userId && credits > 0) {
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

        const { data: creditData } = await supabase
          .from("user_credits")
          .select("balance")
          .eq("user_id", userId)
          .single()

        if (creditData) {
          await supabase
            .from("user_credits")
            .update({ balance: creditData.balance + credits })
            .eq("user_id", userId)

          await supabase.from("transactions").insert({
            user_id: userId,
            amount: credits,
            type: "purchase",
            description: `Lemon Squeezy Order #${payload.data.id}`,
          })
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
