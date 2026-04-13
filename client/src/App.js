import React, { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [score, setScore] = useState(null);
  const [image, setImage] = useState(null);
  const [imageScore, setImageScore] = useState(null);
  const [activeTab, setActiveTab] = useState("text");

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

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.h1}>AI Fake Content Detector</h1>
        <div style={styles.tabContainer}>
            <button
              style={activeTab === "text" ? styles.activeTab : styles.tab}
              onClick={() => setActiveTab("text")}
            >
              Text Detection
            </button>
            <button
              style={activeTab === "image" ? styles.activeTab : styles.tab}
              onClick={() => setActiveTab("image")}
            >
              Image Detection
            </button>
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
      
        </div>
      </div>
      
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f7fa",
    fontFamily: "Arial"
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
    marginBottom: "15px"
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
    gap: "10px",
    marginBottom: "20px"
  },

  tab: {
    padding: "10px 20px",
    cursor: "pointer",
    border: "1px solid #ccc",
    backgroundColor: "#eee"
  },

  activeTab: {
    padding: "10px 20px",
    cursor: "pointer",
    border: "1px solid #4CAF50",
    backgroundColor: "#4CAF50",
    color: "white"
  },
  card: {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  width: "60%",
  textAlign: "center"
  },
  h1: {
  marginBottom: "20px"
  },
  
};

export default App;