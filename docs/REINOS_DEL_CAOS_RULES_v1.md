# NÉMESIS: REINOS DEL CAOS — RULES_v1 (Diseño aprobado)

> Especificación de diseño guardada antes de implementación. No desplegar por este commit.

## Motor y reglas base
- Mazo principal: exactamente 20 cartas.
- Mazo de Fusión: 0–5 cartas, separado. Fusiones nunca entran al mazo principal.
- Toda Fusión requiere exactamente 2 materiales y un efecto que autorice Fusionar.
- Cementerio y Destierro de Fusiones separados. Retorno a mano/mazo devuelve la Fusión al Mazo de Fusión.
- Máximo 5 zonas de criaturas; 3 soporte; 2 Reliquias; 1 Mágica de Campo.
- Mano inicial 5. Robo normal 1/turno; jugador inicial no roba en su primer turno.
- Con 7+ cartas en mano no hay robo normal. Efectos de carta sí pueden superar 7 (p.ej. robar 3 teniendo 6).
- Fatiga por robo con mazo vacío: 500, 1000, 1500... daño creciente de 500.
- 1 Invocación Normal/turno. Criatura recién invocada normalmente no ataca salvo texto específico.
- Posiciones Ataque/Defensa; cambio 1 vez/turno y no el turno de invocación salvo efecto.
- ATQ/DEF/HP: enteros; sin decimales, porcentajes ni multiplicadores. Diseño normalmente en múltiplos de 100.
- Curación siempre por cantidad exacta. Efectos periódicos por cantidad exacta y fase explícita.
- Jerarquía: regla general < texto específico de carta < regla absoluta.

## Combate
- ATQ vs ATQ: menor destruida y diferencia como daño al propietario; empate destruye ambas sin daño.
- ATQ vs DEF: si ATQ>DEF, defensor destruido y diferencia daña al propietario; si ATQ<DEF, atacante recibe diferencia como HP; empate destruye ambas sin daño.
- Ataque directo cuando corresponda.
- Daño: Combate o Efecto.

## Turnos, cadenas y estados
- Fases: Inicio, Robo, Principal, Combate, Principal 2, Final.
- PvP: 90 s por turno; ventana de respuesta 10 s; cadena máx. 8; resolución LIFO.
- Reconexión: 60 s. Tres turnos consecutivos agotados sin acción válida = derrota por inactividad.
- Estados oficiales: Aturdido, Sellado, Congelado, Envenenado, Debilitado, Protegido.
- Estados distintos coexisten; mismo estado acumula solo si la carta lo indica. Al abandonar campo se limpian.
- Duraciones por turnos del jugador afectado.
- Acciones confirmadas irreversibles. Rendición disponible.

## Líderes y progresión
- Líder independiente del mazo; cualquier Líder puede usar cualquier mazo legal.
- Líder fijo durante el duelo, con transformaciones cuando correspondan; transformación no cura salvo efecto.
- Cada Líder tiene Nivel/EXP independientes. Nivel máximo inicial 80; al 80 deja de acumular EXP.
- HP base por hitos: N1 10.000; N10 12.000; N20 14.000; N30 16.000; N40 18.000; N50 20.000; N60 22.000; N70 23.500; N80 25.000.
- Recompensas de nivel: HP por hitos, Estrellas, Fragmentos, cartas, cosméticos y especiales. Cada Líder tiene recompensa exclusiva N80.
- Matchmaking público: comienza ±3 niveles y amplía hasta máximo absoluto ±10. HP real, sin normalización.
- Duelo entre amigos sin límite de nivel, con aceptación y visualización de nivel/HP. Anti-farming.

