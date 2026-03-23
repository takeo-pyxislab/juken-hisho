"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const STEPS = 6

export default function QuestionnairePage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [answers, setAnswers] = useState({
    user_type: "",
    directions: [] as string[],
    good_subjects: [] as string[],
    bad_subjects: [] as string[],
    activities: [] as string[],
    activity_detail: "",
    scales: { talk: 3, write: 3, present: 3, logic: 3, creative: 3, leader: 3 },
    regions: [] as string[],
    cost_pref: "",
    kyotsuu: "",
    other_text: "",
  })
  const router = useRouter()
  const supabase = createClient()

  const toggle = (key: keyof typeof answers, val: string) => {
    const arr = answers[key] as string[]
    setAnswers(a => ({ ...a, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/login"); return }

    const { data: profile } = await supabase.from("profiles").insert({
      user_id: user.id, ...answers
    }).select().single()

    if (profile) {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_id: profile.id, answers })
      })
      const result = await res.json()
      if (result.id) {
        router.push(`/result/${result.id}`)
      }
    }
    setLoading(false)
  }

  const Chip = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
    <button type="button" onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition ${selected ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"}`}>
      {label}
    </button>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => step > 1 ? setStep(s => s - 1) : router.push("/mypage")} className="text-gray-400 hover:text-gray-600">←</button>
            <h1 className="text-lg font-bold text-indigo-700">AI問診</h1>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: STEPS }).map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < step ? "bg-indigo-600" : "bg-gray-200"}`} />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">Step {step} / {STEPS}</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">あなたはどちらですか？</h2>
            <p className="text-gray-500 text-sm mb-6">当てはまるものを選んでください</p>
            <div className="grid grid-cols-1 gap-4">
              {[
                { val: "student_hs", label: "高校生・受験生", icon: "🎓", desc: "自分の受験について調べたい" },
                { val: "student_ms", label: "中学生", icon: "📚", desc: "将来の進路について調べたい" },
                { val: "parent", label: "保護者", icon: "👨‍👩‍👧", desc: "子どもの受験をサポートしたい" },
              ].map(({ val, label, icon, desc }) => (
                <button key={val} type="button" onClick={() => setAnswers(a => ({ ...a, user_type: val }))}
                  className={`p-4 rounded-xl border-2 text-left transition ${answers.user_type === val ? "border-indigo-600 bg-indigo-50" : "border-gray-200 bg-white hover:border-indigo-300"}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <p className="font-bold text-gray-800">{label}</p>
                      <p className="text-sm text-gray-500">{desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">興味のある分野を選んでください</h2>
            <p className="text-gray-500 text-sm mb-6">複数選択OK</p>
            <div className="flex flex-wrap gap-3">
              {["医療・看護・福祉", "理工学・情報", "教育・心理", "法律・政治・経済", "経営・商学", "文学・語学・歴史", "芸術・デザイン", "農学・食品・環境", "スポーツ・体育", "国際・外国語", "まだわからない"].map(d => (
                <Chip key={d} label={d} selected={answers.directions.includes(d)} onClick={() => toggle("directions", d)} />
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">得意な科目は？</h2>
              <p className="text-gray-500 text-sm mb-4">複数選択OK</p>
              <div className="flex flex-wrap gap-3">
                {["英語", "国語", "数学", "理科", "社会", "芸術・音楽", "体育", "情報"].map(s => (
                  <Chip key={s} label={s} selected={answers.good_subjects.includes(s)} onClick={() => toggle("good_subjects", s)} />
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">苦手な科目は？</h2>
              <div className="flex flex-wrap gap-3">
                {["英語", "国語", "数学", "理科", "社会", "芸術・音楽", "体育", "情報"].map(s => (
                  <Chip key={s} label={s} selected={answers.bad_subjects.includes(s)} onClick={() => toggle("bad_subjects", s)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">課外活動・実績を教えてください</h2>
            <p className="text-gray-500 text-sm mb-6">当てはまるものをすべて選択</p>
            <div className="flex flex-wrap gap-3 mb-6">
              {["部活動（運動系）", "部活動（文化系）", "生徒会・委員会", "ボランティア", "インターンシップ", "資格・検定", "スポーツ競技実績", "コンクール・大会入賞", "起業・ビジネス活動", "海外経験・留学", "特になし"].map(a => (
                <Chip key={a} label={a} selected={answers.activities.includes(a)} onClick={() => toggle("activities", a)} />
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">具体的なエピソードがあれば（任意）</label>
              <textarea value={answers.activity_detail} onChange={e => setAnswers(a => ({ ...a, activity_detail: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                rows={4} placeholder="例：陸上部で全国大会に出場、英検準1級取得、地域の防災ボランティアに3年間参加..." />
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">あなたの強みを教えてください</h2>
            <p className="text-gray-500 text-sm mb-6">各項目を5段階で評価してください</p>
            <div className="space-y-5">
              {[
                { key: "talk", label: "人と話す・コミュニケーション", low: "苦手", high: "得意" },
                { key: "write", label: "文章を書く・表現する", low: "苦手", high: "得意" },
                { key: "present", label: "人前で発表・プレゼン", low: "苦手", high: "得意" },
                { key: "logic", label: "論理的に考える・分析する", low: "苦手", high: "得意" },
                { key: "creative", label: "アイデアを出す・創造する", low: "苦手", high: "得意" },
                { key: "leader", label: "チームをまとめる・リード", low: "苦手", high: "得意" },
              ].map(({ key, label, low, high }) => (
                <div key={key} className="bg-white rounded-xl p-4 border border-gray-200">
                  <p className="font-medium text-gray-700 mb-3 text-sm">{label}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-10">{low}</span>
                    <div className="flex gap-2 flex-1 justify-center">
                      {[1,2,3,4,5].map(v => (
                        <button key={v} type="button"
                          onClick={() => setAnswers(a => ({ ...a, scales: { ...a.scales, [key]: v } }))}
                          className={`w-10 h-10 rounded-full font-bold text-sm transition ${(answers.scales as Record<string, number>)[key] === v ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-indigo-100"}`}>
                          {v}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 w-10 text-right">{high}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">受験の条件を教えてください</h2>
              <p className="text-gray-500 text-sm mb-6">志望校選びに活用します</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">通学・進学エリア（複数可）</label>
              <div className="flex flex-wrap gap-2">
                {["北海道・東北", "関東", "東京", "中部・北陸", "関西", "中国・四国", "九州・沖縄", "全国どこでも"].map(r => (
                  <Chip key={r} label={r} selected={answers.regions.includes(r)} onClick={() => toggle("regions", r)} />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">年間費用の目安</label>
              <div className="grid grid-cols-1 gap-2">
                {["100万円未満（国公立志望）", "150万円程度", "200万円程度", "費用は問わない"].map(c => (
                  <button key={c} type="button" onClick={() => setAnswers(a => ({ ...a, cost_pref: c }))}
                    className={`p-3 rounded-xl border-2 text-left text-sm transition ${answers.cost_pref === c ? "border-indigo-600 bg-indigo-50 font-medium" : "border-gray-200 bg-white hover:border-indigo-300"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">共通テストの受験予定</label>
              <div className="flex gap-3">
                {["受験予定", "未定", "受験しない"].map(k => (
                  <button key={k} type="button" onClick={() => setAnswers(a => ({ ...a, kyotsuu: k }))}
                    className={`flex-1 p-3 rounded-xl border-2 text-sm text-center transition ${answers.kyotsuu === k ? "border-indigo-600 bg-indigo-50 font-medium" : "border-gray-200 bg-white hover:border-indigo-300"}`}>
                    {k}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-2xl mx-auto">
          {step < STEPS ? (
            <button onClick={() => setStep(s => s + 1)}
              disabled={step === 1 && !answers.user_type}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-40 transition">
              次へ →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-40 transition">
              {loading ? "AIが診断中..." : "✨ 診断結果を見る"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}