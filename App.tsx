
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowDownTrayIcon,
  ShieldCheckIcon,
  CalendarIcon,
  ClockIcon,
  PhotoIcon,
  SparklesIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { GoogleGenAI } from "@google/genai";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import { ARABIC_DAYS, Gender, AgeRange } from './types';

interface DaySchedule {
  day: string;
  time: string;
}

export default function App() {
  const posterRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    studentName: '',
    schedules: [] as DaySchedule[],
    classLink: '',
    gender: 'Boy' as Gender,
    ageRange: 'Child (7-12)' as AgeRange
  });

  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const arabicNotice = "لضمان أفضل جودة للتعلّم، يُرجى استخدام جهاز بشاشة كبيرة مثل الآيباد لمسح رمز الـ QR والدخول إلى الصف.";

  useEffect(() => {
    if (formData.classLink) {
      QRCode.toDataURL(formData.classLink, {
        width: 400,
        margin: 2,
        color: { dark: '#333333', light: '#FFFFFF' }
      })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error("QR Error:", err));
    } else {
      setQrCodeUrl('');
    }
  }, [formData.classLink]);

  const toggleDay = (day: string) => {
    setFormData(prev => {
      const exists = prev.schedules.find(s => s.day === day);
      if (exists) {
        return { ...prev, schedules: prev.schedules.filter(s => s.day !== day) };
      } else {
        return { ...prev, schedules: [...prev.schedules, { day, time: '18:00' }] };
      }
    });
  };

  const updateTime = (day: string, time: string) => {
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules.map(s => s.day === day ? { ...s, time } : s)
    }));
  };

  const constructPrompt = () => {
    const isGirl = formData.gender === 'Girl';
    const characterDescription = isGirl 
      ? "A Saudi teenage girl seen from the back, wearing pure black abaya and black headscarf,"
      : "A Saudi teenage boy seen from the back, wearing white thobe and red-white shemagh,";

    return `Cinematic warm light poster background, vertical 4:5.
${characterDescription}
walking forward on a glowing golden learning path.
No face visible.
Scene:
On the left side, a cozy study desk with laptop, books and desk lamp,
the path starts from the desk and flows into a wide valley with distant city silhouettes,
bathed in sunset golden-hour light.
Lighting:
strong cinematic sunset rays, warm orange and gold glow,
soft bloom highlights, emotional film-like atmosphere.
Style:
high-end cartoon illustration, semi-realistic Pixar / Disney feeling,
smooth brush strokes, rich color depth, not tech style.
Color palette:
deep blue shadows with warm golden light,
clear contrast between left study area and right bright future path.
Layout:
student centered slightly right,
large clean blank space on the left for Arabic text and QR code.
Mood:
hopeful, emotional, aspirational, “my future is opening”.
No text inside image.`;
  };

  const handleGenerate = async () => {
    if (!formData.studentName || formData.schedules.length === 0 || !formData.classLink) {
      alert('Please fill all fields.');
      return;
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("VITE_GEMINI_API_KEY is not set in Vercel Environment Variables");
    }

    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: constructPrompt() }] },
        config: {
          imageConfig: {
            aspectRatio: "3:4"
          }
        }
      });

      const imageUrl = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
      if (imageUrl) {
        setGeneratedImageUrl(`data:image/png;base64,${imageUrl}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPoster = async () => {
    if (!posterRef.current) return;
    setIsDownloading(true);
    
    // Brief delay to ensure all assets (QR code, AI image) are fully painted
    await new Promise(r => setTimeout(r, 300));

    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 4, // Higher scale for ultra-sharp text
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0,
        // Force the capture width to prevent responsive resizing during capture
        width: posterRef.current.offsetWidth,
        height: posterRef.current.offsetHeight
      });
      
      const dataUrl = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement('a');
      link.download = `LP-Reminder-${formData.studentName || 'Student'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download Error:", err);
      alert("Failed to save poster. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 flex flex-col items-center bg-lpSoftGray font-sans">
      <header className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-lpBlue w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-lpDark tracking-tighter">LP CRM <span className="text-lpBlue">Poster</span></h1>
          </div>
        </div>
        <div className="px-3 py-1 bg-white rounded-full border border-slate-200 text-[9px] font-black flex items-center gap-2 shadow-sm uppercase">
          <ShieldCheckIcon className="w-3.5 h-3.5 text-green-500" /> Active Session
        </div>
      </header>

      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Panel: Configuration */}
        <section className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-[32px] p-6 shadow-xl border border-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-lpBlue" />
            <h2 className="text-base font-black text-lpDark mb-5">Poster Config</h2>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Student Name</label>
                <input type="text" dir="rtl" placeholder="اسم الطالب" 
                  className="w-full bg-lpSoftGray p-3 rounded-xl font-bold text-lg border-2 border-transparent focus:border-lpBlue outline-none"
                  value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Identity</label>
                <div className="grid grid-cols-2 gap-1.5 bg-lpSoftGray p-1 rounded-xl">
                  {(['Boy', 'Girl'] as Gender[]).map(g => (
                    <button key={g} onClick={() => setFormData({...formData, gender: g})}
                      className={`py-2 rounded-lg text-[10px] font-black transition-all ${formData.gender === g ? 'bg-white text-lpBlue shadow-sm' : 'text-slate-400'}`}>
                      {g === 'Boy' ? 'Boy (ولد)' : 'Girl (بنت)'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Schedule</label>
                <div className="flex flex-wrap gap-1 mb-2" dir="rtl">
                  {ARABIC_DAYS.map(day => (
                    <button key={day} onClick={() => toggleDay(day)}
                      className={`px-2 py-1.5 rounded-lg border font-bold text-[8px] transition-all ${
                        formData.schedules.some(s => s.day === day) ? 'bg-lpBlue border-lpBlue text-white shadow-sm' : 'bg-white border-slate-200 text-slate-400'
                      }`}>
                      {day}
                    </button>
                  ))}
                </div>
                {formData.schedules.length > 0 && (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar">
                    {formData.schedules.map(s => (
                      <div key={s.day} className="flex items-center justify-between bg-lpSoftGray px-3 py-1.5 rounded-lg">
                        <span className="font-black text-[10px]">{s.day}</span>
                        <input type="time" value={s.time} onChange={(e) => updateTime(s.day, e.target.value)}
                          className="text-[10px] font-black text-lpBlue bg-transparent outline-none" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Class Link</label>
                <input type="url" placeholder="Paste URL here..." 
                  className="w-full bg-lpSoftGray p-3 rounded-xl font-bold text-[10px] outline-none"
                  value={formData.classLink} onChange={e => setFormData({...formData, classLink: e.target.value})} />
              </div>

              <button onClick={handleGenerate} disabled={isLoading}
                className="w-full bg-lpDark text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-lpBlue transition-all disabled:opacity-50">
                {isLoading ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <SparklesIcon className="w-5 h-5 text-lpYellow" />}
                {isLoading ? 'RENDERING...' : 'GENERATE POSTER'}
              </button>
            </div>
          </div>
        </section>

        {/* Right Panel: Poster Preview & Download */}
        <section className="lg:col-span-8 flex flex-col items-center">
          <div className="bg-white rounded-[40px] p-4 md:p-6 shadow-2xl border border-slate-100 flex flex-col items-center w-full max-w-[500px]">
            
            {/* THIS IS THE CAPTURE TARGET */}
            <div 
              ref={posterRef}
              id="poster-canvas" 
              className="relative w-full aspect-[3/4] bg-white rounded-[24px] overflow-hidden flex flex-col shadow-sm"
              style={{ direction: 'rtl' }}
            >
              {!generatedImageUrl && !isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center opacity-20 p-10 text-center">
                  <PhotoIcon className="w-16 h-16 mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">Artwork Preview</p>
                </div>
              ) : isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center bg-white">
                  <div className="w-10 h-10 border-4 border-lpBlue border-t-transparent rounded-full animate-spin" />
                  <p className="mt-4 font-black text-lpBlue text-[8px] uppercase tracking-widest animate-pulse">Rendering Journey...</p>
                </div>
              ) : (
                <>
                  {/* TOP 62% - BACKGROUND IMAGE */}
                  <div className="relative h-[62%] w-full bg-[#f9f9f9] overflow-hidden flex items-center justify-center">
                    <img 
                      src={generatedImageUrl} 
                      className="w-full h-full object-cover" 
                      alt="Art" 
                      crossOrigin="anonymous"
                    />
                    
                    {/* LOGO OVERLAY - Centered */}
                    <div className="absolute top-6 left-0 w-full flex justify-center z-50">
                      <div className="bg-white/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/40 flex items-center gap-2 shadow-sm">
                        <span className="text-lpBlue font-black text-xs tracking-tight uppercase">51Talk</span>
                        <span className="text-lpDark font-bold text-[10px]">Academy</span>
                      </div>
                    </div>

                    {/* STUDENT NAME OVERLAY - Right Bottom of Image */}
                    {/* Using inline text-shadow instead of tailwind drop-shadow for better canvas capture */}
                    <div className="absolute bottom-6 right-6 z-50 text-right">
                      <h2 
                        className="text-[#26B7FF] font-black text-3xl md:text-4xl tracking-tight leading-tight"
                        style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
                      >
                        {formData.studentName}
                      </h2>
                    </div>

                    {/* GRADIENT FADE */}
                    <div className="absolute bottom-0 left-0 w-full h-[60px] z-20 bg-gradient-to-t from-white to-transparent"></div>
                  </div>

                  {/* BOTTOM 38% - TEXT & QR ZONE */}
                  <div className="flex-1 px-8 pt-6 pb-6 flex flex-col justify-between bg-white relative">
                    <div className="flex items-start">
                      <div className="flex-1" style={{ paddingLeft: '1rem' }}>
                        <div className="mb-4">
                          <label className="text-[10px] font-black text-lpBlue uppercase tracking-[0.2em] mb-2.5 block">موعد الحصص المباشرة</label>
                          <div className="grid grid-cols-2 gap-2">
                            {formData.schedules.slice(0, 4).map((s, idx) => (
                              <div key={idx} className="bg-lpSoftGray/60 px-3 py-2.5 rounded-xl flex flex-col border border-slate-50">
                                <span className="text-[8px] font-black text-lpDark opacity-40 uppercase mb-0.5">{s.day}</span>
                                <span className="text-sm font-black text-lpBlue tracking-tight">{s.time}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-lpBlue/5 p-3 rounded-xl border border-lpBlue/10">
                          <p className="text-[11px] text-lpDark/80 font-bold leading-relaxed text-right">
                            {arabicNotice}
                          </p>
                        </div>
                      </div>

                      {/* QR ZONE */}
                      <div className="flex flex-col items-center shrink-0 self-start mt-2">
                        <div className="w-24 h-24 p-2 bg-white border-2 border-lpSoftGray rounded-[24px] shadow-sm flex items-center justify-center mb-2">
                          {qrCodeUrl && <img src={qrCodeUrl} className="w-full h-full" alt="QR" crossOrigin="anonymous" />}
                        </div>
                        <div className="text-center">
                          <span className="text-[9px] font-black text-lpBlue uppercase tracking-[0.1em] block">امسح الكود للدخول</span>
                          <span className="text-[7px] font-bold text-slate-300 block uppercase mt-0.5">SCAN TO START CLASS</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {generatedImageUrl && (
              <button 
                onClick={handleDownloadPoster} 
                disabled={isDownloading}
                className="mt-6 w-full bg-lpDark text-white px-10 py-4 rounded-full shadow-2xl hover:bg-lpBlue active:scale-95 transition-all flex items-center justify-center gap-3 font-black text-sm disabled:opacity-50"
              >
                {isDownloading ? (
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                ) : (
                  <ArrowDownTrayIcon className="w-5 h-5" />
                )}
                {isDownloading ? 'SAVING POSTER...' : 'DOWNLOAD FULL POSTER'}
              </button>
            )}
          </div>
          
          <p className="mt-4 text-[10px] text-slate-400 font-bold text-center">Tip: We've optimized the download to ensure text clarity and correct placement.</p>
        </section>
      </main>

      <footer className="mt-8 text-slate-300 text-[8px] font-black uppercase tracking-[0.5em] pb-6">
        51Talk Academy Internal Tool
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(180deg) brightness(101%) contrast(101%);
          cursor: pointer;
        }

        /* Ensure smooth rendering for the capture target */
        #poster-canvas {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  );
}
