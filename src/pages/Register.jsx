import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "/src/assets/images.png";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { IoEyeOffSharp, IoEyeSharp } from "react-icons/io5";

export default function Register() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/singup`,
        data,
        { headers: { "Content-Type": "application/json" }, validateStatus: () => true }
      );

      if (!response.data.success) {
        toast.error(response.data.message, {
          duration: 1200,
          style: { borderRadius: "10px", background: "#fff", color: "#b91c1c", fontWeight: "500" }
        });
        return;
      }

      toast.success("Register Successful!", {
        duration: 900,
        style: { borderRadius: "10px", background: "#fff", color: "#065f46", fontWeight: "500" }
      });
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Register Failed!", {
        duration: 1200,
        style: { borderRadius: "10px", background: "#fff", color: "#b91c1c", fontWeight: "500" }
      });
    }
  };

  const steps = ["Account Info", "Security", "Done!"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .reg-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #f3f4ff;
          overflow: hidden;
        }

        /* LEFT DECORATIVE */
        .reg-deco {
          flex: 1;
          background: linear-gradient(160deg, #1a0550 0%, #4f46e5 45%, #818cf8 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 30px 52px;
          position: relative;
          overflow: hidden;
        }

        .reg-deco::before {
          content: '';
          position: absolute;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%);
          top: -100px; right: -100px;
          border-radius: 50%;
        }

        .deco-top .brand {
          font-family: 'Sora', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.5px;
        }

        .deco-top .tagline {
          font-size: 13px;
          color: rgba(255,255,255,0.55);
          margin-top: 6px;
        }

        .deco-middle {
          z-index: 1;
        }

        .deco-middle h2 {
          font-family: 'Sora', sans-serif;
          font-size: clamp(32px, 3.5vw, 50px);
          font-weight: 800;
          color: white;
          line-height: 1.15;
          margin-bottom: 16px;
        }

        .deco-middle h2 em {
          font-style: normal;
          background: linear-gradient(90deg, #c7d2fe, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .deco-middle p {
          font-size: 15px;
          color: rgba(255,255,255,0.6);
          line-height: 1.7;
          max-width: 340px;
        }

        .deco-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          z-index: 1;
        }

        .stat-card {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 16px;
          padding: 18px 20px;
        }

        .stat-card .s-num {
          font-family: 'Sora', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: white;
        }

        .stat-card .s-label {
          font-size: 11px;
          color: rgba(255,255,255,0.55);
          margin-top: 3px;
        }

        /* ORBS */
        .orb {
          position: absolute;
          border-radius: 50%;
          animation: floatOrb 6s ease-in-out infinite;
        }
        .orb-1 {
          width: 120px; height: 120px;
          background: rgba(167,139,250,0.25);
          bottom: 180px; left: 40px;
          animation-delay: 0s;
        }
        .orb-2 {
          width: 70px; height: 70px;
          background: rgba(129,140,248,0.3);
          top: 220px; right: 40px;
          animation-delay: 2s;
        }
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        /* RIGHT FORM */
        .reg-form-panel {
          width: 520px;
          flex-shrink: 0;
          background: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 32px 52px;
          position: relative;
          overflow-y: auto;
        }

        .reg-form-panel::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, #4f46e5, #818cf8, #a78bfa);
        }

        .panel-header {
          margin-bottom: 36px;
        }

        .panel-header .welcome-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ede9fe;
          color: #4f46e5;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 100px;
          margin-bottom: 16px;
        }

        .panel-header h1 {
          font-family: 'Sora', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #0f0f1a;
          line-height: 1.2;
          margin-bottom: 8px;
        }

        .panel-header p {
          font-size: 14px;
          color: #6b7280;
        }

        /* FIELD */
        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .field-grp {
          margin-bottom: 18px;
        }

        .f-label {
          font-size: 11px;
          font-weight: 700;
          color: #374151;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-bottom: 7px;
          display: block;
        }

        .f-wrap { position: relative; }

        .f-input {
          width: 100%;
          padding: 13px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #111827;
          background: #f9fafb;
          outline: none;
          transition: all 0.2s;
        }

        .f-input:focus {
          border-color: #4f46e5;
          background: white;
          box-shadow: 0 0 0 4px rgba(79,70,229,0.1);
        }

        .f-input.err {
          border-color: #ef4444;
          background: #fff5f5;
        }

        .f-input.has-icon { padding-right: 46px; }

        .f-eye {
          position: absolute;
          right: 13px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          font-size: 17px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
          padding: 4px;
        }
        .f-eye:hover { color: #4f46e5; }

        .err-text {
          font-size: 11px;
          color: #ef4444;
          margin-top: 5px;
        }

        .password-strength {
          display: flex;
          gap: 4px;
          margin-top: 8px;
        }

        .ps-bar {
          flex: 1;
          height: 3px;
          border-radius: 2px;
          background: #e5e7eb;
          transition: background 0.3s;
        }

        .ps-bar.active { background: #4f46e5; }

        .submit-btn {
          width: 100%;
          padding: 15px;
          margin-top: 8px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-family: 'Sora', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(79,70,229,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(79,70,229,0.45);
        }

        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .login-redirect {
          text-align: center;
          margin-top: 24px;
          font-size: 14px;
          color: #6b7280;
        }

        .login-redirect button {
          background: none;
          border: none;
          color: #4f46e5;
          font-weight: 700;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          text-decoration: underline;
          text-underline-offset: 2px;
          padding: 0;
        }

        .login-redirect button:hover { color: #7c3aed; }

        @media (max-width: 960px) {
          .reg-deco { display: none; }
          .reg-form-panel { width: 100%; padding: 40px 24px; }
        }
      `}</style>

      <div className="reg-root">
        {/* LEFT */}
        <div className="reg-deco">
          <div className="deco-top">
            <div className="brand">Chat Vibe</div>
            <div className="tagline">Your world, connected.</div>
          </div>

          <div className="deco-middle">
            <h2>
              Start your<br />
              <em>journey today.</em>
            </h2>
            <p>
              Create your free account and step into a world of seamless conversations and connections.
            </p>
          </div>

          <div className="deco-cards">
            {[
              { num: "Daily", label: "Active users" },
              { num: "99.9%", label: "Uptime" },
              { num: "100%", label: "Free forever" },
              { num: "E2E", label: "Encrypted" }
            ].map((s) => (
              <div className="stat-card" key={s.label}>
                <div className="s-num">{s.num}</div>
                <div className="s-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="orb orb-1" />
          <div className="orb orb-2" />
        </div>

        {/* RIGHT */}
        <div className="reg-form-panel">
          <div className="panel-header">
            <div className="welcome-chip">✦ Free Account</div>
            <h1>Create your account</h1>
            <p>Fill in your details and join the vibe in seconds.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name */}
            <div className="field-grp">
              <label className="f-label">Full Name</label>
              <div className="f-wrap">
                <input
                  type="text"
                  placeholder="Chat Vibe"
                  {...register("name", {
                    required: "Name is required",
                    minLength: { value: 3, message: "Name must be at least 3 characters" }
                  })}
                  className={`f-input ${errors.name ? "err" : ""}`}
                />
              </div>
              {errors.name && <p className="err-text">⚠ {errors.name.message}</p>}
            </div>

            {/* Contact */}
            <div className="field-grp">
              <label className="f-label">Contact Number</label>
              <div className="f-wrap">
                <input
                  type="number"
                  placeholder="10-digit mobile number"
                  {...register("contact", {
                    required: "Contact number is required",
                    pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" }
                  })}
                  className={`f-input ${errors.contact ? "err" : ""}`}
                />
              </div>
              {errors.contact && <p className="err-text">⚠ {errors.contact.message}</p>}
            </div>

            {/* Passwords in row */}
            <div className="field-row">
              <div className="field-grp">
                <label className="f-label">Password</label>
                <div className="f-wrap">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Min 4 chars"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 4, message: "Min 4 characters" }
                    })}
                    className={`f-input has-icon ${errors.password ? "err" : ""}`}
                  />
                  <button type="button" className="f-eye" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <IoEyeOffSharp /> : <IoEyeSharp />}
                  </button>
                </div>
                {errors.password && <p className="err-text">⚠ {errors.password.message}</p>}
              </div>

              <div className="field-grp">
                <label className="f-label">Confirm</label>
                <div className="f-wrap">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat password"
                    {...register("confirmPassword", {
                      required: "Please confirm password",
                      validate: (v) => v === password || "Passwords do not match"
                    })}
                    className={`f-input has-icon ${errors.confirmPassword ? "err" : ""}`}
                  />
                  <button type="button" className="f-eye" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <IoEyeOffSharp /> : <IoEyeSharp />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="err-text">⚠ {errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Strength bars (visual only) */}
            {password && (
              <div className="password-strength" style={{ marginTop: -8, marginBottom: 16 }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`ps-bar ${password.length >= i * 2 ? "active" : ""}`} />
                ))}
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? <><div className="spinner" /> Creating account...</> : "Create Account →"}
            </button>
          </form>

          <div className="login-redirect">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")}>Sign in</button>
          </div>
        </div>
      </div>
    </>
  );
}