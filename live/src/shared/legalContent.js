const TABLE_FIGURE_REGEX = /<figure class="table">(.*?)<\/figure>/gis;
const EMPTY_BLOCK_REGEX = /<(p|div)>(?:\s|&nbsp;|<br\s*\/?>)*<\/\1>/gi;

const STYLE_PROPERTIES_TO_STRIP = new Set([
  "color",
  "background",
  "background-color",
  "font-family",
]);

const wrapTableFigures = (content) =>
  content.replace(
    TABLE_FIGURE_REGEX,
    '<div class="table-wrapper"><figure class="table">$1</figure></div>',
  );

const stripUnwantedInlineStyles = (documentBody) => {
  documentBody.querySelectorAll("[style]").forEach((element) => {
    const nextStyle = (element.getAttribute("style") || "")
      .split(";")
      .map((rule) => rule.trim())
      .filter(Boolean)
      .filter((rule) => {
        const property = rule.split(":")[0]?.trim().toLowerCase();
        return property && !STYLE_PROPERTIES_TO_STRIP.has(property);
      })
      .join("; ");

    if (nextStyle) {
      element.setAttribute("style", nextStyle);
      return;
    }

    element.removeAttribute("style");
  });
};

const removeEmptyTextBlocks = (documentBody) => {
  documentBody.querySelectorAll("p, div").forEach((element) => {
    const containsStructuredContent = element.querySelector(
      "img, table, hr, ul, ol, li, figure, iframe, blockquote",
    );

    const normalizedContent = element.innerHTML
      .replace(/&nbsp;/gi, " ")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!containsStructuredContent && !normalizedContent) {
      element.remove();
    }
  });
};

const ensureResponsiveTableWrappers = (documentBody) => {
  documentBody.querySelectorAll("figure.table").forEach((figure) => {
    if (figure.parentElement?.classList.contains("table-wrapper")) {
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "table-wrapper";
    figure.parentNode?.insertBefore(wrapper, figure);
    wrapper.appendChild(figure);
  });
};

export const prepareLegalContent = (content = "") => {
  if (!content) {
    return "";
  }

  const fallbackContent = wrapTableFigures(content).replace(EMPTY_BLOCK_REGEX, "");

  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return fallbackContent;
  }

  try {
    const parser = new DOMParser();
    const document = parser.parseFromString(content, "text/html");

    stripUnwantedInlineStyles(document.body);
    removeEmptyTextBlocks(document.body);
    ensureResponsiveTableWrappers(document.body);

    return document.body.innerHTML || fallbackContent;
  } catch {
    return fallbackContent;
  }
};

export const formatLegalDate = (dateString) => {
  if (!dateString) {
    return "-";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const LEGAL_CONTENT_STYLES = `
  .legal-content {
    color: #d9ece8;
    font-size: 1rem;
    line-height: 1.8;
  }

  .legal-content * {
    color: inherit !important;
    font-family: inherit !important;
    max-width: 100%;
  }

  .legal-content h1,
  .legal-content h2,
  .legal-content h3,
  .legal-content h4,
  .legal-content h5,
  .legal-content h6,
  .legal-content strong,
  .legal-content b {
    color: #f5fbfa !important;
  }

  .legal-content h1 {
    font-size: 1.875rem;
    font-weight: 700;
    margin: 0 0 1rem;
    line-height: 1.25;
  }

  .legal-content h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 2rem 0 0.875rem;
    line-height: 1.35;
  }

  .legal-content h3,
  .legal-content h4,
  .legal-content h5,
  .legal-content h6 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 1.5rem 0 0.75rem;
    line-height: 1.45;
  }

  .legal-content p,
  .legal-content li,
  .legal-content td,
  .legal-content th,
  .legal-content blockquote {
    font-size: 1rem;
    line-height: 1.8;
  }

  .legal-content p,
  .legal-content ul,
  .legal-content ol,
  .legal-content table,
  .legal-content figure,
  .legal-content blockquote {
    margin: 0 0 1.25rem;
  }

  .legal-content p:last-child,
  .legal-content ul:last-child,
  .legal-content ol:last-child,
  .legal-content table:last-child,
  .legal-content figure:last-child,
  .legal-content blockquote:last-child {
    margin-bottom: 0;
  }

  .legal-content ul,
  .legal-content ol {
    padding-left: 1.5rem;
  }

  .legal-content li + li {
    margin-top: 0.45rem;
  }

  .legal-content hr {
    border: 0;
    border-top: 1px solid rgba(125, 225, 213, 0.18);
    margin: 2rem 0;
  }

  .legal-content a {
    color: #84e1d6 !important;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .legal-content a:hover {
    color: #b0f2ea !important;
  }

  .legal-content blockquote {
    border-left: 3px solid rgba(125, 225, 213, 0.35);
    padding-left: 1rem;
    color: #c7e9e3 !important;
  }

  .legal-content img {
    display: inline-block;
    vertical-align: middle;
    height: auto;
    border-radius: 0.5rem;
  }

  .legal-content figure.table {
    width: 100%;
    margin: 0;
  }

  .legal-content table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    background-color: rgba(2, 32, 31, 0.95) !important;
    border: 1px solid rgba(125, 225, 213, 0.16);
    border-radius: 0.75rem;
    overflow: hidden;
  }

  .legal-content thead {
    background-color: rgba(12, 70, 66, 0.95) !important;
  }

  .legal-content th {
    padding: 0.875rem 1rem;
    text-align: left;
    font-weight: 600;
    border-bottom: 1px solid rgba(125, 225, 213, 0.16);
  }

  .legal-content td {
    padding: 0.875rem 1rem;
    border-bottom: 1px solid rgba(125, 225, 213, 0.1);
    vertical-align: top;
  }

  .legal-content tbody tr:last-child td {
    border-bottom: none;
  }

  .legal-content tbody tr:nth-child(even) {
    background-color: rgba(5, 72, 68, 0.28) !important;
  }

  .table-wrapper {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin: 1.25rem 0;
    border-radius: 0.75rem;
  }

  .table-wrapper::-webkit-scrollbar {
    height: 8px;
  }

  .table-wrapper::-webkit-scrollbar-track {
    background: rgba(2, 32, 31, 0.9);
    border-radius: 999px;
  }

  .table-wrapper::-webkit-scrollbar-thumb {
    background: rgba(125, 225, 213, 0.35);
    border-radius: 999px;
  }

  .table-wrapper::-webkit-scrollbar-thumb:hover {
    background: rgba(125, 225, 213, 0.5);
  }

  @media (max-width: 768px) {
    .legal-content {
      font-size: 0.95rem;
      line-height: 1.7;
    }

    .legal-content h1 {
      font-size: 1.35rem;
    }

    .legal-content h2 {
      font-size: 1.15rem;
    }

    .legal-content h3,
    .legal-content h4,
    .legal-content h5,
    .legal-content h6,
    .legal-content p,
    .legal-content li,
    .legal-content td,
    .legal-content th {
      font-size: 0.95rem;
    }

    .legal-content table {
      min-width: 560px;
      table-layout: auto;
    }

    .legal-content th,
    .legal-content td {
      padding: 0.75rem;
      white-space: nowrap;
    }
  }
`;
