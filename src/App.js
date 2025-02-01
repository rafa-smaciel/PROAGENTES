import React, { useState, useEffect, useRef } from "react";

function App() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [typingResponse, setTypingResponse] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const chatContainerRef = useRef(null);

  // 🔹 Definir URL da API automaticamente
  const LOCAL_API = "http://localhost:8000/api/chat"; // Para rodar localmente
  const NGROK_API = "https://aa50-189-1-166-134.ngrok-free.app/api/chat";


  const API_URL = NGROK_API; // 🔹 Altere para LOCAL_API se for rodar localmente

  useEffect(() => {
    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    chatContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingResponse]);

  const handleChat = async () => {
    if (!userInput.trim()) {
      setError("Por favor, insira uma mensagem.");
      return;
    }

    setLoading(true);
    setError(null);

    const newMessage = { role: "Usuário", content: userInput };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: userInput }),
      });

      if (!res.ok) {
        throw new Error(`Erro: ${res.status} - ${res.statusText}`);
      }

      const result = await res.json();
      const chatResponse = result.chat_response || "Erro ao gerar resposta.";
      const citationResponse = result.citation_response || "Nenhuma citação encontrada.";

      const fullResponse = `${chatResponse}\n\n📚 Referência: ${citationResponse}`;

      simulateTyping(fullResponse);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setUserInput("");
    }
  };

  const simulateTyping = (text) => {
    setTypingResponse([]);
    let words = text.split(" ");
    let index = 0;

    const typingInterval = setInterval(() => {
      if (index < words.length) {
        setTypingResponse((prev) => [...prev, words[index] + " "]);
        index++;
      } else {
        clearInterval(typingInterval);
        setMessages((prevMessages) => [...prevMessages, { role: "Assistente", content: text }]);
        setTypingResponse([]);
      }
    }, 30); // 🔹 Ajuste a velocidade da digitação
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const clearChatHistory = () => {
    setMessages([]);
    localStorage.removeItem("chatHistory");
  };

  return (
    <div className="chat-container">
      <h1>💬 BOT 31-01-25</h1>

      <button className="clear-button" onClick={clearChatHistory} title="Limpar Conversa">
        🗑️
      </button>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={msg.role === "Usuário" ? "message user" : "message assistant"}>
            <strong>{msg.role}:</strong>
            <div className="formatted-text">
              {msg.content.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            {/* Botão de copiar para respostas do assistente */}
            {msg.role === "Assistente" && (
              <button className="copy-button" onClick={() => copyToClipboard(msg.content, index)}>
                {copiedIndex === index ? "✔️ Copiado!" : "📋"}
              </button>
            )}
          </div>
        ))}
        {loading && <p className="thinking">🤖 Pensando...</p>}
        {typingResponse.length > 0 && (
          <div className="message assistant">
            <strong>Assistente:</strong>
            <div className="formatted-text">
              {typingResponse.map((word, i) => (
                <span key={i}>{word}</span>
              ))}
            </div>
          </div>
        )}
        <div ref={chatContainerRef}></div>
      </div>

      <div className="input-container">
        <input type="text" placeholder="Digite sua mensagem..." value={userInput} onChange={(e) => setUserInput(e.target.value)} className="input-box" />
        <button onClick={handleChat} disabled={loading} className="send-button">
          {loading ? "⏳ Enviando..." : "➡️ Enviar"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default App;
