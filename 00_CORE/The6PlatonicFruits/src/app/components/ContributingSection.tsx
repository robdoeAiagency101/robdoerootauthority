import React from 'react';

const STEPS = [
  {
    id: 'fork',
    num: '01',
    title: 'Fork & Branch',
    desc: 'Fork the repository and create a feature branch from main.',
    code: 'git checkout -b feature/your-improvement',
  },
  {
    id: 'commit',
    num: '02',
    title: 'Commit Changes',
    desc: 'Make your changes with clear, focused commits.',
    code: 'git commit -m "feat: add tile verification endpoint"',
  },
  {
    id: 'test',
    num: '03',
    title: 'Run Tests',
    desc: 'Ensure existing tests pass before opening a PR.',
    code: 'docker-compose run --rm test',
  },
  {
    id: 'pr',
    num: '04',
    title: 'Open Pull Request',
    desc: 'Open a pull request against main with a clear description of your change. A maintainer will review and merge once CI checks pass.',
    code: '# PR against: main branch',
  },
];

export default function ContributingSection() {
  return (
    <section id="contributing" className="py-20 border-t border-border">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        <div className="mb-10">
          <div className="section-header-terminal mb-3">Contributing</div>
          <h2 className="text-xl font-bold text-terminal-green tracking-wide font-mono">
            JOIN THE VERIFICATION NETWORK
          </h2>
          <p className="text-muted-foreground text-sm font-mono mt-2 max-w-2xl">
            For major design changes, please open an issue first to discuss the approach before investing in implementation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-0 border border-border mb-8">
          {STEPS?.map((step, i) => (
            <div
              key={`contrib-step-${step?.id}`}
              className={`p-5 flex flex-col gap-3 border-b border-r border-border hover:bg-terminal-green/3 transition-colors ${
                i === 3 ? 'border-r-0' : ''
              } xl:border-b-0`}
            >
              <div className="flex items-center gap-2">
                <span className="text-terminal-green font-mono font-bold text-xs tabular-nums">
                  [{step?.num}]
                </span>
                <h3 className="text-sm font-mono font-bold text-terminal-green">
                  {step?.title}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground font-mono leading-relaxed flex-1">
                {step?.desc}
              </p>
              <div className="code-block p-2.5">
                <code className="text-2xs text-terminal-green font-mono">
                  {step?.code}
                </code>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-border p-5 bg-terminal-surface1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-sm font-mono font-bold text-terminal-green mb-1">
              MIT License — The atmospheric truth belongs to everyone.
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              Open source. Open verification. Open sky.
            </div>
          </div>
          <a
            href="https://github.com/AiTenetAgency101/atmospheric-truth-layer"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-terminal text-xs py-2.5 px-5 shrink-0"
          >
            View on GitHub →
          </a>
        </div>
      </div>
    </section>
  );
}