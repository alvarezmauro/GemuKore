import { describe, expect, it } from "vitest";
import {
  authEnvironmentSchema,
  configuredAuthEnvironment,
  authEnvironmentForOrigin,
  authOriginForRequest,
} from "./auth-env";

const configured = {
  NODE_ENV: "test",
  BETTER_AUTH_URL: "http://localhost:3002",
  BETTER_AUTH_SECRET: "test-only-secret-longer-than-thirty-two-characters",
  GOOGLE_CLIENT_ID: "test-google",
  GOOGLE_CLIENT_SECRET: "test-google-secret",
};

describe("auth configuration", () => {
  it("leaves authentication unavailable without provider credentials", () => {
    const env = authEnvironmentSchema.parse({
      NODE_ENV: "development",
      BETTER_AUTH_URL: "http://localhost:3002",
      GOOGLE_CLIENT_ID: "",
      GOOGLE_CLIENT_SECRET: "",
    });
    expect(configuredAuthEnvironment(env)).toBeNull();
  });
  it("accepts a complete provider pair and fixed origin", () => {
    expect(
      configuredAuthEnvironment(authEnvironmentSchema.parse(configured)),
    ).toMatchObject({
      baseURL: "http://localhost:3002",
      google: { clientId: "test-google" },
    });
  });
  it.each([
    { ...configured, GOOGLE_CLIENT_SECRET: "" },
    { ...configured, BETTER_AUTH_SECRET: "short" },
    { ...configured, BETTER_AUTH_URL: "not-a-url" },
    { ...configured, BETTER_AUTH_URL: "http://example.com" },
    { ...configured, BETTER_AUTH_URL: "https://example.com/login" },
    { ...configured, BETTER_AUTH_URL: "https://user:password@example.com" },
    { ...configured, BETTER_AUTH_URL: "https://example.com?origin=other" },
    { ...configured, NODE_ENV: "production" },
  ])("rejects incomplete or unsafe auth configuration", (env) => {
    expect(authEnvironmentSchema.safeParse(env).success).toBe(false);
  });
  it("accepts HTTPS in production", () => {
    expect(
      authEnvironmentSchema.safeParse({
        ...configured,
        NODE_ENV: "production",
        BETTER_AUTH_URL: "https://collection.example",
      }).success,
    ).toBe(true);
  });
  it("trusts proxy headers only through explicit configuration", () => {
    expect(
      configuredAuthEnvironment(authEnvironmentSchema.parse(configured))
        ?.trustProxy,
    ).toBe(false);
    expect(
      configuredAuthEnvironment(
        authEnvironmentSchema.parse({
          ...configured,
          AUTH_TRUST_PROXY: "true",
        }),
      )?.trustProxy,
    ).toBe(true);
    expect(
      authEnvironmentSchema.safeParse({
        ...configured,
        AUTH_TRUST_PROXY: "yes",
      }).success,
    ).toBe(false);
  });
});

it("selects only exact configured origins", () => {
  const env = configuredAuthEnvironment(
    authEnvironmentSchema.parse({
      ...configured,
      AUTH_ADDITIONAL_ORIGINS:
        "https://collector.example:3001,http://localhost:3001",
    }),
  )!;
  expect(authEnvironmentForOrigin(env, "http://localhost:3001")?.baseURL).toBe(
    "http://localhost:3001",
  );
  expect(
    authEnvironmentForOrigin(env, "https://collector.example:3001")?.baseURL,
  ).toBe("https://collector.example:3001");
  for (const origin of [
    "https://evil.example",
    "http://collector.example:3001",
    "http://localhost:3000",
  ]) {
    expect(authEnvironmentForOrigin(env, origin)).toBeNull();
  }
});
it.each([
  "https://*.example.com",
  "https://example.com/login",
  "http://example.com",
  "https://user:pass@example.com",
  "garbage",
])("rejects unsafe additional origin %s", (origin) => {
  expect(
    authEnvironmentSchema.safeParse({
      ...configured,
      AUTH_ADDITIONAL_ORIGINS: origin,
    }).success,
  ).toBe(false);
});
it("rejects HTTP additional origins in production", () => {
  expect(
    authEnvironmentSchema.safeParse({
      ...configured,
      NODE_ENV: "production",
      BETTER_AUTH_URL: "https://example.com",
      AUTH_ADDITIONAL_ORIGINS: "http://localhost:3001",
    }).success,
  ).toBe(false);
});

it("maps proxy Host only to configured origins and ignores forwarding headers", () => {
  const env = configuredAuthEnvironment(
    authEnvironmentSchema.parse({
      ...configured,
      AUTH_ADDITIONAL_ORIGINS: "https://collector.example:3001",
    }),
  )!;
  expect(
    authOriginForRequest(
      env,
      new Request("http://0.0.0.0:3000/api/auth/callback/google", {
        headers: { Host: "collector.example:3001" },
      }),
    ),
  ).toBe("https://collector.example:3001");
  expect(
    authOriginForRequest(
      env,
      new Request("http://0.0.0.0:3000/api/auth/callback/google", {
        headers: {
          Host: "evil.example",
          "X-Forwarded-Host": "collector.example:3001",
        },
      }),
    ),
  ).toBeNull();
});
