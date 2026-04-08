"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Step = "plan" | "register" | "payment" | "complete"

export default function SignupPage() {
  const [step, setStep] = useState<Step>("plan")
  const [userType, setUserType] = useState<"student"|"parent"|"">("")
  const [plan, setPlan] = useState<"free"|"premium">("premium")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  // Stripe モック用
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { user_type: userType } } })
    if (error) {
      setError(error.message === "User already registered" ? "このメールアドレスはすでに登録されています" : "登録に失敗しました")
      setLoading(false)
    } else {
      if (plan === "premium") setStep("payment")
      else setStep("complete")
      setLoading(false)
    }
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Stripeモック：実際の決済は未実装
    await new Promise(r => setTimeout(r, 1500))
    setStep("complete")
    setLoading(false)
  }

  return (
    <div style={{minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px", background:"var(--bg)"}}>
      <div style={{width:"100%", maxWidth:"480px"}}>

        {/* ロゴ */}
        <div style={{textAlign:"center", marginBottom:"28px"}}>
          <Link href="/" style={{textDecoration:"none", display:"inline-block"}}>
            <img src="/logo.png" alt="ユニパス" style={{height:"120px", objectFit:"contain", margin:"0 auto 12px", display:"block"}} />
          </Link>
        </div>

        {/* ステップ1: プラン選択 */}
        {step === "plan" && (
          <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"var(--r-lg)", padding:"36px", boxShadow:"var(--sh-lg)"}}>
            <h1 style={{fontFamily:"Kaisei Opti,serif", fontSize:"22px", fontWeight:700, color:"var(--ink)", textAlign:"center", marginBottom:"6px"}}>プランを選ぶ</h1>
            <p style={{fontSize:"13px", color:"var(--ink3)", textAlign:"center", marginBottom:"28px", lineHeight:1.6}}>まずどちらですか？</p>

            {/* ユーザー種別 */}
            <div style={{marginBottom:"24px"}}>
              <div style={{fontSize:"12px", fontWeight:700, color:"var(--ink2)", marginBottom:"10px"}}>あなたは</div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px"}}>
                {[{v:"student" as const, icon:"🎓", label:"受験生・高校生"}, {v:"parent" as const, icon:"👨‍👩‍👧", label:"保護者"}].map(u => (
                  <button key={u.v} type="button" onClick={() => setUserType(u.v)}
                    style={{padding:"14px", borderRadius:"12px", border:`2px solid ${userType===u.v?"var(--teal)":"var(--border)"}`, background:userType===u.v?"var(--teal-bg)":"var(--surface)", cursor:"pointer", fontFamily:"inherit", textAlign:"center", transition:".15s"}}>
                    <div style={{fontSize:"24px", marginBottom:"6px"}}>{u.icon}</div>
                    <div style={{fontSize:"12px", fontWeight:700, color:userType===u.v?"var(--teal)":"var(--ink)"}}>{u.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* プラン選択 */}
            <div style={{marginBottom:"24px"}}>
              <div style={{fontSize:"12px", fontWeight:700, color:"var(--ink2)", marginBottom:"10px"}}>プラン</div>
              <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
                {/* 無料プラン */}
                <button type="button" onClick={() => setPlan("free")}
                  style={{padding:"16px", borderRadius:"12px", border:`2px solid ${plan==="free"?"var(--teal)":"var(--border)"}`, background:plan==="free"?"var(--teal-bg)":"var(--surface)", cursor:"pointer", fontFamily:"inherit", textAlign:"left", transition:".15s", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                  <div>
                    <div style={{fontSize:"14px", fontWeight:700, color:plan==="free"?"var(--teal)":"var(--ink)"}}>無料プラン</div>
                    <div style={{fontSize:"11px", color:"var(--ink3)", marginTop:"2px"}}>大学シミュレーターのみ利用可能</div>
                  </div>
                  <div style={{fontFamily:"DM Mono,monospace", fontSize:"18px", fontWeight:700, color:"var(--ink3)"}}>¥0</div>
                </button>
                {/* プレミアムプラン */}
                <button type="button" onClick={() => setPlan("premium")}
                  style={{padding:"16px", borderRadius:"12px", border:`2px solid ${plan==="premium"?"var(--teal)":"var(--border)"}`, background:plan==="premium"?"linear-gradient(135deg,var(--premium),#2d2825)":"var(--surface)", cursor:"pointer", fontFamily:"inherit", textAlign:"left", transition:".15s", position:"relative", overflow:"hidden"}}>
                  <div style={{position:"absolute", top:"8px", right:"10px", background:"linear-gradient(135deg,var(--teal),#06b6d4)", borderRadius:"20px", padding:"2px 8px", fontSize:"9px", fontWeight:700, color:"#fff", letterSpacing:".05em"}}>おすすめ</div>
                  <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                    <div>
                      <div style={{fontSize:"14px", fontWeight:700, color:plan==="premium"?"#fff":"var(--ink)"}}>プレミアムプラン</div>
                      <div style={{fontSize:"11px", color:plan==="premium"?"rgba(255,255,255,.6)":"var(--ink3)", marginTop:"2px"}}>AI診断・志望理由書・全機能解放</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontFamily:"DM Mono,monospace", fontSize:"22px", fontWeight:700, color:plan==="premium"?"#fff":"var(--ink)"}}>¥980</div>
                      <div style={{fontSize:"9px", color:plan==="premium"?"rgba(255,255,255,.5)":"var(--ink3)"}}>/月</div>
                    </div>
                  </div>
                  {plan==="premium" && (
                    <div style={{marginTop:"12px", display:"flex", flexWrap:"wrap", gap:"5px"}}>
                      {["AI問診・診断","志望理由書生成","タスク自動生成","保護者レポート"].map(f => (
                        <span key={f} style={{background:"rgba(255,255,255,.1)", borderRadius:"20px", padding:"2px 8px", fontSize:"10px", color:"rgba(255,255,255,.8)"}}>✓ {f}</span>
                      ))}
                    </div>
                  )}
                </button>
              </div>
            </div>

            <button type="button" onClick={() => setStep("register")} disabled={!userType}
              style={{width:"100%", padding:"13px", borderRadius:"10px", border:"none", background:"var(--premium)", color:"#fff", fontSize:"14px", fontWeight:700, cursor:userType?"pointer":"not-allowed", fontFamily:"inherit", opacity:userType?1:0.4}}>
              次へ →
            </button>

            <p style={{fontSize:"12px", color:"var(--ink3)", textAlign:"center", marginTop:"16px"}}>
              すでにアカウントをお持ちですか？{" "}
              <Link href="/login" style={{color:"var(--teal)", fontWeight:600, textDecoration:"underline"}}>ログイン</Link>
            </p>
          </div>
        )}

        {/* ステップ2: アカウント登録 */}
        {step === "register" && (
          <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"var(--r-lg)", padding:"36px", boxShadow:"var(--sh-lg)"}}>
            {/* 選択プランバッジ */}
            {plan === "premium" && (
              <div style={{background:"linear-gradient(135deg,var(--premium),#3d3530)", borderRadius:"10px", padding:"12px 16px", marginBottom:"24px", display:"flex", alignItems:"center", gap:"12px"}}>
                <span style={{fontSize:"20px"}}>👑</span>
                <div>
                  <div style={{fontSize:"13px", fontWeight:700, color:"#fff"}}>プレミアムプラン</div>
                  <div style={{fontSize:"11px", color:"rgba(255,255,255,.6)", marginTop:"1px"}}>月額 ¥980 · いつでも解約可能</div>
                </div>
              </div>
            )}

            <h1 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"6px"}}>アカウント登録</h1>
            <p style={{fontSize:"13px", color:"var(--ink3)", marginBottom:"24px", lineHeight:1.6}}>
              {userType === "parent" ? "お子さんへの共有方法は登録後にご案内します" : "自分だけのユニパスを作りましょう"}
            </p>

            <form onSubmit={handleRegister} style={{display:"flex", flexDirection:"column", gap:"16px"}}>
              <div>
                <label style={{fontSize:"12px", fontWeight:700, color:"var(--ink2)", marginBottom:"6px", display:"block"}}>メールアドレス</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="example@email.com"
                  style={{width:"100%", padding:"11px 14px", border:"1.5px solid var(--border)", borderRadius:"9px", background:"var(--surface2)", color:"var(--ink)", fontSize:"13px", fontFamily:"inherit", outline:"none", boxSizing:"border-box"}}
                />
              </div>
              <div>
                <label style={{fontSize:"12px", fontWeight:700, color:"var(--ink2)", marginBottom:"6px", display:"block"}}>パスワード（8文字以上）</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                  placeholder="8文字以上で設定してください"
                  style={{width:"100%", padding:"11px 14px", border:"1.5px solid var(--border)", borderRadius:"9px", background:"var(--surface2)", color:"var(--ink)", fontSize:"13px", fontFamily:"inherit", outline:"none", boxSizing:"border-box"}}
                />
              </div>

              {error && (
                <div style={{background:"var(--rose-bg)", border:"1px solid var(--rose-border)", borderRadius:"9px", padding:"10px 14px", fontSize:"12px", color:"var(--rose)"}}>
                  ⚠️ {error}
                </div>
              )}

              {/* 特典一覧 */}
              {plan === "premium" && (
                <div style={{background:"var(--teal-bg)", border:"1px solid var(--teal-border)", borderRadius:"10px", padding:"14px"}}>
                  {["AI問診 · マッチング診断","志望理由書の自動生成・リライト","出願スケジュール自動生成","保護者向けレポートPDF出力"].map(b => (
                    <div key={b} style={{display:"flex", alignItems:"center", gap:"8px", fontSize:"12px", color:"var(--ink2)", marginBottom:"6px"}}>
                      <span style={{color:"var(--teal)", fontSize:"13px", minWidth:"16px"}}>✦</span>{b}
                    </div>
                  ))}
                </div>
              )}

              <button type="submit" disabled={loading}
                style={{width:"100%", padding:"13px", borderRadius:"10px", border:"none", background:"var(--premium)", color:"#fff", fontSize:"14px", fontWeight:700, cursor:loading?"not-allowed":"pointer", fontFamily:"inherit", marginTop:"4px", opacity:loading?0.7:1}}>
                {loading ? "登録中..." : plan === "premium" ? "登録して支払いへ →" : "無料で登録する →"}
              </button>
            </form>

            <p style={{fontSize:"11px", color:"var(--ink4)", textAlign:"center", marginTop:"14px", lineHeight:1.7}}>
              登録することで<span style={{textDecoration:"underline", cursor:"pointer"}}>利用規約</span>・<span style={{textDecoration:"underline", cursor:"pointer"}}>プライバシーポリシー</span>に同意したことになります
            </p>

            <button type="button" onClick={() => setStep("plan")} style={{display:"block", margin:"12px auto 0", background:"transparent", border:"none", color:"var(--ink3)", fontSize:"12px", cursor:"pointer", fontFamily:"inherit"}}>
              ← 戻る
            </button>
          </div>
        )}

        {/* ステップ3: 支払い（Stripeモック） */}
        {step === "payment" && (
          <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"var(--r-lg)", padding:"36px", boxShadow:"var(--sh-lg)"}}>
            <div style={{background:"linear-gradient(135deg,var(--premium),#3d3530)", borderRadius:"10px", padding:"14px 16px", marginBottom:"24px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
              <div style={{display:"flex", alignItems:"center", gap:"12px"}}>
                <span style={{fontSize:"20px"}}>👑</span>
                <div>
                  <div style={{fontSize:"13px", fontWeight:700, color:"#fff"}}>プレミアムプラン</div>
                  <div style={{fontSize:"11px", color:"rgba(255,255,255,.6)"}}>月額 ¥980 · いつでも解約可能</div>
                </div>
              </div>
              <div style={{fontFamily:"DM Mono,monospace", fontSize:"24px", fontWeight:700, color:"#fff"}}>¥980</div>
            </div>

            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"var(--ink)", marginBottom:"6px"}}>お支払い情報</h2>
            <p style={{fontSize:"13px", color:"var(--ink3)", marginBottom:"24px"}}>クレジットカード情報を入力してください</p>

            <form onSubmit={handlePayment} style={{display:"flex", flexDirection:"column", gap:"16px"}}>
              <div>
                <label style={{fontSize:"12px", fontWeight:700, color:"var(--ink2)", marginBottom:"6px", display:"block"}}>カード番号</label>
                <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim())}
                  placeholder="1234 5678 9012 3456" maxLength={19}
                  style={{width:"100%", padding:"11px 14px", border:"1.5px solid var(--border)", borderRadius:"9px", background:"var(--surface2)", color:"var(--ink)", fontSize:"13px", fontFamily:"DM Mono,monospace", outline:"none", boxSizing:"border-box"}}
                />
              </div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px"}}>
                <div>
                  <label style={{fontSize:"12px", fontWeight:700, color:"var(--ink2)", marginBottom:"6px", display:"block"}}>有効期限</label>
                  <input type="text" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)}
                    placeholder="MM / YY" maxLength={7}
                    style={{width:"100%", padding:"11px 14px", border:"1.5px solid var(--border)", borderRadius:"9px", background:"var(--surface2)", color:"var(--ink)", fontSize:"13px", fontFamily:"DM Mono,monospace", outline:"none", boxSizing:"border-box"}}
                  />
                </div>
                <div>
                  <label style={{fontSize:"12px", fontWeight:700, color:"var(--ink2)", marginBottom:"6px", display:"block"}}>セキュリティコード</label>
                  <input type="text" value={cardCvc} onChange={e => setCardCvc(e.target.value.replace(/\D/g,"").slice(0,4))}
                    placeholder="CVC" maxLength={4}
                    style={{width:"100%", padding:"11px 14px", border:"1.5px solid var(--border)", borderRadius:"9px", background:"var(--surface2)", color:"var(--ink)", fontSize:"13px", fontFamily:"DM Mono,monospace", outline:"none", boxSizing:"border-box"}}
                  />
                </div>
              </div>

              <div style={{background:"var(--surface2)", borderRadius:"9px", padding:"12px 14px", fontSize:"11px", color:"var(--ink3)", lineHeight:1.7, display:"flex", alignItems:"flex-start", gap:"8px"}}>
                <span style={{fontSize:"14px"}}>🔒</span>
                <span>お支払い情報はSSL暗号化で保護されています。カード情報は安全に処理されます。</span>
              </div>

              <button type="submit" disabled={loading}
                style={{width:"100%", padding:"13px", borderRadius:"10px", border:"none", background:"linear-gradient(135deg,var(--teal),#06b6d4)", color:"#fff", fontSize:"14px", fontWeight:700, cursor:loading?"not-allowed":"pointer", fontFamily:"inherit", opacity:loading?0.7:1}}>
                {loading ? "処理中..." : "¥980 / 月で始める →"}
              </button>
              <p style={{fontSize:"11px", color:"var(--ink4)", textAlign:"center", lineHeight:1.7}}>
                いつでもマイページからキャンセルできます
              </p>
            </form>
          </div>
        )}

        {/* ステップ4: 完了 */}
        {step === "complete" && (
          <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"var(--r-lg)", padding:"40px 36px", boxShadow:"var(--sh-lg)", textAlign:"center"}}>
            <div style={{fontSize:"56px", marginBottom:"16px"}}>🎉</div>
            <h1 style={{fontFamily:"Kaisei Opti,serif", fontSize:"24px", fontWeight:700, color:"var(--ink)", marginBottom:"10px"}}>
              {plan === "premium" ? "プレミアム登録完了！" : "登録完了！"}
            </h1>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:1.8, marginBottom:"28px"}}>
              {userType === "parent"
                ? "保護者ダッシュボードへようこそ。お子さんのアカウントと連携して見守りを始めましょう。"
                : "ユニパスへようこそ。まずはAI問診でプロフィールを作成しましょう。"}
            </p>

            {userType === "parent" && (
              <div style={{background:"var(--teal-bg)", border:"1px solid var(--teal-border)", borderRadius:"12px", padding:"16px", marginBottom:"24px"}}>
                <div style={{fontSize:"12px", fontWeight:700, color:"var(--teal2)", marginBottom:"8px"}}>🔗 連携手順</div>
                <div style={{fontSize:"12px", color:"var(--ink2)", lineHeight:1.7}}>
                  ① お子さんがマイページで「保護者を招待」ボタンを押す<br/>
                  ② 発行された招待URLをLINE/メールで受け取る<br/>
                  ③ URLを開くと自動で連携完了
                </div>
              </div>
            )}

            {plan === "premium" && userType !== "parent" && (
              <div style={{background:"var(--teal-bg)", border:"1px solid var(--teal-border)", borderRadius:"12px", padding:"16px", marginBottom:"24px", textAlign:"left"}}>
                <div style={{fontSize:"12px", fontWeight:700, color:"var(--teal2)", marginBottom:"10px"}}>✦ 利用可能な機能</div>
                {["AI問診・マッチング診断","志望理由書の自動生成","出願スケジュール自動生成","大学シミュレーター（全機能）","保護者向けレポートPDF"].map(f => (
                  <div key={f} style={{display:"flex", alignItems:"center", gap:"8px", fontSize:"12px", color:"var(--ink2)", marginBottom:"5px"}}>
                    <span style={{color:"var(--teal)"}}>✓</span>{f}
                  </div>
                ))}
              </div>
            )}

            {userType === "parent" ? (
              <Link href="/parent"
                style={{display:"block", width:"100%", padding:"14px", borderRadius:"10px", background:"var(--premium)", color:"#fff", fontSize:"14px", fontWeight:700, textDecoration:"none", textAlign:"center", boxSizing:"border-box"}}>
                👨‍👩‍👧 保護者ダッシュボードへ →
              </Link>
            ) : (
              <Link href={plan === "premium" ? "/questionnaire" : "/simulator"}
                style={{display:"block", width:"100%", padding:"14px", borderRadius:"10px", background:"var(--premium)", color:"#fff", fontSize:"14px", fontWeight:700, textDecoration:"none", textAlign:"center", boxSizing:"border-box"}}>
                {plan === "premium" ? "✦ AI問診を始める →" : "🔍 シミュレーターを使う →"}
              </Link>
            )}

            {plan === "premium" && userType !== "parent" && (
              <Link href="/mypage" style={{display:"block", marginTop:"10px", fontSize:"12px", color:"var(--ink3)", textDecoration:"none"}}>
                マイページへ →
              </Link>
            )}
          </div>
        )}

        <p style={{textAlign:"center", marginTop:"20px", fontSize:"11px", color:"var(--ink4)"}}>
          <Link href="/" style={{color:"var(--ink3)", textDecoration:"none"}}>← トップに戻る</Link>
        </p>
      </div>
    </div>
  )
}