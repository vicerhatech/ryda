# AGENTS.md — Ryda Agent Rules

This file applies to every coding agent working in this repository.

## 1. Read Before Coding

Before making any change:
1. Read `/README.md`.
2. Read the task file assigned to the current student in `/docs/`.
3. Identify the exact task ID requested by the human.
4. Inspect only the code needed for that task.
5. Do not begin a later task unless the human explicitly says `Continue to <TASK-ID>`.

## 2. Scope Discipline

- Implement **only** the requested task.
- Do not opportunistically build future tasks.
- Do not edit another student's owned feature directory.
- Do not redesign architecture.
- Do not rename API contracts, statuses, shared constants or folders.
- Do not add packages unless necessary for the active task.
- Do not perform broad codebase refactors during feature work.
- Do not replace working code solely because another style is preferred.

## 3. Shared Files

Unless the current user is the captain performing a captain task:
- do not edit `client/src/app/**`;
- do not edit `client/src/shared/**`;
- do not edit `server/src/app.js`;
- do not edit `server/src/server.js`;
- do not edit `server/src/shared/**`;
- do not edit root package/workspace configuration;
- do not edit another feature module;
- do not edit `README.md` or other students' task files.

If the active task needs a change in a captain-owned/shared file:
1. do not make the change;
2. finish everything possible inside the student's owned directory;
3. document the needed integration change in the task report under `Captain Integration Required`.

## 4. Dependencies on Another Student

If a task expects another student's route, model or API:
- trust the contract in README;
- do not recreate the other student's implementation;
- use the documented API shape;
- if runtime testing is impossible until the dependency is merged, report that fact;
- never copy a second implementation into your own feature directory.

## 5. Coding Standards

- Keep code simple and appropriate for an MVP.
- Use async/await.
- Return useful HTTP status codes.
- Validate input.
- Never trust prices sent by the client.
- Do not expose secrets.
- Do not commit `.env`.
- Use existing utilities before creating duplicates.
- Keep comments concise.
- Avoid unnecessary abstractions.

## 6. Verification

For every task:
- inspect changed files;
- run the narrowest relevant checks/tests available;
- run lint/build for the owned feature when practical;
- do not attempt unrelated fixes merely because lint finds old issues elsewhere.

## 7. Task Completion Report

After each requested task, stop and report:

```text
TASK COMPLETION REPORT
Task:
Status: COMPLETE | PARTIAL | BLOCKED

Implemented:
- ...

Files created:
- ...

Files modified:
- ...

Commands/checks run:
- ...

Manual configuration required:
- ...

Dependencies still required:
- ...

Captain Integration Required:
- ...

Known issues:
- ...

Recommended next task:
- ...
```

Do not automatically continue to the next task.

## 8. If Usage Stops Mid-Task

When asked to resume:
- inspect Git diff/status and existing files first;
- determine what is already complete;
- continue from the first incomplete acceptance criterion;
- do not regenerate completed files;
- do not restart the task from scratch;
- preserve valid prior work.

## 9. Git Safety

- Do not run destructive Git commands without explicit human instruction.
- Do not reset, clean, force-push or rewrite history.
- Commit only when the human explicitly asks.
- Never merge to `main` unless the active task is a captain integration task that explicitly says to do so.
