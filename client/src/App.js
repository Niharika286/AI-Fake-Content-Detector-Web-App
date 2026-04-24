import React, { useState, useEffect } from "react";


function App() {
  const [page, setPage] = useState("detect");
  const [text, setText] = useState("");
  const [score, setScore] = useState(null);
  const [image, setImage] = useState(null);
  const [imageScore, setImageScore] = useState(null);
  const [activeTab, setActiveTab] = useState("text");
  const [url, setUrl] = useState("");
  const [urlScore, setUrlScore] = useState(null);
  const [code, setCode] = useState("");
  const [codeScore, setCodeScore] = useState(null);
  const [newsUrl, setNewsUrl] = useState("");
  const [newsScore, setNewsScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  
  const [feedbackList, setFeedbackList] = useState(() => {
    return JSON.parse(localStorage.getItem("feedbacks")) || [];
  });
  useEffect(() => {
    localStorage.setItem("feedbacks", JSON.stringify(feedbackList));
  }, [feedbackList]);

  const checkAI = async () => {
    try {
      const response = await fetch("http://localhost:5000/detect-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });

      const data = await response.json();
      setScore(data.score);
    } catch (error) {
      console.error(error);
      alert("Error connecting to backend");
    }
  };
  const checkImage = async () => {
    const response = await fetch("http://localhost:5000/detect-image", {
      method: "POST"
    });

    const data = await response.json();
    setImageScore(data.score);
  };
  const checkURL = async () => {
    try {
      const response = await fetch("http://localhost:5000/detect-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
      });

      const data = await response.json();
      //setUrlScore(data.score);
      // 🔥 Heuristic logic
      let heuristicScore = 0;

      if (code.includes("function")) heuristicScore += 0.2;
      if (code.includes("return")) heuristicScore += 0.2;
      if (code.includes("//")) heuristicScore += 0.2;
      if (code.includes("const") || code.includes("let")) heuristicScore += 0.2;

      // Combine API + heuristic
      const finalScore = ((data.score || 0) + heuristicScore) / 2;

      setCodeScore(finalScore);
    } catch (error) {
      console.error(error);
      alert("Error checking URL");
    }
  };
  const checkCode = async () => {
    try {
      const response = await fetch("http://localhost:5000/detect-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: code })
      });

      const data = await response.json();
      setCodeScore(data.score);
    } catch (error) {
      console.error(error);
      alert("Error checking code");
    }
  };
  const checkNews = async () => {
    try {
      const response = await fetch("http://localhost:5000/detect-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: newsUrl })
      });

      const data = await response.json();

      setNewsScore(Number(data.score || 0));

    } catch (error) {
      console.error(error);
      alert("Error checking news");
    }
  };
  const handleFeedback = () => {
    if (feedback.trim() === "") return;

    const updated = [...feedbackList, feedback];
    setFeedbackList(updated);
    setFeedback("");

    localStorage.setItem("feedbacks", JSON.stringify(updated));
  };
  

  return (
    
    <div style={styles.container}>

      <div style={styles.navbar}>
        <h2 style={styles.logo}>AI Fake Content Detector</h2>

        <div>
          <button
            onClick={() => setPage("detect")}
            style={page === "detect" ? styles.activeNavBtn : styles.navBtn}
          >
            Detect
          </button>

          <button
            onClick={() => setPage("about")}
            style={page === "about" ? styles.activeNavBtn : styles.navBtn}
          >
            About
          </button>

          <button
            onClick={() => setPage("feedback")}
            style={page === "feedback" ? styles.activeNavBtn : styles.navBtn}
          >
            Feedback
          </button>
        </div>
      </div>
      {page === "detect" && (
        <div style={styles.card}>
          <div style={styles.hero}>
            <h1 style={styles.heroTitle}>
              Is it <span style={{ color: "#00d4ff" }}>human</span> or AI?
            </h1>

            <p style={styles.heroSub}>
              Paste text or upload content — get AI probability instantly.
            </p>
          </div>
          <div style={styles.tabContainer}>
              {["text", "image", "url","code", "news","audio","video"].map((tab) => (
                <button
                  key={tab}
                  style={activeTab === tab ? styles.activeTab : styles.tab}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
          </div>
            <br></br><br></br>
            {activeTab === "text" && (
              <>
                <i><h2>Text Detection</h2></i>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <textarea
                    style={styles.textarea}
                    placeholder="Paste your text here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <button style={styles.button} onClick={checkAI}>
                    Check AI Content
                  </button>
                </div>
        

                {score !== null && (
                  <div style={styles.resultBox}>
                    <h2>Result</h2>

                    <p>
                      AI Probability: <strong>{(score * 100).toFixed(2)}%</strong>
                    </p>

                    <div style={styles.barBackground}>
                      <div
                        style={{
                          ...styles.barFill,
                          width: `${score * 100}%`
                        }}
                      />
                    </div>

                    <p>
                      {score > 0.5 ? "⚠️ Likely AI-generated" : "✅ Likely Human-written"}
                    </p>
                  </div>
                )}    
              </>
            )}
        
        
            {activeTab === "image" && (
              <>
                <i><h2>Image Detection</h2></i>
                <div>
                  <input
                    type="file"
                    style={styles.fileInput}
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                  <br/>
                  <button style={styles.button} onClick={checkImage}>
                    Check Image Authenticity
                  </button>
                </div>
        
                {imageScore !== null && (
                  <div style={styles.resultBox}>
                    <h2>Image Result</h2>
                    <p>
                      AI Probability: <strong>{(imageScore * 100).toFixed(2)}%</strong>
                    </p>

                    <div style={styles.barBackground}>
                      <div
                        style={{
                          ...styles.barFill,
                          width: `${imageScore * 100}%`
                        }}
                      />
                    </div>

                    <p>
                      {imageScore > 0.5
                        ? "⚠️ Likely AI-generated Image"
                        : "✅ Likely Real Image"}
                    </p>
                  </div>
                )}
              </>
            )}
            {activeTab === "url" && (
              <>
                <i><h2>URL Detection</h2></i>

                <input
                  type="text"
                  placeholder="Enter article URL..."
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setUrlScore(null); // ✅ reset old result
                  }}
                  style={styles.input}
                />

                <br />

                <button style={styles.button} onClick={checkURL}>
                  Check URL Content
                </button>

                {urlScore !== null && (
                  <div style={styles.resultBox}>
                    <h2>Result</h2>

                    <p>
                      AI Probability: <strong>{((urlScore || 0) * 100).toFixed(2)}%</strong>
                    </p>

                    <div style={styles.barBackground}>
                      <div
                        style={{
                          ...styles.barFill,
                          width: `${(urlScore || 0) * 100}%`
                        }}
                      />
                    </div>

                    <p>
                      {urlScore > 0.7
                        ? "⚠️ Likely AI-generated"
                        : urlScore > 0.3
                        ? "🤔 Uncertain"
                        : "✅ Likely Human-written"}
                    </p>
                  </div>
                )}
                
              </>
            )}
            {activeTab === "code" && (
              <>
                <i><h2>Code Detection</h2></i>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <textarea
                    style={styles.textarea}
                    placeholder="Paste your code here..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />

                  <button style={styles.button} onClick={checkCode}>
                    Check Code Authenticity
                  </button>
                  <p style={{ fontSize: "12px", color: "orange", marginTop: "10px" }}>
                    *Code detection is experimental and may not be fully accurate.
                  </p>
                </div>

                {codeScore !== null && (
                  <div style={styles.resultBox}>
                    <h2>Result</h2>

                    <p>
                      AI Probability: <strong>{((codeScore || 0) * 100).toFixed(2)}%</strong>
                    </p>

                    <div style={styles.barBackground}>
                      <div
                        style={{
                          ...styles.barFill,
                          width: `${(codeScore || 0) * 100}%`
                        }}
                      />
                    </div>

                    <p>
                      {codeScore > 0.7
                        ? "⚠️ Likely AI-generated Code"
                        : codeScore > 0.3
                        ? "🤔 Uncertain"
                        : "✅ Likely Human-written Code"}
                    </p>
                  </div>
                )}
              </>
            )}
            {activeTab === "news" && (
              <>
                <i><h2>📰 News Detection</h2></i>

                <input
                  type="text"
                  placeholder="Enter news article URL..."
                  value={newsUrl}
                  onChange={(e) => {
                    setNewsUrl(e.target.value);
                    setNewsScore(null);
                  }}
                  style={styles.input}
                />

                <br />

                <button style={styles.button} onClick={checkNews}>
                  Check News Authenticity
                </button>

                {newsScore !== null && (
                  <div style={styles.resultBox}>
                    <h2>Result</h2>

                    <p>
                      AI Probability: <strong>{((newsScore || 0) * 100).toFixed(2)}%</strong>
                    </p>

                    <div style={styles.barBackground}>
                      <div
                        style={{
                          ...styles.barFill,
                          width: `${(newsScore || 0) * 100}%`
                        }}
                      />
                    </div>

                    <p>
                      {newsScore > 0.7
                        ? "⚠️ Likely AI-generated News"
                        : newsScore > 0.3
                        ? "🤔 Uncertain"
                        : "✅ Likely Human-written News"}
                    </p>
                  </div>
                )}
              </>
            )}
            {activeTab === "audio" && (
              <div style={styles.comingSoonBox}>
                <h2>Audio Detection</h2>
                <h3 style={{ color: "#1230f1" }}>Coming Soon !!!</h3>
                <p style={styles.quote}>
                  "Great things take time. Stay patient, stay consistent."
                </p>
              </div>
            )}
            {activeTab === "video" && (
              <div style={styles.comingSoonBox}>
                <h2>Video Detection</h2>
                <h3 style={{ color: "#1230f1" }}>Coming Soon !!!</h3>
                <p style={styles.quote}>
                  "Big innovations are built step by step. Keep going!"
                </p>
              </div>
            )}
        </div>
      )}
      {page === "about" && (
        <div style={styles.card}>
          <h2 style={{ fontSize: "28px", marginBottom: "10px" }}>About This Project</h2>

          <p style={{ color: "#ddd", lineHeight: "1.6" }}>
            AI Fake Content Detector is a smart web application designed to analyze and
            identify whether content is <b>human-written or AI-generated</b>.
          </p>

          <br />

          <h3 style={{ color: "#00d4ff" }}>✨ Features</h3>
          <ul style={{ textAlign: "left", marginTop: "10px", color: "#eee", lineHeight: "1.8" }}>
            <li>📝 Text AI detection using probability scoring</li>
            <li>🖼️ Image authenticity check</li>
            <li>🔗 URL / article content analysis</li>
            <li>💻 Code generation detection (experimental)</li>
            <li>📰 News article verification</li>
            <li>⚡ Fast real-time results</li>
          </ul>

          <br />

          <h3 style={{ color: "#00d4ff" }}>🎯 Purpose</h3>
          <p style={{ color: "#ddd", lineHeight: "1.6" }}>
            The goal of this project is to help users understand the difference between
            AI-generated and human-created content in an easy and interactive way.
          </p>

          <br />

          <h3 style={{ color: "#00d4ff" }}>⚠️ Note</h3>
          <p style={{ color: "#ffcc00", lineHeight: "1.6" }}>
            This tool provides probabilistic results and may not always be 100% accurate.
            It should be used as a reference, not a final judgment system.
          </p>
        </div>
      )}
      {page === "feedback" && (
        <div style={styles.card}>
          <h2>Feedback</h2>

          <textarea
            placeholder="Write your feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            style={styles.textarea}
          />

          <button style={styles.button} onClick={handleFeedback}>
            Submit Feedback
          </button>

          <div>
            <h3>Previous Feedback:</h3>
            {feedbackList.map((fb, index) => (
              <p key={index}>• {fb}</p>
            ))}
          </div>
        </div>
      )}


    </div> 
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
    color: "white",
    fontFamily: "Arial",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "90px" // 🔥 important (space for navbar)
  },
  textarea: {
    width: "60%",
    height: "150px",
    padding: "10px",
    fontSize: "16px"
  },
  button: {
  marginTop: "15px",
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "5px"

  },
  resultBox: {
    marginTop: "30px"
  },
  barBackground: {
    width: "60%",
    height: "20px",
    backgroundColor: "#ddd",
    margin: "10px auto",
    borderRadius: "10px"
  },
  barFill: {
    height: "100%",
  backgroundColor: "#4CAF50",
  borderRadius: "10px",
  transition: "width 0.5s ease-in-out"
  },
  section: {
    marginTop: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  fileInput: {
    marginTop: "10px",
    marginBottom: "15px",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "5px"
  },
  tabContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "20px"
  },

  tab: {
    padding: "10px 20px",
    cursor: "pointer",
    border: "none",
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "white",
    borderRadius: "20px",
    transition: "0.3s"
  },

  activeTab: {
    padding: "10px 20px",
    cursor: "pointer",
    border: "none",
    backgroundColor: "#00d4ff",
    color: "black",
    borderRadius: "20px",
    fontWeight: "bold"
  },
  card: {
  backgroundColor: "rgba(255,255,255,0.1)",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  width: "60%",
  textAlign: "center",
  backdropFilter: "blur(10px)",
  marginTop: "20px",   // 🔥 extra spacing
  position: "relative", // 🔥 ensures proper stacking behavior
  zIndex: 1
  },
  h1: {
  marginBottom: "20px"
  },
  hero: {
  marginBottom: "20px"
  },

  heroTitle: {
  fontSize: "32px",
  marginBottom: "10px"
  },

  heroSub: {
    fontSize: "14px",
    color: "#ccc"
  },
  input: {
    width: "60%",
    padding: "10px",
    fontSize: "16px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  comingSoonBox: {
  marginTop: "40px",
  padding: "30px",
  borderRadius: "10px",
  backgroundColor: "#f5f5f5",
  color: "#333",
  textAlign: "center",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },

  quote: {
  marginTop: "15px",
  fontStyle: "italic",
  color: "rgb(16, 2, 58)"
  },
  navbar: {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 30px",
  backgroundColor: "#111",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 9999,
  boxSizing: "border-box"
  },

  logo: {
  margin: 0,
  color: "white"
  },

  navBtn: {
  marginLeft: "10px",
  padding: "8px 15px",
  cursor: "pointer",
  border: "none",
  backgroundColor: "#00d4ff",
  color: "black",
  borderRadius: "5px"
  },
  activeNavBtn: {
  marginLeft: "10px",
  padding: "8px 15px",
  cursor: "pointer",
  border: "none",
  backgroundColor: "#ffffff",   // active color
  color: "#111",               // text contrast
  borderRadius: "5px",
  fontWeight: "bold",
  transform: "scale(1.05)",    // slight highlight effect
  transition: "0.2s"
  }
  
};

export default App;