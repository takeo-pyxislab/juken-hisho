import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { createClient as createAdminClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()
    if (!token) return NextResponse.json({ error: "トークンが必要です" }, { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "未認証" }, { status: 401 })

    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // トークンの検証
    const { data: link, error: fetchErr } = await admin
      .from("family_links")
      .select("*")
      .eq("invite_token", token)
      .eq("status", "pending")
      .is("parent_user_id", null)
      .single()

    if (fetchErr || !link) {
      return NextResponse.json({ error: "無効または使用済みの招待URLです" }, { status: 404 })
    }

    if (link.student_user_id === user.id) {
      return NextResponse.json({ error: "自分自身を招待することはできません" }, { status: 400 })
    }

    // 連携
    const { error: updateErr } = await admin
      .from("family_links")
      .update({
        parent_user_id: user.id,
        status: "active",
        linked_at: new Date().toISOString(),
      })
      .eq("id", link.id)

    if (updateErr) throw updateErr

    return NextResponse.json({ success: true, student_id: link.student_user_id })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "エラー" }, { status: 500 })
  }
}
