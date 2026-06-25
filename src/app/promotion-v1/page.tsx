"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useCallback, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = 1 | 2 | 3;

interface LeadForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  instagram: string;
  brandName: string;
  website: string;
}

interface GenerationResult {
  content: string;
  imageUrl: string;
  businessBrief: string;
  businessAddress: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const COOKING_MESSAGES = [
  ["Something beautiful is", "cooking"],
  ["Composing your perfect", "visual"],
  ["Adding those magic", "pixels"],
  ["Crafting your", "caption"],
  ["Almost there — stay with", "us"],
  ["Final creative", "touches"],
];

const GENERATION_STEPS = [
  { label: "Analyzing your product", icon: "🔍" },
  { label: "Fetching business details", icon: "🌐" },
  { label: "Generating creative concept", icon: "💡" },
  { label: "Crafting the visual", icon: "🎨" },
  { label: "Writing your caption", icon: "✍️" },
  { label: "Finalizing your post", icon: "✨" },
];

const STEP_LABELS = ["Source", "Generate", "Your Info"];

// ─── Topbar ───────────────────────────────────────────────────────────────────
function Topbar() {
  return (
    <div className="bg-blue-600 text-center py-2.5 px-5 text-white font-['Space_Grotesk'] text-xs font-semibold tracking-wider flex items-center justify-center gap-2.5">
      <span className="bg-white/20 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wider">
        FREE
      </span>
      <span>
        Limited-time offer — Generate your AI campaign post at no cost
      </span>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="bg-white flex items-center justify-between px-12 h-16 border-b border-gray-200 shadow-sm sticky top-0 z-[100]">
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        <span className="text-[19px] font-bold text-gray-900 tracking-tight">
          PIX<em className="text-blue-600 not-italic">CITY</em>
        </span>
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-gray-500 text-xs font-medium border-l-[1.5px] border-gray-200 pl-4">
          AI Campaign Studio
        </span>
        <span className="bg-blue-50 text-blue-600 text-[11px] font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full border border-blue-600/20">
          AI Studio
        </span>
      </div>
    </nav>
  );
}

// ─── Step Tabs ────────────────────────────────────────────────────────────────
function StepTabs({ currentStep }: { currentStep: Step }) {
  return (
    <div className="flex border-b border-gray-200 bg-gray-50">
      {STEP_LABELS.map((label, idx) => {
        const stepNum = (idx + 1) as Step;
        const isActive = stepNum === currentStep;
        const isDone = stepNum < currentStep;
        return (
          <div
            key={stepNum}
            className={`flex-1 py-3.5 px-2.5 text-center text-[10.5px] font-bold tracking-widest uppercase relative transition-all duration-250 border-r border-gray-200 last:border-r-0 ${
              isActive
                ? "text-blue-600 bg-white"
                : isDone
                ? "text-green-600 bg-green-50"
                : "text-gray-500"
            }`}>
            <span
              className={`inline-flex items-center justify-center w-[19px] h-[19px] rounded-full text-[10px] mr-1.5 align-middle transition-all duration-250 ${
                isActive
                  ? "bg-blue-600 text-white"
                  : isDone
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}>
              {isDone ? (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2">
                  <polyline points="2,6 5,9 10,3" />
                </svg>
              ) : (
                stepNum
              )}
            </span>
            {label}
            {(isActive || isDone) && (
              <div
                className={`absolute bottom-0 left-0 right-0 h-[2.5px] ${
                  isActive ? "bg-blue-600" : "bg-green-600"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Generation Progress (Step 2 only) ───────────────────────────────────────
function GenerationProgress({
  currentStepIndex,
}: {
  currentStepIndex: number;
}) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-[1.5px] border-blue-600/15 rounded-xl p-2.5 animate-slideDown">
      <div className="flex items-center gap-3.5 mb-5">
        <div className="w-[42px] h-[42px] bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-xl animate-pulse">
          ⚡
        </div>
        <div>
          <div className="font-['Space_Grotesk'] text-[15px] font-bold text-gray-900">
            AI is Cooking
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            Please wait while we craft your perfect post
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-4">
        {GENERATION_STEPS.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isDone = idx < currentStepIndex;
          // const isPending = idx > currentStepIndex;

          return (
            <div
              key={idx}
              className={`flex items-center gap-1.5 px-2.5 py-2 bg-white/50 rounded-lg border transition-all duration-300 ${
                isActive
                  ? "border-blue-600 bg-white shadow-md"
                  : isDone
                  ? "border-green-600/20 bg-green-50/80"
                  : "border-transparent opacity-40"
              }`}>
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                {isDone ? (
                  <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-white animate-scaleIn">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5">
                      <polyline points="2,7 5.5,10.5 12,3.5" />
                    </svg>
                  </div>
                ) : (
                  <div
                    className={`text-lg transition-all duration-300 ${
                      isActive
                        ? "grayscale-0 opacity-100 animate-bounce"
                        : "grayscale opacity-50"
                    }`}>
                    {step.icon}
                  </div>
                )}
              </div>
              <div
                className={`flex-1 text-[13px] font-medium ${
                  isActive
                    ? "text-gray-900 font-semibold"
                    : isDone
                    ? "text-green-600"
                    : "text-gray-600"
                }`}>
                {step.label}
              </div>
              {isActive && (
                <div className="flex gap-1 ml-auto">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-dotPulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="h-1.5 bg-blue-600/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500"
          style={{
            width: `${
              ((currentStepIndex + 1) / GENERATION_STEPS.length) * 100
            }%`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Upload Zone ──────────────────────────────────────────────────────────────
function UploadZone({
  onFile,
  previewUrl,
}: {
  onFile: (f: File) => void;
  previewUrl: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      onFile(file);
    },
    [onFile]
  );

  return (
    <div
      className={`h-32 w-full border-2 border-dashed rounded-xl p-2.5 text-center cursor-pointer transition-all duration-220 relative overflow-hidden bg-gray-50 ${
        dragging ? "border-blue-600 bg-blue-50" : "border-gray-400"
      }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
      }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      {previewUrl ? (
        <Image
          src={previewUrl}
          alt="Preview"
          className="w-full h-full object-cover rounded-xl"
          width={100}
          height={100}
        />
      ) : (
        <div>
          <div className="w-12 h-12 mx-auto mb-3.5 bg-blue-50 border-[1.5px] border-blue-600/20 rounded-xl flex items-center justify-center text-2xl transition-transform duration-220 hover:-translate-y-1">
            📷
          </div>
          <div className="font-semibold text-sm text-gray-900 mb-1">
            Upload your product
          </div>
          <div className="text-gray-500 text-xs">
            PNG, JPG up to 10 MB — drag &amp; drop or click
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Blurred Image Component ──────────────────────────────────────────────────
// function BlurredImage({ src }: { src: string }) {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const [blurredDataUrl, setBlurredDataUrl] = useState<string | null>(null);

//   useEffect(() => {
//     if (!src) return;

//     const img = new Image();
//     img.crossOrigin = "anonymous";

//     img.onload = () => {
//       const canvas = canvasRef.current;
//       if (!canvas) return;

//       const ctx = canvas.getContext("2d");
//       if (!ctx) return;

//       // Set canvas size to match image
//       canvas.width = img.width;
//       canvas.height = img.height;

//       // Draw image
//       ctx.drawImage(img, 0, 0);

//       // Apply blur using canvas filter
//       ctx.filter = "blur(10px)";
//       ctx.drawImage(canvas, 0, 0);

//       // Convert to data URL (removes original src from DOM)
//       const blurredUrl = canvas.toDataURL("image/jpeg", 0.7);
//       setBlurredDataUrl(blurredUrl);
//     };

//     img.onerror = () => {
//       console.error("Failed to load image for blurring");
//     };

//     img.src = src;
//   }, [src]);

//   return (
//     <>
//       <canvas ref={canvasRef} className="hidden" />
//       <div className="relative w-full h-full">
//         {blurredDataUrl ? (
//           <Image
//             src={blurredDataUrl}
//             alt="Generated post preview"
//             className="w-full h-full object-cover"
//             width={100}
//             height={100}
//           />
//         ) : (
//           <div className="w-full h-full bg-gray-100 animate-pulse" />
//         )}
//         <div className="absolute inset-0 flex items-center justify-center bg-black/20">
//           <div className="rounded-2xl px-6 py-4 text-center">
//             <div className="text-xs text-white">Complete Step 3 to unlock</div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// ─── IG Preview Card ──────────────────────────────────────────────────────────
function IgCard({
  // previewUrl,
  igHandle,
  avatarLetter,
  generationResult,
  isGenerating,
  cookingIdx,
}: {
  // previewUrl: string | null;
  igHandle: string;
  avatarLetter: string;
  generationResult: GenerationResult | null;
  isGenerating: boolean;
  cookingIdx: number;
}) {
  const [cm0, cm1] = COOKING_MESSAGES[cookingIdx];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden sticky top-20 h-full flex flex-col">
      <div className="flex items-center gap-2.5 p-3 border-b border-gray-200">
        <div className="w-9 h-9 rounded-full flex-shrink-0 bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center font-bold text-[13px] text-white">
          {avatarLetter}
        </div>
        <div>
          <div className="font-semibold text-[13px] text-gray-900">
            {igHandle || "your_instagram_id"}
          </div>
          <div className="text-[11px] text-gray-500">Sponsored</div>
        </div>
        <div className="ml-auto text-gray-500 text-xl cursor-default">···</div>
      </div>

      <div className="flex-1 bg-gray-50 relative overflow-hidden flex items-center justify-center min-h-[260px]">
        {!isGenerating && !generationResult && (
          <div className="flex flex-col items-center gap-3.5 transition-opacity duration-350">
            <div className="w-14 h-14 rounded-2xl bg-white border-[1.5px] border-gray-200 flex items-center justify-center text-2xl text-blue-600">
              ✦
            </div>
            <div className="text-[11px] font-semibold tracking-widest uppercase text-gray-500 text-center leading-relaxed">
              Your professional
              <br />
              post will appear here
            </div>
          </div>
        )}
        {isGenerating && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 bg-white">
            <div className="relative w-[72px] h-[72px]">
              <div className="absolute w-[42px] h-[42px] top-0 left-0 rounded-full bg-gradient-to-br from-blue-600 to-blue-600/10 animate-orbFloat" />
              <div
                className="absolute w-7 h-7 bottom-0 right-0 rounded-full bg-gradient-to-br from-green-600 to-green-600/10 animate-orbFloat"
                style={{ animationDelay: "0.45s" }}
              />
              <div
                className="absolute w-[18px] h-[18px] bottom-2 left-2 rounded-full bg-gradient-to-br from-amber-500 to-amber-500/10 animate-orbFloat"
                style={{ animationDelay: "0.9s" }}
              />
            </div>
            <div className="flex flex-col gap-2 w-[140px]">
              <div className="h-0.5 rounded-full bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 bg-[length:200%] animate-shimmer" />
              <div
                className="h-0.5 rounded-full bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 bg-[length:200%] animate-shimmer w-3/4"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="h-0.5 rounded-full bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 bg-[length:200%] animate-shimmer w-1/2"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
            <div className="text-xs font-semibold tracking-wide text-gray-500 text-center">
              <div>
                {cm0} <strong className="text-blue-600">{cm1}</strong>...
              </div>
              <div className="text-[11px] mt-1 opacity-60">
                Please wait patiently ✦
              </div>
            </div>
          </div>
        )}
        {/* {generationResult && <BlurredImage src={generationResult.imageUrl} />} */}
      </div>

      <div className="flex items-center gap-3.5 p-3 border-t border-gray-200">
        <button className="bg-transparent border-none text-gray-500 cursor-pointer p-0 transition-all duration-200 hover:text-blue-600 hover:scale-110 flex items-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-[21px] h-[21px]">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <button className="bg-transparent border-none text-gray-500 cursor-pointer p-0 transition-all duration-200 hover:text-blue-600 hover:scale-110 flex items-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-[21px] h-[21px]">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
        <button className="bg-transparent border-none text-gray-500 cursor-pointer p-0 transition-all duration-200 hover:text-blue-600 hover:scale-110 flex items-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-[21px] h-[21px]">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
        <button className="bg-transparent border-none text-gray-500 cursor-pointer p-0 transition-all duration-200 hover:text-blue-600 hover:scale-110 flex items-center ml-auto">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-[21px] h-[21px]">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      {generationResult && (
        <div className="px-3.5 pb-0.5 text-xs font-bold text-gray-900">
          1,248 likes
        </div>
      )}

      <div className="px-3.5 pb-3.5 min-h-[50px]">
        {!generationResult ? (
          <div className="flex flex-col gap-2">
            <div className="h-2 rounded-full bg-gray-50 animate-skelpulse" />
            <div className="h-2 rounded-full bg-gray-50 animate-skelpulse w-3/4" />
            <div className="h-2 rounded-full bg-gray-50 animate-skelpulse w-1/2" />
          </div>
        ) : (
          <div className="text-[13px] leading-relaxed text-gray-900">
            <div className="relative mt-1">
              <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-3">
                <strong>{igHandle || "yourbrand"}</strong>{" "}
                {generationResult.content}
              </p>
              <div className="pointer-events-none absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent" />
            </div>
            <span className="text-xs text-amber-800">
              Claim post to unlock full caption 🔒
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CampaignPage() {
  const [step, setStep] = useState<Step>(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [requirement, setRequirement] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [form, setForm] = useState<LeadForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    instagram: "",
    brandName: "",
    website: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] =
    useState<GenerationResult | null>(null);
  const [cookingIdx, setCookingIdx] = useState(0);
  const [genStepIdx, setGenStepIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const cookingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const genStepRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (cookingRef.current) clearInterval(cookingRef.current);
      if (genStepRef.current) clearInterval(genStepRef.current);
    },
    []
  );

  const igHandle = form.instagram.trim() || "your_instagram_id";
  const avatarLetter = form.firstName.trim()
    ? form.firstName[0].toUpperCase()
    : "P";

  const handleFile = useCallback((file: File) => {
    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const handleFormChange = (field: keyof LeadForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Step 1 → 2: kick off generation right away
  const goToStep2 = async () => {
    if (!uploadedFile || !websiteUrl.trim()) {
      setError("Please upload an image and provide your website URL.");
      return;
    }
    setError(null);
    setStep(2);
    await runGeneration();
  };

  const goToStep3 = () => {
    setError(null);
    setStep(3);
  };
  // const goToStep1 = () => {
  //   setStep(1);
  //   setGenerationResult(null);
  //   setIsGenerating(false);
  //   setSubmitted(false);
  // };

  const runGeneration = async () => {
    setIsGenerating(true);
    setGenerationResult(null);
    setCookingIdx(0);
    setGenStepIdx(0);

    cookingRef.current = setInterval(
      () => setCookingIdx((p) => (p + 1) % COOKING_MESSAGES.length),
      2600
    );

    genStepRef.current = setInterval(
      () => setGenStepIdx((p) => Math.min(p + 1, GENERATION_STEPS.length - 1)),
      2400
    );

    try {
      const formData = new FormData();
      formData.append("requirement", requirement);
      formData.append("websiteUrl", websiteUrl);
      formData.append("file", uploadedFile!);

      const response = await fetch("/api/generate-post", {
        method: "POST",
        body: formData,
      });

      console.log(response);
      if (!response.ok) throw new Error("API request failed");
      const data = await response.json();

      const content =
        data.content.length > 80
          ? data.content.slice(0, 2080).replace(/\s+\S*$/, "") + "..."
          : data.content;

      clearInterval(cookingRef.current!);
      clearInterval(genStepRef.current!);
      setGenerationResult({
        content,
        imageUrl: data.generatedImageUrl!,
        businessBrief: data.businessBrief || "",
        businessAddress: data.businessAddress || "",
      });
    } catch {
      clearInterval(cookingRef.current!);
      clearInterval(genStepRef.current!);
      setError("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const submitLead = () => {
    if (!form.firstName.trim() || !form.email.trim()) {
      setError("Please fill in at least your name and email.");
      return;
    }
    setError(null);
    setSubmitted(true);
    // TODO: POST form data to your CRM / backend
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700&display=swap');
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        
        @keyframes dotPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes orbFloat { 
          0%,100%{transform:translate(0,0) scale(1)} 
          33%{transform:translate(7px,-9px) scale(1.12)} 
          66%{transform:translate(-5px,5px) scale(.9)} 
        }
        
        @keyframes shimmer { 
          0%{background-position:200% center} 
          100%{background-position:-200% center} 
        }
        
        @keyframes skelpulse { 
          0%,100%{opacity:.4} 
          50%{opacity:.9} 
        }
        
        .animate-slideDown { animation: slideDown 0.4s ease; }
        .animate-pulse { animation: pulse 2s ease-in-out infinite; }
        .animate-bounce { animation: bounce 1s ease-in-out infinite; }
        .animate-scaleIn { animation: scaleIn 0.3s ease; }
        .animate-dotPulse { animation: dotPulse 1.4s ease-in-out infinite; }
        .animate-orbFloat { animation: orbFloat 2.6s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 1.7s linear infinite; }
        .animate-skelpulse { animation: skelpulse 1.8s ease-in-out infinite; }
      `}</style>

      <Topbar />
      <Navbar />
      <div className="max-w-7xl text-center mx-auto px-6 py-6">
        <h1 className="text-[26px] font-bold tracking-tight leading-tight">
          Create Your <span className="text-blue-600">AI Campaign</span> Post
        </h1>
        <p className="text-sm text-gray-500 mt-1.5">
          Upload your product, let AI craft the post, then confirm your details.
        </p>
      </div>
      <div className="min-h-full flex flex-col mb-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1400px] w-full mx-auto px-5 items-stretch">
          {/* ── LEFT: Step panel ── */}
          <div className="w-full min-w-0 h-full flex flex-col bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <StepTabs currentStep={step} />

            {/* Step 1 — Source */}
            {step === 1 && (
              <div className="p-7 flex-1 min-h-[520px]">
                <div className="text-[10.5px] font-bold tracking-widest text-gray-500 uppercase mb-4">
                  Step 1 — Source Photo, Website &amp; Vision
                </div>
                <UploadZone onFile={handleFile} previewUrl={previewUrl} />

                <label
                  className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mt-4 mb-1"
                  htmlFor="websiteUrl">
                  Website URL *
                </label>
                <input
                  id="websiteUrl"
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourbrand.com"
                  className="w-full bg-gray-50 border-[1.5px] border-gray-200 rounded-lg text-gray-900 font-['Manrope'] text-sm px-3 py-2 outline-none transition-all duration-200 focus:border-blue-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(34,105,248,0.1)]"
                />

                <label
                  className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mt-4 mb-1"
                  htmlFor="requirement">
                  Campaign Description
                </label>
                <textarea
                  id="requirement"
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  placeholder="Describe the look and feel — e.g. moody studio lighting, vibrant lifestyle shot, luxury feel..."
                  className="w-full bg-gray-50 border-[1.5px] border-gray-200 rounded-lg text-gray-900 font-['Manrope'] text-sm px-3 py-2 min-h-[96px] resize-none outline-none transition-all duration-200 focus:border-blue-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(34,105,248,0.1)]"
                />

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-[13px] text-red-600 mt-3">
                    {error}
                  </div>
                )}

                <button
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600 border-none rounded-lg text-white text-[13px] font-bold tracking-wider uppercase cursor-pointer mt-5 shadow-[0_4px_16px_rgba(34,105,248,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(34,105,248,0.38)] hover:bg-blue-500 active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                  disabled={!uploadedFile || !websiteUrl.trim()}
                  onClick={goToStep2}>
                  ✦ Generate My Post →
                </button>
              </div>
            )}

            {/* Step 2 — Generate */}
            {step === 2 && (
              <div className="p-7 flex-1 min-h-[520px]">
                <div className="text-[10.5px] font-bold tracking-widest text-gray-500 uppercase mb-4">
                  Step 2 — AI Generation
                </div>

                {isGenerating && (
                  <GenerationProgress currentStepIndex={genStepIdx} />
                )}

                {!isGenerating && generationResult && (
                  <>
                    <div className="text-center py-4">
                      <div className="text-4xl mb-2.5">🎉</div>
                      <h2 className="font-['Space_Grotesk'] text-xl font-bold">
                        Your post is ready!
                      </h2>
                    </div>

                    {/* Business Brief */}
                    <div className="mt-4">
                      <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">
                        Business Brief
                      </label>
                      <textarea
                        rows={5}
                        value={generationResult.businessBrief}
                        className="w-full bg-gray-50 border-[1.5px] border-gray-200 rounded-lg text-gray-700 font-['Manrope'] text-sm px-3 py-2 min-h-[80px] resize-none"
                      />
                    </div>

                    {/* Business Address */}
                    <div className="mt-4">
                      <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">
                        Business Address
                      </label>
                      <textarea
                        rows={5}
                        value={generationResult.businessAddress}
                        className="w-full bg-gray-50 border-[1.5px] border-gray-200 rounded-lg text-gray-700 font-['Manrope'] text-sm px-3 py-2 resize-none"
                      />
                    </div>
                    <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-lg p-2">
                      <svg
                        className="w-5 h-5 mt-[2px] text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                        />
                      </svg>

                      <p>
                        Please review the business brief and address below.
                        Update them if anything looks incorrect or incomplete.
                      </p>
                    </div>
                    <button
                      className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600 border-none rounded-lg text-white text-[13px] font-bold tracking-wider uppercase cursor-pointer mt-3 shadow-[0_4px_16px_rgba(34,105,248,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(34,105,248,0.38)] hover:bg-blue-500"
                      onClick={goToStep3}>
                      Claim My Post — Fill Details →
                    </button>
                  </>
                )}

                {!isGenerating && !generationResult && error && (
                  <>
                    <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-[13px] text-red-600">
                      {error}
                    </div>
                    <button
                      className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600 border-none rounded-lg text-white text-[13px] font-bold tracking-wider uppercase cursor-pointer mt-4 shadow-[0_4px_16px_rgba(34,105,248,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(34,105,248,0.38)] hover:bg-blue-500"
                      onClick={() => {
                        setError(null);
                        runGeneration();
                      }}>
                      Retry Generation
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Step 3 — Your Info */}
            {step === 3 && (
              <div className="p-7 flex-1 min-h-[520px]">
                <div className="text-[10.5px] font-bold tracking-widest text-gray-500 uppercase mb-4">
                  Step 3 — Your Details
                </div>

                {submitted ? (
                  <div className="text-center py-8 max-w-md mx-auto">
                    <div className="text-5xl mb-3">🎊</div>

                    <h2 className="font-['Space_Grotesk'] text-xl font-bold mb-3">
                      All done!
                    </h2>

                    <p className="text-[13.5px] text-gray-600 leading-relaxed mb-4">
                      We&apos;ll send your campaign post to{" "}
                      <strong>{form.email}</strong> shortly.
                    </p>

                    <p className="text-[13.5px] text-gray-600 leading-relaxed mb-4">
                      That&apos;s everything we need! Our team will now craft
                      your tailor-made creative. Expect it in your inbox within
                      24 hours.
                    </p>

                    <p className="text-[13.5px] text-gray-600 leading-relaxed">
                      We&apos;ll send you a link to your personal delivery file
                      — open it to preview, approve, and download your post.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-600/25 rounded-xl p-4 text-center mb-5">
                      <div className="text-sm text-green-800">
                        <span className="font-medium">
                          🎉 Your post is ready!{" "}
                        </span>
                        Fill in your details below to receive it.
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mt-2 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          className="w-full bg-gray-50 border-[1.5px] border-gray-200 rounded-lg text-gray-900 font-['Manrope'] text-sm px-3 py-2 outline-none transition-all duration-200 focus:border-blue-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(34,105,248,0.1)]"
                          value={form.firstName}
                          onChange={(e) =>
                            handleFormChange("firstName", e.target.value)
                          }
                          placeholder="Alex"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mt-2 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="w-full bg-gray-50 border-[1.5px] border-gray-200 rounded-lg text-gray-900 font-['Manrope'] text-sm px-3 py-2 outline-none transition-all duration-200 focus:border-blue-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(34,105,248,0.1)]"
                          value={form.lastName}
                          onChange={(e) =>
                            handleFormChange("lastName", e.target.value)
                          }
                          placeholder="Rivera"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mt-2 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          className="w-full bg-gray-50 border-[1.5px] border-gray-200 rounded-lg text-gray-900 font-['Manrope'] text-sm px-3 py-2 outline-none transition-all duration-200 focus:border-blue-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(34,105,248,0.1)]"
                          value={form.email}
                          onChange={(e) =>
                            handleFormChange("email", e.target.value)
                          }
                          placeholder="alex@yourbrand.com"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mt-2 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="w-full bg-gray-50 border-[1.5px] border-gray-200 rounded-lg text-gray-900 font-['Manrope'] text-sm px-3 py-2 outline-none transition-all duration-200 focus:border-blue-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(34,105,248,0.1)]"
                          value={form.phone}
                          onChange={(e) =>
                            handleFormChange("phone", e.target.value)
                          }
                          placeholder="+91 98765 43210"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mt-2 mb-1">
                          Company Name
                        </label>
                        <input
                          type="text"
                          className="w-full bg-gray-50 border-[1.5px] border-gray-200 rounded-lg text-gray-900 font-['Manrope'] text-sm px-3 py-2 outline-none transition-all duration-200 focus:border-blue-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(34,105,248,0.1)]"
                          value={form.brandName}
                          onChange={(e) =>
                            handleFormChange("brandName", e.target.value)
                          }
                          placeholder="Your Brand Co."
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-[13px] text-red-600 mt-3">
                        {error}
                      </div>
                    )}

                    <button
                      className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600 border-none rounded-lg text-white text-[13px] font-bold tracking-wider uppercase cursor-pointer mt-5 shadow-[0_4px_16px_rgba(34,105,248,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(34,105,248,0.38)] hover:bg-blue-500"
                      onClick={submitLead}>
                      Submit &amp; Get My Post
                    </button>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-500/30 rounded-xl p-4 text-center mt-5">
                      <div className="text-sm text-blue-800">
                        We&apos;ll craft a tailor-made social media post or
                        story — delivered to your inbox within 24 hours. Made by
                        humans, powered by AI.
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT: IG Preview ── */}
          <div className="w-full min-w-0 h-full flex justify-center">
            <div className="w-full max-w-[420px] h-full">
              <IgCard
                // previewUrl={previewUrl}
                igHandle={igHandle}
                avatarLetter={avatarLetter}
                generationResult={generationResult}
                isGenerating={isGenerating}
                cookingIdx={cookingIdx}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
