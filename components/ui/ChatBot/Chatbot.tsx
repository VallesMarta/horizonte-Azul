"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "¡Hola! ¿En qué puedo ayudarte?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content += chunk;
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = "Error al conectar con la IA.";
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Abrir chat"
        className="fixed bottom-6 right-6 z-50 rounded-full border-none bg-transparent p-0 cursor-pointer hover:scale-105 transition-transform shadow-[0_4px_24px_0_rgba(82,113,255,0.25)]"
      >
        {open ? (
          <div className="bg-primario rounded-full p-4 flex items-center justify-center">
            <X size={22} color="var(--color-blanco-fijo)" />
          </div>
        ) : (
          <img
            src="/media/img/HorionChatBot.png"
            alt="Chatbot Horion"
            className="w-14 h-14 rounded-full object-cover"
          />
        )}
      </button>

      {/* Ventana del chat */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 flex flex-col overflow-hidden rounded-2xl border border-borde bg-fondo shadow-[0_8px_40px_0_rgba(82,113,255,0.15)]">

          {/* Header */}
          <div className="bg-primario px-4 py-3 flex items-center gap-3">
            <img
              src="/media/img/HorionChatBot.png"
              alt="Horion"
              className="w-8 h-8 rounded-full object-cover border-2 border-blanco-fijo"
            />
            <div>
              <p className="text-blanco-fijo font-bold text-sm m-0">
                Asistente Horion
              </p>
              <p className="text-iconos text-[0.7rem] m-0">
                ● En línea
              </p>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 max-h-80 bg-fondo">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap font-[var(--font-lato ${
                    msg.role === "user"
                      ? "bg-primario text-blanco-fijo rounded-[1rem_1rem_0.25rem_1rem]"
                      : "bg-bg text-texto border border-borde rounded-[1rem_1rem_1rem_0.25rem]"
                  }`}
                >
                  {msg.content}
                  {loading &&
                    i === messages.length - 1 &&
                    msg.role === "assistant" &&
                    !msg.content && (
                      <span className="inline-flex gap-1">
                        <span className="animate-bounce">·</span>
                        <span className="animate-bounce [animation-delay:100ms]">·</span>
                        <span className="animate-bounce [animation-delay:200ms]">·</span>
                      </span>
                    )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-borde bg-fondo p-3 flex gap-2">
            <input
              className="flex-1 text-sm bg-bg text-texto border border-borde rounded-xl px-3 py-2 outline-none placeholder:text-placeholder font-[var(--font-lato"
              placeholder="Escribe un mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-primario disabled:bg-gris disabled:cursor-not-allowed text-blanco-fijo rounded-xl p-2 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Send size={16} color="var(--color-blanco-fijo)" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}