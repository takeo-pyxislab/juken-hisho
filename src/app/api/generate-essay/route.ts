import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function POST(req: NextRequest) {
  try {
    const { university, dept, limit, theme, user_id } = await req.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "未認証" }, { status: 401 })

    // プロフィール情報を取得
    const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).single()
    const { data: analysis } = await supabase.from("analysis_results").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).single()

    // モックで生成（後でClaude APIに切り替え）
    const profileSummary = analysis?.profile_summary || "様々な活動に積極的に取り組んできました"
    const activities = profile?.activities?.join("・") || "部活動・ボランティア"
    const directions = profile?.directions?.join("・") || dept

    const mockEssay = `私が${university}${dept}を志望する理由は、${directions}の分野で社会に貢献したいという強い意志があるからです。

高校時代、${activities}に取り組む中で、${profileSummary}。この経験を通じて、問題を多角的に捉え、粘り強く解決策を模索する力が身につきました。

${theme ? `特に、${theme}というテーマに強い関心を持っています。この課題は現代社会において極めて重要であり、` : ""}${dept}で学ぶことで、この分野の専門知識と実践的なスキルを習得したいと考えています。

${university}を選んだ理由は、貴学の教育理念と充実したカリキュラムに共感したからです。特に少人数制のゼミと実践的な学びの場は、私の成長に最適な環境だと確信しています。

入学後は、積極的にゼミ活動や課外活動に参加し、多様なバックグラウンドを持つ仲間と切磋琢磨しながら、専門性を高めていきたいと思います。そして将来は、${directions}の分野で社会課題の解決に貢献できる人材になることを目指します。`.slice(0, limit)

    const { data: result } = await supabase.from("personal_statements").insert({
      user_id: user.id,
      university_name: university,
      department: dept,
      word_limit: limit,
      custom_theme: theme,
      content: mockEssay,
      version: 1,
    }).select().single()

    return NextResponse.json(result || { error: "保存失敗" })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "エラー" }, { status: 500 })
  }
}