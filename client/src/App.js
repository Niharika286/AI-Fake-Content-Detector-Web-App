import React, { useState } from "react";


function App() {
  const [text, setText] = useState("");
  const [score, setScore] = useState(null);
  const [image, setImage] = useState(null);
  const [imageScore, setImageScore] = useState(null);
  const [activeTab, setActiveTab] = useState("text");
  const [url, setUrl] = useState("");
  const [urlScore, setUrlScore] = useState(null);
  const [code, setCode] = useState("");
  const [codeScore, setCodeScore] = useState(null);
  

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
  

  return (
    <div style={styles.container}>
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
    alignItems: "center"
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
  backdropFilter: "blur(10px)"
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
  
};

export default App;