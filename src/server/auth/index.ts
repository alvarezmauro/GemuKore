import "server-only";

import { authEnvironmentForOrigin } from "../config/auth-env";
import { getAuthEnv } from "../config/env";
import { getDatabase } from "../db/client";
import { createAuth } from "./config";

const instances = new Map<string, ReturnType<typeof createAuth>>();

export function getAuth(origin?: string) {
  const env = getAuthEnv();
  if (!env) return null;
  const selected = authEnvironmentForOrigin(env, origin ?? env.baseURL);
  if (!selected) return null;
  const key = JSON.stringify(selected);
  let auth = instances.get(key);
  if (!auth) {
    auth = createAuth(getDatabase(), selected);
    instances.set(key, auth);
  }
  return auth;
}
