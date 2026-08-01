---
name: India News Briefing
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#464555'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#575e70'
  on-secondary: '#ffffff'
  secondary-container: '#d9dff5'
  on-secondary-container: '#5c6274'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#dce2f7'
  secondary-fixed-dim: '#c0c6db'
  on-secondary-fixed: '#141b2b'
  on-secondary-fixed-variant: '#404758'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system for this product is centered on the intersection of high-integrity journalism and advanced artificial intelligence. The personality is **Professional, Analytical, and Effecient**, aimed at busy professionals and policy-makers who require rapid, accurate syntheses of the Indian news landscape.

The aesthetic follows a **Modern Corporate** approach with a refined **Glassmorphic** layer for top-level navigation. It prioritizes clarity and high data density without feeling cluttered. The emotional response should be one of "calm authority"—users should feel that the information is being curated and presented with absolute precision. High-quality whitespace and a disciplined color application differentiate it from traditional, "noisy" news portals.

## Colors
This design system utilizes a sophisticated palette optimized for long-form reading and quick scanning. 

- **Primary Accent:** Indigo (#4F46E5) is used sparingly for call-to-actions, active states, and AI-generated highlights to guide the user's eye to key insights.
- **Surface Strategy:** In both modes, the background and surface colors provide high contrast for cards, ensuring the information architecture is distinct and legible.
- **Muted Tones:** These are critical for metadata (e.g., timestamps, sources, and reading time) to maintain a clear hierarchy between the headline and supporting details.

## Typography
The typographic system pairs the geometric clarity of **Outfit** for headlines with the utilitarian efficiency of **Inter** for body text. 

- **Headlines:** Use Outfit with a tighter letter-spacing for a modern, tech-forward feel. The weight is set to 600 or 700 to ensure editorial authority.
- **Body:** Inter is chosen for its exceptional legibility at small sizes, particularly on mobile screens. A generous line-height of 1.5x (24px for 16px font) is maintained to reduce eye strain during deep reading.
- **Labels:** Use Inter Medium (500) or SemiBold (600) for UI elements like tags and button text to differentiate them from narrative content.

## Layout & Spacing
This design system employs a **Fluid Grid** model with a maximum container width of 1280px to prevent lines of text from becoming too wide for comfortable reading. 

- **Grid:** A 12-column layout for desktop and a 4-column layout for mobile. 
- **Rhythm:** An 8px linear scale (with a 4px "half-step" for tight UI elements) governs all padding and margins. 
- **White Space:** Use large vertical stacks (32px+) between major news sections to provide cognitive breathing room, while internal card components use tighter 16px spacing to maintain a cohesive unit of information.

## Elevation & Depth
The system uses depth to indicate information layers and interactivity:

- **Base Layer:** The background (#F9FAFB / #0F172A) acts as the canvas.
- **Card Layer:** News briefs sit on white/dark-blue cards with a soft, diffused shadow (0px 4px 20px rgba(0,0,0, 0.05)). This provides a subtle "lift" without creating harsh visual breaks.
- **Glassmorphism:** Navigation headers and sticky top-bars utilize a backdrop-blur (12px to 20px) with 80% opacity. This allows content to scroll underneath while maintaining context.
- **Interactive State:** On hover, cards should subtly scale (101%) or the shadow depth should increase to indicate clickability.

## Shapes
The shape language is consistently **Rounded**, reinforcing the modern and approachable nature of the AI service.

- **Standard Radius:** All news cards and primary containers use a 16px (1rem) radius.
- **Small Elements:** Buttons and input fields use a slightly smaller 8px radius to maintain structural integrity at smaller scales.
- **Tags/Chips:** Category tags use a fully pill-shaped (rounded-full) radius to distinguish them from functional UI components.

## Components
Consistent component styling ensures the product feels unified across summary views and full articles.

- **Buttons:** Primary buttons use the Indigo accent with white text. Secondary buttons use a subtle border and the primary text color. High-contrast hover states are required.
- **News Cards:** These are the core atoms. They must include a clear headline (Outfit), a source attribution line (Inter Label), and a 3-bullet point "AI Summary" section.
- **Chips/Tags:** Used for news categories (e.g., #Politics, #Tech). These should be low-contrast (light gray background with dark text) so as not to compete with primary buttons.
- **Input Fields:** Search bars should feature a prominent glassmorphic or white surface with a 1px border. On focus, the border transitions to the Indigo primary color.
- **AI Indicator:** Use a small, subtle gradient or icon next to summaries to indicate content generated by artificial intelligence, ensuring transparency with the user.