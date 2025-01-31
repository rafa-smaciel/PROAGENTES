import React, { useState } from "react";

function App() {
  const [site, setSite] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");
  const [error, setError] = useState(null);

  const handleRunAnalysis = async () => {
    if (!site) {
      setError("Por favor, insira um site.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/run-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ site_url: site }),
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.detail || "Erro desconhecido");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>🔍 Bot de Análise</h1>
      
      <input
        type="text"
        placeholder="Digite a URL do site"
        value={site}
        onChange={(e) => setSite(e.target.value)}
        style={{ padding: "10px", width: "300px", marginRight: "10px" }}
      />

      <button onClick={handleRunAnalysis} disabled={loading}>
        {loading ? "Analisando..." : "Executar Análise"}
      </button>

      {error && <p style={{ color: "red" }}>❌ Erro: {error}</p>}

      {report && (
        <div style={{ marginTop: "20px", background: "#f9f9f9", padding: "10px", borderRadius: "5px" }}>
          <h2>📄 Relatório Gerado</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{report}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
