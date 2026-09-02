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


## Protocolo obligatorio de generación visual de cartas

Este protocolo se ejecuta **antes de generar cualquier imagen de carta**. Su objetivo es impedir errores de orden, estadísticas, formato, rareza, atributo o habilidades.

### 1. La fuente de verdad es la lista aprobada
Cuando el usuario pida **“Carta N”**, primero se debe localizar exactamente la entrada N dentro del mazo aprobado correspondiente en este archivo. No se debe inferir por memoria, nombre parecido, conversación previa ni arte anterior.

Antes de generar, verificar obligatoriamente:
- número de carta;
- nombre exacto;
- tipo exacto;
- atributo exacto;
- rareza exacta;
- ATQ/DEF si corresponde;
- habilidades/efectos exactos;
- restricciones y edición si corresponde.

Si alguno de estos datos no coincide o está incompleto, **NO generar la imagen** hasta resolver la discrepancia.

### 2. Regla absoluta de HP
**Las cartas Monstruo y Fusión NO tienen HP.**
El HP pertenece exclusivamente al **Líder/personaje del jugador**.

Por lo tanto, una carta Monstruo/Fusión puede mostrar ATQ y DEF, pero **nunca HP como estadística propia**.

Si un efecto dice “recupera 500 HP”, significa recuperar **HP del Líder/jugador**, no HP de la carta.

### 3. Formato visual obligatorio
Todas las cartas usan formato vertical y proporción uniforme.

Especificación de archivo oficial:
- **1024 × 1434 px**;
- **WebP**;
- objetivo/máximo aprobado **≤300 KB**;
- una sola imagen oficial por ID;
- ruta objetivo: `assets/cards/CRD-XXXXXX.webp`.

Las cartas deben priorizar legibilidad y arte, sin texto innecesario.

Para Monstruos/Fusiones, mostrar como máximo:
- nombre;
- atributo;
- rareza/edición/restricción cuando corresponda;
- ilustración principal;
- **máximo 2 habilidades**, cada una con nombre propio y efecto breve;
- frase corta de ambientación;
- ATQ y DEF claramente visibles;
- **sin HP**.

Mágicas, Trampas, Reliquias, Armas y Armaduras pueden tener más efectos, pero deben mantenerse legibles.

### 4. Identidad visual por atributo
Usar como guía visual, sin convertirlo en una dependencia rígida del archivo de arte:
- **LUZ:** blanco/dorado;
- **OSCURIDAD:** negro/violeta;
- **FUEGO:** rojo/naranja;
- **ETERNIDAD:** azul profundo/cósmico.

El estilo debe poder aplicarse desde la interfaz/datos para evitar que una ruta o marco incrustado sea imprescindible para que la carta funcione.

### 5. Orden oficial de producción
El orden de la lista aprobada es vinculante. No saltar de Carta 1 a Carta 9 ni sustituir una carta por otra aunque pertenezcan al mismo mazo.

Ejemplo Caballero Rose:
- Carta 1 = **Guardián de la Rosa Blanca**.
- Carta 9 = **Caballero Rose**.

Si se pide “crea Carta 1”, generar únicamente **Guardián de la Rosa Blanca** con los datos registrados en la entrada 1.

### 6. Regla de rechazo
Una imagen se considera **inválida y no debe integrarse** si presenta cualquiera de estos errores:
- nombre distinto al aprobado;
- tipo incorrecto;
- atributo incorrecto;
- rareza incorrecta;
- ATQ/DEF distintos;
- HP impreso en Monstruo/Fusión;
- habilidad adicional no aprobada;
- habilidad omitida o cambiada;
- orden de carta equivocado;
- formato visual incompatible con esta especificación.

Una imagen inválida se descarta/regenera; **nunca se corrige cambiando el catálogo para que coincida con el error visual**.

### 7. Flujo después de aprobar una imagen
Solo después de que el usuario apruebe visualmente una carta:
1. asignar/confirmar ID permanente y familia;
2. optimizar a WebP 1024×1434 ≤300 KB;
3. guardar en su ruta única por ID;
4. validar archivo + catálogo;
5. guardar en rama de trabajo;
6. no fusionar a `main` hasta pruebas PASS;
7. no desplegar a Vercel sin autorización explícita.

### 8. Checklist mínimo que el chat debe realizar antes de cada generación
**NÚMERO → NOMBRE → TIPO → ATRIBUTO → RAREZA → ATQ/DEF → HABILIDADES/EFECTOS → FORMATO → GENERAR.**

Si el checklist falla, detener la generación.


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

## Caballero Rose — mazo aprobado 20/20

### Monstruos (9)
1. **Guardián de la Rosa Blanca** — LUZ, RARA, ATQ 2500 / DEF 2000.
   - Pétalo Protector: 1/turno, otra criatura LUZ +1000 DEF hasta fin del turno.
   - Juramento de Rose: cuando otra criatura LUZ controlada sea destruida, recupera 500 HP.
