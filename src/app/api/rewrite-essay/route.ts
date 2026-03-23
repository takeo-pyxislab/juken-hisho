import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function POST(req: NextRequest) {
  try {
    const { statement_id, note } = await req.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "未認証" }, { status: 401 })

    const { data: statement } = await supabase.from("personal_statements").select("*").eq("id", statement_id).single()
    if (!statement) return NextResponse.json({ error: "見つかりません" }, { status: 404 })

    // モック：指示に基づいて末尾にコメントを追加（後でClaude APIに切り替え）
    const rewritten = statement.content + `

【リライト指示反映: ${note}】
※本番ではClaude APIにより指示内容を反映した完成版が生成されます。`

    return NextResponse.json({ content: rewritten })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "エラー" }, { status: 500 })
  }
}