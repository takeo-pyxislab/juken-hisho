import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { createClient as createAdminClient } from "@supabase/supabase-js"

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "未認証" }, { status: 401 })
    if (user.user_metadata?.user_type === "parent") {
      return NextResponse.json({ error: "保護者アカウントは招待URLを発行できません" }, { status: 403 })
    }

    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 既存のpending招待があれば返す
    const { data: existing } = await admin
      .from("family_links")
      .select("invite_token")
      .eq("student_user_id", user.id)
      .eq("status", "pending")
      .is("parent_user_id", null)
      .limit(1)

    if (existing && existing.length > 0) {
      return NextResponse.json({ token: existing[0].invite_token })
    }

    // 新規作成
    const { data, error } = await admin
      .from("family_links")
      .insert({ student_user_id: user.id })
      .select("invite_token")
      .single()

    if (error) throw error
    return NextResponse.json({ token: data.invite_token })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "エラー" }, { status: 500 })
  }
}
