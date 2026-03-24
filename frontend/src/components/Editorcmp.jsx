import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Card, CardContent } from "./ui/Card.jsx";
import { Badge } from "./ui/Badge.jsx";
import Button from "./ui/Button.jsx";
import { motion } from "framer-motion";

export const Editorcmp = () => {
  const [theme, setTheme] = useState(null);
  const [code, setCode] = useState("// Write your code here");
  const [review, setReview] = useState(null);
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

  useEffect(() => {
    downloadTheme();
  }, []);

  async function reviewCode() {
    setLoading(true);

    const formData = new FormData();
    formData.append("code", code);

    const response = await fetch("http://localhost:8000/api/review/", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    setReview(data);
    setLoading(false);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-gray-950 text-white lg:flex-row">
      {/* Editor */}
      <div className="flex h-[52dvh] w-full min-h-0 flex-col border-b border-gray-800 p-4 lg:h-dvh lg:w-3/5 lg:border-b-0 lg:border-r lg:p-6">
        <Card className="flex min-h-0 flex-1 flex-col">
          <div className="shrink-0 border-b border-white/10 px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold tracking-tight">Editor</h2>
                <p className="mt-1 text-xs text-gray-400">
                  Paste your code and run an AI review.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">JavaScript</Badge>
                <Badge variant="secondary">Dracula</Badge>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 p-3">
            <div className="h-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
              {theme && (
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  value={code}
                  onChange={(v) => setCode(v)}
                  onMount={handleEditorDidMount}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineHeight: 22,
                    padding: { top: 14, bottom: 14 },
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    cursorSmoothCaretAnimation: "on",
                    renderLineHighlight: "gutter",
                  }}
                />
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Review Panel */}
      <div className="flex w-full min-h-0 flex-1 flex-col gap-4 p-4 lg:w-2/5 lg:p-6">
        <div className="shrink-0">
          <Button onClick={reviewCode} className="w-full text-lg rounded-2xl">
            {loading ? "Analyzing Code..." : "🚀 Review Code"}
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {review && (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.25, ease: "easeOut", staggerChildren: 0.06 },
                },
              }}
              className="space-y-4"
            >
              {/* Summary */}
              <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
                <Card className="rounded-2xl">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-lg font-semibold tracking-tight">Summary</h2>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <span className="text-gray-400">Score</span>
                        <Badge variant="secondary">{review.overallScore}/10</Badge>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-300">
                      {review.summary}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Issues */}
              <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
                <Card className="rounded-2xl">
                  <CardContent className="p-5 space-y-4">
                    <h2 className="text-lg font-semibold tracking-tight">Issues</h2>
                    <div className="space-y-3">
                      {review.issues?.length ? (
                        review.issues.map((issue, i) => (
                          <motion.div
                            key={i}
                            variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                            className="rounded-xl border border-gray-800/70 bg-gray-950/40 p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="truncate font-medium">{issue.title}</h3>
                                {issue.line != null && (
                                  <p className="mt-1 text-xs text-gray-500">Line: {issue.line}</p>
                                )}
                              </div>
                              <Badge>{issue.severity}</Badge>
                            </div>
                            <p className="mt-2 text-sm text-gray-400">
                              {issue.description}
                            </p>
                          </motion.div>
                        ))
                      ) : (
                        <div className="rounded-xl border border-gray-800/60 bg-gray-950/30 p-4 text-sm text-gray-400">
                          No issues found.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Suggestions */}
              <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
                <Card className="rounded-2xl">
                  <CardContent className="p-5 space-y-4">
                    <h2 className="text-lg font-semibold tracking-tight">Suggestions</h2>
                    <div className="space-y-3">
                      {review.suggestions?.length ? (
                        review.suggestions.map((s, i) => (
                          <motion.div
                            key={i}
                            variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                            className="rounded-xl border border-gray-800/70 bg-gray-950/40 p-4"
                          >
                            <p className="text-sm text-gray-300">{s.improvement}</p>
                            <pre className="mt-3 overflow-x-auto rounded-lg border border-gray-800/70 bg-black/40 p-3 text-xs text-gray-200">
                              {s.example_fix}
                            </pre>
                          </motion.div>
                        ))
                      ) : (
                        <div className="rounded-xl border border-gray-800/60 bg-gray-950/30 p-4 text-sm text-gray-400">
                          No suggestions.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Strengths */}
              <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
                <Card className="rounded-2xl">
                  <CardContent className="p-5 space-y-4">
                    <h2 className="text-lg font-semibold tracking-tight">Strengths</h2>
                    <ul className="space-y-2 text-sm text-gray-300">
                      {review.strengths?.length ? (
                        review.strengths.map((s, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
                            <span className="leading-relaxed">{s}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400">No strengths returned.</li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
