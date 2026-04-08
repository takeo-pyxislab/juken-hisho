import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "指定校推薦と総合型選抜、どっちを選ぶ？判断基準をやさしく整理 | ユニパス",
  description: "指定校推薦と総合型選抜の違い・向いている人・スケジュールの注意点を高校生・保護者向けにわかりやすく解説。判断フローチャートつき。",
}

export default function ShiteikoVsSougataPage() {
  return (
    <div style={{background:"var(--bg)", minHeight:"100vh", fontFamily:"Noto Sans JP,sans-serif"}}>
      {/* ナビ */}
      <nav style={{
        position:"sticky", top:0, zIndex:300, height:"auto", minHeight:"58px", padding:"0 24px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"rgba(248,247,244,.96)", backdropFilter:"blur(16px)",
        borderBottom:"1px solid var(--border)"
      }}>
        <Link href="/" style={{display:"flex", alignItems:"center", gap:"9px", textDecoration:"none"}}>
          <img src="/logo.png" alt="ユニパス" className="nav-logo" style={{objectFit:"contain"}} />
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
          <Link href="/guide/sougata" style={{color:"var(--teal)", textDecoration:"none"}}>総合型選抜とは？</Link>
          <span style={{margin:"0 8px"}}>/</span>
          <span>指定校推薦 vs 総合型選抜</span>
        </div>

        {/* タイトル */}
        <div style={{marginBottom:"40px"}}>
          <div style={{display:"inline-block", background:"var(--teal-bg)", border:"1px solid var(--teal-border)", borderRadius:"20px", padding:"4px 12px", fontSize:"10px", fontWeight:700, color:"var(--teal2)", marginBottom:"16px"}}>
            受験の基礎知識
          </div>
          <h1 style={{fontFamily:"Kaisei Opti,serif", fontSize:"clamp(28px,4vw,40px)", fontWeight:700, color:"var(--ink)", lineHeight:1.3, marginBottom:"16px"}}>
            指定校推薦と総合型選抜、<br/>どっちを選ぶ？<br/>判断基準をやさしく整理
          </h1>
          <p style={{fontSize:"15px", color:"var(--ink2)", lineHeight:1.8}}>
            どちらも「推薦」だけど、仕組みが全然違います。あなたの状況に合った選び方を一緒に考えましょう。
          </p>
        </div>

        {/* 目次 */}
        <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"14px", padding:"20px 24px", marginBottom:"48px"}}>
          <div style={{fontSize:"13px", fontWeight:700, color:"var(--ink)", marginBottom:"12px"}}>📋 この記事の内容</div>
          <ol style={{margin:0, paddingLeft:"20px", display:"flex", flexDirection:"column", gap:"8px"}}>
            {[
              "そもそも何が違うの？",
              "指定校推薦が向いている人",
              "総合型選抜が向いている人",
              "「両方」はできる？スケジュールの落とし穴",
              "判断フローチャート",
              "まずやるべきこと（3ステップ）",
            ].map((t,i) => (
              <li key={i} style={{fontSize:"13px", color:"var(--teal2)", fontWeight:600, lineHeight:1.6}}>
                <a href={`#section-${i+1}`} style={{color:"var(--teal2)", textDecoration:"none"}}>{t}</a>
              </li>
            ))}
          </ol>
        </div>

        {/* 本文 */}
        <div style={{display:"flex", flexDirection:"column", gap:"48px"}}>

          {/* 1. そもそも何が違うの？ */}
          <section id="section-1">
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"22px", fontWeight:700, color:"var(--ink)", marginBottom:"16px", paddingBottom:"10px", borderBottom:"2px solid var(--teal)"}}>
              1. そもそも何が違うの？
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"16px"}}>
              「指定校推薦」と「総合型選抜」は、どちらも一般入試とは違う入り口ですが、<strong>仕組みがまったく異なります</strong>。まずは一覧表で確認してみましょう。
            </p>
            <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"12px", overflow:"hidden", marginBottom:"16px"}}>
              <table style={{width:"100%", borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{background:"var(--surface2)"}}>
                    <th style={{padding:"10px 14px", fontSize:"12px", fontWeight:700, color:"var(--ink3)", textAlign:"left", borderBottom:"1px solid var(--border)"}}></th>
                    <th style={{padding:"10px 14px", fontSize:"12px", fontWeight:700, color:"var(--amber)", textAlign:"left", borderBottom:"1px solid var(--border)"}}>指定校推薦</th>
                    <th style={{padding:"10px 14px", fontSize:"12px", fontWeight:700, color:"var(--teal2)", textAlign:"left", borderBottom:"1px solid var(--border)"}}>総合型選抜</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["正式名称","学校推薦型選抜（指定校制）","総合型選抜"],
                    ["高校の推薦","必要（校内選考あり）","不要（自分で直接出願）"],
                    ["合格率","ほぼ100%（校内選考が実質の選抜）","大学による（不合格もある）"],
                    ["併願","不可（合格したら入学確約）","大学による（併願OKの大学も多い）"],
                    ["出願時期","10〜11月（校内選考は夏〜秋）","9月1日以降"],
                    ["選べる大学","自分の高校に枠がある大学のみ","全国の大学から自由に選べる"],
                    ["選考方法","書類+面接（形式的な場合も）","志望理由書+面接+小論文等（本格的）"],
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
            <div style={{background:"var(--teal-bg)", border:"1px solid var(--teal-border)", borderRadius:"12px", padding:"16px 20px"}}>
              <div style={{fontSize:"13px", fontWeight:700, color:"var(--teal2)", marginBottom:"8px"}}>💡 ポイント</div>
              <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8, margin:0}}>
                一番大きな違いは<strong>「高校の推薦が必要かどうか」</strong>と<strong>「辞退できるかどうか」</strong>です。指定校推薦は合格＝入学確約ですが、総合型選抜は併願できる大学もあります。
              </p>
            </div>
          </section>

          {/* 2. 指定校推薦が向いている人 */}
          <section id="section-2">
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"22px", fontWeight:700, color:"var(--ink)", marginBottom:"16px", paddingBottom:"10px", borderBottom:"2px solid var(--teal)"}}>
              2. 指定校推薦が向いている人
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"20px"}}>
              以下に当てはまる人は、指定校推薦を積極的に検討する価値があります。
            </p>
            <div style={{display:"flex", flexDirection:"column", gap:"10px", marginBottom:"20px"}}>
              {[
                "評定平均が高く、校内選考を通過できる自信がある",
                "指定校枠のある大学が第一志望",
                "「確実に合格したい」気持ちが強い",
                "合格後に入学を辞退する予定がない",
              ].map((text,i) => (
                <div key={i} style={{display:"flex", gap:"10px", alignItems:"flex-start", padding:"12px 14px", background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"10px"}}>
                  <span style={{fontSize:"18px", flexShrink:0}}>✅</span>
                  <span style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.6}}>{text}</span>
                </div>
              ))}
            </div>

            {/* メリット（緑） */}
            <div style={{background:"rgba(34,197,94,.06)", border:"1.5px solid rgba(34,197,94,.2)", borderRadius:"12px", padding:"16px 20px", marginBottom:"14px"}}>
              <div style={{fontSize:"13px", fontWeight:700, color:"#16a34a", marginBottom:"8px"}}>✅ メリット</div>
              <ul style={{margin:0, paddingLeft:"18px"}}>
                <li style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8}}>校内選考を通ればほぼ確実に合格できる</li>
                <li style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8}}>準備期間が比較的短い（志望理由書＋面接が中心）</li>
                <li style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8}}>早い時期に進路が決まるため、精神的な負担が少ない</li>
              </ul>
            </div>

            {/* 注意点（赤） */}
            <div style={{background:"rgba(225,29,72,.05)", border:"1.5px solid rgba(225,29,72,.15)", borderRadius:"12px", padding:"16px 20px"}}>
              <div style={{fontSize:"13px", fontWeight:700, color:"#e11d48", marginBottom:"8px"}}>⚠️ 注意点</div>
              <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8, margin:0}}>
                <strong>指定校推薦は辞退できません。</strong>合格したら必ずその大学に入学する約束です。「とりあえず指定校で決めて、もっと良い大学があったら…」という考えはNGです。<br/><br/>
                辞退すると高校と大学の信頼関係が壊れ、<strong>来年以降その高校の推薦枠がなくなる</strong>可能性があります。後輩に迷惑がかかるので、「本当にこの大学に行きたい」と思える場合だけ出願しましょう。
              </p>
            </div>
          </section>

          {/* 3. 総合型選抜が向いている人 */}
          <section id="section-3">
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"22px", fontWeight:700, color:"var(--ink)", marginBottom:"16px", paddingBottom:"10px", borderBottom:"2px solid var(--teal)"}}>
              3. 総合型選抜が向いている人
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"20px"}}>
              以下に当てはまる人は、総合型選抜を検討してみましょう。
            </p>
            <div style={{display:"flex", flexDirection:"column", gap:"10px", marginBottom:"20px"}}>
              {[
                "「この大学で○○を学びたい」という明確な理由がある",
                "部活・ボランティア・コンテスト等の活動実績がある",
                "面接やプレゼンが苦にならない",
                "指定校の枠にない大学に行きたい",
                "複数の大学を受けたい（併願したい）",
              ].map((text,i) => (
                <div key={i} style={{display:"flex", gap:"10px", alignItems:"flex-start", padding:"12px 14px", background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"10px"}}>
                  <span style={{fontSize:"18px", flexShrink:0}}>✅</span>
                  <span style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.6}}>{text}</span>
                </div>
              ))}
            </div>

            {/* メリット（ティール） */}
            <div style={{background:"var(--teal-bg)", border:"1px solid var(--teal-border)", borderRadius:"12px", padding:"16px 20px", marginBottom:"14px"}}>
              <div style={{fontSize:"13px", fontWeight:700, color:"var(--teal2)", marginBottom:"8px"}}>✅ メリット</div>
              <ul style={{margin:0, paddingLeft:"18px"}}>
                <li style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8}}>全国どの大学でも挑戦できる（高校の枠に縛られない）</li>
                <li style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8}}>併願できる大学もあるので、複数校に挑戦可能</li>
                <li style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8}}>学力だけでなく、活動実績や人柄をアピールできる</li>
              </ul>
            </div>

            {/* 注意点 */}
            <div style={{background:"rgba(225,29,72,.05)", border:"1.5px solid rgba(225,29,72,.15)", borderRadius:"12px", padding:"16px 20px"}}>
              <div style={{fontSize:"13px", fontWeight:700, color:"#e11d48", marginBottom:"8px"}}>⚠️ 注意点</div>
              <ul style={{margin:0, paddingLeft:"18px"}}>
                <li style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8}}>不合格になるリスクがある（指定校推薦のように「ほぼ確実」ではない）</li>
                <li style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8}}>志望理由書・面接・小論文の対策に時間がかかる</li>
                <li style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8}}>大学ごとに選考方法が違うので、個別の対策が必要</li>
              </ul>
            </div>
          </section>

          {/* 4. 「両方」はできる？ */}
          <section id="section-4">
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"22px", fontWeight:700, color:"var(--ink)", marginBottom:"16px", paddingBottom:"10px", borderBottom:"2px solid var(--teal)"}}>
              4. 「両方」はできる？スケジュールの落とし穴
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"20px"}}>
              「指定校推薦も総合型選抜も両方準備しておけばいいのでは？」と思うかもしれません。しかし、スケジュールを見ると<strong>同時進行はかなり厳しい</strong>ことがわかります。
            </p>

            {/* タイムライン */}
            <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"14px", overflow:"hidden", marginBottom:"20px"}}>
              {[
                {period:"7月〜9月", title:"指定校推薦の校内選考", desc:"担任との面談、校内での選考が進む。この時期に候補者が絞られる。", color:"var(--amber)"},
                {period:"9月〜", title:"総合型選抜の出願開始", desc:"志望理由書の提出、面接・小論文の対策が本格化。", color:"var(--teal)"},
                {period:"10月〜11月", title:"指定校推薦の出願", desc:"校内選考を通過した人が大学に出願。面接等の選考へ。", color:"var(--amber)"},
              ].map((s,i) => (
                <div key={i} style={{padding:"16px 20px", borderBottom: i < 2 ? "1px solid var(--border)" : "none", display:"flex", gap:"16px", alignItems:"flex-start"}}>
                  <div style={{width:"4px", minWidth:"4px", height:"40px", borderRadius:"2px", background:s.color, marginTop:"2px"}}/>
                  <div>
                    <div style={{fontSize:"11px", fontWeight:700, color:s.color, marginBottom:"4px"}}>{s.period}</div>
                    <div style={{fontSize:"14px", fontWeight:700, color:"var(--ink)", marginBottom:"4px"}}>{s.title}</div>
                    <div style={{fontSize:"12px", color:"var(--ink3)", lineHeight:1.6}}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"16px"}}>
              校内選考と総合型選抜の準備が同時期になるため、<strong>両方を全力で準備するのは現実的に厳しい</strong>のが実情です。
            </p>

            {/* 重要な注意 */}
            <div style={{background:"rgba(225,29,72,.05)", border:"1.5px solid rgba(225,29,72,.15)", borderRadius:"12px", padding:"16px 20px", marginBottom:"14px"}}>
              <div style={{fontSize:"13px", fontWeight:700, color:"#e11d48", marginBottom:"8px"}}>🚫 できないパターン</div>
              <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8, margin:0}}>
                「指定校推薦で合格 → やっぱり辞退して総合型選抜へ」は<strong>できません</strong>。指定校推薦は合格＝入学確約です。辞退は高校の信頼を損ない、後輩の推薦枠にも影響します。
              </p>
            </div>

            {/* OKパターン */}
            <div style={{background:"rgba(34,197,94,.06)", border:"1.5px solid rgba(34,197,94,.2)", borderRadius:"12px", padding:"16px 20px"}}>
              <div style={{fontSize:"13px", fontWeight:700, color:"#16a34a", marginBottom:"8px"}}>✅ できるパターン</div>
              <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.8, margin:0}}>
                「総合型選抜で不合格 → 一般入試で再挑戦」は可能です。総合型選抜はチャンスが1回増えると考えましょう。同じ大学に一般入試で再チャレンジすることもできます。
              </p>
            </div>
          </section>

          {/* 5. 判断フローチャート */}
          <section id="section-5">
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"22px", fontWeight:700, color:"var(--ink)", marginBottom:"16px", paddingBottom:"10px", borderBottom:"2px solid var(--teal)"}}>
              5. 判断フローチャート
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"20px"}}>
              迷ったときは、以下の質問に順番に答えてみてください。
            </p>

            <div style={{display:"flex", flexDirection:"column", gap:"12px"}}>
              {/* Q1 */}
              <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"14px", padding:"20px"}}>
                <div style={{display:"flex", gap:"12px", alignItems:"flex-start"}}>
                  <div style={{
                    width:"36px", height:"36px", minWidth:"36px", borderRadius:"50%",
                    background:"linear-gradient(135deg,var(--teal),#06b6d4)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"14px", fontWeight:900, color:"#fff", fontFamily:"DM Mono,monospace"
                  }}>Q1</div>
                  <div>
                    <div style={{fontSize:"14px", fontWeight:700, color:"var(--ink)", marginBottom:"8px"}}>
                      行きたい大学の指定校枠が自分の高校にある？
                    </div>
                    <div style={{display:"flex", gap:"8px", flexWrap:"wrap"}}>
                      <span style={{padding:"4px 12px", borderRadius:"8px", background:"rgba(34,197,94,.1)", border:"1px solid rgba(34,197,94,.2)", fontSize:"12px", fontWeight:700, color:"#16a34a"}}>YES → Q2へ</span>
                      <span style={{padding:"4px 12px", borderRadius:"8px", background:"rgba(59,130,246,.1)", border:"1px solid rgba(59,130,246,.2)", fontSize:"12px", fontWeight:700, color:"#2563eb"}}>NO → 下の結果Cへ</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Q2 */}
              <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"14px", padding:"20px"}}>
                <div style={{display:"flex", gap:"12px", alignItems:"flex-start"}}>
                  <div style={{
                    width:"36px", height:"36px", minWidth:"36px", borderRadius:"50%",
                    background:"linear-gradient(135deg,var(--teal),#06b6d4)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"14px", fontWeight:900, color:"#fff", fontFamily:"DM Mono,monospace"
                  }}>Q2</div>
                  <div>
                    <div style={{fontSize:"14px", fontWeight:700, color:"var(--ink)", marginBottom:"8px"}}>
                      その大学が本当に第一志望？入学を辞退する可能性はない？
                    </div>
                    <div style={{display:"flex", gap:"8px", flexWrap:"wrap"}}>
                      <span style={{padding:"4px 12px", borderRadius:"8px", background:"rgba(34,197,94,.1)", border:"1px solid rgba(34,197,94,.2)", fontSize:"12px", fontWeight:700, color:"#16a34a"}}>YES → 結果Aへ</span>
                      <span style={{padding:"4px 12px", borderRadius:"8px", background:"rgba(245,158,11,.1)", border:"1px solid rgba(245,158,11,.2)", fontSize:"12px", fontWeight:700, color:"#d97706"}}>NO → 結果Bへ</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 結果A */}
              <div style={{background:"rgba(34,197,94,.06)", border:"1.5px solid rgba(34,197,94,.2)", borderRadius:"14px", padding:"20px"}}>
                <div style={{display:"flex", gap:"12px", alignItems:"flex-start"}}>
                  <div style={{
                    width:"36px", height:"36px", minWidth:"36px", borderRadius:"50%",
                    background:"linear-gradient(135deg,#16a34a,#22c55e)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"14px", fontWeight:900, color:"#fff", fontFamily:"DM Mono,monospace"
                  }}>A</div>
                  <div>
                    <div style={{fontSize:"14px", fontWeight:700, color:"#16a34a", marginBottom:"4px"}}>指定校推薦がおすすめ</div>
                    <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.7, margin:0}}>
                      第一志望の大学に指定校枠があり、辞退する予定もないなら、指定校推薦が最も確実な選択肢です。担任の先生に早めに相談しましょう。
                    </p>
                  </div>
                </div>
              </div>

              {/* 結果B */}
              <div style={{background:"rgba(245,158,11,.06)", border:"1.5px solid rgba(245,158,11,.2)", borderRadius:"14px", padding:"20px"}}>
                <div style={{display:"flex", gap:"12px", alignItems:"flex-start"}}>
                  <div style={{
                    width:"36px", height:"36px", minWidth:"36px", borderRadius:"50%",
                    background:"linear-gradient(135deg,#d97706,#f59e0b)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"14px", fontWeight:900, color:"#fff", fontFamily:"DM Mono,monospace"
                  }}>B</div>
                  <div>
                    <div style={{fontSize:"14px", fontWeight:700, color:"#d97706", marginBottom:"4px"}}>総合型選抜で第一志望を狙うのも選択肢</div>
                    <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.7, margin:0}}>
                      指定校枠はあるけど、他にもっと行きたい大学がある場合は、指定校推薦にこだわらず総合型選抜で本当の第一志望を目指すことも考えてみましょう。
                    </p>
                  </div>
                </div>
              </div>

              {/* 結果C */}
              <div style={{background:"rgba(59,130,246,.06)", border:"1.5px solid rgba(59,130,246,.2)", borderRadius:"14px", padding:"20px"}}>
                <div style={{display:"flex", gap:"12px", alignItems:"flex-start"}}>
                  <div style={{
                    width:"36px", height:"36px", minWidth:"36px", borderRadius:"50%",
                    background:"linear-gradient(135deg,#2563eb,#3b82f6)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"14px", fontWeight:900, color:"#fff", fontFamily:"DM Mono,monospace"
                  }}>C</div>
                  <div>
                    <div style={{fontSize:"14px", fontWeight:700, color:"#2563eb", marginBottom:"4px"}}>総合型選抜 or 一般入試で自由に選ぶ</div>
                    <p style={{fontSize:"13px", color:"var(--ink2)", lineHeight:1.7, margin:0}}>
                      指定校枠がない場合は、総合型選抜か一般入試が選択肢になります。活動実績や志望理由をアピールしたいなら総合型選抜、学力で勝負したいなら一般入試を検討しましょう。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. まずやるべきこと */}
          <section id="section-6">
            <h2 style={{fontFamily:"Kaisei Opti,serif", fontSize:"22px", fontWeight:700, color:"var(--ink)", marginBottom:"16px", paddingBottom:"10px", borderBottom:"2px solid var(--teal)"}}>
              6. まずやるべきこと（3ステップ）
            </h2>
            <p style={{fontSize:"14px", color:"var(--ink2)", lineHeight:2, marginBottom:"20px"}}>
              どちらを選ぶにしても、まずは情報を集めることが大切です。以下の3つから始めてみましょう。
            </p>
            <div style={{display:"flex", flexDirection:"column", gap:"12px", marginBottom:"28px"}}>
              {[
                {step:"1", title:"担任 or 進路指導室に「自分の高校の指定校枠」を確認する", desc:"どの大学の枠があるのか、必要な評定平均はいくつか。これを知らないと指定校推薦は検討できません。"},
                {step:"2", title:"総合型選抜で受けられる大学にどんなところがあるか調べてみる", desc:"自分の興味のある分野で、総合型選抜を実施している大学を探してみましょう。意外な大学が見つかるかもしれません。"},
                {step:"3", title:"両方の出願スケジュールを並べて、自分のスケジュールを考える", desc:"校内選考の時期、総合型選抜の出願時期、一般入試の対策。すべてを書き出して、自分にとって現実的なプランを立てましょう。"},
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

        {/* CTA */}
        <div style={{background:"linear-gradient(135deg,#134e4a,#0f766e)", borderRadius:"20px", padding:"32px", textAlign:"center", marginTop:"48px"}}>
          <h3 style={{fontFamily:"Kaisei Opti,serif", fontSize:"20px", fontWeight:700, color:"#fff", marginBottom:"10px"}}>
            総合型選抜の大学を探してみませんか？
          </h3>
          <p style={{fontSize:"13px", color:"rgba(255,255,255,.7)", lineHeight:1.8, marginBottom:"24px"}}>
            ユニパスなら、気になる大学の費用・日程を<br className="hidden sm:inline"/>登録不要でまとめて確認できます。
          </p>
          <Link href="/simulator" style={{
            display:"inline-block", padding:"14px 36px", borderRadius:"12px",
            background:"linear-gradient(135deg,#5eead4,#06b6d4)",
            color:"#134e4a", fontSize:"15px", fontWeight:800, textDecoration:"none",
            boxShadow:"0 4px 20px rgba(94,234,212,.3)"
          }}>
            🔍 総合型選抜の大学を探してみる →
          </Link>
        </div>
      </article>

      {/* フッター */}
      <footer style={{background:"var(--premium)", padding:"32px 24px", textAlign:"center"}}>
        <img src="/logo.png" alt="ユニパス" style={{height:"80px", objectFit:"contain", margin:"0 auto 6px", display:"block", filter:"brightness(0) invert(1)"}} />
        <div style={{fontSize:"12px", color:"rgba(255,255,255,.4)"}}>総合型選抜ナビ · 2026年度対応</div>
      </footer>
    </div>
  )
}
