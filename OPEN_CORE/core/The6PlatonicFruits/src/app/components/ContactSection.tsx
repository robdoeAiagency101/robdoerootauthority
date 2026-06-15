import React from 'react';

const CONTACT_ITEMS = [
  {
    id: 'bugs',
    icon: '⚠',
    title: 'Bug Reports & Feature Requests',
    desc: 'Found an issue or have an idea? Open an issue on GitHub.',
    action: 'Open an Issue',
    href: 'https://github.com/AiTenetAgency101/atmospheric-truth-layer/issues',
    color: 'text-red-400',
    borderColor: 'border-red-500/20',
    bgColor: 'bg-red-500/5',
  },
  {
    id: 'discuss',
    icon: '◉',
    title: 'Questions & Discussion',
    desc: 'General questions, design discussions, and community interaction.',
    action: 'Start a Discussion',
    href: 'https://github.com/AiTenetAgency101/atmospheric-truth-layer/discussions',
    color: 'text-terminal-green',
    borderColor: 'border-terminal-green/20',
    bgColor: 'bg-terminal-green/5',
  },
  {
    id: 'security',
    icon: '◆',
    title: 'Security Vulnerabilities',
    desc: 'Please open a private security advisory rather than a public issue. Responsible disclosure is appreciated.',
    action: 'Private Advisory',
    href: 'https://github.com/AiTenetAgency101/atmospheric-truth-layer/security/advisories/new',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/20',
    bgColor: 'bg-amber-500/5',
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 border-t border-border">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        <div className="mb-10">
          <div className="section-header-terminal mb-3">Contact &amp; Support</div>
          <h2 className="text-xl font-bold text-terminal-green tracking-wide font-mono">
            GET IN TOUCH
          </h2>
          <p className="text-muted-foreground text-sm font-mono mt-2 max-w-2xl">
            All communication happens through GitHub. Transparent by default.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-border">
          {CONTACT_ITEMS?.map((item, i) => (
            <div
              key={`contact-${item?.id}`}
              className={`p-6 flex flex-col gap-4 border-b border-r border-border hover:bg-terminal-green/3 transition-colors group ${
                i === 2 ? 'border-r-0' : ''
              } lg:border-b-0`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-xl ${item?.color} group-hover:scale-110 transition-transform`}>
                  {item?.icon}
                </span>
                <h3 className={`text-sm font-mono font-bold ${item?.color}`}>
                  {item?.title}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground font-mono leading-relaxed flex-1">
                {item?.desc}
              </p>
              <a
                href={item?.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-terminal-ghost text-2xs py-2 px-4 self-start border ${item?.borderColor} ${item?.color} hover:bg-transparent`}
              >
                → {item?.action}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}