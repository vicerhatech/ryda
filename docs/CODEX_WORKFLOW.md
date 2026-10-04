# Codex Workflow Guide — Ryda Team

## 1. Model Choice

For students using ChatGPT Free/Go with Codex, use the GPT-5.6 model currently made available to that plan in Codex.

Do not assume model availability from normal ChatGPT is identical to Codex. If the Codex client only offers one suitable GPT-5.6 model, use it.

Prefer:
- normal/default reasoning for routine isolated implementation;
- higher reasoning only when debugging a difficult integration issue, if the plan exposes that option.

Do not spend usage asking the coding agent broad architecture questions. Architecture is already frozen in README.

---

## 2. Before Anyone Starts Coding

The captain must complete `CAP-T00`.

Then every student:

```bash
git clone <repository-url>
cd ryda
git switch integration
git pull origin integration
```

Create their branch.

### Student 1
```bash
git switch -c student-1/identity
```

### Student 2
```bash
git switch -c student-2/rides
```

### Student 3
```bash
git switch -c student-3/courier-driver
```

### Student 4 / Captain
The captain normally continues on a dedicated feature branch for payments/admin when not doing integration:

```bash
git switch -c student-4/payments-admin
```

When performing captain merges, switch back to `integration`.

---

## 3. Universal Prompt for Starting a Task

Copy this exactly, replacing only the task ID.

```text
You are working inside the Ryda MERN-stack repository.

Read AGENTS.md, README.md, and my assigned task file in /docs before changing any code.

My current task is: <TASK-ID>.

Implement ONLY that task and obey its acceptance criteria.

Important rules:
- Do not start any later task.
- Do not modify another student's owned feature directories.
- Do not modify captain-owned/shared/root integration files unless this is explicitly a captain task.
- Do not recreate another student's dependency. Follow the contracts in README and report any missing dependency.
- Reuse the existing project architecture and dependencies.
- Do not redesign the project.
- Do not hardcode secrets.
- If configuration of an external tool is needed, guide me clearly through the setup and tell me exactly which environment variable is required, but never invent credentials.
- Run only the relevant checks needed to verify this task.
- When the task is finished, STOP and give me the TASK COMPLETION REPORT required by AGENTS.md.
- Do not continue to the next task until I explicitly say "Continue to <next task ID>".
```

---

## 4. Prompt After Teacher Approval

When the teacher says the previous task is approved:

```text
Continue to <TASK-ID>.

First re-read AGENTS.md, README.md and my task file. Confirm the previous task's existing implementation is present, then implement only <TASK-ID>. Do not repeat or rewrite completed work unless the new task requires a small compatible change. Stop after this task and provide the required task completion report.
```

---

## 5. Resume Prompt When Codex Usage Stopped Mid-Task

Use this when an agent stopped because of usage limits, interruption, editor restart, or another failure.

```text
Resume the current Ryda task from the existing repository state.

Read AGENTS.md, README.md and my assigned task file. The active task is <TASK-ID>.

Before writing code:
1. Inspect git status and git diff.
2. Inspect the files already created or modified for <TASK-ID>.
3. Compare the existing implementation against every acceptance criterion for <TASK-ID>.
4. Identify what is already complete and what remains incomplete.

Then continue ONLY from the first incomplete requirement.

Do NOT:
- restart the task from scratch,
- regenerate files that are already correct,
- undo valid completed work,
- begin another task,
- modify another student's feature,
- redesign the architecture.

Run the smallest relevant verification checks.

When <TASK-ID> is complete, stop and provide the exact TASK COMPLETION REPORT required by AGENTS.md, including anything still blocked by another student's work.
```

---

## 6. Prompt for a Failed Check

```text
The current task <TASK-ID> failed the following check:

<PASTE ERROR OR DESCRIBE FAILURE>

Stay strictly inside <TASK-ID>. Diagnose the root cause using the existing implementation and make the smallest safe fix. Do not refactor unrelated code and do not implement future tasks. Re-run the narrow relevant check, then provide an updated task completion report.
```

