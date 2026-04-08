"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const STEPS = 7

type Answers = {
  nickname: string
  user_type: string
  grade: string
  prefecture: string
  school_type: string
  commute_pref: string
  gpa_range: string
  eiken_level: string
  directions: string[]
  target_faculties: string[]
  target_universities_text: string[]
  good_subjects: string[]
  bad_subjects: string[]
  activities: string[]
  achievement_level: string
  activity_detail: string
  scales: Record<string, number>
  regions: string[]
  cost_pref: string
  kyotsuu: string
  other_text: string
}

const PREFECTURES = ["北海道","青森","岩手","宮城","秋田","山形","福島","茨城","栃木","群馬","埼玉","千葉","東京","神奈川","新潟","富山","石川","福井","山梨","長野","岐阜","静岡","愛知","三重","滋賀","京都","大阪","兵庫","奈良","和歌山","鳥取","島根","岡山","広島","山口","徳島","香川","愛媛","高知","福岡","佐賀","長崎","熊本","大分","宮崎","鹿児島","沖縄"]

export default function QuestionnairePage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [answers, setAnswers] = useState<Answers>({
    nickname: "",
    user_type: "",
    grade: "",
    prefecture: "",
    school_type: "",
    commute_pref: "",
    gpa_range: "",
    eiken_level: "",
    directions: [],
    target_faculties: [],
    target_universities_text: [],
    good_subjects: [],
    bad_subjects: [],
    activities: [],
    achievement_level: "",
    activity_detail: "",
    scales: { talk: 3, write: 3, present: 3, logic: 3, creative: 3, leader: 3 },
    regions: [],
    cost_pref: "",
    kyotsuu: "",
    other_text: "",
  })
  const router = useRouter()
  const supabase = createClient()

  const toggle = (key: keyof Answers, val: string) => {
    const arr = (answers[key] as string[]) || []
    setAnswers(a => ({ ...a, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] }))
  }

  const set = (key: keyof Answers, val: string | number) => setAnswers(a => ({ ...a, [key]: val }))

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
      if (result.id) router.push(`/result/${result.id}`)
      else router.push("/mypage")
    }
    setLoading(false)
  }

  const Chip = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
    <button type="button" onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition ${selected ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"}`}>
      {label}
    </button>
  )

  const Card = ({ val, current, label, icon, sub, onClick }: { val: string; current: string; label: string; icon?: string; sub?: string; onClick: () => void }) => (
    <button type="button" onClick={onClick}
      className={`p-4 rounded-xl border-2 text-left transition w-full ${current === val ? "border-indigo-600 bg-indigo-50" : "border-gray-200 bg-white hover:border-indigo-300"}`}>
      <div className="flex items-center gap-3">
        {icon && <span className="text-2xl">{icon}</span>}
        <div>
          <p className="font-bold text-gray-800 text-sm">{label}</p>
          {sub && <p className="text-xs text-gray-500">{sub}</p>}
        </div>
        {current === val && <span className="ml-auto text-indigo-600 text-sm">✓</span>}
      </div>
    </button>
  )

  const canNext = () => {
    if (step === 1) return !!answers.nickname && !!answers.user_type
    if (step === 2) return !!answers.prefecture
    return true
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => step > 1 ? setStep(s => s-1) : router.push("/mypage")} className="text-gray-400 hover:text-gray-600 text-lg">←</button>
            <h1 className="text-lg font-bold text-indigo-700">ユニパス プロフィール作成</h1>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: STEPS }).map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < step ? "bg-indigo-600" : "bg-gray-200"}`} />
            ))}
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-400">Step {step} / {STEPS}　<span className="text-indigo-400 font-medium">約{Math.ceil((STEPS - step + 1) * 0.4)}分で完了</span></p>
            <p className="text-xs text-gray-400">{Math.round((step - 1) / STEPS * 100)}%</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* Step 1: 基本情報 */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full mb-3">✦ 全7問・約3分で完了します</div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">はじめに教えてください</h2>
              <p className="text-gray-500 text-sm mb-5">個人を特定する情報はお預かりしません</p>
              <label className="block text-sm font-medium text-gray-700 mb-2">ニックネーム（アプリ内での表示名）</label>
              <input value={answers.nickname} onChange={e => set("nickname", e.target.value)}
                placeholder="例：たろう、受験生A"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">あなたはどちらですか？</label>
              <div className="grid grid-cols-1 gap-3">
                <Card val="student_hs" current={answers.user_type} label="高校生・受験生" icon="🎓" sub="高1〜高3" onClick={() => set("user_type", "student_hs")} />
                <Card val="student_ms" current={answers.user_type} label="中学生" icon="📚" sub="将来の進路を考えたい" onClick={() => set("user_type", "student_ms")} />
                <Card val="parent" current={answers.user_type} label="保護者" icon="👨‍👩‍��" sub="子どもの受験をサポートしたい" onClick={() => set("user_type", "parent")} />
              </div>
            </div>
            {answers.user_type === "student_hs" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">学年</label>
                <div className="flex gap-3">
                  {["高校1年生","高校2年生","高校3年生"].map(g => (
                    <button key={g} type="button" onClick={() => set("grade", g)}
                      className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition ${answers.grade === g ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300"}`}>
                      {g.replace("高校","")}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: 居住地・学校情報 */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 text-xs font-bold px-3 py-1 rounded-full mb-3">👍 いいスタートです！続けましょう</div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">居住地・学校について</h2>
              <p className="text-gray-500 text-sm mb-5">地域ごとの傾向分析に活用します</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">居住している都道府県</label>
              <select value={answers.prefecture} onChange={e => set("prefecture", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="">選択してください</option>
                {PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">高校の種別</label>
              <div className="grid grid-cols-3 gap-3">
                {[{v:"public",l:"公立"},{v:"private",l:"私立"},{v:"national",l:"国立"}].map(s => (
                  <button key={s.v} type="button" onClick={() => set("school_type", s.v)}
                    className={`py-3 rounded-xl border-2 text-sm font-medium transition ${answers.school_type === s.v ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300"}`}>
                    {s.l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">大学進学時の通学・居住希望</label>
              <div className="grid grid-cols-1 gap-2">
                {[{v:"home",l:"自宅から通いたい",s:"交通費を抑えたい"},{v:"ok",l:"一人暮らしもOK",s:"全国の大学を検討"},{v:"prefer_home",l:"できれば自宅から",s:"条件次第で一人暮らしも可"}].map(c => (
                  <Card key={c.v} val={c.v} current={answers.commute_pref} label={c.l} sub={c.s} onClick={() => set("commute_pref", c.v)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: 学力・資格情報 */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full mb-3">📊 折り返し地点まであと少し</div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">学力・資格について</h2>
              <p className="text-gray-500 text-sm mb-5">出願要件との照合に使います</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">評定平均の目安</label>
              <div className="grid grid-cols-2 gap-3">
                {[{v:"under3.5",l:"3.5未満"},{v:"3.5-4.0",l:"3.5〜4.0"},{v:"4.0-4.5",l:"4.0〜4.5"},{v:"over4.5",l:"4.5以上"}].map(g => (
                  <button key={g.v} type="button" onClick={() => set("gpa_range", g.v)}
                    className={`py-3 rounded-xl border-2 text-sm font-medium transition ${answers.gpa_range === g.v ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300"}`}>
                    {g.l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">英語資格（最高レベル）</label>
              <div className="grid grid-cols-2 gap-3">
                {[{v:"none",l:"なし"},{v:"eiken3",l:"英検3級"},{v:"eiken2j",l:"英検準2級"},{v:"eiken2",l:"英検2級"},{v:"eiken1j",l:"英検準1級"},{v:"eiken1",l:"英検1級以上"}].map(e => (
                  <button key={e.v} type="button" onClick={() => set("eiken_level", e.v)}
                    className={`py-3 rounded-xl border-2 text-sm font-medium transition ${answers.eiken_level === e.v ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300"}`}>
                    {e.l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">得意な科目（複数可）</label>
              <div className="flex flex-wrap gap-2">
                {["英語","国語","数学","物理","化学","生物","歴史・地理","公民","芸術・音楽","体育","情報"].map(s => (
                  <Chip key={s} label={s} selected={answers.good_subjects.includes(s)} onClick={() => toggle("good_subjects", s)} />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">苦手な科目（複数可）</label>
              <div className="flex flex-wrap gap-2">
                {["英語","国語","数学","物理","化学","生物","歴史・地理","公民","芸術・音楽","体育","情報"].map(s => (
                  <Chip key={s} label={s} selected={answers.bad_subjects.includes(s)} onClick={() => toggle("bad_subjects", s)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: 志望情報 */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">志望について教えてください</h2>
              <p className="text-gray-500 text-sm mb-5">登録した志望校は優先的にシミュレーターに反映されます</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">興味のある学部系統（複数可）</label>
              <div className="flex flex-wrap gap-2">
                {["医療・看護・福祉","理工学・情報","教育・心理","法律・政治・経済","経営・商学","文学・語学・歴史","芸術・デザイン","農学・食品・環境","スポーツ・体育","国際・外国語","まだわからない"].map(d => (
                  <Chip key={d} label={d} selected={answers.directions.includes(d)} onClick={() => toggle("directions", d)} />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">気になっている大学（任意・複数可）</label>
              <p className="text-xs text-gray-400 mb-2">志望校として登録され、シミュレーターで優先表示されます</p>
              <textarea
                value={answers.target_universities_text.join("\n")}
                onChange={e => setAnswers(a => ({ ...a, target_universities_text: e.target.value.split("\n").filter((v: string) => v.trim()) }))}
                placeholder="例：&#13;&#10;早稲田大学&#13;&#10;慶應義塾大学&#13;&#10;東京大学"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                rows={4}
              />
              <p className="text-xs text-gray-400 mt-1">1行に1大学で入力してください</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">希望エリア（複数可）</label>
              <div className="flex flex-wrap gap-2">
                {["北海道・東北","関東","東京","中部・北陸","関西","中国・四国","九州・沖縄","全国どこでも"].map(r => (
                  <Chip key={r} label={r} selected={answers.regions.includes(r)} onClick={() => toggle("regions", r)} />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">年間費用の目安</label>
              <div className="grid grid-cols-1 gap-2">
                {["100万円未満（国公立志望）","150万円程度","200万円程度","費用は問わない"].map(c => (
                  <button key={c} type="button" onClick={() => set("cost_pref", c)}
                    className={`p-3 rounded-xl border-2 text-left text-sm transition ${answers.cost_pref === c ? "border-indigo-600 bg-indigo-50 font-medium text-indigo-700" : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: 課外活動 */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 text-xs font-bold px-3 py-1 rounded-full mb-3">🔥 ここが診断精度を上げる重要ポイント！</div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">課外活動・実績</h2>
              <p className="text-gray-500 text-sm mb-5">総合型選抜の評価材料になります</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">活動カテゴリ（複数可）</label>
              <div className="flex flex-wrap gap-2">
                {["部活動（運動系）","部活動（文化系）","生徒会・委員会","ボランティア","インターンシップ","資格・検定","スポーツ競技実績","コンクール・大会入賞","起業・ビジネス活動","海外経験・留学","探究学習・研究","特になし"].map(a => (
                  <Chip key={a} label={a} selected={answers.activities.includes(a)} onClick={() => toggle("activities", a)} />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">実績の最高レベル</label>
              <div className="grid grid-cols-2 gap-3">
                {[{v:"none",l:"特になし"},{v:"local",l:"地区・市区町村レベル"},{v:"pref",l:"都道府県レベル"},{v:"national",l:"全国レベル"},{v:"international",l:"国際レベル"}].map(lv => (
                  <button key={lv.v} type="button" onClick={() => set("achievement_level", lv.v)}
                    className={`py-3 rounded-xl border-2 text-sm font-medium transition ${answers.achievement_level === lv.v ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300"}`}>
                    {lv.l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">具体的なエピソード（任意）</label>
              <textarea value={answers.activity_detail} onChange={e => set("activity_detail", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                rows={4} placeholder="例：陸上部で全国大会出場、英検準1級取得、地域の防災ボランティアに3年間参加..." />
            </div>
          </div>
        )}

        {/* Step 6: パーソナリティ */}
        {step === 6 && (
          <div className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-600 text-xs font-bold px-3 py-1 rounded-full mb-3">✨ あと2問！もう少しです</div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">あなたの強みを教えてください</h2>
              <p className="text-gray-500 text-sm mb-5">選抜方式との相性診断に使います</p>
            </div>
            {[
              {id:"talk", label:"人と話す・コミュニケーション"},
              {id:"write", label:"文章を書く・表現する"},
              {id:"present", label:"人前で発表・プレゼン"},
              {id:"logic", label:"論理的に考える・分析する"},
              {id:"creative", label:"アイデアを出す・創造する"},
              {id:"leader", label:"チームをまとめる・リード"},
            ].map(({ id, label }) => (
              <div key={id} className="bg-white rounded-xl p-4 border border-gray-200">
                <p className="font-medium text-gray-700 mb-3 text-sm">{label}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-8">苦手</span>
                  <div className="flex gap-2 flex-1 justify-center">
                    {[1,2,3,4,5].map(v => (
                      <button key={v} type="button"
                        onClick={() => setAnswers(a => ({ ...a, scales: { ...a.scales, [id]: v } }))}
                        className={`w-10 h-10 rounded-full font-bold text-sm transition ${answers.scales[id] === v ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-indigo-100"}`}>
                        {v}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">得意</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 7: 受験条件・備考 */}
        {step === 7 && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-600 text-xs font-bold px-3 py-1 rounded-full mb-3">🎉 最後の質問です！あと少し</div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">最後に確認です</h2>
              <p className="text-gray-500 text-sm mb-5">残りの条件を教えてください</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">共通テストの受験予定</label>
              <div className="flex gap-3">
                {["受験予定","未定","受験しない"].map(k => (
                  <button key={k} type="button" onClick={() => set("kyotsuu", k)}
                    className={`flex-1 p-3 rounded-xl border-2 text-sm text-center transition ${answers.kyotsuu === k ? "border-indigo-600 bg-indigo-50 font-medium text-indigo-700" : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300"}`}>
                    {k}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">その他・気になること（任意）</label>
              <textarea value={answers.other_text} onChange={e => set("other_text", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                rows={3} placeholder="受験に関して不安なこと、特別な事情など何でも" />
            </div>
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
              <h3 className="font-bold text-indigo-800 text-sm mb-2">📋 入力内容の確認</h3>
              <div className="text-xs text-indigo-700 space-y-1">
                <p>ニックネーム：{answers.nickname || "未入力"}</p>
                <p>居住地：{answers.prefecture || "未選択"}</p>
                <p>志望分野：{answers.directions.slice(0,2).join("・") || "未選択"}{answers.directions.length > 2 ? `他${answers.directions.length-2}件` : ""}</p>
                <p>気になる大学：{answers.target_universities_text.length > 0 ? answers.target_universities_text.slice(0,2).join("・") : "未登録"}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-2xl mx-auto">
          {step < STEPS ? (
            <button onClick={() => setStep(s => s+1)} disabled={!canNext()}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-40 transition">
              次へ →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-40 transition">
              {loading ? "AIが診断中..." : "✨ AI診断スタート"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}