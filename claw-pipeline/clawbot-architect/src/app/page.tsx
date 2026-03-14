'use client';

import { useState, useCallback } from 'react';

const PERSONALITY_TRAITS = [
  'Friendly',
  'Professional',
  'Witty',
  'Direct',
  'Empathetic',
  'Analytical',
  'Creative',
  'Stoic',
  'Energetic',
  'Philosophical',
  'Sarcastic',
  'Nurturing',
  'Provocative',
  'Calm',
];

const SKILL_CATEGORIES = [
  {
    id: 'crypto',
    label: 'Crypto / DeFi',
    icon: '◆',
    skills: [
      'Base Trading',
      'Wallet Monitor',
      'Token Analysis',
      'Gas Tracking',
      'DEX Aggregation',
    ],
  },
  {
    id: 'search',
    label: 'Web Search',
    icon: '⊕',
    skills: [
      'Neural Search (Exa)',
      'Web Scraping',
      'Content Summary',
      'News Monitor',
    ],
  },
  {
    id: 'social',
    label: 'Social',
    icon: '◎',
    skills: ['Twitter/X', 'Farcaster', 'Telegram Bot', 'Discord Bot'],
  },
  {
    id: 'creative',
    label: 'Creative',
    icon: '△',
    skills: ['Image Gen', 'Text-to-Speech', 'Music Gen', 'Video Frames'],
  },
  {
    id: 'data',
    label: 'Data & Analysis',
    icon: '▦',
    skills: [
      'Stock Analysis',
      'Backtesting',
      'Portfolio Track',
      'Market Signals',
    ],
  },
  {
    id: 'infra',
    label: 'Infrastructure',
    icon: '⬡',
    skills: ['Health Monitor', 'Security Scan', 'Web Monitor', 'Auto-Deploy'],
  },
];

