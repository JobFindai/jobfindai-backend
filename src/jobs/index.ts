import "dotenv/config";
import { JSearchProvider } from "./providers/jsearch.provider.js";
import { syncJobs } from "./sync.js";

const apiKey = process.env.JSEARCH_API_KEY;

if (!apiKey) {
  console.error("Missing JSEARCH_API_KEY in environment");
  process.exit(1);
}

const provider = new JSearchProvider(apiKey);

await syncJobs(provider, {
  keywords: [
    "software engineer",
    "frontend developer",
    "backend developer",
    "fullstack developer",
    "react developer",
    "node.js developer",
  ],
  location: "United States",
  limit: 50,
});

process.exit(0);
