# Calidad y pruebas

## Principios

- Probar comportamiento y contratos, no detalles privados de implementación.
- Cálculos deterministas y validadores deben poder probarse sin Spring ni base de datos.
- Una prueba fallida no se deshabilita para hacer pasar CI; diagnosticarla y corregir causa o especificación mediante cambio aprobado.
- Revisar dependencias y sus advisories; fijar versiones y lockfiles reproducibles.

## Pirámide prevista

### Frontend

- Unit tests de transformaciones del modelo, formularios y utilidades.
- Component tests con Testing Library para catálogo, panel de propiedades, validación y métricas, favoreciendo consultas accesibles.
- E2E breve para el camino esencial del editor cuando exista app.
- `lint`, `typecheck`, pruebas y build en CI.

### Backend

- Unit tests de validación, simulación, eventos y coste con valores de entrada y resultados esperados.
- Tests de aplicación/API para contratos, errores y versionado del documento.
- Integración PostgreSQL con Testcontainers o servicio de base de datos efímero en CI; probar Flyway desde base vacía y fixtures válidos/antiguos.
- Compilación y tests Maven en CI.

### Contrato extremo a extremo

Probar arquitectura de ejemplo serializada → validación → resultado de simulación estable, y un caso de proyecto guardado/cargado. Mantener fixtures de documentos versionados.

## CI (propuesta, no configurada todavía)

En PR y push a `main`: workflows independientes o jobs separados frontend/backend, checks con nombres estables, caché segura y permisos mínimos. Ejecutar seguridad de dependencias/secret scanning disponible sin cargar credenciales AWS. No desplegar en AWS. Marcar checks como obligatorios solo después de verificar que el workflow funciona y que GitHub los reporta como checks.

## Evidencia de finalización

PR indica qué comandos corrieron, versión runtime/toolchain, resultados, alcance no probado, riesgos conocidos y captura/video cuando la UI cambia. Revisión independiente y aprobación final del usuario son pasos explícitos, aunque CI esté verde.
