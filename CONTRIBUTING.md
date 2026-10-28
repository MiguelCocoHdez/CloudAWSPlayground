# Contribuir a CloudPlayground

Toda la comunicación y documentación del proyecto se mantiene en español. Los nombres oficiales de tecnologías, clases, variables, comandos y convenciones de programación permanecen en inglés.

## Flujo de trabajo

1. Definir cada cambio con objetivo, alcance y criterios de aceptación.
2. Obtener aprobación del usuario antes de implementarlo.
3. Comprobar estado local/remoto y crear una rama dedicada desde la base correcta.
4. Implementar el cambio con las pruebas necesarias; no compartir rama de escritura con otro agente.
5. Ejecutar comprobaciones aplicables, revisar el diff y documentar límites y riesgos.
6. Abrir un Pull Request con el resumen y evidencia de validación.
7. Solicitar revisión independiente. Quien implementa no da la aprobación final; el usuario decide la integración.

No hacer push directo a `main`, auto-merge ni cambiar/bypassear protecciones sin autorización explícita. No ocultar fallos deshabilitando pruebas o rebajando controles.

## Ramas

- `main`: rama estable.
- `feat/<nombre>`, `fix/<nombre>`, `refactor/<nombre>`, `test/<nombre>`, `docs/<nombre>`: una tarea coherente por rama.
- Usar nombres cortos y descriptivos; no reutilizar una rama ajena ni modificar archivos fuera del alcance aprobado.

## Commits

Se recomienda Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`). Los mensajes describen cambios reales; nunca afirmar que pruebas pasan sin evidencia.

## Pull Requests

Completar la [plantilla de PR](.github/PULL_REQUEST_TEMPLATE.md). Incluir issue/tarea aprobada, alcance, decisiones, pruebas ejecutadas y su resultado, capturas si cambia interfaz, limitaciones y riesgos. Dejar el PR sin auto-merge; la integración final corresponde al usuario.

## Calidad

No declarar código o tareas completos hasta ejecutar las comprobaciones aplicables. Cuando exista aplicación, la CI propuesta verificará compilación, tests y controles de calidad para frontend y backend; integraciones con PostgreSQL se verificarán con una instancia de prueba aislada. La configuración efectiva depende del futuro pipeline y debe comprobarse antes de exigir checks.

## Agentes

Asignar responsabilidades y áreas de escritura explícitas. Para trabajo paralelo, usar ramas y scopes disjuntos; coordinar dependencias y pedir revisión a alguien que no haya implementado el cambio. Consultar [AGENTS.md](AGENTS.md) para las reglas de interacción de agentes.
