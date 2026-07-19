import { AuditIssue } from "@/types/audit";
import { ScrapeResult } from "./scraper";

export function analyzeAccessibility(data: ScrapeResult): { score: number; issues: AuditIssue[] } {
  const issues: AuditIssue[] = [];
  const { metadata, $ } = data;
  let penalty = 0;

  // 1. HTML Lang Attribute Check
  const htmlLang = $("html").attr("lang")?.trim();
  if (!htmlLang) {
    penalty += 15;
    issues.push({
      id: "a11y-missing-html-lang",
      category: "ACCESSIBILITY",
      severity: "HIGH",
      title: "Missing <html lang> Attribute",
      description: "The root <html> element does not specify a language attribute (e.g. lang=\"en\").",
      whyItMatters: "Screen readers rely on the lang attribute to pronounce page content and read words with proper accent and voice synth.",
      element: "<html>",
      recommendation: "Specify the primary language code in the <html> element tag.",
      codeFix: `<html lang="en">`,
      codeFixLanguage: "html",
      seoImpact: 3,
      uxImpact: 14,
    });
  }

  // 2. Images Missing Alt Text (WCAG 1.1.1)
  if (metadata.missingAltImagesCount > 0) {
    penalty += Math.min(25, metadata.missingAltImagesCount * 5);
    issues.push({
      id: "a11y-missing-alt-attributes",
      category: "ACCESSIBILITY",
      severity: "CRITICAL",
      title: `${metadata.missingAltImagesCount} Images Missing Alt Descriptions (WCAG 1.1.1)`,
      description: `${metadata.missingAltImagesCount} out of ${metadata.totalImages} images have no alternative text for visually impaired users.`,
      whyItMatters: "Screen readers cannot describe images without alt attributes, leaving visually impaired users unable to understand page context.",
      element: "<img>",
      recommendation: "Provide informative alt text or use alt=\"\" for purely decorative background assets.",
      codeFix: `<img src="/analytics-chart.png" alt="Bar chart showing 45% increase in weekly website traffic" />`,
      codeFixLanguage: "html",
      seoImpact: 8,
      uxImpact: 18,
    });
  }

  // 3. Form Input Label Associations (WCAG 1.3.1)
  const unlabelledInputs = $("input:not([type='hidden']):not([type='submit']):not([type='button'])").filter((_, el) => {
    const id = $(el).attr("id");
    const ariaLabel = $(el).attr("aria-label");
    const ariaLabelledBy = $(el).attr("aria-labelledby");
    const placeholder = $(el).attr("placeholder");
    const parentLabel = $(el).closest("label").length > 0;
    const hasForLabel = id ? $(`label[for='${id}']`).length > 0 : false;

    return !ariaLabel && !ariaLabelledBy && !parentLabel && !hasForLabel;
  }).length;

  if (unlabelledInputs > 0) {
    penalty += Math.min(20, unlabelledInputs * 6);
    issues.push({
      id: "a11y-missing-form-labels",
      category: "ACCESSIBILITY",
      severity: "HIGH",
      title: `${unlabelledInputs} Form Inputs Missing Visible <label> or ARIA Labels`,
      description: `${unlabelledInputs} form input elements lack explicit label connections or aria-label attributes.`,
      whyItMatters: "Screen readers need explicit labels to announce field titles to users navigating via keyboard.",
      element: "<input>",
      recommendation: "Associate input fields with explicit <label for=\"id\"> tags or add aria-label attributes.",
      codeFix: `<label for="user-email" class="block text-sm font-medium">Email Address</label>\n<input id="user-email" type="email" name="email" required />`,
      codeFixLanguage: "html",
      seoImpact: 2,
      uxImpact: 15,
    });
  }

  // 4. Missing Main Landmark Role
  const hasMainLandmark = $("main, [role='main']").length > 0;
  if (!hasMainLandmark) {
    penalty += 12;
    issues.push({
      id: "a11y-missing-main-landmark",
      category: "ACCESSIBILITY",
      severity: "MEDIUM",
      title: "Missing <main> Structural Landmark Element",
      description: "No <main> tag or element with role=\"main\" was identified on the page.",
      whyItMatters: "Landmark elements allow assistive technology users to skip directly to the primary page content.",
      element: "<body>",
      recommendation: "Wrap your primary section in a semantic <main> container.",
      codeFix: `<main id="main-content" tabIndex="-1">\n  <!-- Core Page Content -->\n</main>`,
      codeFixLanguage: "html",
      seoImpact: 3,
      uxImpact: 10,
    });
  }

  // 5. Buttons or Links with No Accessible Name
  let emptyClickables = 0;
  $("a, button").each((_, el) => {
    const text = $(el).text().trim();
    const ariaLabel = $(el).attr("aria-label");
    const title = $(el).attr("title");
    const childImgAlt = $(el).find("img[alt]").attr("alt");

    if (!text && !ariaLabel && !title && !childImgAlt) {
      emptyClickables++;
    }
  });

  if (emptyClickables > 0) {
    penalty += Math.min(18, emptyClickables * 4);
    issues.push({
      id: "a11y-empty-buttons-links",
      category: "ACCESSIBILITY",
      severity: "HIGH",
      title: `${emptyClickables} Interactive Buttons/Links Missing Accessible Text`,
      description: `Found ${emptyClickables} clickable links or buttons with no text content or aria-label attributes.`,
      whyItMatters: "Users relying on screen readers or voice control hear 'unlabeled button', rendering icons useless.",
      element: "<button> / <a>",
      recommendation: "Add descriptive text inside clickable elements or provide aria-label for icon buttons.",
      codeFix: `<button aria-label="Close dialog window" class="p-2">\n  <XIcon className="w-5 h-5" />\n</button>`,
      codeFixLanguage: "html",
      seoImpact: 4,
      uxImpact: 14,
    });
  }

  const score = Math.max(0, Math.min(100, 100 - penalty));
  return { score, issues };
}
