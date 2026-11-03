# Demo Shop API tests (Kotlin + Cucumber)

The second half of the workshop: testing the Demo Shop **backend** directly, the way
`onboarding-e2e-tests` tests our platform services. Same stack: Maven, Kotlin, Spring,
Cucumber, AssertJ and Awaitility. No browser involved.

## Setup (once)

You need JDK 21+ and Maven. Then, in two terminals:

```bash
# 1. start the backend (http://localhost:8080)
cd backend
mvn spring-boot:run

# 2. run the tests
cd e2e
mvn test
```

## Running tests

| Command | What it does |
| --- | --- |
| `mvn test` | Run all lessons (exercises are skipped) |
| `mvn test -Dcucumber.filter.tags=@lesson03` | Run one lesson |
| `mvn test -Dcucumber.filter.tags="@lesson06 and not @slow"` | Combine tags |
| `mvn test -Dcucumber.filter.tags=@exercise` | Run the exercises |
| `mvn test -Dcucumber.features=classpath:bdd/01_first_scenario.feature` | Run one file |

Report: open `target/cucumber-report.html` after a run. On a failure it also shows the last API response.

## The backend (`../backend`)

A small Spring Boot + Kotlin service, built like our real services: one controller per
area, services for the logic, and one `ErrorHandler` that turns exceptions into
`{ "error": "..." }`. All data lives in memory, so restarting it gives a clean shop.

| Endpoint | Notes |
| --- | --- |
| `GET /api/health` | `{ "status": "UP" }` |
| `GET /api/products` | 5 products |
| `POST /api/login` | `{ email, password }` -> `{ token, email }`; 400 / 401 on bad input |
| `POST /api/logout` | Drops the session and its cart |
| `GET /api/me` | Who is logged in |
| `GET /api/cart` | `{ items, count, total }` |
| `POST /api/cart` | `{ productId, quantity }`; 404 unknown product, 400 bad quantity |
| `DELETE /api/cart/:productId`, `DELETE /api/cart` | Remove one product / empty the cart |
| `POST /api/orders` | Order from the cart, starts as `PENDING` |
| `GET /api/orders/:id` | Becomes `CONFIRMED` or `REJECTED` ~1.5 s later |
| `POST /api/contact` | Field validation, 400 with `errors` per field |
| `PUT /api/test/payment-provider` | **Test only**: `{ result: APPROVE or DECLINE, delayMs }` for this session |

Everything except products, login and contact needs `Authorization: Bearer <token>`.
Carts belong to a session, so tests running at the same time never share data.

## Lessons

Go through them in order. Each `.feature` file starts with a comment explaining the idea.

| File | Topic | Key idea |
| --- | --- | --- |
| `01_first_scenario` | Anatomy of a scenario | Given/When/Then; one Gherkin line = one Kotlin function |
| `02_parameters_and_outlines` | Parameters | `{string}`, `{int}`; Scenario Outline for data-driven negatives |
| `03_context_and_background` | Sharing state | `ScenarioContext`, `Background`, cleanup in `@After` |
| `04_data_tables_and_types` | Readable input | Data tables, custom `{listOfStrings}` parameter type |
| `05_async_and_awaitility` | Timing | Never sleep; `await untilAsserted { }` polls until it passes |
| `06_mocking_external_providers` | External systems | The test decides what the provider answers (like `MockProxySteps`) |
| `07_validation_matrix` | Thinking like a QA | One valid request, break one field per example |
| `99_exercises` | Practice | 6 tasks tagged `@exercise` |

Solutions for the trainer are in `solutions/` (outside `src/`, so they don't run by default).

## Where things live

Same layout as `onboarding-e2e-tests`:

```
src/test/resources/bdd/      feature files (the "what")
src/test/java/.../step/      step definitions, one class per domain (the "how")
src/test/java/.../service/   ShopApiClient (one method per endpoint) and DTOs
src/test/java/.../config/    ScenarioContext, hooks, Spring wiring
src/test/java/.../cucumber/  custom parameter types
src/test/resources/application.yml   base URL of the backend
```

## Mapping to the Playwright lessons

| Playwright (UI) | Cucumber (API) |
| --- | --- |
| `test('...')` | `Scenario:` |
| `test.beforeEach` | `Background:` / `@Before` |
| loop over test data | `Scenario Outline` + `Examples` |
| `expect(...)` auto-retry | Awaitility `await untilAsserted` |
| `page.route()` mocks | `Given payment provider declines payments` |
| Page Objects in `/pages` | `ShopApiClient` + step classes |
| `test.fixme` exercises | `@exercise` tag |

## Suggested session plan (~2h)

1. **Feature files vs. step definitions** (15 min): open lesson 01 and `ProductSteps.kt` side by side.
2. **Lessons 02 to 04** (30 min): run each with its tag and read the output.
3. **Break a test on purpose** (10 min): change an expected value, run it, read the failure and the report.
4. **Lessons 05 and 06** (25 min): asynchronous results and mocked providers are where real e2e suites get flaky.
5. **Lesson 07** (10 min): a validation matrix.
6. **Exercises** (30 min): pairs work on `99_exercises.feature`. Undefined steps print a Kotlin snippet to start from.
