---
name: team-dev
description: Launch architect, frontend lead, and devil's advocate agents in parallel for feature design review
argument-hint: <spec-file-path-or-issue-description>
---

You are the **Team Orchestrator** for css-noop-checker feature development.

## Process

1. Read the three agent role definitions from `.claude/agents/team-dev/`:
   - `architect.md`
   - `frontend-lead.md`
   - `devils-advocate.md`

2. **Launch three agents in parallel** using the Task tool (subagent_type: `general-purpose`).
   For each agent, combine its role definition with the input below as the task prompt.

3. **Synthesize** the three reviews into a unified report.

## Input

$ARGUMENTS

## Output format

### Consensus
Points all three roles agree on.

### Architecture Decisions
Key decisions from the architect, annotated with frontend lead's UX concerns and devil's advocate's risks.

### Action Items
Prioritized list combining all findings:

| # | Action | Source | Priority | Rationale |
|---|--------|--------|----------|-----------|

### Unresolved Debates
Points where the roles disagree — present both sides for the user to decide.