2. **Espadachín de Pétalos** — LUZ, COMÚN, ATQ 2000 / DEF 1500.
   - Corte de Rosas: al destruir criatura rival en combate, otra criatura LUZ +500 ATQ hasta fin del turno.
   - Guardia Floral: 1/turno, si otra criatura LUZ es objetivo de ataque, puede convertirse en el objetivo.
3. **Doncella del Jardín Celestial** — LUZ, RARA, ATQ 1500 / DEF 2500.
   - Luz Restauradora: 1/turno, recupera 500 HP.
   - Jardín Protector: mientras esté en Defensa, otra criatura LUZ controlada +500 DEF.
4. **Caballero de la Espina Dorada** — LUZ, ÉPICA, ATQ 3500 / DEF 2500.
   - Espina de Castigo: al ser atacada, atacante recibe 500 daño de efecto tras resolver combate si el duelo continúa.
   - Juramento Dorado: 1/turno, si controlas otra criatura LUZ, +1000 ATQ hasta fin del turno.
5. **Arquero de la Rosa Lunar** — LUZ, RARA, ATQ 2200 / DEF 1800.
   - Flecha de Pétalo: 1/turno, criatura rival -500 DEF hasta fin del turno.
   - Disparo de Apertura: si queda en 0 DEF por este efecto, otra criatura LUZ +500 ATQ hasta fin del turno.
6. **Paladín de la Rosa Solar** — LUZ, ÉPICA, ATQ 3000 / DEF 3000.
   - Escudo Solar: 1/turno, evita destrucción por efecto de otra criatura LUZ; Paladín -1000 DEF hasta fin del turno.
   - Contraofensiva Radiante: tras evitarla, otra criatura LUZ +1000 ATQ hasta fin del turno.
7. **Sacerdotisa de la Rosa Eterna** — LUZ, ÉPICA, ATQ 1500 / DEF 3000.
   - Plegaria de los Pétalos: 1/turno, recupera 1000 HP.
   - Renacer de la Rosa: 1/duelo, en Principal, devuelve 1 Monstruo LUZ del Cementerio a la mano.
8. **León Sagrado del Rosal** — LUZ, LEGENDARIA, ATQ 4000 / DEF 3500.
   - Rugido del Santuario: al invocarse, criatura rival queda Debilitada hasta fin de su próximo turno y -1000 ATQ mientras dure.
   - Instinto del Guardián: 1/turno, puede sustituir a otra criatura LUZ que fuera a ser destruida en combate; el combate continúa con sus estadísticas.
9. **Caballero Rose** — LUZ, LEGENDARIA, ATQ 5000 / DEF 4500. Monstruo insignia y más poderoso del mazo.
   - Espada de la Rosa Suprema: 1/turno en Principal, otra criatura LUZ +1000 ATQ/+1000 DEF hasta fin del turno; si destruye rival en combate, recupera 500 HP.
   - Último Juramento de Rose: 1/duelo, evita su destrucción y obtiene +1000 ATQ hasta fin de tu próximo turno.

### Mágicas (4)
10. **Jardín Sagrado de Rose** — Mágica de Campo, LUZ, ÉPICA.
   - Reino de los Pétalos: tus criaturas LUZ +500 ATQ/+500 DEF.
   - Rocío Sagrado: en Fase Final, con al menos 2 criaturas LUZ, recupera 500 HP.
   - Último Pétalo: si rival destruye esta Mágica, 1 criatura LUZ +1000 DEF hasta fin de su próximo turno.
11. **Lluvia de Pétalos Sagrados** — LUZ, RARA.
   - Recupera 1500 HP.
   - Hasta 2 criaturas LUZ +500 DEF hasta fin de su próximo turno.
   - Elimina 1 estado negativo de una criatura propia.
12. **Espada de Luz del Rosal** — LUZ, ÉPICA.
   - 1 criatura LUZ +1500 ATQ hasta fin del turno.
   - Si destruye rival en combate, elimina 1 estado negativo de una criatura propia.
   - Si es Caballero Rose, recupera además 500 HP tras esa destrucción.
13. **Renacimiento del Rosal** — LUZ, LEGENDARIA.
   - Devuelve 1 Monstruo LUZ del Cementerio a la mano.
   - Si tiene 3500+ ATQ, recupera 1000 HP.
   - Si es Caballero Rose, permite 1 Invocación Normal adicional de Caballero Rose ese turno, respetando las demás reglas.

### Trampas (3)
14. **Espinas del Juicio** — LUZ, ÉPICA.
   - Al declarar ataque contra criatura LUZ: esa criatura +1500 DEF durante ese combate.
   - Si sobrevive, atacante recibe 1000 daño de efecto.
   - Si era Caballero Rose, recupera 500 HP tras resolver.
