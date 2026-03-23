import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function POST(req: NextRequest) {
  try {
    const { universities } = await req.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "未認証" }, { status: 401 })

    const today = new Date()
    const tasks: object[] = []

    for (const uni of universities) {
      const uniName = uni.university_name
      const uniId = uni.id

      // 出願3ヶ月前を基準にタスクを生成
      const months = (offset: number) => {
        const d = new Date(today)
        d.setMonth(d.getMonth() + offset)
        return d.toISOString().split("T")[0]
      }

      tasks.push(
        { user_id: user.id, target_university_id: uniId, title: `${uniName}のオープンキャンパスに参加`, description: "大学の雰囲気を確認し、志望動機を具体化する", due_date: months(1), category: "その他" },
        { user_id: user.id, target_university_id: uniId, title: `${uniName}の募集要項を入手`, description: "出願資格・提出書類・選抜方法を確認する", due_date: months(1), category: "書類準備" },
        { user_id: user.id, target_university_id: uniId, title: `${uniName}の志望理由書（下書き）を作成`, description: "なぜこの大学・学部でなければならないかを800字程度で書く", due_date: months(2), category: "書類準備" },
        { user_id: user.id, target_university_id: uniId, title: `${uniName}にエントリーシートを提出`, description: "エントリー締切を確認して余裕を持って提出する", due_date: months(2), category: "エントリー" },
        { user_id: user.id, target_university_id: uniId, title: `${uniName}の志望理由書（完成版）を仕上げる`, description: "第三者に読んでもらいフィードバックをもらう", due_date: months(3), category: "書類準備" },
        { user_id: user.id, target_university_id: uniId, title: `${uniName}の出願書類を郵送`, description: "書類の不備がないか最終確認してから郵送する", due_date: months(3), category: "出願" },
        { user_id: user.id, target_university_id: uniId, title: `${uniName}の面接対策を始める`, description: "志望動機・自己PR・学びたいことを整理して練習する", due_date: months(3), category: "試験" },
      )
    }

    // 既存タスクを削除して新規生成
    await supabase.from("tasks").delete().eq("user_id", user.id)
    await supabase.from("tasks").insert(tasks)

    return NextResponse.json({ success: true, count: tasks.length })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "エラー" }, { status: 500 })
  }
}