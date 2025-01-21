interface Env {
  NEXT_PUBLIC_API_KEY: string;
  NEXT_PUBLIC_API_BASE_URL: string;
}

type PagesFunction<
  Env = any,
  Params extends string = any,
  Data extends Record<string, unknown> = Record<string, unknown>
> = (context: EventContext<Env, Params, Data>) => Response | Promise<Response>;

interface EventContext<
  Env = any,
  Params extends string = any,
  Data extends Record<string, unknown> = Record<string, unknown>
> {
  request: Request;
  env: Env;
  params: Record<Params, string>;
  data: Data;
  next: () => Promise<Response>;
  waitUntil: (promise: Promise<any>) => void;
  passThroughOnException: () => void;
}