15. **Reflejo de la Rosa Blanca** — LUZ, ÉPICA.
   - Cuando Mágica/Trampa rival seleccione criatura LUZ propia: anula ese efecto sobre la criatura.
   - La protegida +500 ATQ/+500 DEF hasta fin del turno.
   - Si era Caballero Rose, recupera 500 HP.
16. **Último Pétalo del Destino** — LUZ, LEGENDARIA, 1/duelo.
   - Cuando ataque rival fuera a reducir HP a 0: evita solo el daño de ese ataque.
   - Tras cadena, HP quedan en 1000.
   - 1 criatura LUZ propia +1500 ATQ hasta fin de tu próximo turno.

### Equipamiento (2)
17. **Espada Sagrada de Rose** — Arma, LUZ, LEGENDARIA.
   - Solo criatura LUZ. Equipada +1500 ATQ.
   - 1/turno, al destruir rival en combate, recupera 500 HP.
   - Si equipada a Caballero Rose, además +500 DEF.
18. **Armadura del Rosal Celestial** — Armadura, LUZ, LEGENDARIA.
   - Solo criatura LUZ. Equipada +1500 DEF.
   - 1/turno, reducción rival de ATQ/DEF se reduce en 500 puntos.
   - Si equipada a Caballero Rose, además +500 ATQ.

### Reliquias (2)
19. **Corazón de la Rosa Eterna** — LUZ, LEGENDARIA.
   - Fase Final, si controlas criatura LUZ, recupera 500 HP.
   - 1/turno, pérdida de DEF por efecto rival a criatura LUZ se reduce en 500.
   - Mientras controles Caballero Rose, protege esta Reliquia de la primera destrucción por efecto rival; protección se consume 1/duelo.
20. **Corona del Reino de las Rosas** — LUZ, LEGENDARIA.
   - Con al menos 2 criaturas LUZ, todas tus criaturas LUZ +500 ATQ.
   - 1/turno, cuando criatura LUZ fuera a ser destruida por efecto rival, puede perder 1000 ATQ hasta fin del turno para evitar destrucción.
   - Mientras controles Caballero Rose, este obtiene +500 DEF.

## Auditoría estratégica del mazo Rose
- Composición válida: 9 Monstruos + 4 Mágicas + 3 Trampas + 1 Arma + 1 Armadura + 2 Reliquias = **20/20**.
- Sin Fusiones en este primer mazo/Nivel 1: reduce complejidad para la primera prueba.
- Identidad coherente con LUZ: protección, recuperación, purificación, defensa y contraataque.
- Plan IA: establecer soporte → proteger piezas → reservar respuestas → potenciar atacante → cerrar con Caballero Rose/equipamiento.
- No usar curación cuando HP esté completo; reservar Reflejo/Espinas para amenazas de valor; no consumir Último Pétalo salvo daño letal.
- La IA debe priorizar Caballero Rose como pieza de cierre, no jugarlo sin protección cuando exista una línea más segura.
- Riesgo de balance identificado: múltiples curaciones/protecciones pueden alargar duelos. Requiere simulación runtime antes de fijar balance definitivo.
- Riesgo de apilamiento: Jardín + Corona + Espada + Armadura pueden llevar a Caballero Rose a estadísticas muy altas. Es intencional como combo de varias piezas, pero debe probarse contra eliminación de soporte/equipamiento.
- Aclaración de implementación: efectos “evitar destrucción”, sustitución de defensor, reducción de pérdida de estadísticas y “HP quedan en 1000” necesitan eventos deterministas y orden de resolución explícito en el motor.
- Aclaración de balance: ningún efecto de esta lista debe interpretarse como invulnerabilidad global; cada protección cubre solo el evento y condiciones descritos.
- Compatibilidad RULES_v1: estadísticas enteras, curaciones exactas, máximo 2 habilidades por Monstruo y estados oficiales respetados.
- Antes de arte final: asignar IDs/familias oficiales, normalizar wording técnico y ejecutar validación de catálogo.
- Antes de producción: pruebas unitarias de cada efecto + combinaciones críticas + simulación IA + prueba completa Nivel 1. **No desplegar aún.**

## Punto exacto de continuación
- Mazo Caballero Rose definido: **20/20**.
- Siguiente paso: normalización técnica/IDs y luego creación visual de las 20 cartas, o definir el mazo de Caballero Oscuro de Gaia según el orden aprobado.
- NO crear niveles 3–10.
- Completar y probar SOLO los 2 niveles antes de ampliar campaña.
- Esta especificación es diseño guardado; implementación debe inspeccionar primero las rutas y arquitectura reales del proyecto.
