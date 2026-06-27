# RobDoe — Technical Copilot Instructions (Repo layout & entrypoints)

Purpose: give Copilot/agents a short, precise map of the repository layout and the canonical entrypoints/operators to run or inspect.

Top-level layout (high-level):
- AiAgency101.labs-engine-core — core engine runtime and libraries (primary code to run the execution lattice).
- AiAgency101.labs-agents-core / -orchestrator / -workers — agent implementations and orchestration layers.
- AiAgency101.labs-api-gateway, _api-internal, _api-public — API surface and gateway code.
- tests/ — integration and operational scripts, many are PowerShell/py wrappers.
- scripts/ and tools/ — assorted administrative and helper scripts.
- activation.ps1, activate.ps1, engine.ps1, engine-runner.ps1, agency.cmd, run.ps1 — canonical operator entrypoints.

Canonical entrypoint commands (Windows / PowerShell):
- Activation environment:  powershell -ExecutionPolicy Bypass -File ./activate.ps1  (or ./activation.ps1 when present)
- Start core engine:       powershell -ExecutionPolicy Bypass -File ./engine.ps1
- Run engine runner:      powershell -ExecutionPolicy Bypass -File ./engine-runner.ps1
- Operator console:       .\agency.cmd  (double-click or run from cmd/powershell)
- Generic runner:         powershell -ExecutionPolicy Bypass -File ./run.ps1

Running tests / single test guidance:
- Tests are scripted; run a single script directly with PowerShell:  powershell -ExecutionPolicy Bypass -File .\tests\<script>.ps1
- For Python helpers, run the specific test file (e.g., python tests\engine_core...py) — there is no unified test runner.

What Copilot sessions should and should NOT edit:
- SHOULD: scripts/, AiAgency101.labs-engine-core (bug fixes, small refactors), and tests/ when adding/repairing checks.
- SHOULD NOT: top-level policy/artifacts/activation.state files, LICENSE, or large generated artifacts in Artifacts/ without explicit user approval.

Notes from session history: no recent Copilot sessions were found for this repository in the cloud store. If agents will be used, prefer making small, verifiable edits and include a one-line test command in the same PR.

Need other sections (build/test commands, environment setup, CI rules)? Reply and a more detailed instructions file will be added.

---

Recommended additions (applied per user request):

1) Single-test commands (concrete examples)
- PowerShell scripted tests: powershell -ExecutionPolicy Bypass -File .\tests\RobDoeAi-GlobalInstall.ps1
- Run a specific test script: powershell -ExecutionPolicy Bypass -File .\tests\mesh-engine.ps1
- Python helpers: python .\tests\engine_core.engine_agent.py  (run the file directly when it’s a script)

Why: many tests are standalone scripts; providing exact examples avoids trial-and-error during verification.

2) Entrypoint cheat-sheet (quick notes)
- Use ExecutionPolicy Bypass for local operator runs when required.
- Activation: powershell -ExecutionPolicy Bypass -File .\activate.ps1
- Start engine: powershell -ExecutionPolicy Bypass -File .\engine.ps1
- Runner: powershell -ExecutionPolicy Bypass -File .\engine-runner.ps1

Why: reduces mistakes when agents suggest commands or run scripts.

3) Agent edit & PR checklist (short, copyable)
- Make small focused commits limited to one area (scripts/, AiAgency101.labs-engine-core, or tests/).
- Include one-line verification command in PR description (the exact command to run locally).
- Don’t edit generated artifacts in Artifacts/ or activation/state files without explicit review.
- Tag PRs with: "area:scripts" or "area:engine-core" for maintainers.

Why: enforces small, verifiable changes and speeds human review.

4) Smoke-test / CI verification guidance
- For a quick smoke test after a change: run one of the canonical scripts that starts core behavior (e.g., .\tests\mesh-engine.ps1 or .\tests\RobDoeAi-GlobalInstall.ps1).
- Suggest adding a lightweight CI job that runs a single smoke script on PRs to catch obvious breaking changes.

Why: many failures are due to runtime/startup regressions; a single smoke-test reduces iteration.

---

If you want, these sections can also be merged into the main .github/copilot-instructions.md (manifest) or placed in a third file; tell me which and I'll apply the change.
