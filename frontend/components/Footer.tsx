interface FooterProps {
  isDark: boolean;
}

export default function Footer({ isDark }: FooterProps) {
  return (
    <footer
      id="main-footer"
      className="w-full py-[var(--spacing-stack-lg)] mt-[var(--spacing-stack-lg)] flex flex-col items-center justify-center px-[var(--spacing-margin-mobile)] text-center border-t"
      style={{
        backgroundColor: isDark
          ? "var(--color-dark-bg)"
          : "var(--color-background)",
        borderColor: isDark
          ? "rgba(199, 196, 216, 0.2)"
          : "var(--color-outline-variant)",
      }}
    >
      <p
        className="text-sm font-medium mb-4"
        style={{
          color: isDark
            ? "var(--color-secondary-fixed-dim)"
            : "var(--color-secondary)",
        }}
      >
        Powered by AI • Built with n8n
      </p>
      <div className="flex gap-4">
        {["Privacy Policy", "Terms of Service", "Contact Support"].map(
          (link) => (
            <a
              key={link}
              href="#"
              className="text-xs font-semibold underline transition-colors"
              style={{
                color: isDark
                  ? "var(--color-outline-variant)"
                  : "var(--color-on-surface-variant)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = isDark
                  ? "var(--color-outline-variant)"
                  : "var(--color-on-surface-variant)")
              }
            >
              {link}
            </a>
          )
        )}
      </div>
    </footer>
  );
}
