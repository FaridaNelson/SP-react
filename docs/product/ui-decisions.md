# Frontend UI Decisions

## Purpose

This document records frontend product and interface decisions that affect multiple features.

## Student Experience

- Student routes use a dedicated application experience.
- The public marketing Header and Footer are hidden inside student application routes.
- Student navigation should remain simple and age-appropriate.
- Tablet and laptop layouts are first-class requirements.

## Marketplace

- Educational applications appear as clear, discoverable cards.
- Each application has its own protected host route.
- The Marketplace should support future expansion without requiring a dashboard redesign.
- Hosted applications remain visually and technically independent.

## Note Detective

- Note Detective is presented as a standalone educational application.
- StudioPulse provides the host and authenticated platform context.
- The initial host page is a placeholder until the standalone application is ready.
- Final integration will use iframe and validated messaging.

## Design Collaboration

Functional implementation and final visual design may proceed separately.

Temporary UI should not be treated as a permanent design requirement.

## Accessibility

Frontend work should include:

- semantic headings
- keyboard-accessible controls
- visible focus states
- descriptive iframe titles
- readable responsive typography
- sufficient touch target sizes
