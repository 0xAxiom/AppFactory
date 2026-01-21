# Deprecated Code

This folder contains code that was incorrectly placed in the web3-factory repo.

## platform-v1/

**Status**: DEPRECATED - Wrong repo

This was a Next.js platform with upload/launch/showcase APIs. This code belongs in the `factoryapp.dev` repo, not here.

**Why deprecated**:

- web3-factory is LOCAL-ONLY tooling (generator, validator, zip creator)
- The hosted platform belongs in the factoryapp.dev repository
- API routes, wallet integration for launch, and showcase belong on the hosted platform

**Do not use this code**. It will be removed in a future cleanup.

---

For the correct architecture, see:

- `/README.md` - What web3-factory actually does
- `/ARCHITECTURE.md` - Correct system boundary diagram
