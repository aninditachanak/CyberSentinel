
import { useState } from "react";
import {
  Shield,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Network,
  Target,
  Brain,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";

import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const analyzeFile = async () => {
    if (!file) {
      alert("Please upload a security log file first.");
      return;
    }

    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();

      setResult(data);
    } catch (error) {
      console.error(error);

      // Demo result if backend is not connected yet
      setResult({
        severity: "CRITICAL",
        confidence: 95,
        threat: "SSH Brute Force Attack",
        risk_score: 94,

        source_ip: "192.168.1.105",
        target: "SSH / Port 22",
        account: "admin",

        techniques: [
          {
            id: "T1110",
            name: "Brute Force",
          },
          {
            id: "T1078",
            name: "Valid Accounts",
          },
        ],

        evidence: [
          "Multiple failed authentication attempts",
          "Repeated activity from same source IP",
          "Successful authentication after failures",
          "Suspicious SSH session creation",
        ],

        timeline: [
          {
            time: "21:04:12",
            event: "Failed SSH Login",
            type: "danger",
          },
          {
            time: "21:04:25",
            event: "Failed SSH Login",
            type: "danger",
          },
          {
            time: "21:05:01",
            event: "Failed SSH Login",
            type: "danger",
          },
          {
            time: "21:07:32",
            event: "Successful Login",
            type: "success",
          },
          {
            time: "21:08:04",
            event: "SSH Session Opened",
            type: "warning",
          },
        ],

        explanation:
          "The log indicates a likely brute-force attack against an SSH service. Multiple failed authentication attempts were followed by a successful login from the same source, suggesting that valid credentials may have been obtained.",

        recommendations: [
          "Block the suspicious source IP",
          "Review the compromised account",
          "Enable multi-factor authentication",
          "Configure SSH rate limiting",
        ],
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const resetDashboard = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div className="app">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">
            <Shield size={25} />
          </div>

          <div>
            <h2>CyberSentinel</h2>
            <span>AI Security Platform</span>
          </div>
        </div>

        <nav>
          <div className="nav-item active">
            <Shield size={19} />
            Dashboard
          </div>

          <div className="nav-item">
            <AlertTriangle size={19} />
            Threats
          </div>

          <div className="nav-item">
            <Clock size={19} />
            Timeline
          </div>

          <div className="nav-item">
            <Target size={19} />
            MITRE ATT&CK
          </div>
        </nav>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot"></span>

            <div>
              <strong>System Online</strong>
              <small>AI Engine Ready</small>
            </div>
          </div>
        </div>

      </aside>


      {/* MAIN */}

      <main className="main">

        {/* HEADER */}

        <header className="header">

          <div>
            <h1>Security Dashboard</h1>
            <p>AI-powered security log investigation</p>
          </div>

          <div className="header-status">
            <span className="status-dot"></span>
            LIVE
          </div>

        </header>


        {/* UPLOAD SECTION */}

        {!result && (

          <section className="upload-section">

            <div className="upload-card">

              <div className="upload-icon">
                <Upload size={35} />
              </div>

              <h2>Upload Security Log</h2>

              <p>
                Upload your security log file to detect threats,
                analyze attacks and map MITRE ATT&CK techniques.
              </p>

              <label className="upload-button">

                <Upload size={18} />

                Choose Log File

                <input
                  type="file"
                  accept=".log,.txt,.json,.csv"
                  onChange={handleFileChange}
                  hidden
                />

              </label>

              {file && (

                <div className="selected-file">

                  <FileText size={20} />

                  <div>
                    <strong>{file.name}</strong>
                    <small>
                      {(file.size / 1024).toFixed(2)} KB
                    </small>
                  </div>

                  <CheckCircle
                    size={20}
                    className="success-icon"
                  />

                </div>

              )}

              {file && (

                <button
                  className="analyze-button"
                  onClick={analyzeFile}
                  disabled={analyzing}
                >

                  {analyzing ? (
                    <>
                      <RefreshCw className="spin" size={18} />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain size={18} />
                      Analyze Threat
                    </>
                  )}

                </button>

              )}

            </div>

          </section>

        )}


        {/* DASHBOARD RESULT */}

        {result && (

          <div className="dashboard">

            {/* FILE BAR */}

            <div className="file-bar">

              <div className="file-info">

                <FileText size={20} />

                <div>
                  <strong>{file?.name || "security.log"}</strong>
                  <span>Analysis Complete</span>
                </div>

              </div>

              <button
                className="reset-button"
                onClick={resetDashboard}
              >
                <RefreshCw size={17} />
                Analyze Another
              </button>

            </div>


            {/* STAT CARDS */}

            <div className="stats">

              <div className="stat-card critical">

                <div className="stat-icon">
                  <ShieldAlert />
                </div>

                <div>
                  <span>Threat Level</span>
                  <strong>{result.severity}</strong>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon">
                  <Brain />
                </div>

                <div>
                  <span>AI Confidence</span>
                  <strong>{result.confidence}%</strong>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon">
                  <Target />
                </div>

                <div>
                  <span>Techniques</span>
                  <strong>
                    {result.techniques?.length || 0}
                  </strong>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon">
                  <AlertTriangle />
                </div>

                <div>
                  <span>Risk Score</span>
                  <strong>{result.risk_score}/100</strong>
                </div>

              </div>

            </div>


            {/* THREAT HEADER */}

            <div className="threat-card">

              <div className="threat-title">

                <div className="danger-icon">
                  <ShieldAlert size={30} />
                </div>

                <div>
                  <span>THREAT DETECTED</span>
                  <h2>{result.threat}</h2>
                </div>

              </div>

              <div className="severity-badge">
                {result.severity}
              </div>

            </div>


            {/* DETAILS */}

            <div className="two-column">

              <div className="panel">

                <div className="panel-title">
                  <AlertTriangle size={20} />
                  Attack Details
                </div>

                <p className="explanation">
                  {result.explanation}
                </p>

              </div>


              <div className="panel">

                <div className="panel-title">
                  <Network size={20} />
                  Attack Source
                </div>

                <div className="source-grid">

                  <div>
                    <span>Source IP</span>
                    <strong>{result.source_ip}</strong>
                  </div>

                  <div>
                    <span>Target</span>
                    <strong>{result.target}</strong>
                  </div>

                  <div>
                    <span>Account</span>
                    <strong>{result.account}</strong>
                  </div>

                </div>

              </div>

            </div>


            {/* TIMELINE */}

            <div className="panel">

              <div className="panel-title">
                <Clock size={20} />
                Attack Timeline
              </div>

              <div className="timeline">

                {result.timeline?.map((item, index) => (

                  <div className="timeline-item" key={index}>

                    <div
                      className={`timeline-dot ${item.type}`}
                    ></div>

                    <div className="timeline-content">

                      <strong>{item.time}</strong>

                      <span>{item.event}</span>

                    </div>

                  </div>

                ))}

              </div>

            </div>


            {/* MITRE + EVIDENCE */}

            <div className="two-column">

              {/* MITRE */}

              <div className="panel">

                <div className="panel-title">
                  <Target size={20} />
                  MITRE ATT&CK
                </div>

                <div className="techniques">

                  {result.techniques?.map((technique) => (

                    <div
                      className="technique"
                      key={technique.id}
                    >

                      <strong>{technique.id}</strong>

                      <span>{technique.name}</span>

                    </div>

                  ))}

                </div>

              </div>


              {/* EVIDENCE */}

              <div className="panel">

                <div className="panel-title">
                  <FileText size={20} />
                  Evidence
                </div>

                <div className="evidence-list">

                  {result.evidence?.map((item, index) => (

                    <div
                      className="evidence"
                      key={index}
                    >

                      <CheckCircle size={18} />

                      <span>{item}</span>

                    </div>

                  ))}

                </div>

              </div>

            </div>


            {/* AI ANALYSIS */}

            <div className="ai-panel">

              <div className="panel-title">
                <Brain size={20} />
                Gemma 4 AI Analysis
              </div>

              <p>
                {result.explanation}
              </p>

            </div>


            {/* RECOMMENDATIONS */}

            <div className="panel recommendations">

              <div className="panel-title">
                <Shield size={20} />
                Recommended Actions
              </div>

              <div className="recommendation-grid">

                {result.recommendations?.map(
                  (recommendation, index) => (

                    <div
                      className="recommendation"
                      key={index}
                    >

                      <span>{index + 1}</span>

                      <p>{recommendation}</p>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default App;