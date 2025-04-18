import * as chains from "../../../chains.json";
import { Chain, ChainConfig, EtherscanResponse } from "@/types";

let cache: Record<string, EtherscanResponse> = {};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  const chain = searchParams.get("chain") as Chain;
  const contractaddress = searchParams.get("contractaddress");

  const cacheKey = `${chain}:${contractaddress}:${address}`;

  if (cache[cacheKey]) {
    console.log(">>> cache hit", cacheKey);
    return Response.json(
      { ...cache[cacheKey], cached: true },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const chainConfig: ChainConfig = chains[chain];
  const apikey = process.env[`${chain?.toUpperCase()}_ETHERSCAN_API_KEY`];

  if (!apikey) {
    console.error("No API key found for", chainConfig.explorer_api);
    console.error(
      "Please set the API key in the .env file",
      `${chain?.toUpperCase()}_ETHERSCAN_API_KEY`
    );
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  const params = new URLSearchParams({
    module: "account",
    action: "tokentx",
    startblock: "0",
    endblock: "99999999",
    sort: "desc",
    apikey: apikey || "",
  });

  // Add optional filters
  if (address) {
    params.set("address", address);
  }
  if (contractaddress) {
    params.set("contractaddress", contractaddress);
  }

  if (!chainConfig.explorer_api) {
    throw new Error(`No explorer API found for chain ${chain}`);
  }

  throw new Error("Not yet implemented");
}