const PLATFORMS = [
  { id: 'telegram', label: 'Telegram', color: '#2563eb' },
  { id: 'discord', label: 'Discord', color: '#5865F2' },
  { id: 'slack', label: 'Slack', color: '#4A154B' },
  { id: 'whatsapp', label: 'WhatsApp', color: '#25D366' },
  { id: 'signal', label: 'Signal', color: '#3A76F0' },
  { id: 'cli', label: 'CLI', color: '#888888' },
];

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export default function Home() {
  const [agentName, setAgentName] = useState('');
  const [agentRole, setAgentRole] = useState('');
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [voiceTone, setVoiceTone] = useState('balanced');
  const [autonomy, setAutonomy] = useState(50);
  const [showPreview, setShowPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleTrait = (trait: string) => {
    setSelectedTraits((prev) =>
      prev.includes(trait)
        ? prev.filter((t) => t !== trait)
        : prev.length < 4
          ? [...prev, trait]
          : prev
    );
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const searchSkills = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `AI agent skill: ${searchQuery}` }),
      });
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch {
      setSearchResults([]);
    }
    setSearching(false);
  }, [searchQuery]);

  const generateSoulMd = () => {
    const name = agentName || 'Unnamed Agent';
    const role = agentRole || 'A helpful AI assistant';
    const traits = selectedTraits.length
      ? selectedTraits.join(', ')
      : 'Balanced';
    const skills = selectedSkills.length
      ? selectedSkills.map((s) => `- ${s}`).join('\n')
      : '- General assistance';
    const platforms = selectedPlatforms.length
      ? selectedPlatforms.join(', ')
      : 'CLI';
    const toneDesc =
      voiceTone === 'formal'
        ? 'Professional and measured. Uses complete sentences.'
        : voiceTone === 'casual'
          ? 'Relaxed and conversational. Uses contractions freely.'
          : voiceTone === 'technical'
            ? 'Precise and data-driven. Prefers specifics over abstractions.'
            : "Clear and adaptable. Matches the user's energy.";
    const autoDesc =
      autonomy < 25
        ? 'Conservative — always asks before acting'
        : autonomy < 50
          ? 'Cautious — asks for significant actions, handles routine independently'
          : autonomy < 75
            ? 'Balanced — acts independently on most tasks, confirms for irreversible actions'
            : 'Autonomous — acts first, reports after. Only asks for truly critical decisions';

    return `# SOUL.md — ${name}

## Identity
**Name:** ${name}
**Role:** ${role}
**Personality:** ${traits}

## Voice
${toneDesc}

## Skills
${skills}

## Platforms
${platforms}

## Autonomy
${autoDesc} (Level: ${autonomy}%)

## Rules
- Always verify before stating facts
- Never share user data externally
- Ask first for irreversible actions
- Be helpful, be honest, be safe

---
*Generated by Clawbot Architect — appfactory.fun*
`;
  };

  const copyConfig = () => {
    navigator.clipboard.writeText(generateSoulMd());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const completeness = Math.min(
    100,
    (agentName ? 20 : 0) +
      (agentRole ? 20 : 0) +
      (selectedTraits.length > 0 ? 20 : 0) +
      (selectedSkills.length > 0 ? 20 : 0) +
      (selectedPlatforms.length > 0 ? 20 : 0)
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ background: 'var(--accent)', color: 'white' }}
            >
              ⚡
            </div>
            <div>
              <h1
                className="text-base font-semibold"
                style={{ color: 'var(--text)' }}
              >
                Clawbot Architect
              </h1>
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                AI Agent Design Studio
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className="text-xs mono"
                style={{ color: 'var(--text-muted)' }}
              >
                Config {completeness}%
              </div>
              <div
                className="w-24 h-1.5 rounded-full overflow-hidden"
                style={{ background: 'var(--surface-2)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${completeness}%`,
                    background:
                      completeness === 100 ? 'var(--success)' : 'var(--accent)',
                  }}
                />
              </div>
            </div>
            <a
              href="https://appfactory.fun"
              target="_blank"
              className="text-xs px-3 py-1.5 rounded-md transition-colors"
              style={{
                background: 'var(--surface-2)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border)',
              }}
            >
              AppFactory ↗
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column — Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Identity */}
            <Section title="Identity" subtitle="Who is your agent?">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="text-xs mb-1.5 block"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Agent Name
                  </label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="e.g., Axiom"
                    className="w-full px-3 py-2 rounded-md text-sm outline-none transition-colors"
                    style={{
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                    }}
                  />
                </div>
                <div>
                  <label
                    className="text-xs mb-1.5 block"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Role / Mission
                  </label>
                  <input
                    type="text"
                    value={agentRole}
                    onChange={(e) => setAgentRole(e.target.value)}
                    placeholder="e.g., DeFi research assistant on Base"
                    className="w-full px-3 py-2 rounded-md text-sm outline-none transition-colors"
                    style={{
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                    }}
                  />
                </div>
              </div>
            </Section>

            {/* Personality */}
            <Section title="Personality" subtitle="Pick up to 4 traits">
              <div className="flex flex-wrap gap-2">
                {PERSONALITY_TRAITS.map((trait) => {
                  const active = selectedTraits.includes(trait);
                  return (
                    <button
                      key={trait}
                      onClick={() => toggleTrait(trait)}
                      className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                      style={{
                        background: active
                          ? 'var(--accent)'
                          : 'var(--surface-2)',
                        color: active ? 'white' : 'var(--text-muted)',
                        border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                      }}
                    >
                      {trait}
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* Voice */}
            <Section
              title="Voice & Tone"
              subtitle="How your agent communicates"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'formal', label: 'Formal' },
                  { id: 'balanced', label: 'Balanced' },
                  { id: 'casual', label: 'Casual' },
                  { id: 'technical', label: 'Technical' },
                ].map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setVoiceTone(tone.id)}
                    className="px-3 py-2 rounded-md text-xs font-medium transition-all"
                    style={{
                      background:
                        voiceTone === tone.id
                          ? 'var(--accent)'
                          : 'var(--surface-2)',
                      color:
                        voiceTone === tone.id ? 'white' : 'var(--text-muted)',
                      border: `1px solid ${voiceTone === tone.id ? 'var(--accent)' : 'var(--border)'}`,
                    }}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </Section>

            {/* Autonomy */}
            <Section
              title="Autonomy Level"
              subtitle="How independently your agent acts"
            >
              <div className="space-y-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={autonomy}
                  onChange={(e) => setAutonomy(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div
                  className="flex justify-between text-xs"
                  style={{ color: 'var(--text-dim)' }}
                >
                  <span>Conservative</span>
                  <span className="mono" style={{ color: 'var(--accent)' }}>
                    {autonomy}%
                  </span>
                  <span>Autonomous</span>
                </div>
              </div>
            </Section>

            {/* Skills */}
            <Section
              title="Skills & Capabilities"
              subtitle="What your agent can do"
            >
              <div className="space-y-4">
                {SKILL_CATEGORIES.map((cat) => (
                  <div key={cat.id}>
                    <div
                      className="text-xs font-medium mb-2 flex items-center gap-2"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <span className="mono">{cat.icon}</span> {cat.label}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map((skill) => {
                        const active = selectedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            onClick={() => toggleSkill(skill)}
                            className="px-3 py-1.5 rounded-md text-xs transition-all"
                            style={{
                              background: active
                                ? 'var(--surface-2)'
                                : 'var(--surface)',
                              color: active
                                ? 'var(--success)'
                                : 'var(--text-dim)',
                              border: `1px solid ${active ? 'var(--success)' : 'var(--border)'}`,
                            }}
                          >
                            {active ? '✓ ' : ''}
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Exa Search */}
                <div
                  className="pt-3 border-t"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div
                    className="text-xs font-medium mb-2 flex items-center gap-2"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <span className="mono">⊕</span> Discover Skills (Exa Neural
                    Search)
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && searchSkills()}
                      placeholder="Search for agent skills..."
                      className="flex-1 px-3 py-2 rounded-md text-xs outline-none"
                      style={{
                        background: 'var(--surface-2)',
                        border: '1px solid var(--border)',
                        color: 'var(--text)',
                      }}
                    />
                    <button
                      onClick={searchSkills}
                      disabled={searching}
                      className="px-4 py-2 rounded-md text-xs font-medium transition-colors"
                      style={{ background: 'var(--accent)', color: 'white' }}
                    >
                      {searching ? '...' : 'Search'}
                    </button>
                  </div>
                  {searchResults.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {searchResults.map((r, i) => (
                        <a
                          key={i}
                          href={r.url}
                          target="_blank"
                          className="block p-3 rounded-md transition-colors"
                          style={{
                            background: 'var(--surface-2)',
                            border: '1px solid var(--border)',
                          }}
                        >
                          <div
                            className="text-xs font-medium"
                            style={{ color: 'var(--text)' }}
                          >
                            {r.title}
                          </div>
                          <div
                            className="text-xs mt-1"
                            style={{ color: 'var(--text-dim)' }}
                          >
                            {r.snippet}
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Section>

            {/* Platforms */}
            <Section
              title="Deployment Targets"
              subtitle="Where your agent lives"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PLATFORMS.map((p) => {
                  const active = selectedPlatforms.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => togglePlatform(p.id)}
                      className="px-4 py-3 rounded-md text-xs font-medium transition-all flex items-center gap-2"
                      style={{
                        background: active
                          ? 'var(--surface-2)'
                          : 'var(--surface)',
                        color: active ? 'var(--text)' : 'var(--text-dim)',
                        border: `1px solid ${active ? p.color : 'var(--border)'}`,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: active ? p.color : 'var(--border)',
                        }}
                      />
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </Section>
          </div>

          {/* Right Column — Preview & Export */}
          <div className="space-y-6">
            {/* Agent Card */}
            <div
              className="rounded-lg overflow-hidden sticky top-6"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
            >
              <div
                className="p-4 border-b"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="text-xs font-medium"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Agent Preview
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background:
                          completeness === 100
                            ? 'var(--success)'
                            : 'var(--warning)',
                      }}
                    />
                    <span
                      className="text-xs mono"
                      style={{
                        color:
                          completeness === 100
                            ? 'var(--success)'
                            : 'var(--warning)',
                      }}
                    >
                      {completeness === 100 ? 'Ready' : 'Draft'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                    style={{
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {agentName ? agentName[0]?.toUpperCase() : '?'}
                  </div>
                  <div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: 'var(--text)' }}
                    >
                      {agentName || 'Unnamed Agent'}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: 'var(--text-dim)' }}
                    >
                      {agentRole || 'No role defined'}
                    </div>
                  </div>
                </div>
                {selectedTraits.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {selectedTraits.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          background: 'var(--surface-2)',
                          color: 'var(--accent)',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {selectedSkills.length > 0 && (
                  <div
                    className="text-xs mt-2"
                    style={{ color: 'var(--text-dim)' }}
                  >
                    {selectedSkills.length} skill
                    {selectedSkills.length !== 1 ? 's' : ''} configured
                  </div>
                )}
                {selectedPlatforms.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {selectedPlatforms.map((id) => {
                      const p = PLATFORMS.find((x) => x.id === id);
                      return (
                        <span
                          key={id}
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            background: 'var(--surface-2)',
                            color: p?.color,
                          }}
                        >
                          {p?.label}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Stat Grid */}
              <div
                className="grid grid-cols-3 divide-x"
                style={{ borderColor: 'var(--border)' }}
              >
                {[
                  { label: 'Traits', value: selectedTraits.length, max: 4 },
                  { label: 'Skills', value: selectedSkills.length, max: '' },
                  { label: 'Deploy', value: selectedPlatforms.length, max: '' },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="p-3 text-center"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div
                      className="text-lg font-semibold mono"
                      style={{ color: 'var(--text)' }}
                    >
                      {s.value}
                      {s.max ? (
                        <span style={{ color: 'var(--text-dim)' }}>
                          /{s.max}
                        </span>
                      ) : (
                        ''
                      )}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: 'var(--text-dim)' }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div
                className="p-4 space-y-2 border-t"
                style={{ borderColor: 'var(--border)' }}
              >
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full px-4 py-2.5 rounded-md text-xs font-medium transition-colors"
                  style={{
                    background: showPreview
                      ? 'var(--surface-2)'
                      : 'var(--accent)',
                    color: showPreview ? 'var(--text-muted)' : 'white',
                    border: `1px solid ${showPreview ? 'var(--border)' : 'var(--accent)'}`,
                  }}
                >
                  {showPreview ? 'Hide SOUL.md' : 'Preview SOUL.md'}
                </button>
                <button
                  onClick={copyConfig}
                  className="w-full px-4 py-2.5 rounded-md text-xs font-medium transition-colors"
                  style={{
                    background: copied ? 'var(--success)' : 'var(--surface-2)',
                    color: copied ? 'white' : 'var(--text-muted)',
                    border: `1px solid ${copied ? 'var(--success)' : 'var(--border)'}`,
                  }}
                >
                  {copied ? '✓ Copied!' : 'Copy Config'}
                </button>
              </div>
            </div>

            {/* SOUL.md Preview */}
            {showPreview && (
              <div
                className="rounded-lg overflow-hidden"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <div
                  className="px-4 py-2 border-b flex items-center gap-2"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <span
                    className="text-xs mono"
                    style={{ color: 'var(--text-dim)' }}
                  >
                    SOUL.md
                  </span>
                </div>
                <pre
                  className="p-4 text-xs overflow-auto max-h-96 mono"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {generateSoulMd()}
                </pre>
              </div>
            )}

            {/* Footer Info */}
            <div
              className="text-xs space-y-2 px-1"
              style={{ color: 'var(--text-dim)' }}
            >
              <p>
                Built with{' '}
                <a
                  href="https://appfactory.fun"
                  target="_blank"
                  className="underline"
                  style={{ color: 'var(--accent)' }}
                >
                  AppFactory
                </a>{' '}
                — the AI app generation protocol on Base.
              </p>
              <p>
                Skill search powered by{' '}
                <a
                  href="https://exa.ai"
                  target="_blank"
                  className="underline"
                  style={{ color: 'var(--accent)' }}
                >
                  Exa AI
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-lg p-5"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      <div className="mb-4">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
          {title}
        </h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>
          {subtitle}
        </p>
      </div>
      {children}
    </div>
  );
}
