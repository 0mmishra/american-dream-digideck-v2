import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import gsap from 'gsap';

const SYSTEM_PROMPT = `You are a professional AI assistant for a luxury shopping and entertainment destination inspired by American Dream Mall in New Jersey.

You help users with:
- Location and accessibility
- Retail brands and shopping
- Dining and lifestyle
- Attractions and entertainment
- Events and business opportunities

Answer clearly, professionally, and concisely (2-4 lines). Add a slight persuasive, business-oriented tone.

If the user asks something slightly unclear, try to interpret it as a mall-related question and respond helpfully.
Only reject questions if they are COMPLETELY unrelated (like math, politics, coding, etc).
If rejecting, say: "I can help with questions about the mall, its attractions, retail, dining, or business opportunities."
Otherwise ALWAYS try to answer.

American Dream is a large retail and entertainment complex located in East Rutherford, New Jersey, USA, near New York City.
It includes:
- Over 3 million square feet of retail space
- Indoor theme park (Nickelodeon Universe)
- DreamWorks Water Park
- Big SNOW indoor ski resort
- Luxury retail brands
- Dining and lifestyle experiences
- Major events and activations`;

const ChatPanel = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your luxury concierge. Ask me anything about the destination, attractions, or opportunities.' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const panelRef = useRef(null);
  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.to(panelRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        display: 'flex'
      });
    } else {
      gsap.to(panelRef.current, {
        x: 400,
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => {
          if (panelRef.current) panelRef.current.style.display = 'none';
        }
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (chatContainerRef.current && messagesEndRef.current) {
      const container = chatContainerRef.current;
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
      
      if (isAtBottom) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputVal.trim() || isLoading) return;

    const userMsg = inputVal.trim();
    setInputVal('');
    
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    // Unconditionally scroll exactly when the user explicitly triggers a new direct query
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      
      if (!apiKey || apiKey === "") {
        throw new Error("Missing_Key");
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...newMessages
          ]
        })
      });

      if (!response.ok) {
        throw new Error('API_Request_Failed');
      }

      const data = await response.json();
      const botResponse = data.choices[0].message.content;
      
      setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);

    } catch (error) {
      console.error(error);
      if (error.message === "Missing_Key") {
        setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Setup Required: Please add your VITE_OPENROUTER_API_KEY to your .env file to enable the assistant." }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the network right now. Please try again." }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-panel" ref={panelRef} style={{ transform: 'translateX(400px)', opacity: 0, display: 'none' }}>
      <div className="chat-header">
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>AI Assistant</h3>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Ask anything about the mall</p>
        </div>
        <button className="chat-close-btn" onClick={onClose} aria-label="Close Chat">
          <X size={20} color="#fff" />
        </button>
      </div>

      <div className="chat-messages" ref={chatContainerRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role === 'user' ? 'msg-user' : 'msg-bot'}`}>
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="chat-message msg-bot" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Loader2 size={16} className="spinner" /> Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSend}>
        <input 
          type="text" 
          className="chat-input" 
          placeholder="Type your message..." 
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" className="chat-send-btn" disabled={!inputVal.trim() || isLoading}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
