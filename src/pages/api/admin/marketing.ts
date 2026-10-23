import type { APIRoute } from "astro";
import { authenticateAdmin } from "../../../lib/auth";
import { getProducts } from "../../../lib/db/queries";

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  if (!(await authenticateAdmin(request))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const customHeader = url.searchParams.get("header") || "*🔥 NKT TECH SHOP 🔥*\n*⚡ Digital Subscriptions & Premium Tools*";
  const customFooter = url.searchParams.get("footer") || "*⚡ 100% Replacement Warranty & Instant Activation*\n*📩 Message us on WhatsApp to order: +91 9822587641*";
  const maxCharsPerPost = Number(url.searchParams.get("maxChars") || 2500);

  // Fetch active marketing products
  const allProducts = await getProducts({ status: "active", includeDrafts: false });
  const marketingProducts = allProducts.filter((p) => p.include_in_marketing === 1);

  // Group products by marketing category
  const groups = new Map<string, typeof marketingProducts>();

  for (const prod of marketingProducts) {
    const cat = prod.marketing_category || "Other Premium Tools";
    if (!groups.has(cat)) {
      groups.set(cat, []);
    }
    groups.get(cat)!.push(prod);
  }

  // Build formatted text
  const categorySections: Array<{ category: string; text: string }> = [];

  for (const [categoryName, products] of groups.entries()) {
    let sectionText = `*${categoryName}*\n`;
    for (const prod of products) {
      if (!prod.variants || prod.variants.length === 0) continue;

      // Format variants line: e.g. "✅ Netflix 4K – 1M @ ₹139/- | 3M @ ₹399/-"
      const variantParts = prod.variants.map((v) => {
        let label = v.variant_name;
        // Normalize shorthand if appropriate
        if (v.duration_value && v.duration_unit === "month" && !label.includes("M")) {
          label = `${v.duration_value}M`;
        } else if (v.duration_value && v.duration_unit === "year" && !label.includes("YR")) {
          label = `${v.duration_value}YR`;
        }
        return `${label} @ ₹${v.price_amount}/-`;
      });

      const line = `✅ ${prod.name} – ${variantParts.join(" | ")}`;
      sectionText += `${line}\n`;
    }
    categorySections.push({ category: categoryName, text: sectionText.trim() });
  }

  // Combined full post
  const fullBody = categorySections.map((s) => s.text).join("\n\n");
  const fullPost = `${customHeader}\n\n${fullBody}\n\n${customFooter}`.trim();

  // Smart splitting if post exceeds threshold
  const splitPosts: string[] = [];
  if (fullPost.length > maxCharsPerPost && categorySections.length > 1) {
    let currentPart = "";
    const tempParts: string[] = [];

    for (const section of categorySections) {
      if ((currentPart + "\n\n" + section.text).length > maxCharsPerPost && currentPart) {
        tempParts.push(currentPart.trim());
        currentPart = section.text;
      } else {
        currentPart = currentPart ? `${currentPart}\n\n${section.text}` : section.text;
      }
    }
    if (currentPart) {
      tempParts.push(currentPart.trim());
    }

    const totalParts = tempParts.length;
    for (let i = 0; i < totalParts; i++) {
      splitPosts.push(
        `*🔥 NKT TECH SHOP (Part ${i + 1}/${totalParts}) 🔥*\n\n${tempParts[i]}\n\n*📩 Message us to order: +91 9822587641*`
      );
    }
  }

  const encodedWhatsAppUrl = `https://wa.me/919822587641?text=${encodeURIComponent(fullPost)}`;

  return new Response(
    JSON.stringify({
      success: true,
      post: fullPost,
      splitPosts,
      productCount: marketingProducts.length,
      categoryCount: groups.size,
      encodedWhatsAppUrl,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
