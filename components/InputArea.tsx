import React, { useRef, useState, useEffect } from 'react';
import { Icon } from './Icon';
import { Tier } from '../types';

interface InputAreaProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  onStop: () => void;
  dailyImageCount: number;
  userTier: Tier;
  onUpgradeTrigger: () => void;
  uploadedFiles: File[];
  onFilesChange: (files: File[]) => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ 
  onSend, 
  isLoading, 
  onStop, 
  dailyImageCount, 
  userTier,
  onUpgradeTrigger,
  uploadedFiles,
  onFilesChange
}) => {
  const [input, setInput] = useState('');
  const [imageMode, setImageMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (!input.trim() && !isLoading) return;
    if (isLoading) { 
      onStop(); 
      return; 
    }

    if (imageMode || input.trim().startsWith('/imagine')) {
      if (userTier === Tier.Free && dailyImageCount >= 5) {
        onUpgradeTrigger();
        return;
      }
    }

    onSend(imageMode ? `/imagine ${input}` : input);
    setInput('');
    setImageMode(false);
    onFilesChange([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { 
      e.preventDefault(); 
      handleSubmit(); 
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onFilesChange([...uploadedFiles, ...files].slice(0, 5)); // Max 5 files
  };

  const removeFile = (index: number) => {
    onFilesChange(uploadedFiles.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        // Here you would normally send to a speech-to-text API
        // For now, we'll just show a placeholder
        setInput(prev => prev + ' [Voice message recorded]');
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const isImageDisabled = userTier === Tier.Free && dailyImageCount >= 5;

  return (
    <div className="w-full flex flex-col items-center max-w-3xl mx-auto">
      {/* File Preview */}
      {uploadedFiles.length > 0 && (
        <div className="w-full mb-2 animate-slide-up">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl px-4 py-3 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="paperclip" size={14} />
              <span className="text-xs text-white/60 font-medium">{uploadedFiles.length} file(s) attached</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5 text-xs">
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  <button 
                    onClick={() => removeFile(i)}
                    className="p-0.5 hover:bg-white/20 rounded transition-colors"
                  >
                    <Icon name="x" size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Image Mode Indicator */}
      {imageMode && (
        <div className="w-full mb-2 animate-slide-up">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl px-4 py-2 flex items-center gap-2 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
            <span className="text-xs text-white/60 font-medium">Image Generation Mode</span>
            {userTier === Tier.Free && (
              <span className="ml-auto text-[10px] text-white/40">{dailyImageCount}/5 used</span>
            )}
            <button 
              onClick={() => setImageMode(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors active:scale-95"
            >
              <Icon name="x" size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="w-full bg-black/40 backdrop-blur-2xl border border-white/20 rounded-[28px] p-2 shadow-2xl">
        <div className="flex items-end gap-2">
          
          {/* File Upload Button */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-95 bg-white/10 hover:bg-white/15 text-white"
          >
            <Icon name="paperclip" size={20} />
          </button>
          <input 
            ref={fileInputRef}
            type="file" 
            multiple 
            accept="image/*,application/pdf,.txt,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Image Generation Button */}
          <button 
            onClick={() => {
              if (isImageDisabled) {
                onUpgradeTrigger();
              } else {
                setImageMode(!imageMode);
              }
            }}
            className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${
              imageMode 
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30' 
                : isImageDisabled
                  ? 'bg-white/5 text-white/30 cursor-not-allowed'
                  : 'bg-white/10 hover:bg-white/15 text-white'
            }`}
            disabled={isImageDisabled && !imageMode}
          >
            {isImageDisabled && !imageMode ? (
              <Icon name="lock" size={20} />
            ) : (
              <Icon name="image" size={20} />
            )}
          </button>

          {/* Text Input */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={imageMode ? "Describe what you want to create..." : "Message JAI-NN..."}
            className="flex-1 bg-transparent border-0 focus:ring-0 text-white placeholder-white/30 resize-none py-3 px-2 max-h-[120px] text-[16px] font-normal leading-relaxed outline-none"
            rows={1}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          />

          {/* Voice Recording Button */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${
              isRecording 
                ? 'bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30 animate-pulse' 
                : 'bg-white/10 hover:bg-white/15 text-white'
            }`}
          >
            <Icon name="mic" size={20} />
          </button>

          {/* Send/Stop Button */}
          <button
            onClick={handleSubmit}
            disabled={!input.trim() && !isLoading}
            className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${
              isLoading 
                ? 'bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30 animate-pulse' 
                : input.trim() 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            <Icon name={isLoading ? 'stop' : 'send'} size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-3 mt-3 text-[10px] text-white/20 font-medium">
        <span>JAI-NN 3.0</span>
        <span className="w-1 h-1 rounded-full bg-white/20"></span>
        <span>Powered by Gemini</span>
      </div>
    </div>
  );
};
