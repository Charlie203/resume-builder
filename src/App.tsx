import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Ultra-modern Split Layout AI Resume Builder (single-file)
// Drop this into src/App.tsx of your Stackblitz React project.

type Exp = { role: string; company: string; period: string; bullets: string[] };
type Edu = { school: string; degree: string; year: string };

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark" | "elegant" | "corporate" | "creative">("elegant");
  const [name, setName] = useState("Your Name");
  const [title, setTitle] = useState("Senior Product Designer");
  const [email, setEmail] = useState("name@example.com");
  const [phone, setPhone] = useState("+00 000 000");
  const [summary, setSummary] = useState("Strategic product designer with a record of shipping delightful experiences.");
  const [experiences, setExperiences] = useState<Exp[]>([
    { role: "Senior Designer", company: "Acme Inc", period: "2020 — Present", bullets: ["Led product redesign", "Improved metrics by 32%"] },
  ]);
  const [education, setEducation] = useState<Edu[]>([{ school: "University X", degree: "B.A. Design", year: "2017" }]);
  const [skills, setSkills] = useState<string[]>(["Product Design", "Figma", "Research"]);

  const previewRef = useRef<HTMLDivElement | null>(null);

  function addExperience() {
    setExperiences(s => [...s, { role: "New Role", company: "Company", period: "Year — Year", bullets: ["Achievement"] }]);
  }
  function addBullet(i: number) {
    setExperiences(prev => prev.map((e, idx) => idx === i ? { ...e, bullets: [...e.bullets, "New bullet"] } : e));
  }
  function updateExperienceField(i:number, field:keyof Exp, value:string) {
    setExperiences(prev => prev.map((e,idx) => idx===i ? { ...e, [field]: value } : e));
  }
  function updateBullet(i:number, bi:number, value:string) {
    setExperiences(prev => prev.map((e,idx)=> idx===i ? { ...e, bullets: e.bullets.map((b,bj)=> bj===bi ? value : b) } : e));
  }

  function downloadStyledPDF() {
    if (!previewRef.current) return;
    html2canvas(previewRef.current, { scale: 2 }).then(canvas => {
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const pdfW = pdf.internal.pageSize.getWidth();
      const imgProps = (pdf as any).getImageProperties(img);
      const imgW = pdfW - 40;
      const imgH = (imgProps.height * imgW) / imgProps.width;
      pdf.addImage(img, "PNG", 20, 20, imgW, imgH);
      pdf.save(`${name.replace(/\s+/g, "_")}_styled.pdf`);
    }).catch(() => alert("Failed to generate PDF"));
  }

  function downloadATSPDF() {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    let y = 40;
    doc.setFontSize(18); doc.text(name, 40, y); y += 20;
    doc.setFontSize(12); doc.text(title, 40, y); y += 16;
    doc.text(`${email} | ${phone}`, 40, y); y += 20;
    doc.setFontSize(13); doc.text("Summary", 40, y); y += 16;
    doc.setFontSize(11); doc.text(doc.splitTextToSize(summary, 480), 40, y); y += 14 * Math.ceil(summary.length/80);
    y += 8; doc.setFontSize(13); doc.text("Experience", 40, y); y += 16;
    experiences.forEach(exp => {
      doc.setFontSize(12); doc.text(`${exp.role} — ${exp.company}`, 40, y); y += 14;
      doc.setFontSize(10); doc.text(exp.period, 40, y); y += 12;
      exp.bullets.forEach(b => { doc.text(`- ${b}`, 46, y); y += 12; });
      y += 6; if (y > 700) { doc.addPage(); y = 40; }
    });
    doc.setFontSize(13); doc.text("Education", 40, y); y += 16;
    education.forEach(ed => { doc.setFontSize(11); doc.text(`${ed.school} — ${ed.degree} (${ed.year})`, 40, y); y += 14; });
    y += 6; doc.setFontSize(13); doc.text("Skills", 40, y); y += 14;
    doc.setFontSize(11); doc.text(skills.join(", "), 40, y);
    doc.save(`${name.replace(/\s+/g, "_")}_ats.pdf`);
  }

  const themeStyles: Record<string, any> = {
    light: { pageBg: "linear-gradient(180deg,#f7fbff,#000000)", cardBg: "#ffffff", text: "#0b1220", accent: "#2563eb" },
    dark: { pageBg: "#0b0f13", cardBg: "#0f1720", text: "#e6eef8", accent: "#7c3aed" },
    elegant: { pageBg: "linear-gradient(180deg,#fbf7f2,#fffefc)", cardBg: "#ffffff", text: "#111827", accent: "#8b5cf6" },
    corporate: { pageBg: "linear-gradient(180deg,#eef2ff,#ffffff)", cardBg: "#ffffff", text: "#06202a", accent: "#0ea5a3" },
    creative: { pageBg: "linear-gradient(90deg,#fdf2f8,#eef2ff)", cardBg: "rgba(255,255,255,0.92)", text: "#0b1220", accent: "#ec4899" },
  };

  const ts = themeStyles[theme];

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Inter, system-ui, -apple-system, Roboto, "Helvetica Neue", Arial', background: ts.pageBg, padding: 28, color: ts.text }}>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: 18 }}>
          <h1 style={{ margin: 0, fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', background: `linear-gradient(90deg, ${ts.accent}, #06b6d4)`, WebkitBackgroundClip: 'text' as any, color: 'transparent' }}>AI Resume Builder</h1>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 22 }}>

          <aside style={{ borderRadius: 16, padding: 18, background: 'rgba(255,255,255,0.6)', boxShadow: '0 12px 30px rgba(2,6,23,0.06)', backdropFilter: 'blur(8px)' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, justifyContent: 'space-between' }}>
              {(['light','dark','elegant','corporate','creative'] as const).map(t => (
                <button key={t} onClick={() => setTheme(t)} style={{ flex: 1, padding: '8px 10px', borderRadius: 12, border: theme===t ? `2px solid ${themeStyles[t].accent}` : '1px solid rgba(2,6,23,0.06)', background: theme===t ? themeStyles[t].cardBg : 'transparent', cursor: 'pointer', boxShadow: theme===t ? '0 6px 18px rgba(2,6,23,0.08)' : 'none' }}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
              ))}
            </div>

            <div style={{ display: 'grid', gap: 10 }}>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" style={{ padding: 12, borderRadius: 10, border: '1px solid rgba(2,6,23,0.06)' }} />
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Job title" style={{ padding: 12, borderRadius: 10, border: '1px solid rgba(2,6,23,0.06)' }} />
              <div style={{ display:'flex', gap:8 }}>
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{ flex:1, padding:12, borderRadius:10, border:'1px solid rgba(2,6,23,0.06)' }} />
                <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone" style={{ width:140, padding:12, borderRadius:10, border:'1px solid rgba(2,6,23,0.06)' }} />
              </div>
              <textarea value={summary} onChange={e=>setSummary(e.target.value)} placeholder="Summary" rows={4} style={{ padding:12, borderRadius:10, border:'1px solid rgba(2,6,23,0.06)' }} />

              <div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <strong>Experience</strong>
                  <button onClick={addExperience} style={{ padding:'6px 10px', borderRadius:8 }}>+ Add</button>
                </div>
                {experiences.map((ex,i)=> (
                  <div key={i} style={{ padding:10, borderRadius:10, background:'rgba(0,0,0,0.03)', marginBottom:8 }}>
                    <input value={ex.role} onChange={e=>updateExperienceField(i,'role',e.target.value)} style={{ width:'100%', padding:8, borderRadius:8, marginBottom:6 }} />
                    <input value={ex.company} onChange={e=>updateExperienceField(i,'company',e.target.value)} style={{ width:'100%', padding:8, borderRadius:8, marginBottom:6 }} />
                    <input value={ex.period} onChange={e=>updateExperienceField(i,'period',e.target.value)} style={{ width:'100%', padding:8, borderRadius:8, marginBottom:6 }} />
                    {ex.bullets.map((b,bi)=> (
                      <div key={bi} style={{ display:'flex', gap:8, marginBottom:6 }}>
                        <input value={b} onChange={e=>updateBullet(i,bi,e.target.value)} style={{ flex:1, padding:8, borderRadius:8 }} />
                        <button onClick={()=>addBullet(i)} style={{ padding:'6px 10px', borderRadius:8 }}>+</button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div>
                <strong>Education</strong>
                {education.map((ed, i)=> (
                  <div key={i} style={{ padding:10, borderRadius:10, background:'rgba(0,0,0,0.03)', marginTop:8 }}>
                    <input value={ed.school} onChange={e=> setEducation(prev => prev.map((p,pi)=> pi===i ? {...p, school: e.target.value} : p))} style={{ width:'100%', padding:8, borderRadius:8, marginBottom:6 }} />
                    <input value={ed.degree} onChange={e=> setEducation(prev => prev.map((p,pi)=> pi===i ? {...p, degree: e.target.value} : p))} style={{ width:'100%', padding:8, borderRadius:8, marginBottom:6 }} />
                    <input value={ed.year} onChange={e=> setEducation(prev => prev.map((p,pi)=> pi===i ? {...p, year: e.target.value} : p))} style={{ width:'100%', padding:8, borderRadius:8 }} />
                  </div>
                ))}
              </div>

              <div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <strong>Skills</strong>
                  <button onClick={()=> setSkills(s=>[...s,'New'])} style={{ padding:'6px 10px', borderRadius:8 }}>+ Add</button>
                </div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:8 }}>
                  {skills.map((s,i)=> (
                    <input key={i} value={s} onChange={e=> setSkills(prev => prev.map((p,pi)=> pi===i? e.target.value : p))} style={{ padding:'6px 10px', borderRadius:999, border:'none', boxShadow:'0 6px 18px rgba(2,6,23,0.04)' }} />
                  ))}
                </div>
              </div>

              <div style={{ display:'flex', gap:10, marginTop:12 }}>
                <button onClick={downloadStyledPDF} style={{ flex:1, padding:12, borderRadius:12, background:`linear-gradient(90deg, ${ts.accent}, #06b6d4)`, color:'#fff', border:'none' }}>Download Styled PDF</button>
                <button onClick={downloadATSPDF} style={{ flex:1, padding:12, borderRadius:12, background:'rgba(0,0,0,0.06)', border:'none' }}>Download ATS PDF</button>
              </div>

            </div>
          </aside>

          <main style={{ borderRadius:16, padding:20, background: ts.cardBg, boxShadow: '0 16px 40px rgba(2,6,23,0.06)' }}>
            <div ref={previewRef} style={{ maxWidth:760, margin:'0 auto', padding:24, borderRadius:12, background: theme==='dark' ? '#07101a' : 'transparent', color: ts.text }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                <div>
                  <div style={{ fontSize:28, fontWeight:800 }}>{name}</div>
                  <div style={{ marginTop:6, fontSize:14, opacity:0.9 }}>{title}</div>
                </div>
                <div style={{ textAlign:'right', fontSize:13, opacity:0.9 }}>{email} • {phone}</div>
              </div>

              <section style={{ marginTop:6 }}>
                <h3 style={{ margin:0, fontSize:14, fontWeight:700, color: ts.accent }}>Summary</h3>
                <p style={{ marginTop:8, lineHeight:1.6 }}>{summary}</p>
              </section>

              <section style={{ marginTop:12 }}>
                <h3 style={{ margin:0, fontSize:14, fontWeight:700, color: ts.accent }}>Experience</h3>
                <div style={{ marginTop:10 }}>
                  {experiences.map((ex, i)=> (
                    <div key={i} style={{ marginBottom:12 }}>
                      <div style={{ fontWeight:700 }}>{ex.role}</div>
                      <div style={{ fontSize:12, opacity:0.8 }}>{ex.company} • {ex.period}</div>
                      <ul style={{ marginTop:8 }}>
                        {ex.bullets.map((b,bi)=> <li key={bi} style={{ marginBottom:6 }}>{b}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section style={{ marginTop:8, borderTop:'1px solid rgba(0,0,0,0.04)', paddingTop:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', gap:16 }}>
                  <div style={{ flex:1 }}>
                    <h3 style={{ margin:0, fontSize:14, fontWeight:700, color: ts.accent }}>Education</h3>
                    <div style={{ marginTop:10 }}>
                      {education.map((ed,i)=> (
                        <div key={i} style={{ marginBottom:8 }}>
                          <div style={{ fontWeight:700 }}>{ed.school}</div>
                          <div style={{ fontSize:12, opacity:0.8 }}>{ed.degree} • {ed.year}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <aside style={{ width:220 }}>
                    <h3 style={{ margin:0, fontSize:14, fontWeight:700, color: ts.accent }}>Skills</h3>
                    <div style={{ marginTop:10, display:'flex', flexWrap:'wrap', gap:8 }}>
                      {skills.map((s,i)=> (
                        <div key={i} style={{ padding:'6px 10px', borderRadius:999, background:'rgba(0,0,0,0.06)', display:'inline-block', fontSize:12 }}>{s}</div>
                      ))}
                    </div>
                  </aside>
                </div>
              </section>

            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
