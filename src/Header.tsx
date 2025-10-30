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

  const navLinkClass = cn("text-gray-900 hover:text-gray-600 transition-colors", navLinkClassName);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-sm border-b border-gray-200",
        className
      )}
    >
      <div
        className={cn(
          "container mx-auto px-6 py-4 flex items-center justify-between",
          containerClassName
        )}
      >
        <div className="flex items-center">
          {resolvedLogoSrc ? (
            <img src={resolvedLogoSrc} alt={logoAltText} className="h-[46px] w-auto" />
          ) : null}
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSectionNavigation(section.id)}
              className={navLinkClass}
              type="button"
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
    </header>
  );
};

export type { Section as HeaderSection };
