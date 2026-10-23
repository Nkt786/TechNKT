import type { APIRoute } from "astro";
import { authenticateAdmin } from "../../../lib/auth";
import {
  getProducts,
  createImportBatch,
  applyApprovedBatch,
  rollbackBatch,
} from "../../../lib/db/queries";
import { db } from "../../../lib/db/index";

export const prerender = false;

interface ParsedVariantDiff {
  id: string; // temp client diff id or db change id
  sourceLine: string;
  detectedCategory: string;
  detectedProduct: string;
  matchedProductId: string | null;
  matchedProductName: string | null;
  matchedVariantId: string | null;
  matchedVariantName: string | null;
  currentPrice: number | null;
  proposedPrice: number | null;
  currentDuration: string | null;
  proposedDuration: string | null;
  notes: string | null;
  confidence: "HIGH" | "MEDIUM" | "LOW" | "NONE";
  status:
    | "MATCHED"
    | "PRICE_CHANGE"
    | "NEW_VARIANT"
    | "NEW_PRODUCT"
    | "AMBIGUOUS"
    | "NO_PRICE_PROVIDED"
    | "UNCHANGED"
    | "NEEDS_REVIEW";
  approvable: boolean;
}

// Normalize strings for matching
function normalizeName(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Parse price from string: e.g. "₹80/-", "@ ₹1,399", "299/-"
function extractPrice(str: string): number | null {
  const match = str.match(/(?:@\s*|₹\s*)([0-9]{1,3}(?:,[0-9]{3})*|[0-9]+)(?:\s*\/-)?/);
  if (match) {
    const raw = match[1].replace(/,/g, "");
    const num = parseInt(raw, 10);
    return isNaN(num) ? null : num;
  }
  // Alternate: "@ 49"
  const altMatch = str.match(/@\s*([0-9]+)/);
  if (altMatch) {
    return parseInt(altMatch[1], 10);
  }
  return null;
}

// Parse duration from text
function extractDuration(str: string): { value: number; unit: string; label: string } | null {
  const match = str.match(/\b([0-9]+)\s*(m|mo|month|months|yr|year|years)\b/i);
  if (match) {
    const val = parseInt(match[1], 10);
    const u = match[2].toLowerCase();
    const unit = u.startsWith("y") ? "year" : "month";
    const label = `${val}${unit === "year" ? "YR" : "M"}`;
    return { value: val, unit, label };
  }
  return null;
}

export async function parseWhatsAppRateList(rawText: string): Promise<ParsedVariantDiff[]> {
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const existingProducts = await getProducts({ includeDrafts: true });

  const results: ParsedVariantDiff[] = [];
  let currentCategory = "General";

  for (const line of lines) {
    // Check if line is a Category Header: e.g. "*🎬 OTT & Entertainment*", "🤖 AI Tools", "---"
    if (line.startsWith("*") && line.endsWith("*") && !line.includes("@") && !line.includes("₹")) {
      currentCategory = line.replace(/^\*+|\*+$/g, "").trim();
      continue;
    }
    if (line.startsWith("🔥") || line.startsWith("🎬") || line.startsWith("🤖") || line.startsWith("🎨") || line.startsWith("📚") || line.startsWith("🎵")) {
      if (!line.includes("@") && !line.includes("₹") && !line.includes("–") && !line.includes("-")) {
        currentCategory = line.trim();
        continue;
      }
    }

    // Skip general headers/footers
    if (
      line.toLowerCase().includes("tech shop") ||
      line.toLowerCase().includes("message us") ||
      line.toLowerCase().includes("combo plans also available") ||
      line.length < 4
    ) {
      continue;
    }

    // Clean leading checkmarks and bullets
    const cleanLine = line.replace(/^[✅✓✔\*\-\•\d\.\)]+\s*/, "").trim();

    // Check if line has multiple variants separated by "|"
    // e.g. "Amazon Prime Video – 1M @ ₹49/- | 6M @ ₹169/-"
    let productNamePart = cleanLine;
    let variantSegments: string[] = [];

    const splitDash = cleanLine.split(/–|-/);
    if (splitDash.length >= 2) {
      productNamePart = splitDash[0].trim();
      const rest = splitDash.slice(1).join("–");
      variantSegments = rest.split("|").map((s) => s.trim()).filter(Boolean);
    } else {
      // No dash, try looking for price separator
      const atIdx = cleanLine.indexOf("@");
      if (atIdx !== -1) {
        productNamePart = cleanLine.substring(0, atIdx).trim();
        variantSegments = [cleanLine.substring(atIdx).trim()];
      } else {
        productNamePart = cleanLine;
        variantSegments = [cleanLine];
      }
    }

    // Extract any parenthesized notes from product name: e.g. "LinkedIn Premium (New User)"
    const noteMatch = productNamePart.match(/\(([^)]+)\)/);
    const parenthesizedNote = noteMatch ? noteMatch[1] : null;

    // Fuzzy match against database products
    const normDetected = normalizeName(productNamePart);
    let matchedProduct = null;
    let confidence: "HIGH" | "MEDIUM" | "LOW" | "NONE" = "NONE";

    for (const p of existingProducts) {
      const normPName = normalizeName(p.name);
      const normSlug = normalizeName(p.slug);

      if (normDetected === normPName || normDetected === normSlug) {
        matchedProduct = p;
        confidence = "HIGH";
        break;
      }
      if (normDetected.includes(normPName) || normPName.includes(normDetected)) {
        matchedProduct = p;
        confidence = "MEDIUM";
        break;
      }
      // Common aliases: e.g. Prime Video vs Amazon Prime Video
      if (
        (normDetected.includes("prime") && normPName.includes("prime")) ||
        (normDetected.includes("netflix") && normPName.includes("netflix")) ||
        (normDetected.includes("hotstar") && normPName.includes("hotstar")) ||
        (normDetected.includes("spotify") && normPName.includes("spotify")) ||
        (normDetected.includes("canva") && normPName.includes("canva")) ||
        (normDetected.includes("chatgpt") && normPName.includes("chatgpt")) ||
        (normDetected.includes("youtube") && normPName.includes("youtube"))
      ) {
        matchedProduct = p;
        confidence = "HIGH";
        break;
      }
    }

    // Process each variant segment on the line
    for (const seg of variantSegments) {
      const price = extractPrice(seg);
      const duration = extractDuration(seg);
      const hasWarranty = /warranty/i.test(seg);

      if (!matchedProduct) {
        results.push({
          id: `diff_${Math.random().toString(36).substring(2, 9)}`,
          sourceLine: line,
          detectedCategory: currentCategory,
          detectedProduct: productNamePart,
          matchedProductId: null,
          matchedProductName: null,
          matchedVariantId: null,
          matchedVariantName: null,
          currentPrice: null,
          proposedPrice: price,
          currentDuration: null,
          proposedDuration: duration?.label || null,
          notes: parenthesizedNote || (hasWarranty ? "With Warranty" : null),
          confidence: "NONE",
          status: "NEW_PRODUCT",
          approvable: false, // Cannot auto-approve unknown products
        });
        continue;
      }

      // We have a matched product, find matching variant
      let matchedVariant = null;
      if (matchedProduct.variants && matchedProduct.variants.length > 0) {
        if (duration) {
          matchedVariant = matchedProduct.variants.find(
            (v) =>
              (v.duration_value === duration.value && v.duration_unit === duration.unit) ||
              v.variant_name.toLowerCase().includes(duration.label.toLowerCase())
          );
        }
        // Fallback to first variant if product only has one variant
        if (!matchedVariant && matchedProduct.variants.length === 1) {
          matchedVariant = matchedProduct.variants[0];
        }
      }

      if (price === null) {
        // Line mentions product without explicit price
        results.push({
          id: `diff_${Math.random().toString(36).substring(2, 9)}`,
          sourceLine: line,
          detectedCategory: currentCategory,
          detectedProduct: productNamePart,
          matchedProductId: matchedProduct.id,
          matchedProductName: matchedProduct.name,
          matchedVariantId: matchedVariant?.id || null,
          matchedVariantName: matchedVariant?.variant_name || null,
          currentPrice: matchedVariant?.price_amount || null,
          proposedPrice: null,
          currentDuration: matchedVariant ? `${matchedVariant.duration_value} ${matchedVariant.duration_unit}` : null,
          proposedDuration: duration?.label || null,
          notes: "No price provided in line",
          confidence,
          status: "NO_PRICE_PROVIDED",
          approvable: false,
        });
        continue;
      }

      if (!matchedVariant) {
        // New duration variant for existing product
        results.push({
          id: `diff_${Math.random().toString(36).substring(2, 9)}`,
          sourceLine: line,
          detectedCategory: currentCategory,
          detectedProduct: productNamePart,
          matchedProductId: matchedProduct.id,
          matchedProductName: matchedProduct.name,
          matchedVariantId: null,
          matchedVariantName: null,
          currentPrice: null,
          proposedPrice: price,
          currentDuration: null,
          proposedDuration: duration?.label || "1M",
          notes: parenthesizedNote,
          confidence,
          status: "NEW_VARIANT",
          approvable: false, // Requires variant creation confirmation
        });
        continue;
      }

      // Existing variant matched
      const currentPrice = matchedVariant.price_amount;
      const isPriceDiff = currentPrice !== price;

      results.push({
        id: `diff_${Math.random().toString(36).substring(2, 9)}`,
        sourceLine: line,
        detectedCategory: currentCategory,
        detectedProduct: productNamePart,
        matchedProductId: matchedProduct.id,
        matchedProductName: matchedProduct.name,
        matchedVariantId: matchedVariant.id,
        matchedVariantName: matchedVariant.variant_name,
        currentPrice,
        proposedPrice: price,
        currentDuration: `${matchedVariant.duration_value} ${matchedVariant.duration_unit}`,
        proposedDuration: duration?.label || `${matchedVariant.duration_value} ${matchedVariant.duration_unit}`,
        notes: parenthesizedNote || (hasWarranty ? "Warranty claim detected" : null),
        confidence,
        status: isPriceDiff ? "PRICE_CHANGE" : "UNCHANGED",
        approvable: isPriceDiff && confidence === "HIGH",
      });
    }
  }

  return results;
}

