import { useNavigate } from "react-router-dom";
import Logoimage from "../assets/images.png";
import { useEffect } from "react";

export default function LandingPage() {
    const navigate = useNavigate();

       useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            navigate("/chat");
        }
    }, [navigate]);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp { font-family: 'DM Sans', sans-serif; color: #111827; background: #fff; overflow-x: hidden; }
        .lp h1, .lp h2, .lp h3, .lp h4 { font-family: 'Sora', sans-serif; }

        /* ── BUTTONS ── */
        .btn-primary {
          background: #4f46e5; color: #fff; border: none;
          padding: 13px 28px; border-radius: 10px;
          font-family: 'Sora', sans-serif; font-weight: 700; font-size: 14px;
          cursor: pointer; transition: all .2s; display: inline-flex; align-items: center; gap: 6px;
        }
        .btn-primary:hover { background: #4338ca; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(79,70,229,.35); }

        .btn-outline {
          background: none; border: 2px solid #4f46e5; color: #4f46e5;
          padding: 11px 28px; border-radius: 10px;
          font-family: 'Sora', sans-serif; font-weight: 700; font-size: 14px;
          cursor: pointer; transition: all .2s;
        }
        .btn-outline:hover { background: #eef2ff; }

        .ctime {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    font-size: 12px;
    color: #888;
}

.read-tick {
    color: #53bdeb; /* WhatsApp blue */
    font-weight: bold;
    letter-spacing: -2px;
}
        /* ── NAV ── */
        .lp-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 48px; border-bottom: 1px solid #e5e7eb;
          background: #fff; position: sticky; top: 0; z-index: 100;
        }
        .lp-nav-logo { display: flex; align-items: center; gap: 10px; }
        .lp-nav-logo .ni {
          width: 36px; height: 36px;border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
        }
        .lp-nav-logo .ni svg { fill: #fff; width: 20px; height: 20px; }
        .lp-nav-logo span { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 18px; color: #4f46e5; }
        .lp-nav-links { display: flex; align-items: center; gap: 28px; }
        .lp-nav-links a { font-size: 14px; color: #6b7280; text-decoration: none; font-weight: 500; cursor: pointer; transition: color .2s; }
        .lp-nav-links a:hover { color: #4f46e5; }
        .lp-nav-btns { display: flex; gap: 10px; }

        /* ── HERO ── */
        .lp-hero {
          display: grid; grid-template-columns: 1fr 1fr; gap: 48px;
          align-items: center; padding: 72px 48px 56px;
          max-width: 1200px; margin: 0 auto;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: #eef2ff; color: #4f46e5;
          font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
          padding: 6px 14px; border-radius: 100px; margin-bottom: 20px;
        }
        .hero-badge .pulse {
          width: 7px; height: 7px; background: #4f46e5; border-radius: 50%;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }

        .lp-hero h1 { font-size: clamp(34px, 3.5vw, 52px); font-weight: 800; line-height: 1.1; color: #0f0f1a; margin-bottom: 18px; }
        .lp-hero h1 span { color: #4f46e5; }
        .lp-hero > .hero-left > p { font-size: 16px; color: #6b7280; line-height: 1.75; margin-bottom: 28px; max-width: 440px; }
        .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 36px; }
        .hero-stats { display: flex; gap: 28px; }
        .h-stat .num { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 22px; color: #0f0f1a; }
        .h-stat .lbl { font-size: 11px; color: #9ca3af; margin-top: 2px; }

        /* ── CHAT MOCKUP ── */
        .chat-mockup {
          background: #f5f6ff; border: 1px solid #e0e2f8; border-radius: 20px;
          padding: 20px; box-shadow: 0 12px 40px rgba(79,70,229,.13);
        }
        .mock-hdr {
          display: flex; align-items: center; gap: 8px;
          padding-bottom: 14px; border-bottom: 1px solid #e5e7eb; margin-bottom: 16px;
        }
        .mock-dots { display: flex; gap: 5px; }
        .mock-dots span { width: 10px; height: 10px; border-radius: 50%; }
        .md1{background:#ef4444} .md2{background:#f59e0b} .md3{background:#22c55e}
        .mock-title { font-size: 13px; font-weight: 600; color: #374151; }
        .online-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; margin-left: auto; animation: pulse 1.5s infinite; }
        .chat-body { display: flex; flex-direction: column; gap: 10px; }
        .cmsg { display: flex; align-items: flex-end; gap: 8px; }
        .cmsg.me { flex-direction: row-reverse; }
        .cav {
          width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; color: #fff;
        }
        .ca1{background:#4f46e5} .ca2{background:#7c3aed} .ca3{background:#0ea5e9} .ca4{background:#ec4899}
        .cbubble {
          padding: 9px 13px; border-radius: 14px; font-size: 13px; line-height: 1.5; max-width: 200px;
        }
        .cbubble.them { background: #fff; border: 1px solid #e5e7eb; color: #374151; border-bottom-left-radius: 4px; }
        .cbubble.me { background: #4f46e5; color: #fff; border-bottom-right-radius: 4px; }
        .ctime { font-size: 10px; color: #9ca3af; padding-bottom: 2px; }
        .typing-wrap { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
        .typing-dots {
          display: flex; gap: 4px; background: #fff; border: 1px solid #e5e7eb;
          padding: 9px 13px; border-radius: 14px; border-bottom-left-radius: 4px;
        }
        .typing-dots span {
          width: 6px; height: 6px; background: #9ca3af; border-radius: 50%;
          animation: tdot 1.2s infinite;
        }
        .typing-dots span:nth-child(2){animation-delay:.2s}
        .typing-dots span:nth-child(3){animation-delay:.4s}
        @keyframes tdot { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        .chat-inp-row {
          display: flex; gap: 8px; margin-top: 14px; padding-top: 12px;
          border-top: 1px solid #e5e7eb; align-items: center;
        }
        .chat-inp-box {
          flex: 1; background: #fff; border: 1px solid #e5e7eb;
          border-radius: 10px; padding: 8px 12px; font-size: 12px; color: #9ca3af;
        }
        .send-btn {
          width: 32px; height: 32px; background: #4f46e5; border-radius: 8px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .send-btn svg { fill: #fff; width: 14px; height: 14px; }

        /* ── SECTION COMMON ── */
        .sec-label {
          text-align: center; font-size: 11px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase; color: #4f46e5; margin-bottom: 10px;
        }
        .sec-title {
          text-align: center; font-size: clamp(26px, 3vw, 38px);
          font-weight: 800; color: #0f0f1a; margin-bottom: 48px; line-height: 1.2;
        }

        /* ── FEATURES ── */
        .lp-features { background: #f8f9ff; padding: 80px 48px; }
        .feat-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 20px; max-width: 1100px; margin: 0 auto;
        }
        .feat-card {
          background: #fff; border: 1px solid #e5e7eb; border-radius: 16px;
          padding: 28px 24px; transition: all .2s;
        }
        .feat-card:hover { border-color: #4f46e5; transform: translateY(-3px); box-shadow: 0 6px 24px rgba(79,70,229,.1); }
        .feat-icon {
          width: 48px; height: 48px; background: #eef2ff; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; margin-bottom: 16px; font-size: 22px;
        }
        .feat-card h3 { font-size: 17px; font-weight: 700; color: #0f0f1a; margin-bottom: 8px; }
        .feat-card p { font-size: 13px; color: #6b7280; line-height: 1.65; }

        /* ── STEPS ── */
        .lp-steps { padding: 80px 48px; background: #fff; }
        .steps-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 32px; max-width: 900px; margin: 0 auto 40px;
        }
        .step { text-align: center; padding: 20px; }
        .step-num {
          width: 54px; height: 54px; background: #4f46e5; color: #fff; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Sora', sans-serif; font-weight: 800; font-size: 20px;
          margin: 0 auto 16px;
        }
        .step h3 { font-size: 17px; font-weight: 700; color: #0f0f1a; margin-bottom: 8px; }
        .step p { font-size: 13px; color: #6b7280; line-height: 1.65; }

        /* ── DEMO SPLIT ── */
        .lp-demo {
          padding: 80px 48px; background: #fff;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 60px; align-items: center; max-width: 1100px; margin: 0 auto;
        }
        .demo-label { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #4f46e5; margin-bottom: 10px; }
        .lp-demo h2 { font-size: clamp(26px, 3vw, 38px); font-weight: 800; color: #0f0f1a; line-height: 1.2; margin-bottom: 16px; }
        .lp-demo > .demo-text > p { font-size: 14px; color: #6b7280; line-height: 1.75; margin-bottom: 24px; }
        .demo-checks { display: flex; flex-direction: column; gap: 11px; }
        .dc-item { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #374151; }
        .dc-item .chk { color: #4f46e5; font-size: 18px; font-weight: 700; }
        .demo-visual {
          background: #f5f6ff; border: 1px solid #e0e2f8; border-radius: 20px;
          padding: 20px; box-shadow: 0 8px 32px rgba(79,70,229,.1);
        }
        .group-hdr {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;
        }
        .group-ico {
          width: 36px; height: 36px; background: #4f46e5; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; font-size: 18px; color: #fff;
        }
        .group-name { font-weight: 700; font-size: 14px; color: #0f0f1a; }
        .group-online { font-size: 11px; color: #22c55e; font-weight: 600; }
        .live-badge {
          margin-left: auto; background: #dcfce7; color: #16a34a;
          font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 100px;
        }
        .media-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin: 10px 0; }
        .media-img { border-radius: 8px; aspect-ratio: 1; width: 100%; object-fit: cover; display: block; }
        .profile-img { border-radius: 6px; aspect-ratio: 1; height:30px ; width: 100%; object-fit: cover; display: block; }

        /* ── TESTIMONIALS ── */
        .lp-testi { background: #0f0f1a; padding: 80px 48px; text-align: center; }
        .lp-testi .sec-label { color: #a5b4fc; }
        .lp-testi .sec-title { color: #fff; }
        .av-row { display: flex; justify-content: center; margin-bottom: 14px; }
        .av-row .av {
          width: 44px; height: 44px; border-radius: 50%; border: 3px solid #0f0f1a;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: #fff; margin-left: -10px;
        }
        .av-row .av:first-child { margin-left: 0; }
        .rating-row { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 36px; }
        .stars { color: #f59e0b; font-size: 18px; letter-spacing: 2px; }
        .rating-txt { color: #9ca3af; font-size: 14px; }
        .testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; max-width: 960px; margin: 0 auto; }
        .tcard {
          background: #1a1a2e; border: 1px solid #2d2d4e; border-radius: 14px;
          padding: 20px; text-align: left;
        }
        .tcard-top { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .tav {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0;
        }
        .tcard-name { font-size: 14px; font-weight: 600; color: #e5e7eb; }
        .tcard-role { font-size: 11px; color: #6b7280; }
        .tcard-stars { color: #f59e0b; font-size: 13px; margin-bottom: 8px; }
        .tcard p { font-size: 13px; color: #9ca3af; line-height: 1.6; }

        /* ── CTA ── */
        .lp-cta {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          padding: 80px 48px; text-align: center;
        }
        .lp-cta h2 { font-size: clamp(28px, 3.5vw, 44px); font-weight: 800; color: #fff; margin-bottom: 14px; }
        .lp-cta p { font-size: 16px; color: rgba(255,255,255,.8); margin-bottom: 32px; max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.7; }
        .cta-btns { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
        .btn-white {
          background: #fff; color: #4f46e5; border: none; padding: 14px 32px;
          border-radius: 10px; font-family: 'Sora', sans-serif; font-weight: 700; font-size: 15px;
          cursor: pointer; transition: all .2s;
        }
        .btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.15); }
        .btn-ghost {
          background: rgba(255,255,255,.15); color: #fff;
          border: 2px solid rgba(255,255,255,.4); padding: 13px 32px;
          border-radius: 10px; font-family: 'Sora', sans-serif; font-weight: 700; font-size: 15px;
          cursor: pointer; transition: all .2s;
        }
        .btn-ghost:hover { background: rgba(255,255,255,.25); }

        /* ── FOOTER ── */
        .lp-footer { background: #0f0f1a; padding: 22px 38px 24px; color: #9ca3af; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 32px; margin-bottom: 20px; }
        .footer-logo-row { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
        .fli {
          width: 32px; height: 32px; background: #4f46e5; border-radius: 8px;
          display: flex; align-items: center; justify-content: center; font-size: 16px; color: #fff;
        }
        .fln { font-family: 'Sora', sans-serif; font-weight: 800; color: #fff; font-size: 16px; }
        .footer-brand-p { font-size: 13px; line-height: 1.65; max-width: 200px; }
        .footer-col h4 { font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 14px; }
        .footer-col a { display: block; font-size: 13px; color: #6b7280; text-decoration: none; margin-bottom: 8px; cursor: pointer; transition: color .2s; }
        .footer-col a:hover { color: #a5b4fc; }
        .footer-bottom {
          border-top: 1px solid #85898e; padding-top: 20px;
          display: flex; justify-content: space-between; font-size: 12px; color: #8f9295;
          flex-wrap: wrap; gap: 8px;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .lp-nav { padding: 14px 20px; }
          .lp-nav-links { display: none; }
          .lp-hero { grid-template-columns: 1fr; padding: 40px 20px 32px; gap: 32px; }
          .lp-hero h1 { font-size: 32px; }
          .lp-hero > .hero-left > p { max-width: 100%; }
          .lp-features { padding: 52px 20px; }
          .feat-grid { grid-template-columns: 1fr; }
          .lp-steps { padding: 52px 20px; }
          .steps-grid { grid-template-columns: 1fr; gap: 20px; }
          .lp-demo { grid-template-columns: 1fr; padding: 52px 20px; gap: 32px; }
          .testi-grid { grid-template-columns: 1fr; }
          .lp-testi { padding: 52px 20px; }
          .lp-cta { padding: 60px 20px; }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 28px; }
          .lp-footer { padding: 40px 20px 20px; }
          .footer-bottom { flex-direction: column; align-items: center; text-align: center; }
        }

        @media (max-width: 480px) {
          .lp-nav-btns .btn-outline { display: none; }
          .hero-stats { flex-wrap: wrap; gap: 16px; }
          .hero-btns { flex-direction: column; }
          .hero-btns button { width: 100%; justify-content: center; }
          .feat-grid { grid-template-columns: 1fr; }
          .footer-grid { grid-template-columns: 1fr; }
          .cta-btns { flex-direction: column; align-items: center; }
          .cta-btns button { width: 100%; max-width: 280px; }
          .btn-primary { padding:10px }

          
        }
      `}</style>

            <div className="lp">

                {/* ── NAV ── */}
                <nav className="lp-nav">
                    <div className="lp-nav-logo">
                        <div className="ni">


                            <img className="h-[90%]  " src={Logoimage} alt="" />
                        </div>
                        <span>Chat Vibe</span>
                    </div>

                    <div className="lp-nav-btns">
                        <button className="btn-outline" onClick={() => navigate("/login")}>Login</button>
                        <button className="btn-primary" onClick={() => navigate("/register")}>Sign Up Free</button>
                    </div>
                </nav>

                {/* ── HERO ── */}
                <section style={{ background: "#fff" }}>
                    <div className="lp-hero">
                        <div className="hero-left">
                            <div className="hero-badge">
                                <span className="pulse"></span>
                                Live &amp; Real-time
                            </div>
                            <h1>Connect with anyone,<br /><span>anywhere, anytime.</span></h1>
                            <p>Chat Vibe is a modern messaging platform for real conversations — fast, secure, and beautifully designed for everyone.</p>
                            <div className="hero-btns">
                                <button className="btn-primary" style={{ fontSize: 15, padding: "14px 32px" }} onClick={() => navigate("/register")}>
                                    Get Started Free →
                                </button>
                                <button className="btn-outline" style={{ fontSize: 15, padding: "13px 32px" }} onClick={() => navigate("/login")}>
                                    Login Now
                                </button>
                            </div>
                            <div className="hero-stats">
                                <div className="h-stat">
                                    <div className="num">PWA</div>
                                    <div className="lbl">Installable App..</div>
                                </div>                                <div className="h-stat"><div className="num">99.9%</div><div className="lbl">Uptime</div></div>
                                <div className="h-stat"><div className="num">Instant</div><div className="lbl">Alerts</div></div>
                                <div className="h-stat"><div className="num">Free</div><div className="lbl">Forever</div></div>
                            </div>
                        </div>

                        {/* Chat Mockup */}
                        <div className="chat-mockup">
                            <div className="mock-hdr">
                                <div className="mock-dots">

                                    <img className="profile-img" src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=160&h=160&fit=crop" alt="mountain scenery" loading="lazy" />
                                </div>
                                <span className="mock-title" style={{ marginLeft: 8 }}>Jarvise 😊</span>
                                <span className="online-dot"></span>
                                📞
                                🎥
                            </div>
                            <div className="chat-body">
                                <div className="cmsg">
                                    <div>
                                        <div className="cbubble them">Hey! Planning weekend trip? 🏔️</div>
                                        <div className="ctime">2:30 PM</div>
                                    </div>
                                </div>
                                <div className="cmsg">
                                    <div>
                                        <div className="cbubble them">Manali looks amazing this time! 😍</div>
                                        <div className="ctime">2:31 PM</div>
                                    </div>
                                </div>
                                <div className="cmsg me">
                                    <div>
                                        <div className="cbubble me">Count me in! Booking tickets? 🎫</div>
                                        <div className="ctime">2:32 PM
                                            <span className="read-tick">✓✓</span>

                                        </div>
                                    </div>
                                </div>
                                <div className="cmsg">
                                    <div>
                                        <div className="cbubble them">Shared the itinerary 📁✅</div>
                                        <div className="ctime">2:33 PM

                                        </div>
                                    </div>
                                </div>
                                <div className="cmsg me">
                                    <div>
                                        <div className="cbubble me">This is going to be epic 🔥🔥</div>

                                        <div className="ctime">
                                            2:34 PM
                                            <span className="read-tick">✓✓</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="typing-wrap">
                                    <div className="typing-dots"><span></span><span></span><span></span></div>
                                </div>
                            </div>
                            <div className="chat-inp-row">
                                <div className="chat-inp-box">Type a message...</div>
                                <div className="send-btn">
                                    <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── FEATURES ── */}
                <section className="lp-features">
                    <div className="sec-label">Why Chat Vibe</div>
                    <div className="sec-title">Everything you need to<br />stay connected</div>
                    <div className="feat-grid">
                        {[
                            { icon: "⚡", title: "Real-time Messaging", desc: "Messages delivered instantly — no lag, no delay. Feel every conversation flow naturally." },
                            { icon: "🎥", title: "HD Voice & Video Calls", desc: "Stay connected with crystal-clear voice and video calls for seamless conversations." },
                            { icon: "💬", title: "One-to-One Chat", desc: "Enjoy smooth and private conversations with your friends in real time." }, { icon: "🖼️", title: "Media Sharing", desc: "Share photos message. Relive memories and collaborate in one place." },
                            { icon: "🔔", title: "Smart Notifications", desc: "Get notified for what matters. Smart alerts keep you in the loop, not overwhelmed." },
                            { icon: "📱", title: "Works Everywhere", desc: "Desktop, tablet, or mobile — Chat Vibe works beautifully on every screen and device." },
                        ].map((f) => (
                            <div className="feat-card" key={f.title}>
                                <div className="feat-icon">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── HOW IT WORKS ── */}
                <section className="lp-steps">
                    <div className="sec-label">Simple process</div>
                    <div className="sec-title">Up and chatting in<br />3 easy steps</div>
                    <div className="steps-grid">
                        <div className="step">
                            <div className="step-num">1</div>
                            <h3>Create Account</h3>
                            <p>Sign up in seconds — just your name, contact, and a password. No credit card needed.</p>
                        </div>
                        <div className="step">
                            <div className="step-num">2</div>
                            <h3>Find Friends</h3>
                            <p>Search by username or contact number and send a connection request instantly.</p>
                        </div>
                        <div className="step">
                            <div className="step-num">3</div>
                            <h3>Start Chatting</h3>
                            <p>Send messages, share media, do voice, video call . Your conversations, your way.</p>
                        </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <button className="btn-primary" style={{ fontSize: 15, padding: "14px 36px" }} onClick={() => navigate("/register")}>
                            Start for Free →
                        </button>
                    </div>
                </section>

                {/* ── DEMO SPLIT ── */}
                <section style={{ background: "#f8f9ff", padding: "80px 0" }}>
                    <div className="lp-demo">
                        <div className="demo-text">
                            <div className="demo-label">Built for real conversations</div>
                            <h2>Chat like you're right<br />there together</h2>
                            <p>Whether catching up with friends, planning with family, or collaborating with your team — Chat Vibe makes every conversation feel alive.</p>
                            <div className="demo-checks">
                                {[
                                    "Real-time typing indicators",
                                    "Online presence & status",
                                    "Message read receipts",
                                    "File & media sharing",
                                    "Push notifications (Firebase)",
                                ].map((item) => (
                                    <div className="dc-item" key={item}>
                                        <span className="chk">✓</span>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="demo-visual">
                            <div className="group-hdr">
                                <div className="group-ico">👥</div>
                                <div>
                                    <div className="group-name">Weekend Warriors 🏕️</div>
                                    <div className="group-online">● online</div>
                                </div>
                                <span className="live-badge">Live</span>
                            </div>
                            <div className="chat-body">
                                <div className="cmsg">
                                    <div className="cav ca4">SK</div>
                                    <div>
                                        <div className="cbubble them">Check out these shots! 📸</div>
                                        <div className="ctime">Just now</div>
                                    </div>
                                </div>
                                <div className="media-grid">
                                    <img className="media-img" src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=160&h=160&fit=crop" alt="mountain scenery" loading="lazy" />
                                    <img className="media-img" src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=160&h=160&fit=crop" alt="nature view" loading="lazy" />
                                    <img className="media-img" src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=160&h=160&fit=crop" alt="landscape" loading="lazy" />
                                    <img className="media-img" src="https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=160&h=160&fit=crop" alt="forest" loading="lazy" />
                                </div>
                                <div className="cmsg me">
                                    <div className="cav ca1">YO</div>
                                    <div>
                                        <div className="cbubble me">These are stunning! 😍🔥</div>
                                        <div className="ctime">Just now</div>
                                    </div>
                                </div>
                                <div className="typing-wrap">
                                    <div className="cav ca3">AM</div>
                                    <div className="typing-dots"><span></span><span></span><span></span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── TESTIMONIALS ── */}
                <section className="lp-testi">
                    <div className="sec-label">Community love</div>
                    <div className="sec-title">People are already vibing 💬</div>
                    <div className="av-row">
                        {[
                            { initials: "RK", bg: "#4f46e5" },
                            { initials: "AM", bg: "#7c3aed" },
                            { initials: "PR", bg: "#0ea5e9" },
                            { initials: "SK", bg: "#ec4899" },
                            { initials: "VT", bg: "#f59e0b" },
                            { initials: "12k+", bg: "#22c55e" },
                        ].map((a) => (
                            <div key={a.initials} className="av" style={{ background: a.bg }}>{a.initials}</div>
                        ))}
                    </div>
                    <div className="rating-row">
                        <span className="stars">★★★★★</span>
                        <span className="rating-txt">4.9 / 5 from Growing users</span>
                    </div>
                    <div className="testi-grid">
                        {[
                            { initials: "RK", bg: "#4f46e5", name: "Rahul Kumar", role: "Student, Delhi", text: "Really smooth experience. Messages load instantly and the design feels modern and easy to use." }, 
                            { initials: "PR", bg: "#ec4899", name: "Priya Reddy", role: "Designer, Bangalore", text: "The design is beautiful and messages arrive instantly. Sharing photos with friends has never been easier!" },
                            { initials: "AM", bg: "#0ea5e9", name: "Arjun Mehta", role: "Developer, Mumbai", text: "Finally a chat app that is fast, secure, and looks amazing. Our whole team switched to Chat Vibe!" },
                        ].map((t) => (
                            <div className="tcard" key={t.name}>
                                <div className="tcard-top">
                                    <div className="tav" style={{ background: t.bg }}>{t.initials}</div>
                                    <div>
                                        <div className="tcard-name">{t.name}</div>
                                        <div className="tcard-role">{t.role}</div>
                                    </div>
                                </div>
                                <div className="tcard-stars">★★★★★</div>
                                <p>"{t.text}"</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── CTA ── */}
                <section className="lp-cta">
                    <h2>Ready to start vibing? </h2>
                    <p>Join many people already having better conversations on Chat Vibe. Free forever, no credit card needed.</p>
                    <div className="cta-btns">
                        <button className="btn-white" onClick={() => navigate("/register")}>Create Free Account</button>
                        <button className="btn-ghost" onClick={() => navigate("/login")}>Already have account</button>
                    </div>
                </section>

                {/* ── FOOTER ── */}
                <footer className="lp-footer">
                    <div className="footer-grid">
                        <div>
                            <div className="footer-logo-row">
                                <div className="fli">💬</div>
                                <span className="fln">Chat Vibe</span>
                            </div>
                            <p className="footer-brand-p">Modern real-time messaging for everyone. Fast, secure, and beautifully built.</p>
                        </div>
                        <div className="footer-col">
                            <h4>Features</h4>
                            <p className="footer-brand-p">Real-time Chat</p>
                            <p className="footer-brand-p">Voice & Video Calls</p>
                            <p className="footer-brand-p">Instant Notifications</p>
                        </div>
                        <div className="footer-col">
                            <h4>Experience</h4>
                            <p className="footer-brand-p">Fast Messaging</p>
                            <p className="footer-brand-p">Clean UI</p>
                            <p className="footer-brand-p">Low Data Usage</p>
                        </div>
                        <div className="footer-col">
                            <h4>About</h4>
                            <p className="footer-brand-p">Focused on simplicity</p>
                            <p className="footer-brand-p">Designed for everyone</p>
                            <p className="footer-brand-p">Always improving</p>

                        </div>
                    </div>
                    <div className="footer-bottom">
                        <span>© 2026 Chat Vibe. All rights reserved.</span>
                        <span>Made with ❤️ in India</span>
                    </div>
                </footer>

            </div>
        </>
    );
}