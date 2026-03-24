import React, { useState, useRef, useEffect } from 'react';
import { Attachment, MessageType, Language, Translations } from '../types';

interface InputAreaProps {
  onSend: (text: string, attachments: Attachment[]) => void;
  isLoading: boolean;
  themePrimary: string;
  themeGradient: string;
  language: Language;
  t: Translations;
}

// Declaration for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading, themePrimary, themeGradient, language, t }) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      // Map app language to speech API language codes
      const langMap: Record<Language, string> = {
        'en': 'en-US',
        'fr': 'fr-FR',
        'ar': 'ar-SA'
      };
      recognitionRef.current.lang = langMap[language];

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        // Append new text to existing text if it's a new session, or replace in current flow
        // For simplicity, we just set the input text to what we hear + what was there
        // Actually, best UX for continuous is just to append to current state carefully
        // But since we want to allow editing, we should likely just append final results
        
        if (finalTranscript) {
          setInputText(prev => prev + (prev ? ' ' : '') + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [language]); // Re-init if language changes

  // Update lang if ref exists
  useEffect(() => {
    if (recognitionRef.current) {
        const langMap: Record<Language, string> = {
            'en': 'en-US',
            'fr': 'fr-FR',
            'ar': 'ar-SA'
          };
      recognitionRef.current.lang = langMap[language];
    }
  }, [language]);

  // Handle auto-resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputText]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (!recognitionRef.current) {
        alert("Speech recognition not supported in this browser.");
        return;
      }
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Could not start recording", e);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setAttachment({
          mimeType: file.type,
          data: base64String,
          type: MessageType.IMAGE
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendText = () => {
    if (!inputText.trim() && !attachment) return;
    
    const attachments = attachment ? [attachment] : [];
    onSend(inputText, attachments);
    setInputText('');
    setAttachment(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  return (
    <div className={`p-4 md:p-6 glass-panel border-t-0 rounded-t-3xl md:rounded-3xl md:mb-6 md:mx-6`}>
      {/* Attachment Preview */}
      {attachment && (
        <div className="relative inline-block mb-3 animate-fade-in">
          <img 
            src={`data:${attachment.mimeType};base64,${attachment.data}`} 
            alt="Preview" 
            className="h-24 w-24 object-cover rounded-xl border-2 border-slate-600/50 shadow-lg"
          />
          <button 
            onClick={() => setAttachment(null)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 w-7 h-7 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
          >
            <i className="fas fa-times text-xs"></i>
          </button>
        </div>
      )}

      <div className="flex items-end gap-3">
        {/* Attachment Button */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="p-3.5 rounded-2xl bg-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-600 transition-all shadow-md"
          title={t.uploadImage}
        >
          <i className="fas fa-image text-lg"></i>
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleFileSelect}
        />

        {/* Text Input Wrapper */}
        <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isRecording ? t.recording : t.inputPlaceholder}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
              className={`w-full bg-slate-800/50 border border-slate-700/50 text-slate-100 rounded-2xl px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder-slate-500 resize-none overflow-hidden transition-all shadow-inner`}
              rows={1}
            />
            {/* Mic Button inside Input */}
            <button
                onClick={toggleRecording}
                className={`absolute ${language === 'ar' ? 'left-3' : 'right-3'} bottom-2.5 p-1.5 transition-all duration-300 ${isRecording ? 'text-red-400 recording-pulse scale-110' : 'text-slate-400 hover:text-white'}`}
                title="Dictate"
            >
                <i className={`fas ${isRecording ? 'fa-stop-circle' : 'fa-microphone'} text-lg`}></i>
            </button>
        </div>

        {/* Send Button */}
        <button 
             onClick={handleSendText}
             disabled={isLoading || (!inputText.trim() && !attachment)}
             className={`p-3.5 rounded-2xl w-14 h-14 flex items-center justify-center transition-all shadow-lg bg-gradient-to-r ${themeGradient} text-white disabled:opacity-50 disabled:grayscale hover:shadow-blue-500/30 active:scale-95`}
           >
             {isLoading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className={`fas ${language === 'ar' ? 'fa-paper-plane fa-flip-horizontal' : 'fa-paper-plane'}`}></i>}
        </button>
      </div>
    </div>
  );
};

export default InputArea;