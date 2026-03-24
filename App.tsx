import React, { useState, useEffect, useRef } from 'react';
import { THEMES, TRANSLATIONS } from './constants';
import { Theme, Message, Role, Attachment, MessageType, Language } from './types';
import InputArea from './components/InputArea';
import MathRenderer from './components/MathRenderer';
import { solveMathProblem } from './services/geminiService';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0]);
  const [language, setLanguage] = useState<Language>('en');
  const [showSettings, setShowSettings] = useState(false);
  
  const t = TRANSLATIONS[language];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: Role.MODEL,
      content: t.welcome,
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'welcome') {
      setMessages([{
        id: 'welcome',
        role: Role.MODEL,
        content: t.welcome,
        timestamp: Date.now()
      }]);
    }
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string, attachments: Attachment[]) => {
    const userMsgId = uuidv4();
    const newUserMessage: Message = {
      id: userMsgId,
      role: Role.USER,
      content: text,
      attachments: attachments,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    const solutionText = await solveMathProblem(text, attachments, messages, language);

    const modelMsgId = uuidv4();
    const newModelMessage: Message = {
      id: modelMsgId,
      role: Role.MODEL,
      content: solutionText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newModelMessage]);
    setIsLoading(false);
  };

  const handleClearChat = () => {
    setMessages([{
      id: uuidv4(),
      role: Role.MODEL,
      content: t.welcome,
      timestamp: Date.now()
    }]);
    setShowSettings(false);
  };

  return (
    <div className={`h-screen w-full flex overflow-hidden ${currentTheme.background} text-slate-200 font-sans`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Sidebar (Desktop) */}
      <aside className={`fixed inset-y-0 ${language === 'ar' ? 'right-0 border-l' : 'left-0 border-r'} border-white/5 w-20 md:w-64 glass-panel z-50 flex flex-col items-center md:items-stretch transition-all duration-300 hidden md:flex`}>
        <div className="p-6 flex items-center gap-3 justify-center md:justify-start">
           <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentTheme.gradient} flex items-center justify-center text-white shadow-lg`}>
              <i className="fas fa-cube text-xl"></i>
           </div>
           <div className="hidden md:block">
             <h1 className="font-bold text-xl tracking-tight text-white">{t.appName}</h1>
             <p className="text-xs text-slate-400">{t.tagline}</p>
           </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <button className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-gradient-to-r ${currentTheme.gradient} text-white shadow-lg transition-all`}>
            <i className="fas fa-message w-6 text-center"></i>
            <span className="hidden md:block font-medium">Chat</span>
          </button>
          
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all"
          >
            <i className="fas fa-cog w-6 text-center"></i>
            <span className="hidden md:block font-medium">{t.settings}</span>
          </button>
        </nav>

        {/* Footer Area with Attribution */}
        <div className="p-6 border-t border-white/5 bg-black/20">
            <div className="flex items-center justify-center">
                <p className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase text-center hover:text-slate-400 transition-colors">
                   {t.madeBy}
                </p>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col h-full relative ${language === 'ar' ? 'md:mr-64' : 'md:ml-64'}`}>
        
        {/* Mobile Header */}
        <header className="md:hidden h-16 glass-panel flex items-center justify-between px-4 z-40">
           <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentTheme.gradient} flex items-center justify-center text-white shadow-md`}>
                <i className="fas fa-cube text-sm"></i>
              </div>
              <div className="flex flex-col">
                <h1 className="font-bold text-lg text-white leading-none">{t.appName}</h1>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{t.madeBy}</p>
              </div>
           </div>
           <div className="flex items-center gap-2">
             <button onClick={() => setShowSettings(!showSettings)} className="text-slate-300 p-2 hover:bg-white/5 rounded-full transition-colors">
               <i className="fas fa-bars text-xl"></i>
             </button>
           </div>
        </header>

        {/* Chat Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth relative">
           <div className="max-w-4xl mx-auto space-y-6 pb-4">
             {messages.map((msg) => {
               const isUser = msg.role === Role.USER;
               return (
                 <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                   {!isUser && (
                     <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${currentTheme.gradient} flex-shrink-0 flex items-center justify-center text-white text-xs shadow-lg ${language === 'ar' ? 'ml-3' : 'mr-3'} mt-1`}>
                        <i className="fas fa-robot text-sm"></i>
                     </div>
                   )}
                   
                   <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-6 py-4 shadow-xl backdrop-blur-md ${isUser ? currentTheme.bubbleUser : currentTheme.bubbleModel}`}>
                     
                     {/* Attachments */}
                     {msg.attachments && msg.attachments.length > 0 && (
                       <div className="mb-4">
                         {msg.attachments.map((att, idx) => (
                           att.type === MessageType.IMAGE && (
                             <img 
                               key={idx} 
                               src={`data:${att.mimeType};base64,${att.data}`} 
                               alt="Upload" 
                               className="rounded-xl max-h-72 border border-white/20 shadow-2xl hover:scale-[1.02] transition-transform" 
                             />
                           )
                         ))}
                       </div>
                     )}

                     {/* Content */}
                     <div className={`${isUser ? 'text-white' : 'text-slate-200'}`}>
                        {isUser ? (
                          <p className="whitespace-pre-wrap leading-relaxed font-medium">{msg.content}</p>
                        ) : (
                          <MathRenderer content={msg.content} isDark={true} />
                        )}
                     </div>

                     <div className={`text-[10px] mt-2 opacity-50 flex items-center gap-1 ${isUser ? 'justify-end text-white' : 'justify-start text-slate-400'}`}>
                       {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       {isUser && <i className="fas fa-check-double text-[8px]"></i>}
                     </div>
                   </div>
                 </div>
               );
             })}

             {isLoading && (
               <div className="flex justify-start items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${currentTheme.gradient} flex items-center justify-center text-white text-xs shadow-lg`}>
                    <i className="fas fa-robot text-sm"></i>
                  </div>
                  <div className={`${currentTheme.bubbleModel} px-6 py-3.5 rounded-2xl flex items-center gap-4 shadow-2xl border border-white/5`}>
                    <div className="flex space-x-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-bounce delay-100"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce delay-200"></div>
                    </div>
                    <span className="text-sm text-slate-300 font-semibold tracking-wide">{t.thinking}</span>
                  </div>
               </div>
             )}
             <div ref={messagesEndRef} />
           </div>
        </main>

        <InputArea 
          onSend={handleSendMessage}
          isLoading={isLoading}
          themePrimary={currentTheme.primary}
          themeGradient={currentTheme.gradient}
          language={language}
          t={t}
        />

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
             <div className="bg-[#1E293B] border border-white/10 rounded-[2.5rem] w-full max-w-md p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] transform transition-all scale-100">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <i className="fas fa-sliders text-blue-500"></i> {t.settings}
                  </h2>
                  <button onClick={() => setShowSettings(false)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all active:scale-90">
                    <i className="fas fa-times text-lg"></i>
                  </button>
                </div>

                {/* Language */}
                <div className="mb-8">
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 ml-1">{t.language}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['en', 'fr', 'ar'] as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`py-3 rounded-2xl text-sm font-bold transition-all border-2 ${
                          language === lang 
                          ? `bg-gradient-to-r ${currentTheme.gradient} text-white border-transparent shadow-[0_0_15px_rgba(59,130,246,0.3)]` 
                          : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-700/50'
                        }`}
                      >
                        {lang === 'en' ? 'EN' : lang === 'fr' ? 'FR' : 'AR'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme */}
                <div className="mb-10">
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 ml-1">{t.theme}</label>
                  <div className="grid grid-cols-1 gap-3">
                    {THEMES.map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => setCurrentTheme(theme)}
                        className={`flex items-center p-4 rounded-2xl border-2 transition-all ${
                          currentTheme.id === theme.id 
                          ? `bg-slate-800/80 border-blue-500 shadow-inner` 
                          : 'bg-transparent border-slate-700/30 hover:bg-slate-800/40 hover:border-slate-600'
                        }`}
                      >
                         <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradient} mr-4 shadow-lg`}></div>
                         <span className={`flex-1 text-left font-bold ${currentTheme.id === theme.id ? 'text-white' : 'text-slate-400'}`}>{theme.name}</span>
                         {currentTheme.id === theme.id && <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleClearChat}
                    className="w-full py-4 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center justify-center gap-3 font-bold"
                  >
                    <i className="fas fa-trash-alt"></i> {t.clearChat}
                  </button>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;