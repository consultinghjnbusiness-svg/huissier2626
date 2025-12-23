
import React, { useState, useRef, useEffect } from 'react';

interface RecorderProps {
  onTranscriptionComplete: (text: string) => void;
  onCancel: () => void;
}

const Recorder: React.FC<RecorderProps> = ({ onTranscriptionComplete, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [fullTranscript, setFullTranscript] = useState("");
  const intervalRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialisation de la reconnaissance vocale (Web Speech API)
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'fr-FR';

      recognition.onresult = (event: any) => {
        let interim = "";
        let final = fullTranscript;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript + " ";
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setInterimText(interim);
        setFullTranscript(final);
      };

      recognition.onerror = (event: any) => {
        console.error("Erreur de reconnaissance vocale:", event.error);
        stopRecording();
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [fullTranscript]);

  const startRecording = () => {
    if (!recognitionRef.current) {
      alert("La reconnaissance vocale n'est pas supportée par ce navigateur. Utilisez Chrome ou Edge.");
      return;
    }
    
    setFullTranscript("");
    setInterimText("");
    setIsRecording(true);
    setTimer(0);
    
    recognitionRef.current.start();
    
    intervalRef.current = window.setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (recognitionRef.current) recognitionRef.current.stop();
    
    setIsProcessing(true);
    
    // On laisse un petit délai pour finaliser la dernière phrase
    setTimeout(() => {
      const finalResult = fullTranscript + interimText;
      if (finalResult.trim().length < 5) {
        alert("La dictée semble vide. Veuillez parler plus fort ou vérifier votre micro.");
        setIsProcessing(false);
        return;
      }
      onTranscriptionComplete(finalResult);
      setIsProcessing(false);
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg mx-auto mt-10 animate-in zoom-in duration-300">
      <div className="mb-8 text-center">
        <div className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
          Module DeepSkee v2.0
        </div>
        <h3 className="text-2xl font-black text-slate-800 mb-2 legal-title">
          {isProcessing ? "Analyse Juridique..." : isRecording ? "Dictée en Cours" : "Prêt pour la Dictée"}
        </h3>
        <p className="text-sm text-slate-500 font-medium">Capture vocale sécurisée et conforme OHADA.</p>
      </div>

      <div className="relative mb-8">
        {isRecording && (
          <div className="absolute inset-0 animate-ping bg-red-100 rounded-full scale-150 opacity-75"></div>
        )}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center text-3xl transition-all shadow-2xl ${
            isRecording ? 'bg-red-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
          } disabled:bg-slate-300 transform active:scale-90`}
        >
          {isProcessing ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : isRecording ? (
            <i className="fas fa-stop"></i>
          ) : (
            <i className="fas fa-microphone"></i>
          )}
          {!isRecording && !isProcessing && <span className="text-[10px] font-bold uppercase mt-2">Démarrer</span>}
        </button>
      </div>

      <div className={`text-4xl font-mono font-black mb-8 transition-colors ${isRecording ? 'text-red-500' : 'text-slate-700'}`}>
        {formatTime(timer)}
      </div>

      <div className="w-full bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100 min-h-[120px] max-h-[200px] overflow-y-auto shadow-inner relative">
        <div className="absolute top-2 left-3 text-[8px] font-black text-slate-300 uppercase">Transcription en temps réel</div>
        <p className="text-slate-700 leading-relaxed text-sm pt-2">
          {fullTranscript}
          <span className="text-amber-600 font-medium">{interimText}</span>
          {!fullTranscript && !interimText && <span className="text-slate-300 italic">Vos paroles s'afficheront ici...</span>}
        </p>
      </div>

      <div className="flex gap-4 w-full">
        <button 
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 text-slate-400 hover:text-slate-800 font-bold py-3 text-sm transition-colors"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default Recorder;
