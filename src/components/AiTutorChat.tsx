import React, { useState } from 'react';
import { Bot, Send, User, Sparkles, Cpu } from 'lucide-react';

export const AiTutorChat: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    {
      sender: 'ai',
      text: "Hello! I'm your AI Automata Theory Professor and Tutor, specialized in Ullman's 'Introduction to Automata Theory, Languages, and Computation' (Chapters 3 & 4). Ask me anything about regular expressions, Thompson's construction, the Pumping Lemma, closure properties, or DFA minimization!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState('3.1');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg, section: selectedSection }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: "I'm having trouble connecting to the AI server. Remember that according to Ullman Chapter 3, regular expressions and finite automata have equal expressive power!"
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-gradient-to-r from-indigo-900 via-violet-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
            <Bot className="w-7 h-7 text-indigo-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold">AI Automata Theory Tutor (Gemini Powered)</h2>
            <p className="text-xs text-indigo-200">Expert guidance on Ullman Sections 3.1-3.3, 4.1, 4.2, 4.4</p>
          </div>
        </div>
        <div>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="bg-indigo-950 text-indigo-200 border border-indigo-500/30 px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none"
          >
            <option value="3.1">Section 3.1: RegEx</option>
            <option value="3.2">Section 3.2: Automata & RegEx</option>
            <option value="3.3">Section 3.3: Applications</option>
            <option value="4.1">Section 4.1: Pumping Lemma</option>
            <option value="4.2">Section 4.2: Closure Properties</option>
            <option value="4.4">Section 4.4: DFA Minimization</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[550px]">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex items-start space-x-3 ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                m.sender === 'ai' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-white'
              }`}>
                {m.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed ${
                m.sender === 'ai' ? 'bg-slate-50 text-slate-800 border border-slate-200' : 'bg-indigo-600 text-white'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl text-xs text-slate-500 italic">
                AI Professor is analyzing automata states and theorem proofs...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-200 flex items-center space-x-3 bg-slate-50 rounded-b-2xl">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask a question about Section ${selectedSection} (e.g., "Explain how state elimination works")...`}
            className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold text-xs shadow-md flex items-center space-x-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
