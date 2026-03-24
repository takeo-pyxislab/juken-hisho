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
            <div style={{fontFamily:"Kaisei Opti,serif", fontSize:"16px", fontWeight:700, color:"var(--ink)"}}>受験秘書</div>
            <div style={{fontSize:"10px", color:"var(--ink3)"}}>総合型選抜ナビ</div>
          </div>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:"8px"}}>
          <Link href="/simulator" style={{padding:"6px 12px", borderRadius:"8px", color:"var(--ink2)", fontSize:"12px", fontWeight:600, textDecoration:"none", display:"none"}}>
            無料シミュレーター
          </Link>
          <Link href="/login" style={{padding:"6px 14px", borderRadius:"8px", border:"1px solid var(--border)", color:"var(--ink2)", fontSize:"12px", fontWeight:600, textDecoration:"none"}}>
            ログイン
          </Link>
          <Link href="/signup" style={{padding:"7px 16px", borderRadius:"8px", background:"var(--premium)", color:"#fff", fontSize:"12px", fontWeight:700, textDecoration:"none"}}>
            無料登録
          </Link>
        </div>
      </nav>

      {/* ヒーロー */}
      <section style={{
        minHeight:"calc(100vh - 58px)",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        padding:"60px 24px 80px", position:"relative", overflow:"hidden", textAlign:"center"
      }}>
        <div style={{position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 30% 40%, rgba(13,148,136,.07) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 70% 60%, rgba(6,182,212,.05) 0%, transparent 60%)", pointerEvents:"none"}}/>
        <div style={{position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 27px,rgba(26,23,20,.025) 27px,rgba(26,23,20,.025) 28px)", pointerEvents:"none"}}/>

        <div style={{display:"inline-flex", alignItems:"center", gap:"6px", background:"var(--teal-bg)", border:"1px solid var(--teal-border)", borderRadius:"20px", padding:"5px 14px", fontSize:"11px", fontWeight:700, color:"var(--teal2)", letterSpacing:".1em", textTransform:"uppercase", marginBottom:"24px", position:"relative", zIndex:1}}>
          ✦ 2026年度 総合型選抜対応
        </div>

        <h1 style={{fontFamily:"Kaisei Opti,serif", fontSize:"clamp(36px,5vw,64px)", fontWeight:700, color:"var(--ink)", lineHeight:1.2, marginBottom:"20px", position:"relative", zIndex:1}}>
          受験のすべてを、<br/>
          <span style={{background:"linear-gradient(135deg,var(--teal),#06b6d4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>あなただけの秘書</span>が<br/>
          サポートする。
        </h1>

        <p style={{fontSize:"17px", color:"var(--ink2)", lineHeight:1.9, maxWidth:"560px", margin:"0 auto 40px", position:"relative", zIndex:1}}>
          522大学・7,980学科の最新データとAIが、出願日程・費用・併願可否の整理から、あなたに合った大学のサジェストまで、ひとつのツールで完結させます。
        </p>

        {/* 2つのCTAボタン */}
        <div style={{display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap", position:"relative", zIndex:1, marginBottom:"60px"}}>
          <Link href="/simulator" style={{
            padding:"15px 32px", borderRadius:"12px",
            border:"2px solid var(--border2)", background:"var(--surface)",
            color:"var(--ink)", fontSize:"15px", fontWeight:700, textDecoration:"none",
            display:"inline-block", transition:".2s"
          }}>
            🔍 無料で試す（登録不要）
          </Link>
          <Link href="/signup" style={{
            padding:"15px 36px", borderRadius:"12px", border:"none",
            background:"linear-gradient(135deg,var(--premium),#3d3530)",
            color:"#fff", fontSize:"15px", fontWeight:700, textDecoration:"none",
            display:"inline-block", boxShadow:"0 8px 24px rgba(26,23,20,.2)"
          }}>
            ✦ プレミアムで始める
          </Link>
        </div>

        {/* 統計 */}
        <div style={{display:"flex", border:"1px solid var(--border)", borderRadius:"var(--r-lg)", background:"var(--surface)", overflow:"hidden", boxShadow:"var(--sh)", position:"relative", zIndex:1, flexWrap:"wrap"}}>
          {[{num:"522",label:"収録大学数"},{num:"7,980",label:"学科・専攻数"},{num:"2026",label:"年度対応済み"},{num:"AI",label:"マッチング診断"}].map((s,i) => (
            <div key={i} style={{padding:"20px 32px", textAlign:"center", borderRight: i < 3 ? "1px solid var(--border)" : "none"}}>
              <div style={{fontSize:"28px", fontWeight:900, fontFamily:"DM Mono,monospace", color:"var(--teal)"}}>{s.num}</div>
              <div style={{fontSize:"11px", color:"var(--ink3)", marginTop:"3px", fontWeight:600, letterSpacing:".05em"}}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 利用の流れ */}
      <section style={{padding:"80px 24px", maxWidth:"1100px", margin:"0 auto", textAlign:"center"}}>
        <div style={{fontSize:"11px", fontWeight:700, letterSpacing:".14em", textTransform:"uppercase", color:"var(--teal)", marginBottom:"12px"}}>使い方</div>
        <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"clamp(26px,3vw,36px)", fontWeight:700, color:"var(--ink)", lineHeight:1.3, marginBottom:"48px"}}>4ステップで、受験計画が完成する</h2>
        <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0", position:"relative"}}>
          <div style={{position:"absolute", top:"28px", left:"calc(12.5%)", right:"calc(12.5%)", height:"2px", background:"linear-gradient(90deg,var(--teal),#06b6d4)", zIndex:0}}/>
          {[
            {icon:"🔍", badge:"無料", badgeDark:false, title:"大学を検索・比較", desc:"日程・費用・併願可否を一覧で比較。登録不要ですぐ使える。"},
            {icon:"💡", badge:"無料", badgeDark:false, title:"「もっと知りたい」が芽生える", desc:"「自分はどこを受ければいいの？」という問いが自然に浮かぶ。"},
            {icon:"✦", badge:"プレミアム", badgeDark:true, title:"AI問診でプロフィール作成", desc:"強み・活動実績・得意科目から、あなた専用の分析を生成。"},
            {icon:"📅", badge:"プレミアム", badgeDark:true, title:"受験秘書が動き出す", desc:"合格率データ・穴場発掘・スケジュール自動生成・レポート出力。"},
          ].map((s,i) => (
            <div key={i} style={{textAlign:"center", position:"relative", zIndex:1, padding:"0 16px"}}>
              <div style={{width:"56px", height:"56px", borderRadius:"50%", border:"3px solid var(--teal)", background:"var(--surface)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", margin:"0 auto 16px", boxShadow:"var(--sh)"}}>{s.icon}</div>
              <div style={{display:"inline-block", padding:"2px 8px", borderRadius:"20px", fontSize:"10px", fontWeight:700, marginBottom:"6px", background:s.badgeDark?"var(--premium)":"var(--teal-bg)", color:s.badgeDark?"#fff":"var(--teal2)", border:s.badgeDark?"none":"1px solid var(--teal-border)"}}>{s.badge}</div>
              <div style={{fontSize:"13px", fontWeight:700, color:"var(--ink)", marginBottom:"6px"}}>{s.title}</div>
              <div style={{fontSize:"12px", color:"var(--ink3)", lineHeight:1.5}}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 無料機能セクション */}
      <section style={{background:"var(--surface2)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", padding:"60px 24px"}}>
        <div style={{maxWidth:"1100px", margin:"0 auto", textAlign:"center"}}>
          <div style={{fontSize:"11px", fontWeight:700, letterSpacing:".14em", textTransform:"uppercase", color:"var(--teal)", marginBottom:"12px"}}>無料でできること</div>
          <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"clamp(26px,3vw,36px)", fontWeight:700, color:"var(--ink)", lineHeight:1.3, marginBottom:"16px"}}>
            こんなのが<span style={{color:"var(--teal)"}}>無料</span>でいいの？
          </h2>
          <p style={{fontSize:"15px", color:"var(--ink2)", lineHeight:1.8, maxWidth:"560px", margin:"0 auto 48px"}}>
            受験生が何時間もかけて調べていた情報を、ボタン一つで比較できます。
          </p>
          <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px"}}>
            {[
              {icon:"📅", title:"日程タイムライン", desc:"選んだ大学の出願期間・試験日を4月〜3月のガントチャートで一覧表示。重複が一目でわかる。"},
              {icon:"⚡", title:"併願チェック", desc:"専願のみの大学を自動検出・警告。出願期間の重複を月単位で可視化。受験計画の抜け漏れを防ぐ。"},
              {icon:"💰", title:"費用シミュレーション", desc:"受験料・入学金・授業料を横並び比較。受験パターンを変えると合計額がリアルタイムで変わる。"},
            ].map((c,i) => (
              <div key={i} style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"var(--r-lg)", padding:"28px 24px", boxShadow:"var(--sh-sm)", textAlign:"left"}}>
                <div style={{display:"inline-block", background:"var(--teal-bg)", border:"1px solid var(--teal-border)", borderRadius:"20px", padding:"3px 10px", fontSize:"10px", fontWeight:700, color:"var(--teal2)", marginBottom:"12px", letterSpacing:".06em", textTransform:"uppercase"}}>FREE</div>
                <div style={{fontSize:"36px", marginBottom:"14px"}}>{c.icon}</div>
                <h3 style={{fontSize:"15px", fontWeight:700, color:"var(--ink)", marginBottom:"8px"}}>{c.title}</h3>
                <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.7}}>{c.desc}</p>
              </div>
            ))}
          </div>
          <div style={{marginTop:"32px"}}>
            <Link href="/simulator" style={{display:"inline-block", padding:"14px 40px", borderRadius:"12px", border:"2px solid var(--border2)", background:"var(--surface)", color:"var(--ink)", fontSize:"15px", fontWeight:700, textDecoration:"none"}}>
              今すぐ無料で試す →
            </Link>
          </div>
        </div>
      </section>

      {/* プレミアム機能セクション */}
      <section style={{background:"linear-gradient(135deg,var(--premium) 0%,#2d2825 50%,var(--teal3) 100%)", padding:"80px 24px", position:"relative", overflow:"hidden"}}>
        <div style={{position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(45deg,rgba(255,255,255,.02) 0,rgba(255,255,255,.02) 1px,transparent 1px,transparent 8px)"}}/>
        <div style={{maxWidth:"1100px", margin:"0 auto", position:"relative", zIndex:1}}>
          <div style={{fontSize:"11px", fontWeight:700, letterSpacing:".14em", textTransform:"uppercase", color:"rgba(255,255,255,.5)", marginBottom:"12px"}}>プレミアムプラン</div>
          <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"clamp(28px,3vw,42px)", fontWeight:700, color:"#fff", lineHeight:1.3, marginBottom:"16px"}}>
            「自分だけの<span style={{color:"#5eead4"}}>受験秘書</span>」を<br/>持ってみませんか。
          </h2>
          <p style={{fontSize:"15px", color:"rgba(255,255,255,.7)", lineHeight:1.8, maxWidth:"560px", marginBottom:"48px"}}>
            無料版は「情報を調べる」ツール。プレミアムは「自分に合った答えを出す」ツールです。
          </p>
          <div style={{display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"14px", marginBottom:"48px"}}>
            {[
              {icon:"🧠", title:"AI問診 × マッチング診断", desc:"得意科目・活動実績・パーソナリティから、最適な大学・学部・選抜方法を診断。"},
              {icon:"📈", title:"穴場スコア・倍率データ", desc:"募集人数・応募者数・合格率データと照合。「実はここ穴場！」「ここは激戦注意」を表示。"},
              {icon:"📅", title:"出願スケジュール自動生成", desc:"志望校を選ぶだけで、逆算した出願カレンダーを自動生成。締切リマインドも。"},
              {icon:"��", title:"保護者向けレポートPDF出力", desc:"診断結果・費用・日程を1枚のレポートに。保護者・担任の先生への共有に最適。"},
              {icon:"🔄", title:"条件変更で何度でも診断", desc:"「エリアを変えたら？」「費用重視にしたら？」パターンを変えて比較できる。"},
              {icon:"✍️", title:"志望理由書 AIアドバイス", desc:"あなたのプロフィールをもとに、「この活動をこうアピールすると強い」を提案。"},
            ].map((f,i) => (
              <div key={i} style={{background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.12)", borderRadius:"var(--r)", padding:"20px", display:"flex", gap:"14px", alignItems:"flex-start"}}>
                <span style={{fontSize:"24px", minWidth:"32px", marginTop:"2px"}}>{f.icon}</span>
                <div>
                  <div style={{fontSize:"14px", fontWeight:700, color:"#fff", marginBottom:"4px"}}>{f.title}</div>
                  <div style={{fontSize:"12px", color:"rgba(255,255,255,.6)", lineHeight:1.6}}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.15)", borderRadius:"var(--r-lg)", padding:"32px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"24px", flexWrap:"wrap"}}>
            <div>
              <div style={{fontSize:"13px", color:"rgba(255,255,255,.5)", marginBottom:"4px"}}>プレミアムプラン</div>
              <div style={{fontFamily:"DM Mono,monospace", fontSize:"40px", fontWeight:700, color:"#fff"}}>¥980<span style={{fontSize:"16px", fontWeight:400, color:"rgba(255,255,255,.5)"}}> / 月</span></div>
              <div style={{fontSize:"12px", color:"rgba(255,255,255,.4)", marginTop:"4px"}}>※ いつでも解約可能 · 初月無料キャンペーン準備中</div>
            </div>
            <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
              <Link href="/signup" style={{padding:"14px 36px", borderRadius:"10px", background:"linear-gradient(135deg,var(--teal),#06b6d4)", color:"#fff", fontSize:"15px", fontWeight:700, textDecoration:"none", display:"inline-block", textAlign:"center", whiteSpace:"nowrap"}}>
                ✦ 今すぐ始める
              </Link>
              <Link href="/simulator" style={{padding:"12px 36px", borderRadius:"10px", border:"1px solid rgba(255,255,255,.2)", color:"rgba(255,255,255,.8)", fontSize:"14px", fontWeight:600, textDecoration:"none", display:"inline-block", textAlign:"center"}}>
                まず無料で試す
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 保護者向けセクション */}
      <section style={{padding:"80px 24px", maxWidth:"1100px", margin:"0 auto"}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"60px", alignItems:"center"}}>
          <div>
            <div style={{fontSize:"11px", fontWeight:700, letterSpacing:".14em", textTransform:"uppercase", color:"var(--teal)", marginBottom:"12px"}}>保護者の方へ</div>
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"clamp(24px,2.5vw,34px)", fontWeight:700, color:"var(--ink)", lineHeight:1.3, marginBottom:"16px"}}>
              お子さんの受験、<br/>一緒に<span style={{color:"var(--teal)"}}>見える化</span>しませんか。
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:1.9, marginBottom:"28px"}}>
              「うちの子、ちゃんと準備できてるの？」<br/>
              総合型選抜は一般入試と異なり、出願スケジュール・費用・専願リスクが複雑です。受験秘書なら、保護者の方も一緒に把握できます。
            </p>
            <div style={{display:"flex", flexDirection:"column", gap:"12px", marginBottom:"32px"}}>
              {[
                {icon:"📊", text:"費用の全体像が一目でわかる（受験料・入学金・初年度合計）"},
                {icon:"⚠️", text:"専願リスクを自動検出・警告してくれる"},
                {icon:"📅", text:"出願スケジュールを家族で共有できる"},
                {icon:"📄", text:"保護者向けレポートをPDFで出力できる"},
              ].map((item,i) => (
                <div key={i} style={{display:"flex", alignItems:"flex-start", gap:"12px"}}>
                  <span style={{fontSize:"18px", marginTop:"2px"}}>{item.icon}</span>
                  <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.7}}>{item.text}</p>
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

      {/* 声のセクション */}
      <section style={{background:"var(--surface2)", borderTop:"1px solid var(--border)", padding:"80px 24px"}}>
        <div style={{maxWidth:"1100px", margin:"0 auto", textAlign:"center"}}>
          <div style={{fontSize:"11px", fontWeight:700, letterSpacing:".14em", textTransform:"uppercase", color:"var(--teal)", marginBottom:"12px"}}>利用者の声</div>
          <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"clamp(26px,3vw,36px)", fontWeight:700, color:"var(--ink)", marginBottom:"48px"}}>受験生・保護者から届いた声</h2>
          <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px"}}>
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
            登録不要でシミュレーターをすぐに使えます。<br/>「もっと詳しく知りたい」と思ったらプレミアムへ。
          </p>
          <div style={{display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap"}}>
            <Link href="/simulator" style={{padding:"15px 32px", borderRadius:"12px", border:"2px solid var(--border2)", background:"var(--surface)", color:"var(--ink)", fontSize:"15px", fontWeight:700, textDecoration:"none", display:"inline-block"}}>
              🔍 無料で試す（登録不要）
            </Link>
            <Link href="/signup" style={{padding:"15px 36px", borderRadius:"12px", background:"linear-gradient(135deg,var(--premium),#3d3530)", color:"#fff", fontSize:"15px", fontWeight:700, textDecoration:"none", display:"inline-block", boxShadow:"0 8px 24px rgba(26,23,20,.2)"}}>
              ✦ プレミアムで始める
            </Link>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer style={{background:"var(--premium)", padding:"48px 24px 32px", textAlign:"center"}}>
        <div style={{fontFamily:"Kaisei Opti,serif", fontSize:"22px", color:"#fff", marginBottom:"8px"}}>受験秘書</div>
        <div style={{fontSize:"13px", color:"rgba(255,255,255,.4)", marginBottom:"24px"}}>総合型選抜ナビ · 2026年度対応</div>
        <div style={{display:"flex", gap:"20px", justifyContent:"center", flexWrap:"wrap", marginBottom:"24px"}}>
          {["利用規約","プライバシーポリシー","免責事項","お問い合わせ"].map(l => (
            <span key={l} style={{fontSize:"12px", color:"rgba(255,255,255,.4)", cursor:"pointer"}}>{l}</span>
          ))}
        </div>
        <div style={{fontSize:"11px", color:"rgba(255,255,255,.25)"}}>© 2026 受験秘書. All rights reserved. · 本サービスの診断結果はAIによる参考情報です。</div>
      </footer>

    </div>
  )
}
