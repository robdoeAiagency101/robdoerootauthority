import React from 'react';

const USE_CASES = [
  {
    id: 'disaster',
    icon: '⚠',
    title: 'Disaster Response',
    color: 'text-red-400',
    borderColor: 'border-red-500/20',
    bgColor: 'bg-red-500/5',
    desc: 'First responders and emergency agencies obtain cryptographically-verified atmospheric data for evacuation routing and resource allocation.',
    link: 'USE_CASES.md#disaster-response',
  },
  {
    id: 'aviation',
    icon: '▲',
    title: 'Aviation Safety',
    color: 'text-blue-400',
    borderColor: 'border-blue-500/20',
    bgColor: 'bg-blue-500/5',
    desc: 'Airlines and airspace managers verify weather grid readings before critical flight decisions with independently auditable proof.',
    link: 'USE_CASES.md#aviation',
  },
  {
    id: 'climate',
    icon: '◈',
    title: 'Climate Research',
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/20',
    bgColor: 'bg-cyan-500/5',
    desc: 'Academics access tamper-proof, append-only historical atmospheric records free from institutional revision or political interference.',
    link: 'USE_CASES.md#climate-research',
  },
  {
    id: 'assistive',
    icon: '◎',
    title: 'Assistive Technology',
    color: 'text-purple-400',
    borderColor: 'border-purple-500/20',
    bgColor: 'bg-purple-500/5',
    desc: 'Applications for visually impaired users announce verified air-quality and storm warnings backed by cryptographic confidence scores.',
    link: 'USE_CASES.md#assistive-tech',
  },
  {
    id: 'insurance',
    icon: '≡',
    title: 'Insurance & Reinsurance',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/20',
    bgColor: 'bg-amber-500/5',
    desc: 'Parametric insurance contracts settle automatically against independently confirmed, tamper-evident weather events. No disputes. No adjusters.',
    link: 'USE_CASES.md#insurance',
  },
  {
    id: 'agriculture',
    icon: '⬡',
    title: 'Agriculture',
    color: 'text-green-400',
    borderColor: 'border-green-500/20',
    bgColor: 'bg-green-500/5',
    desc: 'Precision farming platforms consume authenticated satellite data for irrigation scheduling and harvest timing decisions.',
    link: 'USE_CASES.md#agriculture',
  },
  {
    id: 'energy',
    icon: '⊙',
    title: 'Renewable Energy',
    color: 'text-yellow-400',
    borderColor: 'border-yellow-500/20',
    bgColor: 'bg-yellow-500/5',
    desc: 'Wind and solar operators optimize grid dispatch using multi-satellite verified atmospheric data, reducing curtailment and maximizing yield.',
    link: 'USE_CASES.md#renewable-energy',
  },
];

export default function UseCasesGrid() {
  return (
    <section id="use-cases" className="py-20 border-t border-border">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        <div className="mb-10">
          <div className="section-header-terminal mb-3">Use Cases</div>
          <h2 className="text-xl font-bold text-terminal-green tracking-wide font-mono">
            VERIFIED ATMOSPHERIC TRUTH IN ACTION
          </h2>
          <p className="text-muted-foreground text-sm font-mono mt-2 max-w-2xl">
            Seven sectors where cryptographic weather verification creates measurable value. See USE_CASES.md for detailed scenarios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-0 border border-border">
          {USE_CASES?.map((uc, i) => (
            <div
              key={`usecase-${uc?.id}`}
              className={`p-5 flex flex-col gap-3 border-b border-r border-border hover:bg-terminal-green/3 transition-colors group ${
                i % 4 === 3 ? '2xl:border-r-0' : ''
              } ${i % 3 === 2 ? 'xl:border-r-0 2xl:border-r border-border' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-xl ${uc?.color} group-hover:scale-110 transition-transform`}>
                  {uc?.icon}
                </span>
                <h3 className={`text-sm font-mono font-bold ${uc?.color}`}>
                  {uc?.title}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground font-mono leading-relaxed flex-1">
                {uc?.desc}
              </p>
              <a
                href={`#${uc?.link}`}
                className="text-2xs font-mono text-muted-foreground hover:text-terminal-green transition-colors tracking-wider"
              >
                → {uc?.link}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}