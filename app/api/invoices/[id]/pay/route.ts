import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { logActivity } from "@/lib/activity"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { last4 } = await request.json()

  try {
    const invoice = await db.invoice.update({
      where: { id, userId },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    })

    // Log activity
    await logActivity({
      type: "invoice",
      action: "paid",
      itemId: invoice.id,
      itemName: invoice.number,
      details: `Demo payment processed${last4 ? ` ending in ${last4}` : ""}`,
    })

    return NextResponse.json({ success: true, invoice })
  } catch (error) {
    console.error("Payment processing error:", error)
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 })
  }
}
