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

function InstagramPreviewCard({
  form,
  generationResult,
  previewUrl,
}: {
  form: LeadForm;
  generationResult: GenerationResult | null;
  previewUrl: string | null;
}) {
  return (
    <div className="sticky top-28 bg-white border border-[#ebe7e7] rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="px-4 py-3 flex items-center gap-3 border-b border-[#f4f4f4]">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2269F8] to-[#10B981] p-[2px]">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold font-['Space_Grotesk']">
            {form.companyName
              ? form.companyName.substring(0, 2).toUpperCase()
              : "PX"}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold font-['Space_Grotesk']">
            {form.companyName || "yourbrand"}
          </h4>

          <p className="text-[11px] text-[#737687]">Sponsored</p>
        </div>
      </div>

      <div className="bg-[#f6f3f2] aspect-square flex items-center justify-center overflow-hidden">
        {previewUrl ? (
          <Image
            width={100}
            height={100}
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center px-6">
            <span className="text-3xl mb-2 block">✨</span>

            <p className="text-xs text-[#737687]">Campaign creative preview</p>
          </div>
        )}
      </div>

      <div className="bg-[#2269F8] text-white px-4 py-3 flex items-center justify-between text-xs font-semibold">
        <span>LEARN MORE</span>

        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5">
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </div>

      <div className="p-4 space-y-2 text-[14px] leading-relaxed">
        <p>
          <span className="font-bold mr-2 font-['Space_Grotesk']">
            {form.companyName || "yourbrand"}
          </span>

          {generationResult?.content ||
            "Generated campaign preview content appears here..."}
        </p>
      </div>
    </div>
  );
}

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
  const maskCaption = (text: string) => {
    return text
      .split(/(\s+)/) // preserve spaces/newlines
      .map((token, idx) => {
        // keep whitespace untouched
        if (/^\s+$/.test(token)) {
          return token;
        }

        const clean = token.replace(/[.,!?;:]/g, "");

        // never mask hashtags, mentions, urls
        if (
          clean.startsWith("#") ||
          clean.startsWith("@") ||
          clean.startsWith("http") ||
          clean.length <= 4
        ) {
          return token;
        }

        // natural scattered masking
        const shouldMask = idx % 5 === 0 || idx % 9 === 0;

        if (!shouldMask) {
          return token;
        }

        return "██████";
      })
      .join("");
  };
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
          <div
            className={
              step === 3
                ? "grid lg:grid-cols-[1fr_460px] gap-10 items-start"
                : "max-w-3xl mx-auto"
            }>
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

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-5 sm:space-y-6">
                  {/* SUCCESS CARD */}
                  <div className="bg-white rounded-[22px] sm:rounded-[28px] border border-[#ebe7e7] p-5 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.03)] overflow-hidden relative">
                    <div className="relative z-10">
                      {/* TITLE */}
                      <h2 className="text-[26px] sm:text-[34px] leading-[1.1] font-bold text-[#232323] mb-3 font-['Space_Grotesk'] tracking-tight">
                        🎉 All done!
                      </h2>

                      {/* DESCRIPTION */}
                      <p className="text-[13.5px] sm:text-[14px] text-[#6b7280] leading-[1.8] max-w-[620px] font-['Manrope']">
                        That&apos;s everything we need. Our creative team is now
                        preparing your tailor-made campaign assets and strategy
                        package. You can expect delivery within the next 24
                        hours.
                      </p>

                      {/* PROFILE CARD */}
                      <div className="mt-6 sm:mt-8 rounded-[24px] border border-[#ececec] bg-[#fafafa] p-4 sm:p-6 overflow-hidden">
                        {/* TOP BAR */}
                        <div className="flex items-center justify-between gap-3 mb-5">
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.15em] text-[#9ca3af] font-semibold">
                              Assigned Creative Lead
                            </p>
                          </div>

                          {/* STATUS */}
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#d8f5e5] shrink-0">
                            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />

                            <span className="text-[10px] sm:text-[11px] font-semibold text-[#10B981] uppercase tracking-wide">
                              Active
                            </span>
                          </div>
                        </div>

                        {/* CONTENT */}
                        <div className="flex flex-col md:flex-row gap-5">
                          {/* IMAGE */}
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

                          {/* INFO */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[20px] md:text-[18px] font-bold text-[#232323] font-['Space_Grotesk'] leading-tight">
                              Marie Bresson-Mignot
                            </h4>

                            <p className="text-[13px] text-[#2269F8] font-semibold font-['Manrope'] mt-1">
                              Head of Digital & Social Media
                            </p>

                            <p className="text-[13px] text-[#737687] mt-3 leading-relaxed font-['Manrope']">
                              Your assigned creative lead for campaign planning,
                              design direction, and delivery coordination.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* USER DATA */}
                  <div className="bg-white rounded-[22px] sm:rounded-[24px] border border-[#ebe7e7] p-5 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-2 pb-4 mb-4 border-b border-[#f6f3f2]">
                      <span className="text-md">📋</span>

                      <h3 className="text-[15px] sm:text-md font-bold font-['Space_Grotesk'] text-[#232323]">
                        User Data
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4 text-[13px] sm:text-[13.5px] font-['Manrope']">
                      <div className="min-w-0">
                        <span className="block text-[10px] sm:text-xs uppercase text-[#737687] font-semibold mb-1">
                          Contact Name
                        </span>

                        <p className="text-[#232323] font-medium break-words">
                          {form.firstName} {form.lastName || ""}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <span className="block text-[10px] sm:text-xs uppercase text-[#737687] font-semibold mb-1">
                          Email Delivery
                        </span>

                        <p className="text-[#232323] font-medium break-all">
                          {form.email}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <span className="block text-[10px] sm:text-xs uppercase text-[#737687] font-semibold mb-1">
                          Company Account
                        </span>

                        <p className="text-[#232323] font-medium break-words">
                          {form.companyName || "N/A"}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <span className="block text-[10px] sm:text-xs uppercase text-[#737687] font-semibold mb-1">
                          Phone
                        </span>

                        <p className="text-[#232323] font-medium break-words">
                          {form.phone || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT */}
            {step === 3 && (
              <div>
                <InstagramPreviewCard
                  form={form}
                  generationResult={
                    generationResult
                      ? {
                          ...generationResult,
                          content: maskCaption(generationResult.content),
                        }
                      : null
                  }
                  previewUrl={
                    previewUrl ??
                    "https://pixcity-prod-planning.s3.eu-west-2.amazonaws.com/11369_61762_11968_6984913bb1d74.png"
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
