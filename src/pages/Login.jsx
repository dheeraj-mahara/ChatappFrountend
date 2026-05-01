import { useState } from "react";
import logo from "/src/assets/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { IoEyeOffSharp, IoEyeSharp } from "react-icons/io5";

const Login = () => {
  const navigate = useNavigate();
  const [showpassword, setshowpassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    else if (formData.username.length < 3) newErrors.username = "Username must be at least 3 characters";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || loading) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData,
        { withCredentials: true, timeout: 10000 }
      );
      if (response.data.token) localStorage.setItem("token", response.data.token);
      toast.success("Login Successful!", {
        duration: 900,
        style: { borderRadius: "10px", background: "#fff", color: "#065f46", fontWeight: "500" }
      });
      setTimeout(() => navigate("/"), 900);
    } catch (error) {
      const message =
        error.response?.data?.message || error.code === "ECONNABORTED"
          ? "Something wrong, try again"
          : "Login failed";
      toast.error(message, {
        duration: 1200,
        style: { borderRadius: "10px", background: "#fff", color: "#b91c1c", fontWeight: "500" }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #0a0a1a;
          overflow: hidden;
        }

        /* LEFT PANEL */
        .login-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 30px 64px;
          position: relative;
          background: linear-gradient(145deg, #1a0550 0%, #4f46e5 50%, #7c3aed 100%);
          overflow: hidden;
        }

        .login-left::before {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
          top: -150px;
          left: -150px;
        }

        .login-left::after {
          content: '';
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%);
          bottom: -100px;
          right: -100px;
        }

        .left-tag {
          font-family: 'Sora', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          margin-bottom: 24px;
          z-index: 1;
        }

        .left-heading {
          font-family: 'Sora', sans-serif;
          font-size: clamp(36px, 4vw, 56px);
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 20px;
          z-index: 1;
        }

        .left-heading span {
          background: linear-gradient(90deg, #a5b4fc, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .left-sub {
          font-size: 16px;
          color: rgba(255,255,255,0.65);
          line-height: 1.7;
          max-width: 360px;
          z-index: 1;
          margin-bottom: 48px;
        }

        .left-features {
          display: flex;
          flex-direction: column;
          gap: 16px;
          z-index: 1;
        }

        .feature-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 12px 18px;
          border-radius: 100px;
          width: fit-content;
        }

        .feature-pill .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #a5b4fc;
          flex-shrink: 0;
        }

        .feature-pill span {
          font-size: 13px;
          color: rgba(255,255,255,0.85);
          font-weight: 500;
        }

        .floating-card {
          position: absolute;
          bottom: 80px;
          right: -20px;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px;
          padding: 20px 24px;
          z-index: 2;
          animation: float 4s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        .floating-card .fc-num {
          font-family: 'Sora', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #fff;
        }

        .floating-card .fc-label {
          font-size: 12px;
          color: rgba(255,255,255,0.6);
          margin-top: 2px;
        }

        /* RIGHT PANEL */
        .login-right {
          width: 480px;
          flex-shrink: 0;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 30px 52px;
          position: relative;
        }

        .login-right::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, #4f46e5, #7c3aed, #a78bfa);
        }

        .logo-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .logo-wrap img {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          box-shadow: 0 4px 16px rgba(79,70,229,0.3);
        }

        .logo-wrap .app-name {
          font-family: 'Sora', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #4f46e5;
        }

        .form-title {
          font-family: 'Sora', sans-serif;
          font-size: 30px;
          font-weight: 800;
          color: #0f0f1a;
          margin-bottom: 8px;
        }

        .form-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 36px;
        }

        .field-group {
          margin-bottom: 20px;
        }

        .field-label {
          font-size: 12px;
          font-weight: 600;
          color: #374151;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          display: block;
        }

        .field-wrap {
          position: relative;
        }

        .field-input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #0f0f1a;
          background: #f9fafb;
          outline: none;
          transition: all 0.2s ease;
        }

        .field-input:focus {
          border-color: #4f46e5;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(79,70,229,0.1);
        }

        .field-input.error {
          border-color: #ef4444;
          background: #fff5f5;
        }

        .field-input.has-icon {
          padding-right: 48px;
        }

        .eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          font-size: 18px;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .eye-btn:hover { color: #4f46e5; }

        .error-msg {
          font-size: 11px;
          color: #ef4444;
          margin-top: 6px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .submit-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-family: 'Sora', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 8px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(79,70,229,0.35);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(79,70,229,0.45);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .submit-btn .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
          vertical-align: middle;
          margin-right: 8px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 28px 0;
        }

        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        .divider span {
          font-size: 12px;
          color: #9ca3af;
          white-space: nowrap;
        }

        .register-link {
          text-align: center;
          font-size: 14px;
          color: #6b7280;
        }

        .register-link button {
          background: none;
          border: none;
          color: #4f46e5;
          font-weight: 700;
          cursor: pointer;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          padding: 0;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .register-link button:hover { color: #7c3aed; }

        @media (max-width: 900px) {
          .login-left { display: none; }
          .login-right { width: 100%; padding: 40px 28px; }
        }
      `}</style>

      <div className="login-root">
        {/* LEFT */}
        <div className="login-left">
          <p className="left-tag">Chat Vibe Platform</p>
          <h1 className="left-heading">
            Connect.<br />
            <span>Communicate.</span><br />
            Vibe.
          </h1>
          <p className="left-sub">
            Join thriving of people already chatting, sharing, and building connections in real time.
          </p>

          <div className="left-features">
            {["Real-time messaging", "End-to-end encrypted", "Connect with anyone"].map((f) => (
              <div className="feature-pill" key={f}>
                <div className="dot" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          <div className="floating-card">
            <div className="fc-num hidden">12k+</div>
            <div className="fc-label">Active users today</div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="login-right">
          <div className="logo-wrap">
            <img src={logo} alt="logo" />
            <span className="app-name">Chat Vibe</span>
          </div>

          <h2 className="form-title">Welcome back 👋</h2>
          <p className="form-subtitle">Sign in to continue your conversations</p>

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label">USERNAME</label>
              <div className="field-wrap">
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`field-input ${errors.username ? "error" : ""}`}
                />
              </div>
              {errors.username && <p className="error-msg">⚠ {errors.username}</p>}
            </div>

            <div className="field-group">
              <label className="field-label">PASSWORD</label>
              <div className="field-wrap">
                <input
                  type={showpassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`field-input has-icon ${errors.password ? "error" : ""}`}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setshowpassword(!showpassword)}
                >
                  {showpassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
                </button>
              </div>
              {errors.password && <p className="error-msg">⚠ {errors.password}</p>}
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <div className="divider"><span>New to Chat Vibe?</span></div>

          <div className="register-link">
            Don't have an account?{" "}
            <button onClick={() => navigate("/register")}>Create one free</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;