export const POST: APIRoute = async ({ request }) => {
  if (!(await authenticateAdmin(request))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const { action } = body;

    // ── 1. PARSE RATE LIST ──
    if (action === "parse") {
      const { rawText } = body;
      if (!rawText || !rawText.trim()) {
        return new Response(
          JSON.stringify({ success: false, error: "Rate list text is required." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const diffs = await parseWhatsAppRateList(rawText);

      // Create import batch in pending state
      const approvableChanges = diffs
        .filter((d) => d.status === "PRICE_CHANGE" && d.matchedProductId && d.matchedVariantId && d.proposedPrice !== null)
        .map((d) => ({
          productId: d.matchedProductId!,
          variantId: d.matchedVariantId!,
          fieldName: "price_amount",
          oldValue: String(d.currentPrice || 0),
          proposedValue: String(d.proposedPrice!),
        }));

      let batchId: string | null = null;
      if (approvableChanges.length > 0) {
        const batchRes = await createImportBatch({
          submittedBy: "admin",
          originalText: rawText,
          changes: approvableChanges,
        });
        batchId = batchRes.batchId;
      }

      return new Response(
        JSON.stringify({
          success: true,
          batchId,
          diffs,
          totalParsed: diffs.length,
          priceChangesCount: approvableChanges.length,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // ── 2. APPLY APPROVED CHANGES ──
    if (action === "apply") {
      const { batchId, approvedChangeIds } = body;
      if (!batchId) {
        return new Response(
          JSON.stringify({ success: false, error: "batchId is required." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Fetch changes belonging to this batch
      const allBatchChanges = await db.query(
        `SELECT * FROM import_changes WHERE batch_id = $1`,
        [batchId]
      );

      const idsToApply =
        approvedChangeIds && approvedChangeIds.length > 0
          ? approvedChangeIds
          : allBatchChanges.map((c: any) => c.id);

      const res = await applyApprovedBatch(batchId, idsToApply, "admin");

      return new Response(
        JSON.stringify({
          success: true,
          message: `Successfully updated ${res.updatedCount} product prices in database.`,
          updatedCount: res.updatedCount,
          batchId,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // ── 3. ROLLBACK BATCH ──
    if (action === "rollback") {
      const { batchId } = body;
      if (!batchId) {
        return new Response(
          JSON.stringify({ success: false, error: "batchId is required." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const res = await rollbackBatch(batchId, "admin");
      return new Response(
        JSON.stringify({
          success: true,
          message: `Successfully rolled back batch ${batchId}. Restored ${res.revertedCount} prices.`,
          revertedCount: res.revertedCount,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // ── 4. LIST RECENT BATCHES ──
    if (action === "list_batches") {
      const batches = await db.query(
        `SELECT * FROM import_batches ORDER BY created_at DESC LIMIT 15`
      );
      return new Response(
        JSON.stringify({ success: true, batches }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: "Invalid action." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
