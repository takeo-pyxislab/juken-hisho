import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function POST(req: NextRequest) {
  try {
    const { profile_id, answers } = await req.json()
    const supabase = await createClient()

    // モックデータ（APIキーなしでも動作確認できる）
    const mockResult = {
      profile_summary: `${answers.directions?.join("・") || "様々な分野"}に興味を持ち、${answers.good_subjects?.join("・") || "複数の科目"}が得意なあなたは、自分の意見を論理的に伝える力を持っています。課外活動で培った経験は、総合型選抜で大きな強みになります。`,
      strength_tags: ["主体性", "探究心", "コミュニケーション力"],
      selection_fit: {
        interview: Math.min(95, 60 + (answers.scales?.talk || 3) * 7),
        essay: Math.min(95, 55 + (answers.scales?.write || 3) * 7),
        portfolio: Math.min(95, 50 + (answers.scales?.creative || 3) * 7),
        presentation: Math.min(95, 55 + (answers.scales?.present || 3) * 7),
      },
      recommended_faculties: [
        answers.directions?.[0] || "経営学部",
        answers.directions?.[1] || "国際学部",
        answers.directions?.[2] || "情報学部",
      ].filter(Boolean).slice(0, 3),
      suggested_universities: [
        {
          name: "法政大学",
          faculty: "経営学部",
          reason: "総合型選抜の実績が豊富で、あなたの活動経験が評価されやすい環境です。",
          is_anaba: false,
        },
        {
          name: "東洋大学",
          faculty: "国際学部",
          reason: "グローバルな視点を重視した選抜で、語学力と課外活動が強みになります。",
          is_anaba: true,
        },
        {
          name: "立命館大学",
          faculty: "政策科学部",
          reason: "関西圏で総合型選抜の受け入れが積極的。プレゼン型の選抜が得意な方に向いています。",
          is_anaba: false,
        },
      ],
      advice: "あなたの最大の強みは、自分の経験を言語化できる力です。志望理由書では、なぜその大学・学部でなければならないかを具体的なエピソードと結びつけて表現しましょう。面接では自分の言葉で話すことを意識してください。",
      next_actions: [
        "志望大学のオープンキャンパスに参加して、具体的な志望動機を見つける",
        "自分の活動実績を400字程度でまとめる練習をする",
        "志望理由書の下書きを今週中に1本書いてみる",
      ],
    }

    const { data: userData } = await supabase.auth.getUser()
    const { data: result } = await supabase
      .from("analysis_results")
      .insert({
        user_id: userData.user?.id,
        profile_id,
        ...mockResult,
      })
      .select()
      .single()

    return NextResponse.json(result || { error: "保存失敗" })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "エラーが発生しました" }, { status: 500 })
  }
}
