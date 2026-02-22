import { useState, useEffect, useCallback, useRef } from "react";

const SCIENTIST_QUOTES = [
  { quote: "The important thing is not to stop questioning. Curiosity has its own reason for existing.", author: "Albert Einstein" },
  { quote: "Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.", author: "Marie Curie" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { quote: "The good thing about science is that it's true whether or not you believe in it.", author: "Neil deGrasse Tyson" },
  { quote: "Somewhere, something incredible is waiting to be known.", author: "Carl Sagan" },
  { quote: "One, remember to look up at the stars and not down at your feet.", author: "Stephen Hawking" },
  { quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { quote: "If I have seen further it is by standing on the shoulders of Giants.", author: "Isaac Newton" },
  { quote: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { quote: "Science is not only a disciple of reason but also one of romance and passion.", author: "Stephen Hawking" },
  { quote: "The cosmos is within us. We are made of star-stuff.", author: "Carl Sagan" },
  { quote: "Life is not easy for any of us. But what of that? We must have perseverance and above all confidence in ourselves.", author: "Marie Curie" },
  { quote: "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.", author: "Albert Einstein" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "The only way to do great work is to love what you do.", author: "Ada Lovelace" },
  { quote: "We are just an advanced breed of monkeys on a minor planet of a very average star. But we can understand the Universe.", author: "Stephen Hawking" },
  { quote: "It is not the strongest of the species that survives, nor the most intelligent, but the one most responsive to change.", author: "Charles Darwin" },
  { quote: "Genius is one percent inspiration and ninety-nine percent perspiration.", author: "Thomas Edison" },
  { quote: "The measure of intelligence is the ability to change.", author: "Albert Einstein" },
];

function getQuoteForContact(name) {
  const seed = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return SCIENTIST_QUOTES[(seed + dayOfYear) % SCIENTIST_QUOTES.length];
}

function parseBirthday(bd) {
  if (!bd) return null;
  const [m, d] = bd.split("-").map(Number);
  if (!m || !d) return null;
  return { month: m, day: d };
}

function getDaysUntilBirthday(bd) {
  const parsed = parseBirthday(bd);
  if (!parsed) return Infinity;
  const today = new Date();
  const thisYear = today.getFullYear();
  let next = new Date(thisYear, parsed.month - 1, parsed.day);
  if (next < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
    next = new Date(thisYear + 1, parsed.month - 1, parsed.day);
  }
  const diff = Math.ceil((next - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000);
  return diff;
}

function formatBirthdayDate(bd) {
  const parsed = parseBirthday(bd);
  if (!parsed) return "";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parsed.month - 1]} ${parsed.day}`;
}

const INITIAL_CONTACTS = [
  { id: "Identifier", name: "Full Name", email: "email address", company: "Company Name", role: "Job Description", tags: ["Category"], notes: "memo", lastInteraction: "date {yyyy-mm-dd}", starred: true/false, birthday: "mm-dd" },
];

const TAG_COLORS = { recruiter: { bg: "#FFF3E0", text: "#E65100", border: "#FFB74D" }, interviewer: { bg: "#E8F5E9", text: "#1B5E20", border: "#81C784" }, family: { bg: "#FCE4EC", text: "#880E4F", border: "#F48FB1" }, friend: { bg: "#E3F2FD", text: "#0D47A1", border: "#64B5F6" }, colleague: { bg: "#F3E5F5", text: "#4A148C", border: "#CE93D8" }, client: { bg: "#E0F7FA", text: "#006064", border: "#4DD0E1" } };
const getTagStyle = (tag) => TAG_COLORS[tag] || { bg: "#F5F5F5", text: "#424242", border: "#BDBDBD" };
function generateId() { return "c" + Date.now() + Math.random().toString(36).slice(2, 6); }

const SearchIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>);
const PlusIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>);
const StarIcon = ({ filled }) => (<svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#F59E0B" : "none"} stroke={filled ? "#F59E0B" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const TrashIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>);
const EditIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5z"/></svg>);
const XIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>);
const MailIcon = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>);
const BuildingIcon = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>);
const UserIcon = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const ExportIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>);
const CakeIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-8a2 2 0 00-2-2H6a2 2 0 00-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v3M12 8v3M17 8v3"/><path d="M7 4h.01M12 4h.01M17 4h.01"/></svg>);
const CopyIcon = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>);

// ─── Birthday Banner ───
function BirthdayBanner({ contacts }) {
  const [copiedId, setCopiedId] = useState(null);
  const upcoming = contacts
    .filter((c) => c.birthday)
    .map((c) => ({ ...c, daysUntil: getDaysUntilBirthday(c.birthday) }))
    .filter((c) => c.daysUntil <= 30)
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 5);

  if (upcoming.length === 0) return null;

  const copyWish = (contact) => {
    const q = getQuoteForContact(contact.name);
    const firstName = contact.name.split(" ")[0].split("/")[0].trim();
    const wish = `Happy Birthday, ${firstName}! 🎂\n\n"${q.quote}"\n— ${q.author}\n\nWishing you a wonderful year ahead!`;
    navigator.clipboard.writeText(wish).then(() => { setCopiedId(contact.id); setTimeout(() => setCopiedId(null), 2000); });
  };

  return (
    <div style={{ marginBottom: 20, borderRadius: 14, border: "1px solid #FDE68A", background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)", padding: "18px 20px", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <CakeIcon />
        <span style={{ fontSize: 14, fontWeight: 600, color: "#92400E" }}>Upcoming Birthdays</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {upcoming.map((c) => {
          const q = getQuoteForContact(c.name);
          const isToday = c.daysUntil === 0;
          const label = isToday ? "Today!" : c.daysUntil === 1 ? "Tomorrow" : `In ${c.daysUntil} days`;
          const initials = c.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
          const hue = c.name.split("").reduce((a, ch) => a + ch.charCodeAt(0), 0) % 360;
          return (
            <div key={c.id} style={{ background: isToday ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)", borderRadius: 10, padding: "12px 14px", border: isToday ? "1px solid #F59E0B" : "1px solid rgba(253,230,138,0.5)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `hsl(${hue}, 45%, 88%)`, color: `hsl(${hue}, 45%, 35%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1C1917" }}>{c.name}</span>
                    {isToday && <span style={{ fontSize: 16 }}>🎉</span>}
                  </div>
                  <div style={{ fontSize: 11, color: "#92400E" }}>
                    {formatBirthdayDate(c.birthday)} · <span style={{ fontWeight: 600 }}>{label}</span>
                  </div>
                </div>
                <button onClick={() => copyWish(c)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: copiedId === c.id ? "#059669" : "#1C1917", color: "#fff", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s", whiteSpace: "nowrap" }}>
                  <CopyIcon /> {copiedId === c.id ? "Copied!" : "Copy wish"}
                </button>
              </div>
              <div style={{ fontSize: 12, color: "#78716C", fontStyle: "italic", lineHeight: 1.5, paddingLeft: 42 }}>
                "{q.quote}" <span style={{ fontStyle: "normal", color: "#A8A29E" }}>— {q.author}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContactModal({ contact, onSave, onClose }) {
  const [form, setForm] = useState(contact || { name: "", email: "", company: "", role: "", tags: [], notes: "", lastInteraction: new Date().toISOString().split("T")[0], starred: false, birthday: "" });
  const [tagInput, setTagInput] = useState("");
  const nameRef = useRef(null);
  useEffect(() => { nameRef.current?.focus(); }, []);
  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const addTag = () => { const t = tagInput.trim().toLowerCase(); if (t && !form.tags.includes(t)) update("tags", [...form.tags, t]); setTagInput(""); };
  const removeTag = (t) => update("tags", form.tags.filter((x) => x !== t));
  const handleSubmit = (e) => { e.preventDefault(); if (!form.name.trim()) return; onSave({ ...form, id: form.id || generateId() }); };
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}><h3 style={styles.modalTitle}>{contact ? "Edit contact" : "New contact"}</h3><button style={styles.iconBtn} onClick={onClose}><XIcon /></button></div>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}><label style={styles.label}>Name *</label><input ref={nameRef} style={styles.input} value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Full name" required /></div>
            <div style={styles.formGroup}><label style={styles.label}>Email</label><input style={styles.input} type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="email@example.com" /></div>
            <div style={styles.formGroup}><label style={styles.label}>Company</label><input style={styles.input} value={form.company} onChange={(e) => update("company", e.target.value)} placeholder="Company name" /></div>
            <div style={styles.formGroup}><label style={styles.label}>Role</label><input style={styles.input} value={form.role} onChange={(e) => update("role", e.target.value)} placeholder="Job title" /></div>
            <div style={styles.formGroup}><label style={styles.label}>Birthday</label><input style={styles.input} value={form.birthday} onChange={(e) => update("birthday", e.target.value)} placeholder="MM-DD (e.g. 03-15)" maxLength={5} /></div>
            <div style={styles.formGroup}><label style={styles.label}>Last interaction</label><input style={styles.input} type="date" value={form.lastInteraction} onChange={(e) => update("lastInteraction", e.target.value)} /></div>
            <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
              <label style={styles.label}>Tags</label>
              <div style={{ display: "flex", gap: 6 }}><input style={{ ...styles.input, flex: 1 }} value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Add tag + Enter" /></div>
              {form.tags.length > 0 && (<div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>{form.tags.map((t) => { const s = getTagStyle(t); return (<span key={t} style={{ ...styles.tag, background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>{t}<button type="button" style={{ ...styles.iconBtn, marginLeft: 2, padding: 0 }} onClick={() => removeTag(t)}><XIcon /></button></span>); })}</div>)}
            </div>
          </div>
          <div style={styles.formGroup}><label style={styles.label}>Notes</label><textarea style={{ ...styles.input, minHeight: 72, resize: "vertical", fontFamily: "inherit" }} value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Any notes..." /></div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}><button type="button" style={styles.btnSecondary} onClick={onClose}>Cancel</button><button type="submit" style={styles.btnPrimary}>{contact ? "Save changes" : "Add contact"}</button></div>
        </form>
      </div>
    </div>
  );
}

function ContactRow({ contact, onEdit, onDelete, onToggleStar }) {
  const initials = contact.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const hue = contact.name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  const daysUntil = getDaysUntilBirthday(contact.birthday);
  const hasBdaySoon = daysUntil <= 7;
  return (
    <div style={styles.contactRow}>
      <div style={{ ...styles.avatar, background: `hsl(${hue}, 45%, 88%)`, color: `hsl(${hue}, 45%, 35%)` }}>{initials}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={styles.contactName}>{contact.name}</span>
          {hasBdaySoon && <span title={`Birthday ${formatBirthdayDate(contact.birthday)}`} style={{ fontSize: 14 }}>🎂</span>}
          <button style={{ ...styles.iconBtn, padding: 2 }} onClick={() => onToggleStar(contact.id)}><StarIcon filled={contact.starred} /></button>
        </div>
        <div style={styles.contactMeta}>
          {contact.email && <span style={styles.metaItem}><MailIcon /> {contact.email}</span>}
          {contact.company && <span style={styles.metaItem}><BuildingIcon /> {contact.company}</span>}
          {contact.role && <span style={styles.metaItem}><UserIcon /> {contact.role}</span>}
          {contact.birthday && <span style={styles.metaItem}><CakeIcon /> {formatBirthdayDate(contact.birthday)}</span>}
        </div>
        {contact.tags.length > 0 && (<div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>{contact.tags.map((t) => { const s = getTagStyle(t); return <span key={t} style={{ ...styles.tagSmall, background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>{t}</span>; })}</div>)}
        {contact.notes && <div style={styles.notesPreview}>{contact.notes}</div>}
      </div>
      <div style={styles.contactRight}><span style={styles.dateLabel}>{contact.lastInteraction}</span><div style={{ display: "flex", gap: 4 }}><button style={styles.iconBtn} onClick={() => onEdit(contact)}><EditIcon /></button><button style={{ ...styles.iconBtn, color: "#EF5350" }} onClick={() => onDelete(contact.id)}><TrashIcon /></button></div></div>
    </div>
  );
}

export default function PersonalCRM() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [showStarred, setShowStarred] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [modalContact, setModalContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => { try { const result = await window.storage.get("crm-contacts-v4"); if (result && result.value) { setContacts(JSON.parse(result.value)); } else { setContacts(INITIAL_CONTACTS); await window.storage.set("crm-contacts-v4", JSON.stringify(INITIAL_CONTACTS)); } } catch { setContacts(INITIAL_CONTACTS); try { await window.storage.set("crm-contacts-v4", JSON.stringify(INITIAL_CONTACTS)); } catch {} } setLoading(false); })(); }, []);

  const persist = useCallback(async (updated) => { setContacts(updated); try { await window.storage.set("crm-contacts-v4", JSON.stringify(updated)); } catch {} }, []);
  const handleSave = (contact) => { const exists = contacts.find((c) => c.id === contact.id); persist(exists ? contacts.map((c) => (c.id === contact.id ? contact : c)) : [...contacts, contact]); setShowModal(false); setModalContact(null); };
  const handleDelete = (id) => persist(contacts.filter((c) => c.id !== id));
  const handleToggleStar = (id) => persist(contacts.map((c) => (c.id === id ? { ...c, starred: !c.starred } : c)));
  const handleExport = () => { const headers = ["Name","Email","Company","Role","Tags","Notes","Birthday","Last Interaction","Starred"]; const rows = contacts.map((c) => [c.name, c.email, c.company, c.role, c.tags.join(";"), c.notes, c.birthday||"", c.lastInteraction, c.starred]); const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n"); const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "contacts.csv"; a.click(); URL.revokeObjectURL(url); };

  const allTags = [...new Set(contacts.flatMap((c) => c.tags))].sort();
  const filtered = contacts.filter((c) => { const q = search.toLowerCase(); return (!q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.notes.toLowerCase().includes(q)) && (!filterTag || c.tags.includes(filterTag)) && (!showStarred || c.starred); }).sort((a, b) => { if (sortBy === "name") return a.name.localeCompare(b.name); if (sortBy === "company") return (a.company || "zzz").localeCompare(b.company || "zzz"); if (sortBy === "recent") return (b.lastInteraction || "").localeCompare(a.lastInteraction || ""); return 0; });

  if (loading) return (<div style={{ ...styles.container, display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "#999", fontFamily: "'DM Sans', sans-serif" }}>Loading contacts...</p></div>);

  return (
    <div style={styles.container}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Instrument+Serif&display=swap" rel="stylesheet" />
      <div style={styles.header}><div><h1 style={styles.title}>Contacts</h1><p style={styles.subtitle}>{contacts.length} people · {filtered.length} shown</p></div><div style={{ display: "flex", gap: 8 }}><button style={styles.btnSecondary} onClick={handleExport}><ExportIcon /> Export</button><button style={styles.btnPrimary} onClick={() => { setModalContact(null); setShowModal(true); }}><PlusIcon /> Add</button></div></div>
      <BirthdayBanner contacts={contacts} />
      <div style={styles.controls}>
        <div style={styles.searchWrap}><span style={styles.searchIcon}><SearchIcon /></span><input style={styles.searchInput} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, company, or notes..." />{search && <button style={{ ...styles.iconBtn, position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)" }} onClick={() => setSearch("")}><XIcon /></button>}</div>
        <div style={styles.filterRow}><button style={showStarred ? styles.filterActive : styles.filterBtn} onClick={() => setShowStarred(!showStarred)}><StarIcon filled={showStarred} /> Starred</button><select style={styles.select} value={filterTag} onChange={(e) => setFilterTag(e.target.value)}><option value="">All tags</option>{allTags.map((t) => <option key={t} value={t}>{t}</option>)}</select><select style={styles.select} value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="name">Sort: Name</option><option value="company">Sort: Company</option><option value="recent">Sort: Recent</option></select></div>
      </div>
      <div style={styles.list}>{filtered.length === 0 ? (<div style={styles.empty}><p style={{ color: "#999", fontSize: 14 }}>No contacts match your filters.</p></div>) : filtered.map((c) => (<ContactRow key={c.id} contact={c} onEdit={(ct) => { setModalContact(ct); setShowModal(true); }} onDelete={handleDelete} onToggleStar={handleToggleStar} />))}</div>
      {showModal && <ContactModal contact={modalContact} onSave={handleSave} onClose={() => { setShowModal(false); setModalContact(null); }} />}
    </div>
  );
}

const styles = {
  container: { fontFamily: "'DM Sans', sans-serif", maxWidth: 800, margin: "0 auto", padding: "32px 20px", minHeight: "100vh", background: "#FAFAF9", color: "#1C1917" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 },
  title: { fontFamily: "'Instrument Serif', serif", fontSize: 36, fontWeight: 400, margin: 0, letterSpacing: "-0.02em", color: "#1C1917" },
  subtitle: { fontSize: 13, color: "#78716C", margin: "4px 0 0" },
  controls: { marginBottom: 20 },
  searchWrap: { position: "relative", marginBottom: 12 },
  searchIcon: { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#A8A29E", display: "flex" },
  searchInput: { width: "100%", padding: "10px 36px", border: "1px solid #E7E5E4", borderRadius: 10, fontSize: 13, fontFamily: "'DM Sans', sans-serif", background: "#fff", outline: "none", boxSizing: "border-box" },
  filterRow: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" },
  filterBtn: { display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", border: "1px solid #E7E5E4", borderRadius: 8, background: "#fff", fontSize: 12, fontFamily: "'DM Sans', sans-serif", color: "#57534E", cursor: "pointer" },
  filterActive: { display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", border: "1px solid #F59E0B", borderRadius: 8, background: "#FFFBEB", fontSize: 12, fontFamily: "'DM Sans', sans-serif", color: "#92400E", cursor: "pointer" },
  select: { padding: "6px 10px", border: "1px solid #E7E5E4", borderRadius: 8, background: "#fff", fontSize: 12, fontFamily: "'DM Sans', sans-serif", color: "#57534E", cursor: "pointer", outline: "none" },
  list: { display: "flex", flexDirection: "column", gap: 2 },
  contactRow: { display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 16px", background: "#fff", borderRadius: 10, border: "1px solid #F5F5F4" },
  avatar: { width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, flexShrink: 0, marginTop: 2 },
  contactName: { fontSize: 14, fontWeight: 600, color: "#1C1917" },
  contactMeta: { display: "flex", flexWrap: "wrap", gap: "4px 12px", marginTop: 3, fontSize: 12, color: "#78716C" },
  metaItem: { display: "flex", alignItems: "center", gap: 4 },
  notesPreview: { fontSize: 12, color: "#A8A29E", marginTop: 5, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 500 },
  contactRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 },
  dateLabel: { fontSize: 11, color: "#A8A29E", whiteSpace: "nowrap" },
  tag: { display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 500 },
  tagSmall: { display: "inline-flex", padding: "1px 6px", borderRadius: 5, fontSize: 10, fontWeight: 500 },
  empty: { textAlign: "center", padding: "48px 20px" },
  iconBtn: { background: "none", border: "none", cursor: "pointer", color: "#A8A29E", padding: 4, display: "flex", alignItems: "center", borderRadius: 4 },
  btnPrimary: { display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#1C1917", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" },
  btnSecondary: { display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#fff", color: "#57534E", border: "1px solid #E7E5E4", borderRadius: 8, fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 },
  modal: { background: "#fff", borderRadius: 14, padding: "24px 28px", width: "100%", maxWidth: 520, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontFamily: "'Instrument Serif', serif", fontSize: 22, fontWeight: 400, margin: 0 },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px", marginBottom: 12 },
  formGroup: { display: "flex", flexDirection: "column", gap: 4 },
  label: { fontSize: 12, fontWeight: 500, color: "#78716C" },
  input: { padding: "8px 10px", border: "1px solid #E7E5E4", borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", background: "#FAFAF9" },
};
