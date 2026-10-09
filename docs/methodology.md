# Conformance methodology

Vehicle API Lab uses explicit contracts and deterministic tests. It does not use an opaque model to certify interoperability.

## Evidence thread

`Contract → Implementation → Generated suite → Recorded run → Findings → Human review`

## Generated test categories

Every contract receives happy-path, invalid-input, error-contract, and timing cases. Optional contract properties add authorization, idempotency, version-compatibility, and declared boundary cases.

A run is `NON_CONFORMANT` when a critical case fails or is not run, when any case has no result, or when mandatory categories are absent. A complete passing run is a `CONFORMANT_CANDIDATE`, subject to human review.

The MVP records supplied results. It does not actively call endpoints or perform fuzzing.

## Production backlog

1. Entra/OIDC authentication, RBAC, tenant isolation, and signed audit events.
2. OpenAPI, AsyncAPI, protobuf, ARXML, FIDL, and Franca importers.
3. Active REST/gRPC/MQTT/SOME-IP runners in isolated workers.
4. Schema validation, property-based tests, mutation tests, fuzzing, and protocol robustness.
5. mTLS, credential-vault, network segmentation, and safe test-environment controls.
6. Performance baselines, time-series comparison, and hardware-aware budgets.
7. Compatibility matrices and integration with VariantGuard, AutoQualify, and CI/CD.
8. Signed PDF reports and marketplace conformance APIs.
