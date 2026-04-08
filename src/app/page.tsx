import Link from "next/link"

export default function Home() {

  return (
    <div style={{background:"var(--bg)", minHeight:"100vh", fontFamily:"Noto Sans JP,sans-serif"}}>

      {/* ナビゲーション */}
      <nav style={{
        position:"sticky", top:0, zIndex:300, height:"58px", padding:"0 24px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"rgba(248,247,244,.96)", backdropFilter:"blur(16px)",
        borderBottom:"1px solid var(--border)"
      }}>
        <div style={{display:"flex", alignItems:"center", gap:"9px"}}>
          <div style={{width:"30px", height:"30px", background:"linear-gradient(135deg,var(--teal),#06b6d4)", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px"}}>📖</div>
          <div>
            <div style={{fontFamily:"Kaisei Opti,serif", fontSize:"16px", fontWeight:700, color:"var(--ink)"}}>ユニパス</div>
            <div style={{fontSize:"10px", color:"var(--ink3)"}}>総合型選抜ナビ</div>
          </div>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:"8px"}}>
          <Link href="/login" style={{padding:"6px 14px", borderRadius:"8px", border:"1px solid var(--border)", color:"var(--ink2)", fontSize:"12px", fontWeight:600, textDecoration:"none"}}>
            ログイン
          </Link>
          <Link href="/signup" style={{padding:"7px 16px", borderRadius:"8px", background:"var(--premium)", color:"#fff", fontSize:"12px", fontWeight:700, textDecoration:"none"}}>
            無料登録
          </Link>
        </div>
      </nav>

      {/* ヒーロー：2つの価値をバンバン打ち出す */}
      <section style={{
        padding:"60px 24px 40px", textAlign:"center",
        position:"relative", overflow:"hidden"
      }}>
        <div style={{position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 30% 40%, rgba(13,148,136,.07) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 70% 60%, rgba(6,182,212,.05) 0%, transparent 60%)", pointerEvents:"none"}}/>

        <div style={{position:"relative", zIndex:1, maxWidth:"900px", margin:"0 auto"}}>
          <div style={{display:"inline-flex", alignItems:"center", gap:"6px", background:"var(--teal-bg)", border:"1px solid var(--teal-border)", borderRadius:"20px", padding:"5px 14px", fontSize:"11px", fontWeight:700, color:"var(--teal2)", letterSpacing:".1em", textTransform:"uppercase", marginBottom:"24px"}}>
            ✦ 2026年度 総合型選抜対応
          </div>

          <h1 style={{fontFamily:"Kaisei Opti,serif", fontSize:"clamp(32px,4.5vw,56px)", fontWeight:700, color:"var(--ink)", lineHeight:1.2, marginBottom:"16px"}}>
            総合型選抜の<br/>
            <span style={{background:"linear-gradient(135deg,var(--teal),#06b6d4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>「わからない」</span>を<br className="sm:hidden" />
            ゼロにする。
          </h1>
          <p style={{fontSize:"16px", color:"var(--ink2)", lineHeight:1.8, maxWidth:"520px", margin:"0 auto 32px"}}>
            522大学 · 7,980学科の最新データから、<br className="hidden sm:inline"/>あなたの受験を整理します。
          </p>
          <Link href="/guide/sougata" style={{
            display:"inline-flex", alignItems:"center", gap:"6px",
            fontSize:"13px", color:"var(--teal)", fontWeight:600, textDecoration:"none",
            background:"var(--teal-bg)", border:"1px solid var(--teal-border)",
            borderRadius:"20px", padding:"6px 16px", marginBottom:"48px"
          }}>
            📖 そもそも総合型選抜とは？ →
          </Link>
        </div>
      </section>

      {/* 2つの柱：無料 vs プレミアム */}
      <section style={{padding:"0 24px 80px", maxWidth:"960px", margin:"0 auto"}}>
        <div className="lp-two-cols" style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px"}}>

          {/* 無料カード */}
          <div style={{
            background:"var(--surface)", border:"2px solid var(--border)",
            borderRadius:"20px", padding:"36px 28px", position:"relative", overflow:"hidden",
            display:"flex", flexDirection:"column"
          }}>
            <div style={{display:"inline-flex", alignItems:"center", gap:"6px", background:"var(--teal-bg)", border:"1px solid var(--teal-border)", borderRadius:"20px", padding:"4px 12px", fontSize:"10px", fontWeight:700, color:"var(--teal2)", letterSpacing:".1em", marginBottom:"20px", alignSelf:"flex-start"}}>
              FREE · 登録不要
            </div>

            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"22px", fontWeight:700, color:"var(--ink)", lineHeight:1.3, marginBottom:"12px"}}>
              大学を比較して<br/>受験を整理する
            </h2>
            <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.7, marginBottom:"24px"}}>
              気になる大学を選ぶだけで、費用・日程・併願可否をまとめて比較。何時間もかけて調べていた情報が、一瞬で整理できます。
            </p>

            <div style={{display:"flex", flexDirection:"column", gap:"10px", marginBottom:"28px", flex:1}}>
              {[
                {icon:"💰", title:"費用シミュレーション", desc:"受験料・入学金・授業料を横並び比較"},
                {icon:"📅", title:"日程タイムライン", desc:"出願〜試験〜発表をガントチャートで可視化"},
                {icon:"⚡", title:"併願チェック", desc:"専願のみの大学を自動検出・警告"},
              ].map((f,i) => (
                <div key={i} style={{display:"flex", gap:"10px", alignItems:"flex-start"}}>
                  <span style={{fontSize:"20px", minWidth:"28px", marginTop:"1px"}}>{f.icon}</span>
                  <div>
                    <div style={{fontSize:"13px", fontWeight:700, color:"var(--ink)", marginBottom:"2px"}}>{f.title}</div>
                    <div style={{fontSize:"11px", color:"var(--ink3)", lineHeight:1.5}}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/simulator" style={{
              display:"block", padding:"14px", borderRadius:"12px",
              border:"2px solid var(--teal)", background:"transparent",
              color:"var(--teal)", fontSize:"15px", fontWeight:700,
              textDecoration:"none", textAlign:"center"
            }}>
              🔍 無料で試してみる →
            </Link>
          </div>

          {/* プレミアムカード */}
          <div style={{
            background:"linear-gradient(135deg,var(--premium),#2d2825)",
            border:"2px solid rgba(255,255,255,.1)",
            borderRadius:"20px", padding:"36px 28px", position:"relative", overflow:"hidden",
            display:"flex", flexDirection:"column"
          }}>
            <div style={{position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(45deg,rgba(255,255,255,.02) 0,rgba(255,255,255,.02) 1px,transparent 1px,transparent 8px)", pointerEvents:"none"}}/>

            <div style={{position:"relative", zIndex:1, display:"flex", flexDirection:"column", flex:1}}>
              <div style={{display:"inline-flex", alignItems:"center", gap:"6px", background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.15)", borderRadius:"20px", padding:"4px 12px", fontSize:"10px", fontWeight:700, color:"rgba(255,255,255,.7)", letterSpacing:".1em", marginBottom:"20px", alignSelf:"flex-start"}}>
                PREMIUM · ¥980/月
              </div>

              <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"22px", fontWeight:700, color:"#fff", lineHeight:1.3, marginBottom:"12px"}}>
                あなたに合った大学を<br/>合格まで伴走する
              </h2>
              <p style={{fontSize:"13px", color:"rgba(255,255,255,.65)", lineHeight:1.7, marginBottom:"24px"}}>
                AIがあなたの強み・実績を分析し、最適な大学をサジェスト。出願スケジュール、志望理由書、タスク管理まで、合格のその日まで一緒に走ります。
              </p>

              <div style={{display:"flex", flexDirection:"column", gap:"10px", marginBottom:"28px", flex:1}}>
                {[
                  {icon:"🧠", title:"AI問診 × マッチング診断", desc:"あなたに合った大学・選抜方法を提案"},
                  {icon:"📅", title:"タスク自動生成", desc:"出願〜試験の逆算スケジュールを自動作成"},
                  {icon:"✍️", title:"志望理由書サポート", desc:"あなたの実績をもとにAIが下書き・添削"},
                  {icon:"👨‍👩‍👧", title:"保護者レポート", desc:"費用・日程・リスクを1枚に。家族で共有"},
                ].map((f,i) => (
                  <div key={i} style={{display:"flex", gap:"10px", alignItems:"flex-start"}}>
                    <span style={{fontSize:"20px", minWidth:"28px", marginTop:"1px"}}>{f.icon}</span>
                    <div>
                      <div style={{fontSize:"13px", fontWeight:700, color:"#fff", marginBottom:"2px"}}>{f.title}</div>
                      <div style={{fontSize:"11px", color:"rgba(255,255,255,.5)", lineHeight:1.5}}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/signup" style={{
                display:"block", padding:"14px", borderRadius:"12px",
                background:"linear-gradient(135deg,var(--teal),#06b6d4)",
                color:"#fff", fontSize:"15px", fontWeight:700,
                textDecoration:"none", textAlign:"center",
                boxShadow:"0 4px 16px rgba(13,148,136,.3)"
              }}>
                ✦ プレミアムで始める →
              </Link>
            </div>
          </div>
        </div>

        {/* 統計バー */}
        <div className="grid grid-cols-2 md:grid-cols-4" style={{marginTop:"32px", border:"1px solid var(--border)", borderRadius:"var(--r-lg)", background:"var(--surface)", overflow:"hidden", boxShadow:"var(--sh)"}}>
          {[{num:"522",label:"収録大学数"},{num:"7,980",label:"学科・専攻数"},{num:"2026",label:"年度対応済み"},{num:"AI",label:"マッチング診断"}].map((s,i) => (
            <div key={i} className={`${i < 2 ? "border-b md:border-b-0" : ""} ${i < 3 ? "md:border-r" : ""} ${i % 2 === 0 ? "border-r md:border-r-0" : ""}`} style={{padding:"18px 24px", textAlign:"center", borderColor:"var(--border)"}}>
              <div style={{fontSize:"24px", fontWeight:900, fontFamily:"DM Mono,monospace", color:"var(--teal)"}}>{s.num}</div>
              <div style={{fontSize:"10px", color:"var(--ink3)", marginTop:"2px", fontWeight:600, letterSpacing:".05em"}}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 無料体験の流れ */}
      <section style={{background:"var(--surface2)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", padding:"60px 24px"}}>
        <div style={{maxWidth:"800px", margin:"0 auto", textAlign:"center"}}>
          <div style={{fontSize:"11px", fontWeight:700, letterSpacing:".14em", textTransform:"uppercase", color:"var(--teal)", marginBottom:"12px"}}>無料体験の流れ</div>
          <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"clamp(24px,3vw,32px)", fontWeight:700, color:"var(--ink)", lineHeight:1.3, marginBottom:"48px"}}>3ステップで、受験の全体像が見える</h2>

          <div style={{display:"flex", flexDirection:"column", gap:"0px", textAlign:"left"}}>
            {[
              {step:"1", title:"知りたいことを選ぶ", desc:"「費用を知りたい」「日程を整理したい」「併願できるか確認したい」——あなたの課題から始まります。", icon:"🎯"},
              {step:"2", title:"大学を選ぶ", desc:"名前で検索、または条件で絞り込み。気になる大学をチェックするだけ。学部・学科単位でも選べます。", icon:"🏫"},
              {step:"3", title:"シミュレーション結果を見る", desc:"選んだ大学の費用比較・日程タイムライン・併願可否がまとめて表示。「他の視点でも見る」でさらに深掘り。", icon:"📊"},
            ].map((s,i) => (
              <div key={i} style={{display:"flex", gap:"20px", alignItems:"flex-start", padding:"24px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none"}}>
                <div style={{
                  width:"44px", height:"44px", minWidth:"44px", borderRadius:"50%",
                  background:"linear-gradient(135deg,var(--teal),#06b6d4)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"18px", fontWeight:900, color:"#fff", fontFamily:"DM Mono,monospace"
                }}>{s.step}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:"15px", fontWeight:700, color:"var(--ink)", marginBottom:"6px", display:"flex", alignItems:"center", gap:"8px"}}>
                    <span>{s.icon}</span> {s.title}
                  </div>
                  <div style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.7}}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{marginTop:"32px"}}>
            <Link href="/simulator" style={{display:"inline-block", padding:"14px 40px", borderRadius:"12px", border:"2px solid var(--teal)", color:"var(--teal)", fontSize:"15px", fontWeight:700, textDecoration:"none"}}>
              今すぐ無料で試す →
            </Link>
          </div>
        </div>
      </section>

      {/* 保護者向けセクション */}
      <section style={{padding:"80px 24px", maxWidth:"1100px", margin:"0 auto"}}>
        <div className="lp-two-cols" style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"40px", alignItems:"center"}}>
          <div>
            <div style={{fontSize:"11px", fontWeight:700, letterSpacing:".14em", textTransform:"uppercase", color:"var(--teal)", marginBottom:"12px"}}>保護者の方へ</div>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"clamp(24px,2.5vw,34px)", fontWeight:700, color:"var(--ink)", lineHeight:1.3, marginBottom:"16px"}}>
              お子さんの受験、<br/>一緒に<span style={{color:"var(--teal)"}}>見える化</span>しませんか。
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:1.9, marginBottom:"28px"}}>
              「うちの子、ちゃんと準備できてるの？」<br/>
              総合型選抜は出願スケジュール・費用・専願リスクが複雑。ユニパスなら、保護者の方も一緒に把握できます。
            </p>
            <div style={{display:"flex", flexDirection:"column", gap:"12px", marginBottom:"32px"}}>
              {[
                {icon:"📊", text:"費用の全体像が一目でわかる"},
                {icon:"⚠️", text:"専願リスクを自動検出・警告"},
                {icon:"📅", text:"出願スケジュールを家族で共有"},
                {icon:"📄", text:"保護者向けレポートPDF出力"},
              ].map((item,i) => (
                <div key={i} style={{display:"flex", alignItems:"center", gap:"10px"}}>
                  <span style={{fontSize:"16px"}}>{item.icon}</span>
                  <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.6}}>{item.text}</p>
                </div>
              ))}
            </div>
            <Link href="/signup" style={{display:"inline-block", padding:"13px 28px", borderRadius:"10px", background:"var(--premium)", color:"#fff", fontSize:"14px", fontWeight:700, textDecoration:"none"}}>
              保護者として登録する →
            </Link>
          </div>
          <div style={{background:"linear-gradient(135deg,var(--teal3),var(--teal2))", borderRadius:"20px", padding:"32px", color:"#fff", position:"relative", overflow:"hidden"}}>
            <div style={{position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(45deg,rgba(255,255,255,.03) 0,rgba(255,255,255,.03) 1px,transparent 1px,transparent 8px)"}}/>
            <div style={{position:"relative", zIndex:1}}>
              <div style={{fontSize:"12px", fontWeight:700, color:"rgba(255,255,255,.6)", letterSpacing:".08em", marginBottom:"16px"}}>📄 保護者向けレポートイメージ</div>
              <div style={{background:"rgba(255,255,255,.1)", borderRadius:"12px", padding:"16px", marginBottom:"12px"}}>
                <div style={{fontSize:"11px", color:"rgba(255,255,255,.5)", marginBottom:"6px"}}>志望校リスト</div>
                {["早稲田大学 商学部","明治大学 経営学部","法政大学 経営学部"].map((u,i) => (
                  <div key={i} style={{display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px"}}>
                    <div style={{width:"18px", height:"18px", background:"rgba(255,255,255,.2)", borderRadius:"5px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"9px", fontWeight:700}}>{i+1}</div>
                    <span style={{fontSize:"11px", color:"#fff"}}>{u}</span>
                  </div>
                ))}
              </div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"12px"}}>
                <div style={{background:"rgba(255,255,255,.1)", borderRadius:"10px", padding:"12px", textAlign:"center"}}>
                  <div style={{fontSize:"18px", fontWeight:900, fontFamily:"DM Mono,monospace", color:"#5eead4"}}>¥87,000</div>
                  <div style={{fontSize:"9px", color:"rgba(255,255,255,.5)", marginTop:"2px"}}>受験料合計</div>
                </div>
                <div style={{background:"rgba(255,255,255,.1)", borderRadius:"10px", padding:"12px", textAlign:"center"}}>
                  <div style={{fontSize:"18px", fontWeight:900, fontFamily:"DM Mono,monospace", color:"#fcd34d"}}>1校</div>
                  <div style={{fontSize:"9px", color:"rgba(255,255,255,.5)", marginTop:"2px"}}>専願注意</div>
                </div>
              </div>
              <div style={{background:"rgba(255,255,255,.1)", borderRadius:"10px", padding:"12px"}}>
                <div style={{fontSize:"10px", color:"rgba(255,255,255,.5)", marginBottom:"8px"}}>出願スケジュール</div>
                {[{month:"9月", task:"早稲田大学 出願期間"},{month:"10月", task:"明治大学 試験日"},{month:"11月", task:"法政大学 結果発表"}].map((s,i) => (
                  <div key={i} style={{display:"flex", gap:"10px", alignItems:"center", marginBottom:"5px"}}>
                    <span style={{fontSize:"10px", color:"rgba(255,255,255,.5)", minWidth:"30px"}}>{s.month}</span>
                    <div style={{flex:1, height:"1px", background:"rgba(255,255,255,.15)"}}/>
                    <span style={{fontSize:"10px", color:"#fff"}}>{s.task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 利用者の声 */}
      <section style={{background:"var(--surface2)", borderTop:"1px solid var(--border)", padding:"80px 24px"}}>
        <div style={{maxWidth:"1100px", margin:"0 auto", textAlign:"center"}}>
          <div style={{fontSize:"11px", fontWeight:700, letterSpacing:".14em", textTransform:"uppercase", color:"var(--teal)", marginBottom:"12px"}}>利用者の声</div>
          <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"clamp(26px,3vw,36px)", fontWeight:700, color:"var(--ink)", marginBottom:"48px"}}>受験生・保護者から届いた声</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {quote:"専願かどうかが一目でわかったのが一番助かった。自分で調べていたときは気づかなかった大学を3校も見逃していました。", name:"高校3年生（私立）", role:"関東在住 · 経営学部志望", icon:"📚"},
              {quote:"受験料の合計がこんなに見やすく出るとは思わなかった。3パターン比較して、予算の組み方が全然変わりました。", name:"保護者（お母様）", role:"子ども：高校2年生", icon:"👩"},
              {quote:"面接が得意と診断されて、面接重視の大学を優先的に見せてもらえた。自分では気づかなかったアプローチでした。", name:"高校2年生", role:"近畿在住 · 国際学部志望", icon:"🌱"},
            ].map((t,i) => (
              <div key={i} style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"var(--r-lg)", padding:"24px", boxShadow:"var(--sh-sm)", textAlign:"left"}}>
                <div style={{fontSize:"24px", color:"var(--teal)", marginBottom:"10px"}}>"</div>
                <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8, marginBottom:"14px"}}>{t.quote}</p>
                <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
                  <div style={{width:"36px", height:"36px", borderRadius:"50%", background:"var(--surface2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px"}}>{t.icon}</div>
                  <div>
                    <div style={{fontSize:"12px", fontWeight:700, color:"var(--ink)"}}>{t.name}</div>
                    <div style={{fontSize:"11px", color:"var(--ink3)"}}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 最終CTA */}
      <section style={{padding:"80px 24px", textAlign:"center"}}>
        <div style={{maxWidth:"600px", margin:"0 auto"}}>
          <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"clamp(28px,3vw,40px)", fontWeight:700, color:"var(--ink)", lineHeight:1.3, marginBottom:"16px"}}>
            まずは無料で、<br/>試してみませんか。
          </h2>
          <p style={{fontSize:"15px", color:"var(--ink2)", lineHeight:1.8, marginBottom:"40px"}}>
            登録不要ですぐに使えます。<br/>「もっと詳しく知りたい」と思ったらプレミアムへ。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap items-center">
            <Link href="/simulator" style={{padding:"15px 32px", borderRadius:"12px", border:"2px solid var(--teal)", color:"var(--teal)", fontSize:"15px", fontWeight:700, textDecoration:"none", display:"inline-block"}}>
              🔍 無料で試す →
            </Link>
            <Link href="/signup" style={{padding:"15px 36px", borderRadius:"12px", background:"linear-gradient(135deg,var(--premium),#3d3530)", color:"#fff", fontSize:"15px", fontWeight:700, textDecoration:"none", display:"inline-block", boxShadow:"0 8px 24px rgba(26,23,20,.2)"}}>
              ✦ プレミアムで始める
            </Link>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer style={{background:"var(--premium)", padding:"48px 24px 32px", textAlign:"center"}}>
        <div style={{fontFamily:"Kaisei Opti,serif", fontSize:"22px", color:"#fff", marginBottom:"8px"}}>ユニパス</div>
        <div style={{fontSize:"13px", color:"rgba(255,255,255,.4)", marginBottom:"24px"}}>総合型選抜ナビ · 2026年度対応</div>
        <div style={{display:"flex", gap:"20px", justifyContent:"center", flexWrap:"wrap", marginBottom:"24px"}}>
          {["利用規約","プライバシーポリシー","免責事項","お問い合わせ"].map(l => (
            <span key={l} style={{fontSize:"12px", color:"rgba(255,255,255,.4)", cursor:"pointer"}}>{l}</span>
          ))}
        </div>
        <div style={{fontSize:"11px", color:"rgba(255,255,255,.25)"}}>© 2026 ユニパス. All rights reserved. · 本サービスの診断結果はAIによる参考情報です。</div>
      </footer>

      <style>{`
        @media (max-width: 767px) {
          .lp-two-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
