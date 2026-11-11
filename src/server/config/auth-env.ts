import { z } from "zod";

const optionalValue = (schema: z.ZodString) =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    schema.optional(),
  );

export const authEnvironmentSchema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]),
    AUTH_TRUST_PROXY: z.enum(["true", "false"]).default("false"),
    BETTER_AUTH_URL: optionalValue(z.string().url()),
    AUTH_ADDITIONAL_ORIGINS: z.string().default(""),
    BETTER_AUTH_SECRET: optionalValue(z.string().min(32)),
    GOOGLE_CLIENT_ID: optionalValue(z.string().trim().min(1)),
    GOOGLE_CLIENT_SECRET: optionalValue(z.string().min(1)),
    GITHUB_CLIENT_ID: optionalValue(z.string().trim().min(1)),
    GITHUB_CLIENT_SECRET: optionalValue(z.string().min(1)),
  })
  .superRefine((env, context) => {
    for (const [id, secret] of [
      ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
      ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"],
    ] as const) {
      if (Boolean(env[id]) !== Boolean(env[secret])) {
        context.addIssue({
          code: "custom",
          path: [env[id] ? secret : id],
          message: "Provider credentials must be configured together.",
        });
      }
    }
    if (env.GOOGLE_CLIENT_ID || env.GITHUB_CLIENT_ID) {
      for (const key of ["BETTER_AUTH_URL", "BETTER_AUTH_SECRET"] as const) {
        if (!env[key])
          context.addIssue({
            code: "custom",
            path: [key],
            message: "Required for OAuth.",
          });
      }
    }
    for (const [key, value] of [
      ["BETTER_AUTH_URL", env.BETTER_AUTH_URL],
      ...env.AUTH_ADDITIONAL_ORIGINS.split(",").map((value) => [
        "AUTH_ADDITIONAL_ORIGINS",
        value.trim(),
      ]),
    ]) {
      if (!value) continue;
      if (!URL.canParse(value)) {
        context.addIssue({
          code: "custom",
          path: [key!],
          message: "Use a valid origin.",
        });
        continue;
      }
      const url = new URL(value);
      if (
        url.hostname.includes("*") ||
        url.username ||
        url.password ||
        url.search ||
        url.hash ||
        url.pathname !== "/" ||
        (url.protocol !== "https:" &&
          !(
            url.protocol === "http:" &&
            env.NODE_ENV !== "production" &&
            ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
          ))
      ) {
        context.addIssue({
          code: "custom",
          path: [key!],
          message:
            "Use an HTTPS origin, or a loopback HTTP origin for development.",
        });
      }
    }
  });

export type AuthEnvironment = {
  baseURL: string;
  additionalOrigins?: string[];
  secret: string;
  production: boolean;
  trustProxy?: boolean;
  google?: { clientId: string; clientSecret: string };
  github?: { clientId: string; clientSecret: string };
};

export function configuredAuthEnvironment(
  env: z.infer<typeof authEnvironmentSchema>,
): AuthEnvironment | null {
  if (
    !env.BETTER_AUTH_URL ||
    !env.BETTER_AUTH_SECRET ||
    !(env.GOOGLE_CLIENT_ID || env.GITHUB_CLIENT_ID)
  )
    return null;
  return {
    baseURL: new URL(env.BETTER_AUTH_URL).origin,
    additionalOrigins: [
      ...new Set(
        env.AUTH_ADDITIONAL_ORIGINS.split(",")
          .map((value) => value.trim())
          .filter(Boolean)
          .map((value) => new URL(value).origin),
      ),
    ],
    secret: env.BETTER_AUTH_SECRET,
    production: env.NODE_ENV === "production",
    trustProxy: env.AUTH_TRUST_PROXY === "true",
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
    ...(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
  };
}

// Select only a configured fixed origin. Forwarding headers cannot add origins.
export function authEnvironmentForOrigin(env: AuthEnvironment, origin: string) {
  return [env.baseURL, ...(env.additionalOrigins ?? [])].includes(origin)
    ? { ...env, baseURL: origin }
    : null;
}

// Next.js can expose its internal listener URL behind a reverse proxy. Resolve
// the Host only through configured origins; never consume X-Forwarded-Host.
export function authOriginForRequest(
  env: AuthEnvironment,
  request: Request,
): string | null {
  const url = new URL(request.url);
  const host = request.headers.get("host");
  if (!host) return authEnvironmentForOrigin(env, url.origin)?.baseURL ?? null;
  const matches = [
    ...new Set([env.baseURL, ...(env.additionalOrigins ?? [])]),
  ].filter((origin) => new URL(origin).host === host);
  if (matches.length === 1) return matches[0]!;
  return matches.includes(url.origin) ? url.origin : null;
}
