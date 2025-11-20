import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "./Button";
import defaultLogo from "./assets/im-cloud-logo.png";
import { cn } from "./utils";

type Section = {
  id: string;
  label: string;
};

const defaultSections: Section[] = [
  { id: "migrations", label: "Migrations" },
  { id: "ai-copilot", label: "AI Co-Pilot" },
  { id: "pricing", label: "Pricing" }
];

type LogoSource = string | { src?: string } | { default?: string }

const resolveLogoSrc = (value: unknown): string | undefined => {
  if (!value) {
    return undefined;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && value !== null) {
    if ("src" in value && typeof (value as { src?: unknown }).src === "string") {
      return (value as { src: string }).src;
    }

    if ("default" in value && typeof (value as { default?: unknown }).default === "string") {
      return (value as { default: string }).default;
    }
  }

  return undefined;
};

export type HeaderProps = {
  sections?: Section[];
  supportHref?: string | null;
  supportLabel?: string;
  blogHref?: string | null;
  blogLabel?: string;
  ctaLabel?: string;
  onSectionNavigate?: (sectionId: string) => void;
  onCtaClick?: () => void;
  logoSrc?: LogoSource;
  logoAltText?: string;
  className?: string;
  containerClassName?: string;
  navLinkClassName?: string;
};

export const Header: React.FC<HeaderProps> = ({
  sections = defaultSections,
  supportHref = "/support",
  supportLabel = "Support",
  blogHref = "/blog",
  blogLabel = "Blog",
  ctaLabel = "Sign Up For Updates",
  onSectionNavigate,
  onCtaClick,
  logoSrc,
  logoAltText = "IMHCloud Logo",
  className,
  containerClassName,
  navLinkClassName
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = React.useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = React.useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  React.useEffect(() => {
    closeMobileMenu();
  }, [closeMobileMenu, location.hash, location.pathname, location.search]);

  const resolvedLogoSrc =
    resolveLogoSrc(logoSrc) ??
    resolveLogoSrc(defaultLogo) ??
    (typeof defaultLogo === "string" ? defaultLogo : undefined);

  const scrollToSection = React.useCallback((sectionId: string) => {
    if (typeof document === "undefined") {
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleSectionNavigation = React.useCallback(
    (sectionId: string) => {
      if (onSectionNavigate) {
        onSectionNavigate(sectionId);
        return;
      }

      const targetHash = `#${sectionId}`;
      const targetPath = `/${targetHash}`;

      if (location.pathname === "/") {
        scrollToSection(sectionId);
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", targetHash);
        }
        return;
      }

      try {
        navigate(targetPath);
      } catch (error) {
        if (typeof window !== "undefined") {
          window.location.assign(targetPath);
        }
      }
    },
    [location.pathname, navigate, onSectionNavigate, scrollToSection]
  );

  const handleCtaClick = React.useCallback(() => {
    if (onCtaClick) {
      onCtaClick();
      return;
    }

    handleSectionNavigation("request-access");
  }, [handleSectionNavigation, onCtaClick]);

  const handleMobileSectionClick = React.useCallback(
    (sectionId: string) => {
      closeMobileMenu();
      handleSectionNavigation(sectionId);
    },
    [closeMobileMenu, handleSectionNavigation]
  );

  const handleMobileCtaClick = React.useCallback(() => {
    closeMobileMenu();
    handleCtaClick();
  }, [closeMobileMenu, handleCtaClick]);

  const navLinkClass = cn("text-gray-900 hover:text-gray-600 transition-colors", navLinkClassName);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 z-50 bg-white backdrop-blur-sm border-b border-gray-200",
        className
      )}
      style={{ top: "var(--payload-admin-bar-offset, 0px)" }}
    >
      <div
        className={cn(
          "container mx-auto px-6 py-4 flex items-center justify-between gap-4",
          containerClassName
        )}
      >
        <div className="flex items-center">
          {resolvedLogoSrc ? (
            <a href="/" aria-label="Return to homepage" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">
              <img src={resolvedLogoSrc} alt={logoAltText} className="h-[46px] w-auto" />
            </a>
          ) : null}
        </div>

        <div className="flex items-center gap-4">
          <button
            aria-controls="mobile-navigation"
            aria-expanded={mobileMenuOpen}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-900 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onClick={toggleMobileMenu}
            type="button"
          >
            <span className="sr-only">Toggle navigation</span>
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <nav className="hidden md:flex items-center space-x-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionNavigation(section.id)}
                className={navLinkClass}
                type="button"
                role="link"
                aria-label={`Navigate to ${section.label} section`}
              >
                {section.label}
              </button>
            ))}
            {supportHref ? (
              <a href={supportHref} className={navLinkClass}>
                {supportLabel}
              </a>
            ) : null}
            {blogHref ? (
              <a href={blogHref} className={navLinkClass}>
                {blogLabel}
              </a>
            ) : null}
            <Button
              variant="primary"
              size="sm"
              onClick={handleCtaClick}
              type="button"
            >
              {ctaLabel}
            </Button>
          </nav>
        </div>
      </div>

      <nav
        aria-hidden={!mobileMenuOpen}
        className={cn(
          "md:hidden border-t border-gray-200 bg-white",
          mobileMenuOpen ? "block" : "hidden"
        )}
        id="mobile-navigation"
      >
        <div className="container mx-auto flex flex-col gap-4 px-6 py-4">
          {sections.map((section) => (
            <button
              key={`mobile-${section.id}`}
              onClick={() => handleMobileSectionClick(section.id)}
              className={cn(navLinkClass, "w-full text-left text-base")}
              type="button"
              role="link"
              aria-label={`Navigate to ${section.label} section`}
            >
              {section.label}
            </button>
          ))}
          {supportHref ? (
            <a
              href={supportHref}
              onClick={closeMobileMenu}
              className={cn(navLinkClass, "text-base")}
            >
              {supportLabel}
            </a>
          ) : null}
          {blogHref ? (
            <a
              href={blogHref}
              onClick={closeMobileMenu}
              className={cn(navLinkClass, "text-base")}
            >
              {blogLabel}
            </a>
          ) : null}
          <Button
            className="w-full"
            onClick={handleMobileCtaClick}
            type="button"
            variant="primary"
          >
            {ctaLabel}
          </Button>
        </div>
      </nav>
    </header>
  );
};

export type { Section as HeaderSection };
