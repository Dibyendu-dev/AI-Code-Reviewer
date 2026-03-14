import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

export const Editorcmp = () => {

  const [theme, setTheme] = useState(null);
  const [code, setCode] = useState("// Write your code here");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  async function downloadTheme() {
    const response = await fetch("/Dracula.json");
    const data = await response.json();
    setTheme(data);
  }

  function handleEditorDidMount(editor, monaco) {
    monaco.editor.defineTheme("dracula", theme);
    monaco.editor.setTheme("dracula");
  }

  function handleChange(value) {
    setCode(value);
  }

  useEffect(() => {
    downloadTheme();
  }, []);

  // AI review function
  async function reviewCode() {

    setLoading(true);

    const formData = new FormData();
    formData.append('code', code);

    const response = await fetch("http://localhost:8000/api/review/", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    setReview(data.review ?? data.error ?? "Unexpected response");
    setLoading(false);
  }

  return (
    <div style={{display:"flex", height:"100vh"}}>

      {/* Editor */}
      <div style={{width:"60%"}}>
        {theme && (
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={code}
            onChange={handleChange}
            onMount={handleEditorDidMount}
          />
        )}
      </div>

      {/* Review Panel */}
      <div style={{
        width:"40%",
        padding:"20px",
        background:"#1e1e1e",
        color:"white",
        overflow:"auto"
      }}>

        <button
          onClick={reviewCode}
          style={{
            padding:"10px 20px",
            background:"#6c63ff",
            border:"none",
            color:"white",
            cursor:"pointer",
            marginBottom:"20px"
          }}
        >
          {loading ? "Reviewing..." : "Review Code"}
        </button>

        <h3>AI Code Review</h3>

        <pre style={{
          whiteSpace:"pre-wrap",
          lineHeight:"1.5"
        }}>
          {review}
        </pre>

      </div>

    </div>
  );
};