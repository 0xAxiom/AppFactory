"use client";

import { useState } from "react";
import { generateQuestions, generateConfig } from "./actions";

type Step = 1 | 2 | 3 | 4;

interface AgentConfig {
  agentName: string;
  emoji: string;
  soul: string;
  agents: string;
  heartbeat: string;
  identity: string;
  config: string;
  setup: string;
  readme: string;
  skills: string[];
}

export default function ClawPipeline() {
  const [step, setStep] = useState<Step>(1);
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [agentConfig, setAgentConfig] = useState<AgentConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDescribe() {
    if (!description.trim()) return;
    setLoading(true);
    setError("");
    try {
      const { questions: q } = await generateQuestions(description);
      setQuestions(q);
      setAnswers(new Array(q.length).fill(""));
      setStep(2);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate questions");
    } finally {
      setLoading(false);
    }
  }

  async function handleAnswers() {
    setLoading(true);
    setError("");
    try {
      const config = await generateConfig(description, answers);
      setAgentConfig(config);
      setStep(3);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate config");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!agentConfig) return;
    setLoading(true);
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    const folder = zip.folder(agentConfig.agentName)!;

    folder.file("SOUL.md", agentConfig.soul);
    folder.file("AGENTS.md", agentConfig.agents);
    folder.file("HEARTBEAT.md", agentConfig.heartbeat);
    folder.file("IDENTITY.md", agentConfig.identity);
    folder.file("USER.md", `# USER.md\n\nTell your agent about yourself here.\n\n- **Name:** \n- **Role:** \n- **Preferences:** \n- **Timezone:** \n`);
    folder.file("TOOLS.md", `# TOOLS.md\n\nLocal tool configuration and notes.\n\n---\n\n## Not Yet Configured\n\nAdd tool-specific notes as you set things up.\n`);
    folder.file("MEMORY.md", `# MEMORY.md\n\nLong-term memory. Your agent will read this every session.\n\n---\n\n*Nothing here yet. Your agent will fill this in over time.*\n`);
    folder.file("config.yaml", agentConfig.config);
    folder.file("setup.sh", agentConfig.setup);
    folder.file("README.md", agentConfig.readme);

    const skillsFolder = folder.folder("skills")!;
    for (const skill of agentConfig.skills) {
      skillsFolder.file(
        `${skill}/SKILL.md`,
        `# ${skill}\n\nInstall: \`npx openclaw skills add ${skill}\`\n`
      );
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${agentConfig.agentName}.zip`;
    a.click();
    URL.revokeObjectURL(url);
    setStep(4);
    setLoading(false);
  }

  return (
    <div className="min-h-[80vh] flex flex-col">
      {/* Progress bar */}
      <div className="border-b border-[#262626] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[15px] font-semibold tracking-tight">Claw Pipeline</span>
            <span className="text-[11px] font-mono text-[#737373] border border-[#262626] px-1.5 py-0.5 rounded">
              v1.0
            </span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-8 h-1 rounded-full transition-colors duration-200 ${
                  s <= step ? "bg-[#e5e5e5]" : "bg-[#262626]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center pt-16 pb-24 px-6">
        <div className="w-full max-w-2xl">
          {error && (
            <div className="mb-6 px-4 py-3 border border-[#ef4444]/30 bg-[#ef4444]/5 rounded-lg text-[13px] text-[#ef4444]">
              {error}
            </div>
          )}

          {/* Step 1: Describe */}
          {step === 1 && (
            <div>
              <p className="text-[#737373] text-[13px] font-mono mb-2">01 / describe</p>
              <h1 className="text-[32px] font-semibold tracking-tight leading-tight mb-2">
                What should your agent do?
              </h1>
              <p className="text-[#a3a3a3] text-[15px] mb-8">
                Describe your ideal AI agent. What it does, how it behaves, what tools it needs.
              </p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. I want a trading assistant that monitors crypto prices on Solana, alerts me on Telegram when there are big moves, and can execute swaps on my behalf..."
                className="w-full h-40 bg-[#111111] border border-[#262626] rounded-lg px-4 py-3 text-[14px] text-[#e5e5e5] placeholder:text-[#525252] focus:outline-none focus:border-[#404040] resize-none transition-colors"
              />
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleDescribe}
                  disabled={!description.trim() || loading}
                  className="px-5 py-2.5 bg-[#e5e5e5] text-[#0a0a0a] text-[14px] font-medium rounded-md hover:bg-[#d4d4d4] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Analyzing..." : "Continue"}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Questions */}
          {step === 2 && (
            <div>
              <p className="text-[#737373] text-[13px] font-mono mb-2">02 / configure</p>
              <h1 className="text-[32px] font-semibold tracking-tight leading-tight mb-2">
                A few more details
              </h1>
              <p className="text-[#a3a3a3] text-[15px] mb-8">
                Help us fine-tune your agent&apos;s setup.
              </p>
              <div className="space-y-5">
                {questions.map((q, i) => (
                  <div key={i} className="bg-[#111111] border border-[#262626] rounded-lg p-5">
                    <label className="block text-[14px] text-[#e5e5e5] mb-3">{q}</label>
                    <input
                      type="text"
                      value={answers[i]}
                      onChange={(e) => {
                        const next = [...answers];
                        next[i] = e.target.value;
                        setAnswers(next);
                      }}
                      placeholder="Your answer..."
                      className="w-full bg-[#0a0a0a] border border-[#262626] rounded-md px-3 py-2 text-[14px] text-[#e5e5e5] placeholder:text-[#525252] focus:outline-none focus:border-[#404040] transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 text-[14px] text-[#a3a3a3] hover:text-[#e5e5e5] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleAnswers}
                  disabled={loading}
                  className="px-5 py-2.5 bg-[#e5e5e5] text-[#0a0a0a] text-[14px] font-medium rounded-md hover:bg-[#d4d4d4] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Generating..." : "Generate Agent"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {step === 3 && agentConfig && (
            <div>
              <p className="text-[#737373] text-[13px] font-mono mb-2">03 / preview</p>
              <h1 className="text-[32px] font-semibold tracking-tight leading-tight mb-2">
                {agentConfig.emoji} {agentConfig.agentName}
              </h1>
              <p className="text-[#a3a3a3] text-[15px] mb-8">
                Review your agent&apos;s configuration before downloading.
              </p>

              <div className="space-y-4">
                <PreviewSection title="SOUL.md" content={agentConfig.soul} />
                <PreviewSection title="IDENTITY.md" content={agentConfig.identity} />
                <PreviewSection title="HEARTBEAT.md" content={agentConfig.heartbeat} />
                <PreviewSection title="config.yaml" content={agentConfig.config} />
                {agentConfig.skills.length > 0 && (
                  <div className="bg-[#111111] border border-[#262626] rounded-lg p-5">
                    <h3 className="text-[13px] font-mono text-[#737373] mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {agentConfig.skills.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 text-[12px] font-mono bg-[#0a0a0a] border border-[#262626] rounded text-[#a3a3a3]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <PreviewSection title="setup.sh" content={agentConfig.setup} />
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 text-[14px] text-[#a3a3a3] hover:text-[#e5e5e5] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleDownload}
                  disabled={loading}
                  className="px-5 py-2.5 bg-[#e5e5e5] text-[#0a0a0a] text-[14px] font-medium rounded-md hover:bg-[#d4d4d4] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Packaging..." : "Download .zip"}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Done */}
          {step === 4 && agentConfig && (
            <div className="text-center pt-12">
              <p className="text-[64px] mb-4">{agentConfig.emoji}</p>
              <h1 className="text-[32px] font-semibold tracking-tight mb-2">
                {agentConfig.agentName} is ready
              </h1>
              <p className="text-[#a3a3a3] text-[15px] mb-8 max-w-md mx-auto">
                Unzip the file, run <code className="font-mono text-[13px] text-[#e5e5e5] bg-[#111111] px-1.5 py-0.5 rounded">./setup.sh</code>, and your agent will be live.
              </p>
              <div className="bg-[#111111] border border-[#262626] rounded-lg p-6 max-w-sm mx-auto text-left font-mono text-[13px] text-[#a3a3a3] space-y-1">
                <p><span className="text-[#737373]">$</span> unzip {agentConfig.agentName}.zip</p>
                <p><span className="text-[#737373]">$</span> cd {agentConfig.agentName}</p>
                <p><span className="text-[#737373]">$</span> chmod +x setup.sh</p>
                <p><span className="text-[#737373]">$</span> ./setup.sh</p>
              </div>
              <div className="mt-10 flex justify-center gap-4">
                <button
                  onClick={handleDownload}
                  className="px-4 py-2.5 border border-[#333333] text-[14px] text-[#a3a3a3] rounded-md hover:text-[#e5e5e5] hover:border-[#404040] transition-colors"
                >
                  Download again
                </button>
                <button
                  onClick={() => {
                    setStep(1);
                    setDescription("");
                    setQuestions([]);
                    setAnswers([]);
                    setAgentConfig(null);
                  }}
                  className="px-4 py-2.5 text-[14px] text-[#737373] hover:text-[#a3a3a3] transition-colors"
                >
                  Build another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewSection({ title, content }: { title: string; content: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#111111] border border-[#262626] rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 hover:bg-[#1a1a1a] transition-colors"
      >
        <span className="text-[13px] font-mono text-[#737373]">{title}</span>
        <span className="text-[#525252] text-[12px]">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <pre className="px-5 pb-4 text-[12px] font-mono text-[#a3a3a3] whitespace-pre-wrap overflow-x-auto leading-relaxed border-t border-[#1a1a1a]">
          {content}
        </pre>
      )}
    </div>
  );
}
