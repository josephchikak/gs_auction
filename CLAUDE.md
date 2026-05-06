@AGENTS.md

---
applyTo: '**'
---

## Workflow Orchestration
### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update 'tasks/lessons.md' with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

# Task Management
1. **Plan First**: Write plan to 'tasks/todo.md" with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to 'tasks/todo.md*
6. **Capture Lessons**: Update 'tasks/lessons.md' after corrections
## Core Principles
- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

### 7. Systematic Debugging  
- When a solution doesn't work on first attempt, DON'T repeat the same suggestion
- Trace the entire system flow: identify each component and check them methodically
- Use available logs and HTTP status codes as clues to locate the actual problem
- Check the whole codebase for potential issues in related code paths, not just the obvious place
- Example: Login fails → check (1) login endpoint (2) cookie setting (3) auth middleware (4) user verification logic


Do not add semi colon at the end 

Minimize client‑only code (useEffect/useState) where unnecessary.

Dynamically import non‑critical components.

Optimize images (WebP, width/height, lazy-loading).

Memoize expensive computations with useMemo.

Wrap pure components in React.memo.

Structure modules for effective tree‑shaking.

Write concise, technical Javascript. Follow Standard.js rules.

Use functional, declarative patterns; avoid classes.

Favor loops and small helper modules over duplicate code.

Use descriptive names with auxiliary verbs (e.g. isLoading, hasError).

File layout: exported component → subcomponents → hooks/helpers → static content.

Define props with interfaces/types, not prop-types.


Call hooks (useState, useEffect, etc.) only at the top level.

Extract reusable logic into custom hooks (useAuth, useFormValidation).

Memoize with React.memo, useCallback, useMemo where appropriate.

Avoid inline functions in JSX—pull handlers out or wrap in useCallback.

Favor composition (render props, children) over inheritance.

Use React.lazy + Suspense for code splitting.

Use refs only for direct DOM access.

Prefer controlled components for forms.

Implement an error boundary component.

Clean up effects in useEffect to prevent leaks.

Use guard clauses (early returns) for error handling.

2‑space indentation

Single quotes (except to avoid escaping)

No semicolons (unless disambiguation requires)

No unused variables

Space after keywords (if (… ))

Space before function’s (

Always use === / !==

Operators spaced (a + b)

Commas followed by space

else on same line as closing }


