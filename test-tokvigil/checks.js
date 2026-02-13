const { TokVigil } = require("tokvigil");

const TV_API_KEY = "tv_test_0bc933311d83be404819d19008ccffaea8d28ded75a8aa81";
const BASE_URL = "http://127.0.0.1:8001";

function mask(key) {
  if (!key || key.length < 10) return "***";
  return key.slice(0, 7) + "..." + key.slice(-4);
}

async function runStep(name, fn) {
  console.log("\n======================================");
  console.log(name);
  console.log("======================================");
  try {
    const res = await fn();
    console.dir(res, { depth: 6 });
    return { ok: true, res };
  } catch (err) {
    const out = {
      name: err?.name,
      message: err?.message,
      status: err?.status,
      code: err?.code,
      retryAfter: err?.retryAfter,
      details: err?.details,
    };
    console.log("❌ Error:");
    console.dir(out, { depth: 6 });

    if (err?.response) {
      console.log("Raw response:");
      console.dir(err.response, { depth: 6 });
    }
    return { ok: false, err };
  }
}

(async () => {
  console.log("TokVigil SDK single-call test: evaluate()");
  console.log("baseUrl:", BASE_URL);
  console.log("apiKey:", mask(TV_API_KEY));

  const tv = new TokVigil({
    apiKey: TV_API_KEY,
    baseUrl: BASE_URL,
    timeout: 30000,
    retryCount: 1,
    retryDelay: 500,
  });

  const userId = "user_123";
  const model = "gpt-4o-mini";
  const feature = "chat";
  const plan = "free";
  const inputTokens = 100;

  // ONLY ONE FUNCTION CALL: evaluate()
  await runStep("1) evaluate()", async () => {
    return await tv.evaluate({
      userId,
      model,
      feature,
      inputTokens: 100,
      plan: "free",
      inputTokens: 500,
      estimatedOutputTokens: 50,
    });
  });

  console.log("\n✅ Done.");
})();