## Atributos y cartas
- 4 atributos oficiales: LUZ, OSCURIDAD, FUEGO, ETERNIDAD.
- Identidad: LUZ protección/curación/HP/purificación/defensa; OSCURIDAD destrucción/sacrificio/cementerio/destierro/debilitamiento; FUEGO ofensiva/daño/presión/daño periódico; ETERNIDAD transformación/resurrección/control/manipulación/larga duración.
- No hay ventajas automáticas entre atributos; solo si el texto de una carta lo indica.
- Todas las cartas y Líderes tienen 1 atributo por ahora; arquitectura preparada para doble atributo futuro.
- Mazos multatributo libres.
- Rarezas: COMÚN, RARA, ÉPICA, LEGENDARIA. Rareza no aumenta estadísticas automáticamente.
- Edición separada: Normal/Shiny. Shiny puede tener arte, ATQ/DEF y habilidades diferentes y posee ID propio.
- Restricción ÚNICA separada. Máximo 2 cartas por familia en mazo; variante ÚNICA máx. 1 copia de esa variante.
- Monstruos y Fusiones: máximo 2 habilidades, cada una con nombre propio + efecto breve; 1 frase corta de ambientación.
- Mágicas, Trampas, Reliquias, Armas y Armaduras pueden tener más de 2 efectos.

## Identidad, imágenes y catálogo
- Triple identidad: ID permanente de carta + ID de familia + UID de instancia de duelo.
- Limitada Numerada: además ID único permanente de copia y número público #NNN/total.
- 1 ID de carta = 1 imagen oficial.
- Imagen estándar: WebP 1024x1434, objetivo/máximo aprobado ≤300 KB.
- Ruta objetivo única por ID: assets/cards/CRD-XXXXXX.webp.
- Catálogo Maestro único + validador obligatorio de IDs, familia, tipo, atributo, rareza, edición, imagen, estadísticas y habilidades.
- Carga bajo demanda + caché. No precargar todo el catálogo.

## Inventario, colección, canje y mazos
- Inventario ilimitado; puede poseer más de 2 copias, aunque el mazo respeta límite por familia.
- Catálogo define cartas; inventario guarda ID + cantidad.
- Inventario, Colección y Canje: mismo componente, 20 cartas por página.
- Filtros: atributo, tipo, rareza, edición, restricción y nombre. Orden: nombre, ATQ, DEF, rareza, recientes.
- Modal de detalle conserva página/filtros.
- Constructor: inventario + Mazo 0/20 + Fusión 0/5; validación inmediata; Guardar solo con 20 válidas.
- Hasta 10 mazos por jugador; nombre máx. 30; 1 favorito. Edición mediante borrador y validación. Eliminación con confirmación.
- Si falta propiedad, el mazo no se altera: queda NO VÁLIDO.

## Economía, exclusividad e intercambio
- Recursos: Estrellas + Fragmentos de LUZ/OSCURIDAD/FUEGO/ETERNIDAD.
- Costes pueden ser Estrellas, Fragmentos o combinaciones, incluso varios atributos, según carta.
- Cartas exclusivas por campaña/jefe/evento/logro/recompensa.
- Limitadas temporales y numeradas; se permiten LEGENDARIA + SHINY + ÚNICA + LIMITADA NUMERADA.
- Intercambio directo en primera versión; Mercado queda para después.
- Intercambio solo entre amigos; puede incluir múltiples cartas + Estrellas + Fragmentos.
- Cambio de oferta reinicia confirmaciones; 5 min de inactividad cancela. Operación atómica.
- Cartas bloqueables contra intercambio. Carta usada en mazo puede intercambiarse con advertencia; mazo puede quedar NO VÁLIDO.
- Sin intercambio durante duelo activo. Historial permanente de intercambios.
- Amigos: nombre visible + ID público único + ID interno privado; solicitudes y bloqueo. Chat queda para después.
- Retos directos a amigos + matchmaking público. Revancha disponible.
- Historial de duelos y registro técnico mínimo; sin replay.
- Perfil público: duelos, victorias, derrotas, empates, % victorias, rachas y Líder más usado.

