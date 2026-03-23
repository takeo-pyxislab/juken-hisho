import Link from "next/link"

export default function Home() {
  return (
    <div style={{background:'var(--bg)', minHeight:'100vh'}}>
      {/* ナビゲーション */}
      <nav style={{
        position:'sticky', top:0, zIndex:300,
        height:'58px', padding:'0 24px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        background:'rgba(248,247,244,.94)', backdropFilter:'blur(16px)',
        borderBottom:'1px solid var(--border)'
      }}>
        <div style={{display:'flex', alignItems:'center', gap:'9px'}}>
          <div style={{
            width:'30px', height:'30px',
            background:'linear-gradient(135deg,var(--teal),#06b6d4)',
            borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'16px'
          }}>📖</div>
          <div>
            <div style={{fontFamily:'Kaisei Opti,serif', fontSize:'16px', fontWeight:700, color:'var(--ink)'}}>受験秘書</div>
            <div style={{fontSize:'10px', color:'var(--ink3)'}}>総合型選抜ナビ</div>
          </div>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
          <Link href="/simulator" style={{
            padding:'6px 12px', borderRadius:'8px',
            color:'var(--ink2)', fontSize:'12px', fontWeight:600, textDecoration:'none'
          }}>無料シミュレーター</Link>
          <Link href="/login" style={{
            padding:'6px 12px', borderRadius:'8px',
            color:'var(--ink2)', fontSize:'12px', fontWeight:600, textDecoration:'none'
          }}>ログイン</Link>
          <Link href="/signup" style={{
            padding:'7px 16px', borderRadius:'8px',
            background:'var(--premium)', color:'#fff',
            fontSize:'12px', fontWeight:700, textDecoration:'none'
          }}>無料登録</Link>
        </div>
      </nav>

      {/* ヒーロー */}
      <section style={{
        minHeight:'calc(100vh - 58px)',
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        padding:'60px 24px 80px',
        position:'relative', overflow:'hidden', textAlign:'center'
      }}>
        <div style={{
          position:'absolute', inset:0,
          background:'radial-gradient(ellipse 60% 50% at 30% 40%, rgba(13,148,136,.07) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 70% 60%, rgba(6,182,212,.05) 0%, transparent 60%)',
          pointerEvents:'none'
        }}/>

        <div style={{
          display:'inline-flex', alignItems:'center', gap:'6px',
          background:'var(--teal-bg)', border:'1px solid var(--teal-border)',
          borderRadius:'20px', padding:'5px 14px',
          fontSize:'11px', fontWeight:700, color:'var(--teal2)',
          letterSpacing:'.1em', textTransform:'uppercase',
          marginBottom:'24px', position:'relative', zIndex:1
        }}>
          ✦ 2026年度入試対応
        </div>

        <h1 style={{
          fontFamily:'Kaisei Opti,serif',
          fontSize:'clamp(36px,5vw,64px)', fontWeight:700,
          color:'var(--ink)', lineHeight:1.2,
          marginBottom:'20px', position:'relative', zIndex:1
        }}>
          総合型選抜を、<br/>
          <span style={{
            background:'linear-gradient(135deg,var(--teal),#06b6d4)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'
          }}>あなた専用に。</span>
        </h1>

        <p style={{
          fontSize:'17px', color:'var(--ink2)', lineHeight:1.9,
          maxWidth:'560px', margin:'0 auto 40px',
          position:'relative', zIndex:1
        }}>
          AIが問診から志望校選定・志望理由書まで一括サポート。<br/>
          7,980学科のデータベースで最適な大学を見つけよう。
        </p>

        <div style={{display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap', position:'relative', zIndex:1, marginBottom:'60px'}}>
          <Link href="/simulator" style={{
            padding:'15px 32px', borderRadius:'12px',
            border:'2px solid var(--border2)',
            background:'var(--surface)', color:'var(--ink)',
            fontSize:'15px', fontWeight:700, textDecoration:'none', display:'inline-block'
          }}>
            🔍 無料で試す（登録不要）
          </Link>
          <Link href="/signup" style={{
            padding:'15px 36px', borderRadius:'12px', border:'none',
            background:'linear-gradient(135deg,var(--premium),#3d3530)',
            color:'#fff', fontSize:'15px', fontWeight:700,
            textDecoration:'none', display:'inline-block',
            boxShadow:'0 8px 24px rgba(26,23,20,.2)'
          }}>
            ✦ プレミアムで始める
          </Link>
        </div>

        {/* 統計 */}
        <div style={{
          display:'flex', border:'1px solid var(--border)',
          borderRadius:'var(--r-lg)', background:'var(--surface)',
          overflow:'hidden', boxShadow:'var(--sh)',
          position:'relative', zIndex:1
        }}>
          {[
            {num:'522', label:'大学データ'},
            {num:'7,980', label:'学科・専攻'},
            {num:'8,015', label:'入試情報'},
            {num:'AI', label:'診断エンジン'},
          ].map((s, i) => (
            <div key={i} style={{
              padding:'20px 32px', textAlign:'center',
              borderRight: i < 3 ? '1px solid var(--border)' : 'none'
            }}>
              <div style={{fontSize:'28px', fontWeight:900, fontFamily:'DM Mono,monospace', color:'var(--teal)'}}>{s.num}</div>
              <div style={{fontSize:'11px', color:'var(--ink3)', marginTop:'3px', fontWeight:600, letterSpacing:'.05em'}}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 無料機能 */}
      <section style={{padding:'80px 24px', maxWidth:'1100px', margin:'0 auto', textAlign:'center'}}>
        <div style={{fontSize:'11px', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--teal)', marginBottom:'12px'}}>FREE</div>
        <h2 style={{fontFamily:'Kaisei Opti,serif', fontSize:'clamp(26px,3vw,36px)', fontWeight:700, color:'var(--ink)', lineHeight:1.3, marginBottom:'16px'}}>まずは無料で試す</h2>
        <p style={{fontSize:'15px', color:'var(--ink2)', lineHeight:1.8, maxWidth:'560px', margin:'0 auto 48px'}}>
          登録不要で今すぐ使える。522大学・7,980学科から日程・費用を比較。
        </p>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px'}}>
          {[
            {icon:'🔍', title:'大学シミュレーター', desc:'エリア・学部・費用・共通テスト有無などで絞り込み。7,980学科を比較検討。', badge:'無料'},
            {icon:'📅', title:'日程比較', desc:'出願期間・試験日・結果発表日を一覧で確認。重複チェックも自動で。', badge:'無料'},
            {icon:'💰', title:'費用シミュレーション', desc:'受験料・入学金・授業料の概算を複数大学で比較。資金計画に役立てよう。', badge:'無料'},
          ].map((c, i) => (
            <div key={i} style={{
              background:'var(--surface)', border:'1.5px solid var(--border)',
              borderRadius:'var(--r-lg)', padding:'28px 24px',
              boxShadow:'var(--sh-sm)', textAlign:'left'
            }}>
              <div style={{fontSize:'36px', marginBottom:'14px'}}>{c.icon}</div>
              <div style={{
                display:'inline-block', background:'var(--teal-bg)',
                border:'1px solid var(--teal-border)', borderRadius:'20px',
                padding:'3px 10px', fontSize:'10px', fontWeight:700,
                color:'var(--teal2)', marginBottom:'10px'
              }}>{c.badge}</div>
              <h3 style={{fontSize:'15px', fontWeight:700, color:'var(--ink)', marginBottom:'8px'}}>{c.title}</h3>
              <p style={{fontSize:'13px', color:'var(--ink2)', lineHeight:1.7}}>{c.desc}</p>
            </div>
          ))}
        </div>
        <div style={{marginTop:'32px'}}>
          <Link href="/simulator" style={{
            display:'inline-block', padding:'14px 40px', borderRadius:'12px',
            background:'var(--teal)', color:'#fff',
            fontSize:'15px', fontWeight:700, textDecoration:'none',
            boxShadow:'0 6px 20px rgba(13,148,136,.3)'
          }}>
            シミュレーターを試す →
          </Link>
        </div>
      </section>

      {/* 有料機能 */}
      <section style={{
        background:'linear-gradient(135deg,var(--premium) 0%,#2d2825 50%,var(--teal3) 100%)',
        padding:'80px 24px', position:'relative', overflow:'hidden'
      }}>
        <div style={{maxWidth:'1100px', margin:'0 auto', position:'relative', zIndex:1}}>
          <div style={{fontSize:'11px', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'rgba(255,255,255,.5)', marginBottom:'12px'}}>PREMIUM</div>
          <h2 style={{fontFamily:'Kaisei Opti,serif', fontSize:'clamp(28px,3vw,42px)', fontWeight:700, color:'#fff', lineHeight:1.3, marginBottom:'16px'}}>
            AIが、あなただけの<br/><span style={{color:'#5eead4'}}>受験戦略</span>を作る。
          </h2>
          <p style={{fontSize:'15px', color:'rgba(255,255,255,.7)', lineHeight:1.8, maxWidth:'560px', marginBottom:'48px'}}>
            問診→診断→志望理由書→タスク管理まで。総合型選抜のすべてをAIがサポート。
          </p>
          <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'14px', marginBottom:'48px'}}>
            {[
              {icon:'🧠', title:'AI問診・志望校診断', desc:'6ステップの問診で、あなたに合う大学と選抜方式をAIが分析。穴場校も自動提案。'},
              {icon:'✍️', title:'志望理由書の自動生成', desc:'大学・学部・字数を指定するだけ。AIが完成版を生成し、何度でもリライト可能。'},
              {icon:'✅', title:'逆算タスクリスト', desc:'志望校を登録するだけで、出願までの全タスクを自動生成。やることが一目瞭然。'},
              {icon:'📊', title:'保護者レポートPDF', desc:'面接対策・書類進捗・日程管理を保護者と共有。家族で受験を乗り越えよう。'},
            ].map((f, i) => (
              <div key={i} style={{
                background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)',
                borderRadius:'var(--r)', padding:'20px',
                display:'flex', gap:'14px', alignItems:'flex-start'
              }}>
                <span style={{fontSize:'24px', minWidth:'32px', marginTop:'2px'}}>{f.icon}</span>
                <div>
                  <div style={{fontSize:'14px', fontWeight:700, color:'#fff', marginBottom:'4px'}}>{f.title}</div>
                  <div style={{fontSize:'12px', color:'rgba(255,255,255,.6)', lineHeight:1.6}}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{
            background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.15)',
            borderRadius:'var(--r-lg)', padding:'32px',
            display:'flex', alignItems:'center', justifyContent:'space-between', gap:'24px', flexWrap:'wrap'
          }}>
            <div>
              <div style={{fontSize:'13px', color:'rgba(255,255,255,.5)', marginBottom:'4px'}}>月額料金</div>
              <div style={{fontFamily:'DM Mono,monospace', fontSize:'40px', fontWeight:700, color:'#fff'}}>
                ¥980<span style={{fontSize:'16px', fontWeight:400, color:'rgba(255,255,255,.5)'}}>/月</span>
              </div>
              <div style={{fontSize:'12px', color:'rgba(255,255,255,.4)', marginTop:'4px'}}>いつでも解約可能</div>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
              <Link href="/signup" style={{
                padding:'14px 36px', borderRadius:'10px',
                background:'linear-gradient(135deg,var(--teal),#06b6d4)',
                color:'#fff', fontSize:'15px', fontWeight:700,
                textDecoration:'none', display:'inline-block', textAlign:'center', whiteSpace:'nowrap'
              }}>
                今すぐ始める →
              </Link>
              <Link href="/simulator" style={{
                padding:'12px 36px', borderRadius:'10px',
                border:'1px solid rgba(255,255,255,.2)',
                color:'rgba(255,255,255,.8)', fontSize:'14px', fontWeight:600,
                textDecoration:'none', display:'inline-block', textAlign:'center'
              }}>
                まず無料で試す
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 利用の流れ */}
      <section style={{padding:'80px 24px', maxWidth:'1100px', margin:'0 auto', textAlign:'center'}}>
        <div style={{fontSize:'11px', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--teal)', marginBottom:'12px'}}>HOW IT WORKS</div>
        <h2 style={{fontFamily:'Kaisei Opti,serif', fontSize:'clamp(26px,3vw,36px)', fontWeight:700, color:'var(--ink)', marginBottom:'48px'}}>使い方は4ステップ</h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'24px'}}>
          {[
            {num:'01', badge:'無料', icon:'🔍', title:'シミュレーター', desc:'ログイン不要で大学を検索・比較'},
            {num:'02', badge:'無料', icon:'📝', title:'アカウント登録', desc:'メールアドレスで30秒で完了'},
            {num:'03', badge:'有料', icon:'🧠', title:'AI問診・診断', desc:'6ステップでAIが志望校を提案'},
            {num:'04', badge:'有料', icon:'✍️', title:'書類・対策', desc:'志望理由書生成・タスク管理'},
          ].map((s, i) => (
            <div key={i} style={{textAlign:'center', padding:'0 8px'}}>
              <div style={{
                width:'56px', height:'56px', borderRadius:'50%',
                border:'3px solid var(--teal)', background:'var(--surface)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'20px', margin:'0 auto 16px', boxShadow:'var(--sh)'
              }}>{s.icon}</div>
              <div style={{
                display:'inline-block', padding:'2px 8px', borderRadius:'20px',
                fontSize:'10px', fontWeight:700, marginBottom:'6px',
                background: s.badge==='無料' ? 'var(--teal-bg)' : 'var(--premium)',
                color: s.badge==='無料' ? 'var(--teal2)' : '#fff',
                border: s.badge==='無料' ? '1px solid var(--teal-border)' : 'none'
              }}>{s.badge}</div>
              <h3 style={{fontSize:'13px', fontWeight:700, color:'var(--ink)', marginBottom:'6px'}}>{s.title}</h3>
              <p style={{fontSize:'12px', color:'var(--ink3)', lineHeight:1.5}}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* フッター */}
      <footer style={{background:'var(--premium)', padding:'48px 24px 32px', textAlign:'center'}}>
        <div style={{fontFamily:'Kaisei Opti,serif', fontSize:'22px', color:'#fff', marginBottom:'8px'}}>受験秘書</div>
        <div style={{fontSize:'13px', color:'rgba(255,255,255,.4)', marginBottom:'24px'}}>総合型選抜（AO入試）専門のAIナビゲーター</div>
        <div style={{display:'flex', gap:'20px', justifyContent:'center', flexWrap:'wrap', marginBottom:'24px'}}>
          {['利用規約', 'プライバシーポリシー', 'お問い合わせ'].map(l => (
            <span key={l} style={{fontSize:'12px', color:'rgba(255,255,255,.4)', cursor:'pointer'}}>{l}</span>
          ))}
        </div>
        <div style={{fontSize:'11px', color:'rgba(255,255,255,.25)'}}>© 2026 受験秘書 / Pyxislab Inc.</div>
      </footer>
    </div>
  )
}
