import { Link } from "react-router-dom";

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2H21l-6.57 7.51L22.16 22h-6.05l-4.74-6.2L5.95 22H3.19l7.03-8.03L1.84 2h6.2l4.28 5.72L18.244 2z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.94 8.5A1.56 1.56 0 1 1 6.93 5.4 1.56 1.56 0 0 1 6.94 8.5zM5.5 9.75h2.88V19H5.5V9.75zm5 0h2.76v1.26h.04c.38-.73 1.32-1.5 2.72-1.5 2.91 0 3.45 1.92 3.45 4.42V19h-2.88v-4.5c0-1.07-.02-2.45-1.49-2.45-1.49 0-1.72 1.16-1.72 2.37V19h-2.88V9.75z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.58 7.19a2.98 2.98 0 0 0-2.1-2.11C17.6 4.5 12 4.5 12 4.5s-5.6 0-7.48.58A2.98 2.98 0 0 0 2.42 7.2 31.2 31.2 0 0 0 2 12a31.2 31.2 0 0 0 .42 4.81 2.98 2.98 0 0 0 2.1 2.11c1.88.58 7.48.58 7.48.58s5.6 0 7.48-.58a2.98 2.98 0 0 0 2.1-2.11c.28-1.59.42-3.2.42-4.81s-.14-3.22-.42-4.81zM10 15.5v-7l6 3.5-6 3.5z" />
  </svg>
);

const GlobeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const normalizeUrl = (value = "") => {
  if (!value) return "";
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:")
  ) {
    return value;
  }
  return `https://${value}`;
};

const getSocialUrl = (item = {}) =>
  normalizeUrl(
    item.url || item.link || item.href || item.value || item.social_url || "",
  );

const getSocialLabel = (item = {}) =>
  String(
    item.platform ||
      item.name ||
      item.title ||
      item.type ||
      item.label ||
      item.url ||
      "",
  ).toLowerCase();

const getSocialIcon = (item) => {
  const label = getSocialLabel(item);
  const url = getSocialUrl(item).toLowerCase();
  const matchText = `${label} ${url}`;

  if (matchText.includes("facebook")) return <FacebookIcon />;
  if (
    matchText.includes("twitter") ||
    matchText.includes("x.com") ||
    matchText.includes("//x")
  ) {
    return <XIcon />;
  }
  if (matchText.includes("instagram")) return <InstagramIcon />;
  if (matchText.includes("linkedin")) return <LinkedInIcon />;
  if (matchText.includes("youtube")) return <YoutubeIcon />;

  return <GlobeIcon />;
};

const getBrandParts = (siteName = "") => {
  if (!siteName) {
    return { accent: "Hyper", rest: "Picks.ai" };
  }

  const hyperMatch = siteName.match(/^(hyper)(.*)$/i);
  if (hyperMatch) {
    return { accent: hyperMatch[1], rest: hyperMatch[2] || "" };
  }

  const [firstWord, ...restWords] = siteName.split(" ");
  return { accent: firstWord || siteName, rest: restWords.join(" ") };
};

const SocialLinks = ({ socialLinks }) => {
  if (socialLinks.length === 0) return null;

  return (
    <div className="flex gap-3">
      {socialLinks.map((item, index) => (
        <a
          key={item.id || item.url || item.link || index}
          href={getSocialUrl(item)}
          target="_blank"
          rel="noreferrer"
          aria-label={item.name || item.platform || "Social link"}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#0A9087]/10 text-[#0A9087] border border-[#0A9087]/20 hover:bg-[#0A9087]/20 hover:border-[#0A9087]/50 hover:-translate-y-0.5 transition-all duration-200"
        >
          {getSocialIcon(item)}
        </a>
      ))}
    </div>
  );
};

