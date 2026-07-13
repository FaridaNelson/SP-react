# Host Application Architecture

## Purpose

The StudioPulse host application is responsible for embedding standalone educational applications inside the authenticated student experience.

The first hosted application is **Note Detective**.

## Responsibilities

The host application owns:

- authenticated student context
- iframe rendering
- trusted application URL configuration
- loading and error states
- navigation back to the Student Dashboard
- future message validation
- future GameProgress API communication

Standalone educational applications do not receive direct access to StudioPulse authentication tokens, MongoDB, or backend internals.

## Integration Boundary

```text
Student
  ↓
SP-react Host
  ↓ iframe
Standalone Application
  ↓ postMessage
SP-react Session Bridge
  ↓ authenticated API
SP-express
```

## Current Scope

The current host implementation includes:

- protected student route
- Note Detective placeholder page
- student-only access
- dashboard navigation

## Future Scope

Future host work will include:

- configurable iframe source
- iframe loading state
- unavailable/error state
- origin validation
- application-ready handshake
- session event handling
- GameProgress persistence

## Security Principles

- StudioPulse owns authentication.
- Hosted applications do not receive database credentials.
- Messages must be validated by origin, type, and payload shape.
- Backend persistence must use StudioPulse’s authenticated API.
- Wildcard message origins should not be used in production.
