# Student Dashboard Architecture

## Purpose

The Student Dashboard is the authenticated entry point for StudioPulse students.

It provides access to practice tools, educational applications, assignments, progress, and future learning experiences.

## Current Implementation

The initial implementation includes:

- protected `/student` route
- personalized greeting
- Marketplace section
- Note Detective card
- navigation to the Note Detective host route

## Ownership

`SP-react` owns:

- dashboard layout
- student navigation
- Marketplace presentation
- application entry points
- responsive behavior
- accessibility

Standalone educational applications own:

- gameplay
- internal settings
- guest-mode persistence
- application-specific UI
- session result generation

## Design Direction

The current interface is a functional foundation.

The final visual design will be created separately and should support:

- elementary students using tablets
- middle and high school students using laptops
- clear, low-friction navigation
- future Marketplace expansion
- age-appropriate visual hierarchy
- accessible interaction patterns

## Future Sections

Potential dashboard areas include:

- assignments
- current practice plan
- educational applications
- recent progress
- achievements
- teacher messages
- recommended activities
