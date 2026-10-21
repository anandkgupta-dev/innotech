import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

// Declaration for SpeechRecognition web API
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
    length: number;
  };
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  className = '',
}) => {
  const { language, t } = useLanguage();
  const [isSupported] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  });
  const [isListening, setIsListening] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  // Use any to accommodate vendor prefix in older/webkit browsers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isSupported) return;

    // Check SpeechRecognition browser availability
    const SpeechRecognition =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setStatusMessage(t('voiceListening'));
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        if (transcript) {
          onTranscript(transcript);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setStatusMessage(t('voicePermissionDenied'));
        } else {
          setStatusMessage(t('voiceError'));
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch {
      // Speech recognition instantiation error
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, [isSupported, language, onTranscript, t]);

  const toggleRecording = () => {
    if (!isSupported) {
      setStatusMessage(t('voiceNotSupported'));
      return;
    }

    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setStatusMessage(null);
    } else {
      setStatusMessage(null);
      // Update language before starting
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      try {
        recognitionRef.current.start();
      } catch {
        setStatusMessage(t('voiceError'));
      }
    }
  };

  return (
    <div className={`inline-flex flex-col items-start gap-1 ${className}`}>
      <button
        type="button"
        onClick={toggleRecording}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border shadow-2xs cursor-pointer ${
          !isSupported
            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
            : isListening
            ? 'bg-rose-600 text-white border-rose-700 animate-pulse ring-4 ring-rose-200'
            : 'bg-white text-sky-800 border-sky-300 hover:bg-sky-50'
        }`}
        title={!isSupported ? t('voiceNotSupported') : t('voiceButtonText')}
        aria-pressed={isListening}
      >
        {isListening ? (
          <>
            <MicOff className="w-4 h-4 text-white animate-spin" />
            <span>{t('voiceStop')}</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 text-sky-600" />
            <span>{t('voiceButtonText')}</span>
          </>
        )}
      </button>

      {/* Voice Status & Helper Messages */}
      {statusMessage && (
        <div className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 px-2 py-1 rounded-md border border-amber-200 mt-1 max-w-sm">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
};
