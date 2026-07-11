import fs from "node:fs";
import path from "node:path";

const outputDir = path.resolve("src/generated");
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(
  path.join(outputDir, "README.md"),
  "# Generated Stellar bindings\n\nThis placeholder file is created so the binding-generation workflow exists for contributors.\n",
  "utf8",
);

console.log("Binding generation placeholder complete.");
