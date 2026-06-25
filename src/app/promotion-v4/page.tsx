"use client";

import Image from "next/image";
import { useState, useRef, useCallback, useEffect } from "react";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3;

interface LeadForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  website: string;
  businessBrief: string;
  businessAddress: string;
  postDate: string;
  requirement: string;
}

interface GenerationResult {
  content: string;
  imageUrl: string;
  businessBrief: string;
  businessAddress: string;
}

// ─────────────────────────────────────────────────────────────
// FORM CARD
// ─────────────────────────────────────────────────────────────

interface FormCardProps {
  assistantText: string;
  questionTitle?: string;
  children?: React.ReactNode;
}

function FormCard({ assistantText, questionTitle, children }: FormCardProps) {
  return (
    <div
      className="
        flex items-start gap-4 w-full
        animate-in fade-in slide-in-from-bottom-3
        duration-500
      ">
      {/* STATUS ICON */}
      <div className="w-8 h-8 rounded-full bg-[#e8f7f1] border border-[#d1ebd9] flex items-center justify-center shrink-0 mt-3 shadow-sm">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2269F8"
          strokeWidth="2.2"
          strokeLinecap="round">
          {/* AI assistant lines */}
          <path d="M7 8h10" />
          <path d="M5 12h14" />
          <path d="M8 16h8" />
        </svg>
      </div>

      {/* CARD */}
      <div className="flex-1 bg-white border border-[#ebe7e7] rounded-[22px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-4 transition-all duration-300 hover:shadow-[0_18px_40px_rgba(0,0,0,0.04)]">
        {questionTitle && (
          <h3 className="text-[15px] font-medium text-[#232323] font-['Manrope'] tracking-tight leading-tight">
            {questionTitle}
          </h3>
        )}

        <p className="text-[14px] leading-relaxed text-[#232323] font-['Manrope']">
          {assistantText}
        </p>

        {children && <div className="pt-1 w-full">{children}</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────────────────────

function ProgressLine({ step }: { step: Step }) {
  const progress = step === 1 ? 33 : step === 3 ? 100 : 66;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999]">
      <div className="h-[6px] w-full bg-gray-200 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-green-500 to-green-500 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CTA BUTTON
// ─────────────────────────────────────────────────────────────

function CTAButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        group inline-flex items-center gap-4
        bg-[#2269F8]
        hover:bg-[#1d5fe0]
        hover:-translate-y-[2px]
        hover:shadow-[0_18px_40px_rgba(34,105,248,0.25)]
        active:scale-[0.98]
        disabled:opacity-40
        disabled:cursor-not-allowed
        text-white
        rounded-2xl
        px-6 py-3.5
        transition-all duration-300
        w-full md:w-auto justify-center
      ">
      <span className="font-semibold text-[15px] font-['Manrope']">
        {label}
      </span>

      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#2269F8] transition-transform duration-300 group-hover:translate-x-[2px]">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="M13 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

const inputClass =
  "w-full max-w-xl rounded-xl bg-[#f6f3f2] border border-[#e5e2e1] px-4 py-3 text-[14.5px] text-[#232323] placeholder:text-[#737687] focus:border-[#2269F8] focus:bg-white focus:ring-4 focus:ring-[#2269F8]/10 outline-none transition-all font-['Manrope'] shadow-inner";

// ─────────────────────────────────────────────────────────────
// UPLOAD
// ─────────────────────────────────────────────────────────────

function UploadDropzone({
  onFile,
  previewUrl,
}: {
  onFile: (f: File) => void;
  previewUrl: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      onFile(file);
    },
    [onFile]
  );

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="cursor-pointer rounded-2xl border border-dashed border-[#d6d6d6] bg-[#f8f8f8] hover:bg-white hover:border-[#2269F8]/30 transition-all p-8 max-w-xl">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) handleFile(e.target.files[0]);
        }}
      />

      {previewUrl ? (
        <Image
          width={100}
          height={100}
          src={previewUrl}
          alt="Preview"
          className="rounded-xl w-full h-[220px] object-cover mx-auto"
        />
      ) : (
        <div className="text-center">
          <div className="text-3xl mb-3">📷</div>

          <h4 className="text-[15px] font-semibold text-[#232323] font-['Space_Grotesk']">
            Upload creative image
          </h4>

          <p className="text-[#737687] text-xs font-['Manrope'] mt-1">
            PNG or JPG · Up to 10MB
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PREVIEW CARD
// ─────────────────────────────────────────────────────────────

// function InstagramPreviewCard({
//   form,
//   generationResult,
//   previewUrl,
// }: {
//   form: LeadForm;
//   generationResult: GenerationResult | null;
//   previewUrl: string | null;
// }) {
//   return (
//     <div className="sticky top-28 bg-white border border-[#ebe7e7] rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden">
//       <div className="px-4 py-3 flex items-center gap-3 border-b border-[#f4f4f4]">
//         <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2269F8] to-[#10B981] p-[2px]">
//           <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold font-['Space_Grotesk']">
//             {form.companyName
//               ? form.companyName.substring(0, 2).toUpperCase()
//               : "PX"}
//           </div>
//         </div>

//         <div>
//           <h4 className="text-sm font-semibold font-['Space_Grotesk']">
//             {form.companyName || "yourbrand"}
//           </h4>

//           <p className="text-[11px] text-[#737687]">Sponsored</p>
//         </div>
//       </div>

//       <div className="bg-[#f6f3f2] aspect-square flex items-center justify-center overflow-hidden">
//         {previewUrl ? (
//           <Image
//             width={100}
//             height={100}
//             src={previewUrl}
//             alt="Preview"
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="text-center px-6">
//             <span className="text-3xl mb-2 block">✨</span>

//             <p className="text-xs text-[#737687]">Campaign creative preview</p>
//           </div>
//         )}
//       </div>

//       <div className="bg-[#2269F8] text-white px-4 py-3 flex items-center justify-between text-xs font-semibold">
//         <span>LEARN MORE</span>

//         <svg
//           width="14"
//           height="14"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2.5">
//           <path d="M5 12h14M13 5l7 7-7 7" />
//         </svg>
//       </div>

//       <div className="p-4 space-y-2 text-[14px] leading-relaxed">
//         <p>
//           <span className="font-bold mr-2 font-['Space_Grotesk']">
//             {form.companyName || "yourbrand"}
//           </span>

//           {generationResult?.content ||
//             "Generated campaign preview content appears here..."}
//         </p>
//       </div>
//     </div>
//   );
// }

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────

export default function CampaignPage() {
  const [step, setStep] = useState<Step>(1);

  const [generated, setGenerated] = useState(false);

  const generatedSectionRef = useRef<HTMLDivElement | null>(null);

  const [form, setForm] = useState<LeadForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    website: "",
    businessBrief: "",
    businessAddress: "",
    postDate: "",
    requirement: "",
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [generationResult, setGenerationResult] =
    useState<GenerationResult | null>(null);

  const [loading, setLoading] = useState(false);

  // ─────────────────────────────────────────────────────────────
  // AUTO SCROLL
  // ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (generated && generatedSectionRef.current) {
      setTimeout(() => {
        generatedSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }
  }, [generated]);

  // ─────────────────────────────────────────────────────────────

  const handleFormChange = (field: keyof LeadForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFile = useCallback((file: File) => {
    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  // ─────────────────────────────────────────────────────────────

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("requirement", form.requirement);
      formData.append("websiteUrl", form.website);

      const response = await fetch("/api/generate-post-v2", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setGenerationResult({
        content: data.content,
        imageUrl: data.generatedImageUrl,
        businessBrief: data.businessBrief || "",
        businessAddress: data.businessAddress || "",
      });
      setForm((prev) => ({
        ...prev,
        businessBrief: data.businessBrief || "",
        businessAddress: data.businessAddress || "",
      }));
      setStep(2);

      setGenerated(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  // const maskCaption = (text: string) => {
  //   return text
  //     .split(/(\s+)/) // preserve spaces/newlines
  //     .map((token, idx) => {
  //       // keep whitespace untouched
  //       if (/^\s+$/.test(token)) {
  //         return token;
  //       }

  //       const clean = token.replace(/[.,!?;:]/g, "");

  //       // never mask hashtags, mentions, urls
  //       if (
  //         clean.startsWith("#") ||
  //         clean.startsWith("@") ||
  //         clean.startsWith("http") ||
  //         clean.length <= 4
  //       ) {
  //         return token;
  //       }

  //       // natural scattered masking
  //       const shouldMask = idx % 5 === 0 || idx % 9 === 0;

  //       if (!shouldMask) {
  //         return token;
  //       }

  //       return "██████";
  //     })
  //     .join("");
  // };
  // ─────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value)
      );

      if (uploadedFile) {
        formData.append("image", uploadedFile);
      }

      formData.append("aiGeneratedContent", generationResult?.content || "");

      await fetch("/api/proxy-submit", {
        method: "POST",
        body: formData,
      });

      setStep(3);
    } catch (e) {
      console.error(e);
    }
  };

  // ─────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700&display=swap');

        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>

      <div className="min-h-screen bg-[#fcf9f8] relative overflow-hidden">
        {/* NAVBAR */}
        <div className="relative z-10 border-b border-[#ebe7e7] bg-white/70 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <h1 className="text-[26px] tracking-tight font-bold text-[#232323] font-['Space_Grotesk']">
              PIX<span className="text-[#2269F8]">CITY</span>
            </h1>

            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#2269F8]/10 border border-[#2269F8]/10">
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />

              <span className="text-xs text-[#2269F8] font-semibold uppercase tracking-wider font-['Manrope']">
                AI Campaign Studio
              </span>
            </div>
          </div>
        </div>

        <ProgressLine step={step} />

        {/* CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          <div className="max-w-5xl mx-auto">
            {/* LEFT */}
            <div className="space-y-6">
              {/* STEP 1 */}
              {step !== 3 && (
                <>
                  <FormCard assistantText="Hi, I'm Pixcity AI, your AI campaign production assistant. Let's build your next high-performing social campaign together." />

                  <FormCard
                    questionTitle="Corporate Brand Domain"
                    assistantText="Paste your company website so I can analyze your visual identity and positioning.">
                    <input
                      type="url"
                      value={form.website}
                      onChange={(e) =>
                        handleFormChange("website", e.target.value)
                      }
                      placeholder="https://yourbrand.com"
                      className={inputClass}
                    />
                  </FormCard>

                  <FormCard
                    questionTitle="Post Requirement"
                    assistantText="Describe the style, mood, audience, or visual direction for the campaign.">
                    <textarea
                      rows={4}
                      value={form.requirement}
                      onChange={(e) =>
                        handleFormChange("requirement", e.target.value)
                      }
                      placeholder="Luxury aesthetic, modern product showcase, cinematic lighting..."
                      className={`${inputClass} resize-none`}
                    />
                  </FormCard>

                  <FormCard
                    questionTitle="Launch Date"
                    assistantText="Choose when this campaign should go live.">
                    <input
                      type="date"
                      value={form.postDate}
                      onChange={(e) =>
                        handleFormChange("postDate", e.target.value)
                      }
                      className={inputClass}
                    />
                  </FormCard>

                  {/* GENERATE BUTTON */}
                  {!generated && !loading && (
                    <div className="pt-2 pl-[44px]">
                      <CTAButton
                        label="Generate Campaign Concept"
                        onClick={handleGenerate}
                      />
                    </div>
                  )}

                  {/* LOADING */}
                  {loading && (
                    <div className="pl-[44px]">
                      <div className="max-w-xl rounded-2xl border border-[#e5e7eb] bg-white p-5 overflow-hidden relative">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />

                        <div className="relative space-y-3">
                          <div className="h-3 w-32 rounded-full bg-[#e5e7eb]" />
                          <div className="h-3 w-full rounded-full bg-[#f0f0f0]" />
                          <div className="h-3 w-[90%] rounded-full bg-[#f0f0f0]" />
                          <div className="h-3 w-[75%] rounded-full bg-[#f0f0f0]" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GENERATED */}
                  {generated && (
                    <div
                      ref={generatedSectionRef}
                      className="
                        space-y-6
                        animate-in
                        fade-in
                        slide-in-from-bottom-8
                        duration-700
                      ">
                      {/* GENERATED RESULT */}
                      <div className="relative overflow-hidden">
                        <FormCard assistantText="Pixcity AI">
                          <div className="flex items-center gap-2 text-[#10B981]">
                            <div className="w-5 h-5 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[11px]">
                              ✓
                            </div>

                            <span className="text-[13px] font-medium font-['Manrope']">
                              Strategy blueprint successfully compiled
                            </span>
                          </div>
                        </FormCard>
                      </div>

                      {/* DIVIDER */}
                      <div className="flex items-center gap-4 py-2 pl-[44px]">
                        <div className="h-px flex-1 bg-gradient-to-r from-[#2269F8]/20 to-transparent" />

                        <div className="px-4 py-2 rounded-full bg-white border border-[#e5e7eb] shadow-sm">
                          <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#2269F8] font-['Manrope']">
                            Final Details
                          </span>
                        </div>

                        <div className="h-px flex-1 bg-gradient-to-l from-[#10B981]/20 to-transparent" />
                      </div>
                      {/* {generationResult?.content} */}
                      <FormCard assistantText="Perfect. Your campaign structure looks strong. I just need a few final details to prepare delivery assets." />
                      <FormCard
                        questionTitle="Your Business Details and Address"
                        assistantText="
                            Please review the business brief and address below.
                            Update them if anything looks incorrect or incomplete.
                        ">
                        <textarea
                          value={form.businessBrief}
                          onChange={(e) =>
                            handleFormChange("businessBrief", e.target.value)
                          }
                          rows={4}
                          className={inputClass}
                          placeholder="Business Details"
                        />

                        <textarea
                          value={form.businessAddress}
                          onChange={(e) =>
                            handleFormChange("businessAddress", e.target.value)
                          }
                          rows={3}
                          className={inputClass}
                          placeholder="Address"
                        />
                      </FormCard>
                      <FormCard
                        questionTitle="Your Name"
                        assistantText="How should we address you?">
                        <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
                          <input
                            type="text"
                            value={form.firstName}
                            onChange={(e) =>
                              handleFormChange("firstName", e.target.value)
                            }
                            placeholder="First name"
                            className={inputClass}
                          />

                          <input
                            type="text"
                            value={form.lastName}
                            onChange={(e) =>
                              handleFormChange("lastName", e.target.value)
                            }
                            placeholder="Last name"
                            className={inputClass}
                          />
                        </div>
                      </FormCard>

                      <FormCard
                        questionTitle="Email Address"
                        assistantText="Where should we send your final assets?">
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            handleFormChange("email", e.target.value)
                          }
                          placeholder="alex@company.com"
                          className={inputClass}
                        />
                      </FormCard>

                      <FormCard
                        questionTitle="Company Details"
                        assistantText="Add your brand name and contact number.">
                        <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
                          <input
                            type="text"
                            value={form.companyName}
                            onChange={(e) =>
                              handleFormChange("companyName", e.target.value)
                            }
                            placeholder="Company name"
                            className={inputClass}
                          />

                          <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) =>
                              handleFormChange("phone", e.target.value)
                            }
                            placeholder="Phone number"
                            className={inputClass}
                          />
                        </div>
                      </FormCard>

                      <FormCard
                        questionTitle="Creative Reference"
                        assistantText="Upload your campaign image or reference asset.">
                        <UploadDropzone
                          onFile={handleFile}
                          previewUrl={previewUrl}
                        />
                      </FormCard>

                      <div className="pt-2 pl-[44px]">
                        <CTAButton
                          label="Claim My Campaign"
                          onClick={handleSubmit}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {step === 3 && (
                <div className="space-y-6 max-w-5xl mx-auto font-sans antialiased text-[#232323]  rounded-3xl">
                  {/* TOP USER & COMPANY OVERVIEW CARD */}
                  <div className="bg-white rounded-2xl border border-[#e5e9f0] sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    {/* User Branding info */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-[#113255] flex items-center justify-center text-white text-2xl font-bold border border-gray-200 shadow-inner">
                        <Image
                          width={100}
                          height={100}
                          src="https://backoffice.pix.city/images/pixcity-profile-logo.png"
                          alt="Pixcity"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm font-medium">
                        <span className="text-gray-400">First Name</span>
                        <span className="text-[#10b981] font-semibold">
                          {form.firstName || ""}
                        </span>
                        <span className="text-gray-400">Last Name</span>
                        <span className="text-[#10b981] font-semibold">
                          {form.lastName || ""}
                        </span>
                      </div>
                    </div>

                    {/* Metadata / Company Account list */}
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs sm:text-sm border-t md:border-t-0 md:border-l border-gray-100 p-4 w-full md:w-auto">
                      <span className="text-gray-400">Company</span>
                      <span className="text-[#10b981] font-semibold break-words">
                        {form.companyName || "sdf"}
                      </span>
                      <span className="text-gray-400">Email</span>
                      <span className="font-medium text-gray-700 break-all">
                        {form.email || "sdfs"}
                      </span>
                      <span className="text-gray-400">Tél</span>
                      <span className="font-medium text-gray-700">
                        {form.phone || "sdfds"}
                      </span>
                    </div>
                  </div>

                  {/* MAIN INTERACTIVE PREVIEW PANEL */}
                  <div className="bg-white rounded-2xl border border-[#e5e9f0] p-4 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] min-h-[500px]">
                    <div className="grid gap-6">
                      {/* LEFT COLUMN: SOCIAL POST CONTAINER SIMULATION */}
                      <div className="md:col-span-5 lg:col-span-4 border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white max-w-sm mx-auto w-full">
                        {/* Header */}
                        <div className="px-3 py-2.5 border-b border-gray-100 flex items-center justify-center text-xs font-bold text-gray-800">
                          <div className="flex items-center gap-1.5">
                            <span className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide">
                              POST
                            </span>

                            <span className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide">
                              REEL
                            </span>
                          </div>
                        </div>

                        <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between text-xs text-gray-700">
                          <span className="font-bold flex items-center gap-1">
                            <span className="w-4 h-4 rounded-full bg-gray-200 inline-block text-[9px] text-center font-black leading-4">
                              P
                            </span>
                            @{form.companyName || "your-company"}
                          </span>
                          <span className="text-gray-400 cursor-pointer text-base leading-none">
                            •••
                          </span>
                        </div>

                        {/* Social Image Artwork Wrapper */}
                        <div className="relative bg-[#f5bc27] flex items-stretch min-h-[360px]">
                          {/* Split Content Pictures */}
                          <div className="w-3/5 p-2 flex flex-col gap-1 justify-between bg-white/10">
                            <div className="flex-1 bg-gray-100 border-b border-white rounded-sm overflow-hidden relative group">
                              <Image
                                width={100}
                                height={100}
                                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=400&auto=format&fit=crop"
                                alt="Moda Élégante Kitchen Design"
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-white/90 text-[8px] tracking-wider px-2 py-0.5 font-bold rounded shadow-sm whitespace-nowrap">
                                MODA ÉLÉGANTE
                              </span>
                            </div>

                            <div className="absolute top-1/2 left-[30%] -translate-y-1/2 -translate-x-1/2 z-10 bg-white border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center font-bold text-[9px] text-gray-600 shadow-sm">
                              VS
                            </div>

                            <div className="flex-1 bg-gray-100 rounded-sm overflow-hidden relative group">
                              <Image
                                width={100}
                                height={100}
                                src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=400&auto=format&fit=crop"
                                alt="Velvet Urbaine Kitchen Design"
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-white/90 text-[8px] tracking-wider px-2 py-0.5 font-bold rounded shadow-sm whitespace-nowrap">
                                VELVET URBAINE
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Social Feedback Bar */}
                        <div className="p-3 border-t border-gray-100">
                          <div className="flex items-center justify-between text-gray-600 mb-1 text-sm">
                            <div className="flex items-center gap-3">
                              <span className="cursor-pointer text-red-500">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="red"
                                  className="bi bi-heart-fill"
                                  viewBox="0 0 16 16">
                                  <path
                                    fillRule="evenodd"
                                    d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"></path>
                                </svg>
                              </span>
                              <span className="cursor-pointer">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-chat"
                                  viewBox="0 0 16 16">
                                  <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"></path>
                                </svg>
                              </span>
                              <span className="cursor-pointer">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-send"
                                  viewBox="0 0 16 16">
                                  <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"></path>
                                </svg>
                              </span>
                            </div>
                            <span className="cursor-pointer">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-bookmark"
                                viewBox="0 0 16 16">
                                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"></path>
                              </svg>
                            </span>
                          </div>
                          <p className="text-xs font-bold text-gray-800">
                            8329 likes
                          </p>
                        </div>

                        {/* Verification Box */}
                        <div className="p-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-600">
                          <label className="block font-semibold text-gray-700 mb-1">
                            Your comments
                          </label>
                          <div className="bg-white border border-pink-200 rounded-xl p-2.5 text-[11px] leading-relaxed text-gray-400 select-none">
                            You can add your comments or suggestions here
                            regarding the requested updates. These notes can be
                            added when the delivery file is sent to you.
                          </div>
                          <label className="flex items-center gap-2 mt-3 cursor-pointer text-gray-700 font-medium">
                            <input
                              type="checkbox"
                              className="accent-[#f43f5e] h-4 w-4 rounded border-gray-300"
                              disabled
                            />
                            <span>Approve creation for integration</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PROJECT MANAGER INFORMATION CARD */}
                  <div className="bg-white rounded-2xl border border-[#e5e9f0] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                      {/* Profile Picture */}
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                        <Image
                          width={100}
                          height={100}
                          src="https://pix.city/assets/marie-b.xMxjQfTy_Z1Q4nd2.webp"
                          alt="Admin"
                          className="
                            w-full
                            md:w-32
                            h-[220px]
                            md:h-32
                            rounded-2xl
                            object-cover
                            border border-white
                            shadow-md
                            shrink-0
                        "
                        />
                      </div>

                      {/* Profile Meta Meta Details */}
                      <div className="flex-1">
                        <span className="text-[#f43f5e] text-xs font-bold uppercase tracking-wider block mb-1">
                          Your assigned creative lead for the Post
                        </span>
                        <h3 className="text-xl font-bold text-gray-800 leading-tight">
                          Marie Bresson-Mignot
                        </h3>
                        <p className="text-sm font-semibold text-gray-400 mt-0.5">
                          Head of Digital & Social Media
                        </p>
                        <p className="text-sm text-[#3b82f6] font-medium mt-1 hover:underline cursor-pointer break-all">
                          marieb@pix.city
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
