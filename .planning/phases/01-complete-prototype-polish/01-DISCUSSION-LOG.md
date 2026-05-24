# Phase 1: Complete Prototype Polish — Discussion Log

**Date:** 2026-05-24
**Areas discussed:** 4

## Swiggy Integration Flow
| Question | Options | Selected |
|----------|---------|----------|
| How should Swiggy MCP be invoked? | MCP tool call / deeplink / research docs | MCP tool call (direct) |
| Fallback on failure? | Error + retry / Blinkit fallback / Option B fallback | Show error + retry button |

## Empty States Design
| Question | Options | Selected |
|----------|---------|----------|
| How should empty states look? | Icon+title+subtitle / text only / you decide | Icon + title + subtitle |
| CTA buttons on empty states? | Yes contextual / No text only | Yes — contextual CTA |

## Impact Card + QR Code
| Question | Options | Selected |
|----------|---------|----------|
| Impact card share mechanism? | Screenshot hint / Web Share API / html2canvas | Screenshot hint only |
| QR code approach? | qrcode.react inline / qrcode.react modal / API-generated image | API-generated image (api.qrserver.com) |

## Notification Prefs Persistence
| Question | Response |
|----------|----------|
| Persist toggles how? | Session state only |
| Which toggles? | BRD spec: Email alerts, WhatsApp updates, Monthly impact summary |

## Deferred Ideas
- Mobile responsive (375px/768px) → v2
- Backend/auth → future milestone
