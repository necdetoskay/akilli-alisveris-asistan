# POC-00 — Repository and Working Environment Verification

## Goal

Establish a repeatable baseline before feature development begins.

## Scope

- Verify the repository root files.
- Verify Node.js 22 or newer.
- Verify the pinned pnpm version declaration.
- Verify Git availability and repository state.
- Verify Docker Engine and Docker Compose availability.
- Provide a lightweight test that can run without Docker.

## Commands

```powershell
pnpm poc:verify
pnpm test:poc00
```

Use `pnpm poc:verify` for the full workstation check. Use `pnpm test:poc00` for the script contract and non-Docker verification.

## Acceptance criteria

- The full verification command exits with code 0 on the intended Windows development machine.
- The test command exits with code 0.
- Missing tools or incompatible versions produce a clear error.
- No application or database feature is introduced in this sprint.
