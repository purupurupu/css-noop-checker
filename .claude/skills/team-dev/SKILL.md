---
name: team-dev
description: Implement a feature then iterate with architect, frontend lead, devil's advocate, and code reviewer reviews (×3 rounds)
argument-hint: <spec-file-path-or-issue-description>
disable-model-invocation: true
---

You are the **Team Orchestrator** for css-noop-checker feature development.

## Process

### Phase 1 — Initial Implementation

1. **Spawn an implementer** using the `Task` tool with the exact parameters below:

   ```
   Task(
     subagent_type: "general-purpose",
     model: "opus",
     description: "Implement feature: <short summary>",
     prompt: <see prompt template below>
   )
   ```

   **Implementer prompt template:**
   ```
   You are the implementer for css-noop-checker.

   ## Task
   <paste the full input context / spec here>

   ## Instructions
   1. Read CLAUDE.md for project conventions
   2. Read relevant source files in src/rules/ and src/sidebar/
   3. Implement the feature: create/modify files, write code, add tests
   4. Follow the rule ID naming convention in CLAUDE.md
   5. Add test cases to examples/test.html if adding a new rule

   ## Output
   Return a summary of:
   - Files created/modified (with paths)
   - Key design decisions
   - What tests were added
   ```

2. **Collect the implementation** — the implementer returns a summary of what was built.

### Phases 2–4 — Review → Fix (×3)

Repeat the following cycle **exactly 3 times**. Each iteration improves the implementation
through specialist review and targeted fixes.

3. **Review phase** — Spawn all four reviewer subagents **in parallel** in a single message
   with four `Task` tool calls:

   ```
   # Call 1
   Task(
     subagent_type: "architect",
     description: "Architect review round N",
     prompt: <review prompt with context>
   )

   # Call 2
   Task(
     subagent_type: "frontend-lead",
     description: "Frontend lead review round N",
     prompt: <review prompt with context>
   )

   # Call 3
   Task(
     subagent_type: "devils-advocate",
     description: "Devil's advocate review round N",
     prompt: <review prompt with context>
   )

   # Call 4
   Task(
     subagent_type: "code-reviewer",
     description: "Code review round N",
     prompt: <review prompt with context>
   )
   ```

   **NOTE:** These custom agents already have `model` defined in their YAML frontmatter
   (`architect` → opus, `frontend-lead` → sonnet, `devils-advocate` → sonnet, `code-reviewer` → sonnet).
   Do NOT pass a `model` parameter for these — it is handled automatically.

   **Reviewer prompt template** (adapt for each reviewer):
   ```
   ## Context
   <original input context / spec>

   ## Current Implementation
   <summary of what was built/changed so far>

   ## Files Changed
   <list of file paths that were created or modified>

   ## Instructions
   Review the implementation by reading the actual source files listed above.
   Produce your review in the output format defined in your system prompt.
   Focus on your area of expertise.
   ```

4. **Collect review feedback** — wait for all four reviewers to return their findings.

5. **Fix phase** — Spawn the implementer again:

   ```
   Task(
     subagent_type: "general-purpose",
     model: "opus",
     description: "Fix round N: address review feedback",
     prompt: <fix prompt with feedback>
   )
   ```

   **Fix prompt template:**
   ```
   You are the implementer for css-noop-checker.

   ## Original Task
   <original input context / spec>

   ## Review Feedback — Round N

   ### Architect
   <architect's full feedback>

   ### Frontend Lead
   <frontend lead's full feedback>

   ### Devil's Advocate
   <devil's advocate's full feedback>

   ### Code Reviewer
   <code reviewer's full feedback>

   ## Instructions
   1. Read CLAUDE.md for project conventions
   2. Address each finding: fix issues, refactor based on suggestions,
      or explicitly justify why a suggestion was not adopted
   3. Write the actual code changes to files

   ## Output
   Return a summary of:
   - What was changed and why
   - Which reviewer concerns were addressed vs. deferred with justification
   ```

6. **Track progress** — After each round, briefly summarize:
   - Issues fixed in this round
   - Remaining open items (if any)
   - Which reviewer concerns were addressed vs. deferred

### Phase 5 — Final Synthesis

7. **Final review** — Spawn all four reviewers one last time **in parallel** (same as step 3)
   to confirm the implementation is satisfactory. Add this to the reviewer prompt:
   ```
   This is the FINAL review. Give a verdict: PASS / CONDITIONAL PASS / FAIL
   with brief rationale.
   ```

8. **Synthesize** the full development history into a unified report using the output format below.

## Input

$ARGUMENTS

## Output format

### Implementation Summary

What was built — files created/modified, key design decisions made during implementation.

### Iteration Log

For each of the 3 review→fix rounds:

| Round | Key Findings | Fixes Applied | Deferred |
| ----- | ------------ | ------------- | -------- |

### Final Verdicts

| Reviewer         | Verdict                        | Rationale |
| ---------------- | ------------------------------ | --------- |
| Architect        | PASS / CONDITIONAL PASS / FAIL |           |
| Frontend Lead    | PASS / CONDITIONAL PASS / FAIL |           |
| Devil's Advocate | PASS / CONDITIONAL PASS / FAIL |           |
| Code Reviewer    | PASS / CONDITIONAL PASS / FAIL |           |

### Remaining Items

Any CONDITIONAL PASS conditions or unresolved concerns for the user to decide on.
