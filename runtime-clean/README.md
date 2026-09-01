# NÉMESIS Runtime Clean

Frozen source: `7c9a1781e50dc40f460624ef296303126f82dfee`

## Hard rules
- Never import or execute `../js/game.js`.
- Assets and JSON are content sources only.
- Every card copy has an immutable `uid`.
- Architecture: ENGINE -> STATE -> EVENTS -> VIEWMODEL -> RENDERER.
- Renderer never owns card state.
- Animation failure cannot delete a card.
- Every migrated source keeps its Git blob SHA.

Phase 1 is isolated from production.