## Campaña — Isla: Reino del Caos
- Arquitectura extensible a 50 niveles, pero primera prueba implementará SOLO 2 niveles para minimizar errores/peso.
- Progreso lineal. Ganar desbloquea siguiente. Nivel ganado puede repetirse indefinidamente.
- Campaña gratis: sin energía/tickets/vidas. Derrota no quita recursos/progreso y no da recompensas.
- Solo victoria entrega EXP del Líder + Estrellas + Fragmentos + drops.
- Primera victoria tiene recompensa mayor; repetición menor. Cantidades de EXP/Estrellas/Fragmentos fijas por nivel.
- Drops de cartas probabilísticos con porcentajes visibles.
- En estructura futura: N5 Guardián y N10 Jefe, pero NO implementar aún.
- Los rivales usan el mismo motor oficial de duelo y mazos legales; dificultad mediante IA/mazo, no trampas ocultas.

### Prototipo de 2 niveles
1. **Nivel 1 — Caballero Rose**: Líder N1, 10.000 HP, atributo LUZ. Mazo estratégico de 20 cartas.
2. **Nivel 2 — Caballero Oscuro de Gaia**: Líder N3, 10.000 HP, atributo OSCURIDAD. Bloqueado hasta vencer Nivel 1.

## Caballero Rose — cartas aprobadas 1–5
1. **Guardián de la Rosa Blanca** — Monstruo, LUZ, RARA, ATQ 2500 / DEF 2000.
   - Pétalo Protector: 1/turno, otra criatura LUZ +1000 DEF hasta fin del turno.
   - Juramento de Rose: cuando otra criatura LUZ controlada sea destruida, recupera 500 HP.
   - Ambientación: “Mientras una rosa permanezca en pie, la luz no desaparecerá.”
2. **Espadachín de Pétalos** — Monstruo, LUZ, COMÚN, ATQ 2000 / DEF 1500.
   - Corte de Rosas: al destruir criatura rival en combate, otra criatura LUZ +500 ATQ hasta fin del turno.
   - Guardia Floral: 1/turno, si otra criatura LUZ es objetivo de ataque, puede convertirse en el objetivo.
   - Ambientación: “Su espada no protege una corona; protege el último jardín de la luz.”
3. **Doncella del Jardín Celestial** — Monstruo, LUZ, RARA, ATQ 1500 / DEF 2500.
   - Luz Restauradora: 1/turno, recupera 500 HP.
   - Jardín Protector: mientras esté en Defensa, otra criatura LUZ controlada +500 DEF.
   - Ambientación: “Donde sus pétalos caen, incluso las heridas recuerdan cómo sanar.”
4. **Caballero de la Espina Dorada** — Monstruo, LUZ, ÉPICA, ATQ 3500 / DEF 2500.
   - Espina de Castigo: al ser atacada, atacante recibe 500 daño de efecto tras resolver combate si el duelo continúa.
   - Juramento Dorado: 1/turno, si controlas otra criatura LUZ, +1000 ATQ hasta fin del turno.
   - Ambientación: “La belleza de la rosa termina donde comienza su espada.”
5. **Arquero de la Rosa Lunar** — Monstruo, LUZ, RARA, ATQ 2200 / DEF 1800.
   - Flecha de Pétalo: 1/turno, criatura rival -500 DEF hasta fin del turno.
   - Disparo de Apertura: si esa criatura queda en 0 DEF por este efecto, otra criatura LUZ +500 ATQ hasta fin del turno.
   - Ambientación: “Un solo pétalo señala dónde caerá la próxima flecha.”

## Punto exacto de continuación
- NO crear todavía niveles 3–10.
- Continuar desde **Carta 6 del mazo de Caballero Rose**.
- Completar y probar los 2 niveles de punta a punta antes de ampliar campaña.
- Esta especificación es diseño guardado; implementación debe inspeccionar primero las rutas y arquitectura reales del proyecto.