const ContactSection = ({ contactItems, isMobile = false }) => {
  if (contactItems.length === 0) return null;

  return (
    <div className={isMobile ? "mb-7" : ""}>
      <p
        className={`font-logo font-extrabold tracking-widest uppercase text-[#0A9087] ${
          isMobile ? "text-[11px] mb-2.5" : "text-[12px] mb-3"
        }`}
      >
        Contact
      </p>
      <div className="h-[2px] w-8 bg-[#0A9087] rounded-full mb-4" />
      <div
        className={`font-logo font-normal text-white/60 ${
          isMobile ? "text-[13px] leading-[24px]" : "text-[14px] leading-[26px]"
        }`}
      >
        {contactItems.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
    </div>
  );
};

const CtaSection = ({ title, subtitle, isMobile = false }) => (
  <div className={isMobile ? "mb-9" : ""}>
    <p
      className={`font-logo font-extrabold tracking-widest uppercase text-[#0A9087] ${
        isMobile ? "text-[11px] mb-2.5" : "text-[12px] mb-3"
      }`}
    >
      {title}
    </p>
    <div className="h-[2px] w-8 bg-[#0A9087] rounded-full mb-4" />
    <p
      className={`font-logo font-normal text-white/60 mb-5 ${
        isMobile ? "text-[13px] leading-[22px]" : "text-[14px] leading-[24px]"
      }`}
    >
      {subtitle}
    </p>
    <Link
      to="/sign-up"
      className="w-[170px] h-[44px] rounded-full border border-[#0A9087] font-logo text-white font-extrabold text-[14px] leading-none flex justify-center items-center cursor-pointer hover:bg-[#087a72] hover:shadow-[0_0_25px_rgba(10,144,135,0.4)] transition-all duration-300"
    >
      {title}
    </Link>
  </div>
);

export default function Footer({ data = {} }) {
  const currentYear = new Date().getFullYear();
  const siteName = data.site_name || "HyperPicks.ai";
  const tagline =
    data.tagline ||
    data.footer_text ||
    "AI-powered sports predictions for smarter picks.";
  const ctaTitle = data.cta_section_title || "SIGN UP";
  const ctaSubtitle =
    data.cta_section_subtitle ||
    data.footer_text ||
    data.meta_description ||
    tagline;
  const contactItems = [
    data.footer_email,
    data.footer_phone,
    data.footer_address,
  ].filter(Boolean);
  const socialLinks = Array.isArray(data.social_links)
    ? data.social_links.filter((item) => getSocialUrl(item))
    : [];
  const brandParts = getBrandParts(siteName);

  return (
    <div className="bg-[#020C0B] relative overflow-hidden py-16 sm:py-20">
      <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="hidden sm:block">
          <div className="grid grid-cols-3 gap-10 items-start">
            <div>
              {data.logo ? (
                <img
                  src={data.logo}
                  alt={siteName}
                  className="h-10 w-auto mb-5 object-contain"
                />
              ) : (
                <div className="font-logo font-extrabold text-2xl mb-3">
                  <span className="text-[#0A9087]">{brandParts.accent}</span>
                  {brandParts.rest ? (
                    <span className="text-white">{brandParts.rest}</span>
                  ) : null}
                </div>
              )}
              <p className="font-logo text-[14px] leading-[24px] text-white/60 mb-5 max-w-[280px]">
                {tagline}
              </p>
              <SocialLinks socialLinks={socialLinks} />
            </div>

            <ContactSection contactItems={contactItems} />

            <CtaSection title={ctaTitle} subtitle={ctaSubtitle} />
          </div>

          <div className="h-px w-full bg-[#0A9087]/15 my-10" />

          <div className="flex justify-between items-center">
            <p className="font-logo font-medium text-[12px] text-white/30">
              © {currentYear} {siteName} | All rights reserved
            </p>
            <div className="flex gap-7">
              <Link
                to="/privacy-policy"
                className="font-logo font-medium text-[12px] text-white/50 hover:text-[#0A9087] transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-and-conditions"
                className="font-logo font-medium text-[12px] text-white/50 hover:text-[#0A9087] transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="block sm:hidden">
          <div className="flex justify-between items-start gap-4 mb-8">
            <div>
              {data.logo ? (
                <img
                  src={data.logo}
                  alt={siteName}
                  className="h-9 w-auto object-contain"
                />
              ) : (
                <div className="font-logo font-extrabold text-xl mb-2">
                  <span className="text-[#0A9087]">{brandParts.accent}</span>
                  {brandParts.rest ? (
                    <span className="text-white">{brandParts.rest}</span>
                  ) : null}
                </div>
              )}
              <p className="font-logo text-[13px] leading-[22px] text-white/60 max-w-[180px]">
                {tagline}
              </p>
            </div>

            <div className="shrink-0">
              <SocialLinks socialLinks={socialLinks} />
            </div>
          </div>

          <ContactSection contactItems={contactItems} isMobile />
          <CtaSection title={ctaTitle} subtitle={ctaSubtitle} isMobile />

          <div className="h-px w-full bg-[#0A9087]/15 mb-6" />

          <div className="text-center">
            <p className="font-logo font-medium text-[11px] text-white/30 mb-3">
              © {currentYear} {siteName} | All rights reserved
            </p>
            <div className="flex justify-center gap-6">
              <Link
                to="/privacy-policy"
                className="font-logo font-medium text-[11px] text-white/50 hover:text-[#0A9087] transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-and-conditions"
                className="font-logo font-medium text-[11px] text-white/50 hover:text-[#0A9087] transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
