import * as React from "react";

import { cn } from "./utils";

const defaultLegalNotice = (
  <>
    By continuing to visit any webpage within this website, each visitor agrees to the use of cookies and
    tracking technologies, and further agrees to abide by our{" "}
    <a
      href="https://www.inmotionhosting.com/legal/universal-terms-of-service/"
      className="underline hover:text-primary-foreground/80"
    >
      Universal Terms of Service
    </a>
    ,{" "}
    <a
      href="https://www.inmotionhosting.com/legal/privacy-policy/"
      className="underline hover:text-primary-foreground/80"
    >
      Privacy Policy
    </a>
    ,{" "}
    <a
      href="https://www.inmotionhosting.com/legal/cookie-policy/"
      className="underline hover:text-primary-foreground/80"
    >
      Cookie Policy
    </a>
    , and any other terms and policies posted on this website.
    {" "}
    <button
      type="button"
      className="ot-sdk-show-settings cookie-setting-link underline hover:text-primary-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded"
      aria-label="Manage cookie preferences"
    >
      Cookie Settings
    </button>
  </>
);

export type FooterProps = {
  title?: React.ReactNode;
  tagline?: React.ReactNode;
  copyright?: React.ReactNode;
  legalNotice?: React.ReactNode;
  className?: string;
  containerClassName?: string;
};

export const Footer: React.FC<FooterProps> = ({
  title = "InMotion Cloud",
  tagline = "The AI First Managed Cloud Platform",
  copyright = "© 2025 InMotion Cloud. All Rights Reserved.",
  legalNotice = defaultLegalNotice,
  className,
  containerClassName
}) => {
  return (
    <footer className={cn("py-12 bg-primary text-primary-foreground", className)}>
      <div className={cn("container mx-auto px-6", containerClassName)}>
        <div className="text-center">
          {title ? <div className="text-2xl font-bold mb-4">{title}</div> : null}
          {tagline ? <div className="text-sm text-primary-foreground/80 mb-2">{tagline}</div> : null}
          {copyright ? <div className="text-xs text-primary-foreground/60">{copyright}</div> : null}
          {legalNotice ? (
            <div className="text-xs text-primary-foreground/60 mt-4 max-w-4xl mx-auto leading-relaxed">
              {legalNotice}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  );
};