---

## 7. Prompt for External Service Setup

Usually the coding agent should detect this itself, but if configuration is blocked:

```text
For the active task <TASK-ID>, guide me through configuring the required external service for local development. Do not invent credentials and do not expose secrets. Tell me:
1. what account/project I need,
2. what setting/key I need,
3. the exact environment variable name,
4. whether it belongs in client or server .env,
5. how to verify configuration,
6. what must never be committed to Git.

After setup instructions, do not implement any task outside <TASK-ID>.
```

---

## 8. How to Conserve Codex Usage

### Do
- give Codex one numbered task at a time;
- keep architecture in repo files;
- keep branches small;
- use exact error messages when asking for a fix;
- let the agent inspect existing code instead of pasting the whole repository into chat;
- manually change tiny copy/text values when safe;
- commit stable work before moving to the next task;
- use the resume prompt rather than asking the agent to rebuild after an interruption.

### Avoid
- "build the whole Ryda app";
- "improve everything";
- "refactor the project";
- repeatedly asking the agent to explain the whole codebase;
- repeatedly regenerating UI that already works;
- changing frameworks mid-project;
- adding post-MVP features;
- starting multiple tasks in one turn.

---

## 9. Student Commit Practice

After the teacher approves a task, commit it.

Example:

```bash
git status
git add client/src/features/identity server/src/modules/identity
git commit -m "feat(identity): complete S1-T02 authentication backend"
git push -u origin student-1/identity
```

Adjust paths/message for your owned feature.

Do not use:

```bash
git add .
```

blindly if unrelated files are present. Inspect status first.

---

## 10. Sending the Teacher a Report

The student should send the complete agent report, plus:

```text
Student:
Branch:
Task:
Commit hash:
Did the task pass locally? Yes/No
Anything I had to do manually:
```

The teacher can then review and reply:

```text
Continue to S1-T03
```

or ask for a correction first.

---

## 11. When Another Student's Work Is Missing

Correct behavior:

```text
TASK STATUS: PARTIAL

Everything inside my owned feature is implemented.

Blocked integration:
The ride payment button expects the documented
POST /api/payments/initialize endpoint from Student 4.

I did not create a replacement payment endpoint.

Captain integration required after Student 4 module is merged.
```

Incorrect behavior:
- creating a second payments folder;
- changing another student's code;
- copying their model into your module;
- changing the README contract to suit your branch.

---

## 12. Captain Merge Procedure

Before each merge:

```bash
git switch integration
git pull origin integration
git fetch origin
git status
```

Ensure working tree is clean.

Merge one branch at a time:

```bash
git merge --no-ff origin/<branch-name>
```

If conflict:
```bash
git status
```

Open each conflicted file. Do not choose "accept all current" or "accept all incoming" blindly.

After resolving:
```bash
git add <resolved-files>
git commit
```

Then run the relevant integration checks before merging the next branch.

---

## 13. Conflict Prevention Rules

Conflicts are unlikely only if everyone obeys ownership.

Students must not independently edit:
- AppRoutes
- root navigation
- Express app mounting
- root Socket.IO setup
- shared constants
- package-level architecture
- README task contracts

Instead, they export their module and tell the captain what to mount.

The captain is the only person responsible for those integration edits.

---

## 14. Suggested Two-Week Rhythm

This is a planning suggestion, not a guarantee of Codex account reset timing.

### Week 1
- Captain baseline
- Student 1: T01–T04
- Student 2: T01–T04
- Student 3: T01–T04
- Student 4: T01–T03

### Week 2
- Student 1: T05–T06
- Student 2: T05–T08
- Student 3: T05–T08
- Student 4: T04–T06
- Captain: T07–T14 integration/deployment

If anyone hits an account limit, stop cleanly, commit valid work, and resume when the account itself shows that usage is available again. Do not assume an exact reset date unless the product UI states it.
