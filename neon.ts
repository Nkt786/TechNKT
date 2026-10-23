import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  // Preserving TechNKT custom username/password auth; Neon managed auth disabled
  auth: false,
  buckets: {
    "technkt-products": { access: "public_read" },
  },
  branch: (branch) => {
    if (branch.isDefault) {
      return {};
    }
    return {};
  },
});
