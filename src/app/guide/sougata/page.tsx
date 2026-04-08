import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "総合型選抜とは？高校生・保護者向けにわかりやすく解説 | ユニパス",
  description: "総合型選抜（旧AO入試）の仕組み・スケジュール・指定校推薦との違いを、高校生と保護者にわかりやすく解説。2026年度の最新情報対応。",
}

export default function SougataGuidePage() {
  return (
    <div style={{background:"var(--bg)", minHeight:"100vh", fontFamily:"Noto Sans JP,sans-serif"}}>
      {/* ナビ */}
      <nav style={{
        position:"sticky", top:0, zIndex:300, height:"58px", padding:"0 24px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"rgba(248,247,244,.96)", backdropFilter:"blur(16px)",
        borderBottom:"1px solid var(--border)"
      }}>
        <Link href="/" style={{display:"flex", alignItems:"center", gap:"9px", textDecoration:"none"}}>
          <img src="/logo.png" alt="ユニパス" style={{height:"44px", objectFit:"contain"}} />
          <div>
          </div>
        </Link>
        <div style={{display:"flex", alignItems:"center", gap:"8px"}}>
          <Link href="/simulator" style={{padding:"7px 16px", borderRadius:"8px", background:"var(--teal)", color:"#fff", fontSize:"12px", fontWeight:700, textDecoration:"none"}}>無料で試す</Link>
        </div>
      </nav>

      <article style={{maxWidth:"740px", margin:"0 auto", padding:"48px 24px 80px"}}>
        {/* パンくず */}
        <div style={{fontSize:"12px", color:"var(--ink3)", marginBottom:"24px"}}>
          <Link href="/" style={{color:"var(--teal)", textDecoration:"none"}}>トップ</Link>
          <span style={{margin:"0 8px"}}>/</span>
          <span>総合型選抜とは？</span>
        </div>

        {/* タイトル */}
        <div style={{marginBottom:"40px"}}>
          <div style={{display:"inline-block", background:"var(--teal-bg)", border:"1px solid var(--teal-border)", borderRadius:"20px", padding:"4px 12px", fontSize:"10px", fontWeight:700, color:"var(--teal2)", marginBottom:"16px"}}>
            受験の基礎知識
          </div>
          <h1 style={{fontFamily:"Kaisei Opti,serif", fontSize:"clamp(28px,4vw,40px)", fontWeight:700, color:"var(--ink)", lineHeight:1.3, marginBottom:"16px"}}>
            総合型選抜とは？<br/>高校生・保護者向けにやさしく解説
          </h1>
          <p style={{fontSize:"15px", color:"var(--ink2)", lineHeight:1.8}}>
            「AO入試と何が違うの？」「指定校推薦とは別物？」——そんな疑問を持つ高校生や保護者の方に向けて、総合型選抜の仕組みをわかりやすくまとめました。
          </p>
        </div>

        {/* 目次 */}
        <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"14px", padding:"20px 24px", marginBottom:"48px"}}>
          <div style={{fontSize:"13px", fontWeight:700, color:"var(--ink)", marginBottom:"12px"}}>📋 この記事の内容</div>
          <ol style={{margin:0, paddingLeft:"20px", display:"flex", flexDirection:"column", gap:"8px"}}>
            {[
              "総合型選抜ってなに？",
              "AO入試じゃなかったっけ？",
              "指定校推薦・公募推薦との違い",
              "総合型選抜のスケジュール",
              "どんな人が向いている？",
              "よくある誤解と注意点",
              "まとめ：最初にやるべきこと",
            ].map((t,i) => (
              <li key={i} style={{fontSize:"13px", color:"var(--teal2)", fontWeight:600, lineHeight:1.6}}>
                <a href={`#section-${i+1}`} style={{color:"var(--teal2)", textDecoration:"none"}}>{t}</a>
              </li>
            ))}
          </ol>
        </div>

        {/* 本文 */}
        <div style={{display:"flex", flexDirection:"column", gap:"48px"}}>

          {/* 1 */}
          <section id="section-1">
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"22px", fontWeight:700, color:"var(--ink)", marginBottom:"16px", paddingBottom:"10px", borderBottom:"2px solid var(--teal)"}}>
              1. 総合型選抜ってなに？
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"16px"}}>
              総合型選抜は、<strong>大学が「この学生と一緒に学びたい」と思う人を選ぶ入試</strong>です。
            </p>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"16px"}}>
              一般入試が「テストの点数」で合否が決まるのに対して、総合型選抜では<strong>志望理由書、面接、小論文、活動実績（部活・ボランティア・資格など）</strong>を総合的に評価します。つまり、「あなたがどんな人で、なぜこの大学で学びたいのか」が問われる入試です。
            </p>
            <div style={{background:"var(--teal-bg)", border:"1px solid var(--teal-border)", borderRadius:"12px", padding:"16px 20px", marginBottom:"16px"}}>
              <div style={{fontSize:"13px", fontWeight:700, color:"var(--teal2)", marginBottom:"8px"}}>💡 ポイント</div>
              <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8, margin:0}}>
                総合型選抜は「学力が足りない人が受ける入試」ではありません。むしろ、学力＋αの魅力をアピールできる入試です。近年は国公立大学でも採用が増えており、全大学入学者の約2割が総合型選抜で入学しています。
              </p>
            </div>
          </section>

          {/* 2 */}
          <section id="section-2">
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"22px", fontWeight:700, color:"var(--ink)", marginBottom:"16px", paddingBottom:"10px", borderBottom:"2px solid var(--teal)"}}>
              2. AO入試じゃなかったっけ？
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"16px"}}>
              はい、<strong>2021年度入試から「AO入試」は「総合型選抜」に名称が変わりました。</strong>
            </p>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"16px"}}>
              お父さん・お母さん世代では「AO入試」の方が馴染みがあると思います。中身はほぼ同じですが、名称変更と同時にいくつかの変更点がありました。
            </p>
            <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"12px", overflow:"hidden", marginBottom:"16px"}}>
              <table style={{width:"100%", borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{background:"var(--surface2)"}}>
                    <th style={{padding:"10px 14px", fontSize:"12px", fontWeight:700, color:"var(--ink3)", textAlign:"left", borderBottom:"1px solid var(--border)"}}></th>
                    <th style={{padding:"10px 14px", fontSize:"12px", fontWeight:700, color:"var(--ink3)", textAlign:"left", borderBottom:"1px solid var(--border)"}}>旧：AO入試</th>
                    <th style={{padding:"10px 14px", fontSize:"12px", fontWeight:700, color:"var(--teal2)", textAlign:"left", borderBottom:"1px solid var(--border)"}}>現：総合型選抜</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["名称","AO入試","総合型選抜"],
                    ["学力の確認","不問の大学も多かった","大学入学共通テストや小論文など、学力確認が推奨"],
                    ["出願時期","大学ごとにバラバラ","9月1日以降（文科省のルール）"],
                    ["合格発表","早いところは8月","11月1日以降"],
                  ].map((row,i) => (
                    <tr key={i} style={{borderBottom:"1px solid rgba(0,0,0,.04)"}}>
                      <td style={{padding:"10px 14px", fontSize:"12px", fontWeight:700, color:"var(--ink)"}}>{row[0]}</td>
                      <td style={{padding:"10px 14px", fontSize:"12px", color:"var(--ink3)"}}>{row[1]}</td>
                      <td style={{padding:"10px 14px", fontSize:"12px", color:"var(--ink2)", fontWeight:600}}>{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2}}>
              つまり、以前のAO入試よりも<strong>学力をちゃんと見るようになった</strong>のが大きな変化です。「AO＝学力不問」というイメージは、今の総合型選抜には当てはまりません。
            </p>
          </section>

          {/* 3 */}
          <section id="section-3">
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"22px", fontWeight:700, color:"var(--ink)", marginBottom:"16px", paddingBottom:"10px", borderBottom:"2px solid var(--teal)"}}>
              3. 指定校推薦・公募推薦との違い
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"16px"}}>
              「推薦」と名のつく入試が複数あって混乱しますよね。大きく分けると、大学入試には<strong>3つの入り口</strong>があります。
            </p>
            <div style={{display:"flex", flexDirection:"column", gap:"12px", marginBottom:"16px"}}>
              {[
                {
                  name:"一般選抜",
                  color:"var(--ink3)",
                  bg:"var(--surface2)",
                  border:"var(--border)",
                  desc:"いわゆる「一般入試」。筆記テストの点数で合否が決まる。",
                  who:"学力で勝負したい人"
                },
                {
                  name:"学校推薦型選抜",
                  color:"var(--amber)",
                  bg:"rgba(245,158,11,.06)",
                  border:"rgba(245,158,11,.2)",
                  desc:"高校の推薦が必要。「指定校推薦」と「公募推薦」の2種類がある。",
                  who:"評定平均が高い人、高校に推薦枠がある人"
                },
                {
                  name:"総合型選抜（旧AO入試）",
                  color:"var(--teal2)",
                  bg:"rgba(13,148,136,.06)",
                  border:"rgba(13,148,136,.2)",
                  desc:"高校の推薦は不要。大学が求める人物像に合うかを、書類・面接・実績で判断。",
                  who:"やりたいことが明確な人、活動実績がある人"
                },
              ].map((item,i) => (
                <div key={i} style={{border:`1.5px solid ${item.border}`, borderRadius:"12px", padding:"16px 20px", background:item.bg}}>
                  <div style={{fontSize:"14px", fontWeight:700, color:item.color, marginBottom:"6px"}}>{item.name}</div>
                  <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.7, marginBottom:"6px"}}>{item.desc}</p>
                  <div style={{fontSize:"11px", color:"var(--ink3)"}}>向いている人：{item.who}</div>
                </div>
              ))}
            </div>

            <div style={{background:"rgba(225,29,72,.05)", border:"1.5px solid rgba(225,29,72,.15)", borderRadius:"12px", padding:"16px 20px", marginBottom:"16px"}}>
              <div style={{fontSize:"13px", fontWeight:700, color:"#e11d48", marginBottom:"8px"}}>⚠️ 指定校推薦と総合型選抜の決定的な違い</div>
              <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8, margin:0}}>
                <strong>指定校推薦</strong>は高校に割り当てられた枠を使うため、校内選考を通れば<strong>ほぼ確実に合格</strong>します。ただし合格したら必ず入学する約束（専願）です。<br/><br/>
                <strong>総合型選抜</strong>は高校の推薦は不要で、自分で直接大学に出願します。不合格になる可能性もありますが、<strong>併願できる大学も多い</strong>のがメリットです。
              </p>
            </div>
          </section>

          {/* 4 */}
          <section id="section-4">
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"22px", fontWeight:700, color:"var(--ink)", marginBottom:"16px", paddingBottom:"10px", borderBottom:"2px solid var(--teal)"}}>
              4. 総合型選抜のスケジュール
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"20px"}}>
              総合型選抜は一般入試よりもかなり早く動き出します。高3の夏には出願が始まる大学もあるので、<strong>高2のうちから情報収集を始める</strong>のが理想です。
            </p>
            <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"14px", overflow:"hidden", marginBottom:"16px"}}>
              {[
                {period:"高2の冬〜高3の春（1〜5月）", title:"情報収集・大学研究", desc:"気になる大学の募集要項をチェック。オープンキャンパスにも参加。", color:"var(--blue)"},
                {period:"高3の春〜夏（5〜8月）", title:"書類準備・志望理由書", desc:"志望理由書や活動報告書を作成。添削を繰り返して完成度を上げる。", color:"var(--teal)"},
                {period:"高3の秋（9〜10月）", title:"出願・エントリー", desc:"9月1日以降に出願開始。書類提出、面接・小論文の対策も本格化。", color:"var(--amber)"},
                {period:"高3の秋〜冬（10〜12月）", title:"選考・合格発表", desc:"面接、プレゼン、小論文などの選考を経て、11月以降に合格発表。", color:"#e11d48"},
              ].map((s,i) => (
                <div key={i} style={{padding:"16px 20px", borderBottom: i < 3 ? "1px solid var(--border)" : "none", display:"flex", gap:"16px", alignItems:"flex-start"}}>
                  <div style={{width:"4px", minWidth:"4px", height:"40px", borderRadius:"2px", background:s.color, marginTop:"2px"}}/>
                  <div>
                    <div style={{fontSize:"11px", fontWeight:700, color:s.color, marginBottom:"4px"}}>{s.period}</div>
                    <div style={{fontSize:"14px", fontWeight:700, color:"var(--ink)", marginBottom:"4px"}}>{s.title}</div>
                    <div style={{fontSize:"12px", color:"var(--ink3)", lineHeight:1.6}}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{background:"var(--teal-bg)", border:"1px solid var(--teal-border)", borderRadius:"12px", padding:"16px 20px"}}>
              <div style={{fontSize:"13px", fontWeight:700, color:"var(--teal2)", marginBottom:"8px"}}>💡 保護者の方へ</div>
              <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8, margin:0}}>
                一般入試は1〜3月が本番ですが、総合型選抜は9〜12月がピークです。「まだ高3になったばかりなのに出願？」と驚く保護者の方も多いですが、これが総合型選抜のスケジュールです。早めにお子さんと一緒に確認しておきましょう。
              </p>
            </div>
          </section>

          {/* 5 */}
          <section id="section-5">
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"22px", fontWeight:700, color:"var(--ink)", marginBottom:"16px", paddingBottom:"10px", borderBottom:"2px solid var(--teal)"}}>
              5. どんな人が向いている？
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"20px"}}>
              総合型選抜は「特別な実績がないと受けられない」と思われがちですが、そんなことはありません。以下のどれかに当てはまるなら、検討する価値があります。
            </p>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"20px"}} className="guide-grid">
              {[
                {icon:"🎯", text:"「この大学で○○を学びたい」という明確な理由がある"},
                {icon:"🏆", text:"部活・ボランティア・コンテストなどの活動実績がある"},
                {icon:"💬", text:"面接やプレゼンなど、人前で話すのが苦にならない"},
                {icon:"📝", text:"文章を書くのが好き（志望理由書・小論文）"},
                {icon:"🌍", text:"留学経験や語学資格がある"},
                {icon:"🔬", text:"探究活動や自由研究に力を入れてきた"},
              ].map((item,i) => (
                <div key={i} style={{display:"flex", gap:"10px", alignItems:"flex-start", padding:"12px 14px", background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"10px"}}>
                  <span style={{fontSize:"18px", flexShrink:0}}>{item.icon}</span>
                  <span style={{fontSize:"12px", color:"var(--ink2)", lineHeight:1.6}}>{item.text}</span>
                </div>
              ))}
            </div>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2}}>
              逆に、「まだ何も決まっていない」という人でも、自分の強みを整理してみると意外とアピールできることが見つかるものです。まずは大学の募集要項を見て、「求める人物像」に自分が合いそうか確認してみてください。
            </p>
          </section>

          {/* 6 */}
          <section id="section-6">
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"22px", fontWeight:700, color:"var(--ink)", marginBottom:"16px", paddingBottom:"10px", borderBottom:"2px solid var(--teal)"}}>
              6. よくある誤解と注意点
            </h2>
            <div style={{display:"flex", flexDirection:"column", gap:"14px"}}>
              {[
                {
                  myth:"❌ 「総合型選抜＝学力不問」",
                  fact:"2021年度以降、学力確認が必須化されました。共通テストの成績を求める大学も増えています。一般入試との併願を視野に、勉強は続けましょう。"
                },
                {
                  myth:"❌ 「併願できるから気軽に受ければいい」",
                  fact:"併願可能な大学もありますが、専願（合格したら入学が条件）の大学もたくさんあります。専願で不合格になると、その時間が無駄になるリスクも。事前に必ず確認してください。"
                },
                {
                  myth:"❌ 「すごい実績がないと受からない」",
                  fact:"全国大会レベルの実績は必須ではありません。地域のボランティア活動や、課外活動、資格取得なども立派なアピール材料です。大切なのは「なぜその活動をしたか」「そこから何を学んだか」を語れること。"
                },
                {
                  myth:"❌ 「落ちたら恥ずかしい」",
                  fact:"総合型選抜で不合格になっても、一般入試で同じ大学に再挑戦できます。むしろ「チャンスが1回増える」と考えましょう。準備の過程で書いた志望理由書は、一般入試の面接でも活きます。"
                },
              ].map((item,i) => (
                <div key={i} style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"12px", padding:"16px 20px"}}>
                  <div style={{fontSize:"14px", fontWeight:700, color:"#e11d48", marginBottom:"8px"}}>{item.myth}</div>
                  <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8, margin:0}}>→ {item.fact}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 7 */}
          <section id="section-7">
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"22px", fontWeight:700, color:"var(--ink)", marginBottom:"16px", paddingBottom:"10px", borderBottom:"2px solid var(--teal)"}}>
              7. まとめ：最初にやるべきこと
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"20px"}}>
              総合型選抜に興味を持ったら、まずは以下の3つから始めてみましょう。
            </p>
            <div style={{display:"flex", flexDirection:"column", gap:"12px", marginBottom:"28px"}}>
              {[
                {step:"1", title:"気になる大学を3〜5校ピックアップする", desc:"「なんとなくいいな」でOK。まずは候補を出すことが大事。"},
                {step:"2", title:"出願スケジュール・費用・併願可否を確認する", desc:"専願なのか併願なのか、いつまでに何を準備するのか。ここが一番大事。"},
                {step:"3", title:"志望理由を言葉にしてみる", desc:"「なぜこの大学？」を一言でもいいので書いてみる。それが志望理由書の第一歩。"},
              ].map((s,i) => (
                <div key={i} style={{display:"flex", gap:"14px", alignItems:"flex-start", padding:"16px 20px", background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"12px"}}>
                  <div style={{
                    width:"32px", height:"32px", minWidth:"32px", borderRadius:"50%",
                    background:"linear-gradient(135deg,var(--teal),#06b6d4)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"14px", fontWeight:900, color:"#fff", fontFamily:"DM Mono,monospace"
                  }}>{s.step}</div>
                  <div>
                    <div style={{fontSize:"14px", fontWeight:700, color:"var(--ink)", marginBottom:"4px"}}>{s.title}</div>
                    <div style={{fontSize:"12px", color:"var(--ink3)", lineHeight:1.6}}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 関連記事 */}
        <div style={{marginTop:"48px", padding:"20px", background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"16px"}}>
          <div style={{fontSize:"13px", fontWeight:700, color:"var(--ink)", marginBottom:"12px"}}>📚 あわせて読みたい</div>
          <Link href="/guide/shiteiko-vs-sougata" style={{display:"flex", alignItems:"center", gap:"12px", padding:"12px 16px", background:"var(--surface2)", borderRadius:"12px", textDecoration:"none"}}>
            <span style={{fontSize:"24px"}}>🔀</span>
            <div>
              <div style={{fontSize:"13px", fontWeight:700, color:"var(--ink)"}}>指定校推薦と総合型選抜、どっちを選ぶ？</div>
              <div style={{fontSize:"11px", color:"var(--ink3)", marginTop:"2px"}}>判断基準をやさしく整理</div>
            </div>
          </Link>
        </div>

        {/* CTA */}
        <div style={{background:"linear-gradient(135deg,#134e4a,#0f766e)", borderRadius:"20px", padding:"32px", textAlign:"center", marginTop:"20px"}}>
          <h3 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"#fff", marginBottom:"10px"}}>
            まずは大学を比較してみませんか？
          </h3>
          <p style={{fontSize:"13px", color:"rgba(255,255,255,.7)", lineHeight:1.8, marginBottom:"24px"}}>
            ユニパスなら、気になる大学の費用・日程・併願可否を<br className="hidden sm:inline"/>登録不要でまとめて確認できます。
          </p>
          <Link href="/simulator" style={{
            display:"inline-block", padding:"14px 36px", borderRadius:"12px",
            background:"linear-gradient(135deg,#5eead4,#06b6d4)",
            color:"#134e4a", fontSize:"15px", fontWeight:800, textDecoration:"none",
            boxShadow:"0 4px 20px rgba(94,234,212,.3)"
          }}>
            🔍 無料で試してみる →
          </Link>
        </div>
      </article>

      {/* フッター */}
      <footer style={{background:"var(--premium)", padding:"32px 24px", textAlign:"center"}}>
        <img src="/logo.png" alt="ユニパス" style={{height:"44px", objectFit:"contain", margin:"0 auto 6px", display:"block", filter:"brightness(0) invert(1)"}} />
        <div style={{fontSize:"12px", color:"rgba(255,255,255,.4)"}}>総合型選抜ナビ · 2026年度対応</div>
      </footer>

      <style>{`
        @media (max-width: 767px) {
          .guide-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
