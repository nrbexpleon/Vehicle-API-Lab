# Vehicle API Lab

Contract and interoperability testing for software-defined vehicle APIs.

Vehicle API Lab helps OEM, Tier-1, and software-supplier teams define vehicle-service contracts, register implementations, generate conformance tests, execute reproducible test runs, compare results, and produce human-reviewed interoperability evidence.

## MVP capabilities

- Vehicle API/service contract registry
- REST/OpenAPI-like and SOME/IP-style service metadata
- Request/response schema, transport, timing, error, and compatibility rules
- Implementation and target-platform registry
- Deterministic contract-test generation
- Recorded execution results for positive, negative, timing, error, and compatibility tests
- Explainable conformance scoring, blockers, and remediation actions
- Human review gate and append-style audit history
- Downloadable JSON conformance report
- REST API, responsive UI, tests, Docker, and Azure deployment assets

## Important limitation

This MVP records and evaluates supplied test outcomes; it is not yet an active network fuzzer or production certification system. Approved test environments, safety controls, and qualified human review are required.

## Run

Requires Node.js 20+.

```bash
npm test
npm start
```

Open http://localhost:3000.

## API

- `GET /api/health`
- `GET|POST /api/labs`
- `GET /api/labs/:id`
- `POST /api/labs/:id/contracts`
- `POST /api/labs/:id/implementations`
- `POST /api/labs/:id/suites`
- `POST /api/labs/:id/runs`
- `POST /api/labs/:id/reviews`
- `GET /api/labs/:id/report`

See `docs/methodology.md` for the conformance model.
