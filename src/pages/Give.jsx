import { useState } from "react";
import "./Give.css";

export default function Give() {
  const [purpose, setPurpose] = useState("Tithes");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  
  const [status, setStatus] = useState("idle"); // idle, processing, success, error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) < 10) {
      setErrorMsg("Please enter a valid amount (minimum 10 KES).");
      return;
    }
    
    // Check if phone number is roughly Safaricom length 
    const phoneRegex = /^(?:254|\+254|0)?(7[0-9]{8}|1[0-9]{8})$/;
    if (!phoneRegex.test(phone)) {
      setErrorMsg("Please enter a valid Safaricom M-Pesa number (e.g., 0712345678 or 2547...).");
      return;
    }

    setErrorMsg("");
    setStatus("processing");

    // Simulate STK Push delay
    setTimeout(() => {
      setStatus("success");
    }, 2500);
  };

  const handleReset = () => {
    setStatus("idle");
    setAmount("");
    setPhone("");
    setErrorMsg("");
  };

  return (
    <div className="give-page">
      <div className="give-hero">
        <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src="/sdalogo.png" alt="SDA Logo" style={{ width: "80px", marginBottom: "var(--space-3)" }} />
          <p className="give-hero__eyebrow">Partner with us</p>
          <h1 className="give-hero__title">Give</h1>
          <p className="give-hero__subtitle">
            Support through your tithes, offerings, and donations. 
            "God loves a cheerful giver." — 2 Corinthians 9:7
          </p>
        </div>
      </div>

      <section className="section give-section">
        <div className="container give-container">
          
          <div className="give-card">
            <div className="give-card__header">
              <h2>M-Pesa Express</h2>
              <p>Enter your details below to receive a secure M-Pesa PIN prompt on your phone.</p>
            </div>

            {status === "idle" || status === "processing" ? (
              <form onSubmit={handleSubmit} className="give-form">
                
                {errorMsg && <div className="give-form__error">{errorMsg}</div>}
                
                <div className="form-group">
                  <label htmlFor="purpose">Giving towards</label>
                  <select 
                    id="purpose" 
                    value={purpose} 
                    onChange={(e) => setPurpose(e.target.value)}
                    disabled={status === "processing"}
                  >
                    <option value="Tithes">Tithes</option>
                    <option value="Offering">Offering</option>
                    <option value="Mission">Mission</option>
                    <option value="Church Building">Church Building</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="amount">Amount (KES)</label>
                  <input 
                    type="number" 
                    id="amount" 
                    placeholder="e.g. 500" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={status === "processing"}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">M-Pesa Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    placeholder="e.g. 0712345678" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={status === "processing"}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className={`button button--primary give-submit ${status === "processing" ? "is-loading" : ""}`}
                  disabled={status === "processing"}
                >
                  {status === "processing" ? (
                    <>
                      <span className="give-spinner"></span>
                      Initiating STK Push...
                    </>
                  ) : (
                    "Pay via M-Pesa"
                  )}
                </button>
              </form>
            ) : (
              <div className="give-success">
                <div className="give-success__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3>Request Sent Successfully!</h3>
                <p>
                  Please check your phone <strong>({phone})</strong> for the Safaricom M-Pesa PIN prompt to complete your payment of <strong>KES {amount}</strong> towards <strong>{purpose}</strong>.
                </p>
                <button onClick={handleReset} className="button button--secondary">Make another contribution</button>
              </div>
            )}
            
          </div>
          
          <div className="give-info">
            <div className="give-info__block">
              <h3>Other ways to give</h3>
              <p>If you prefer to use the standard Paybill method via the Safaricom menu, you can use the details below:</p>
              <div className="paybill-details">
                <div className="paybill-row">
                  <span className="paybill-label">Paybill Number:</span>
                  <span className="paybill-value">123456</span>
                </div>
                <div className="paybill-row">
                  <span className="paybill-label">Account Number:</span>
                  <span className="paybill-value">Tithes / Offering</span>
                </div>
              </div>
            </div>
            
            <div className="give-info__block give-info__block--dark">
              <h3>Secure Giving</h3>
              <p>Your transactions are securely processed via Safaricom M-Pesa API. We do not store your M-Pesa PIN or any banking credentials.</p>
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}
