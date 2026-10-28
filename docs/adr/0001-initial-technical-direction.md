# ADR-0001: Dirección técnica inicial

- Estado: Aprobado para planificar; las versiones se fijan antes de iniciar implementación.
- Actualizado: 2026-10-28.
- Fecha: 2026-10-28.

## Contexto

Producto de portfolio y aprendizaje, sin infraestructura AWS real. La solución necesita editor interactivo, API, persistencia de proyectos y núcleo determinista. Se busca entrega profesional sin microservicios ni abstracción excesiva.

## Decisiones

- Frontend React + TypeScript separado del backend.
- React Flow vía `@xyflow/react` como candidato al canvas; confirmar versión/licencia/compatibilidad al bootstrap.
- Backend Java + Spring Boot en un monolito modular, API REST.
- Maven como build.
- PostgreSQL como persistencia de servidor; Flyway como candidato de migración.
- Dataset oficial AWS versionado para estimar precios, aislado de las fórmulas.
- Sin autenticación avanzada inicialmente; la propiedad/acceso a proyectos remotos debe definirse antes de exponer persistencia públicamente.
- Sin despliegue, credenciales, Terraform, CloudFormation, microservicios, Kafka, Kubernetes o IA en el MVP.

## Alternativas consideradas

- Frontend-only con IndexedDB: útil para demo sin backend, pero no satisface persistencia de servidor PostgreSQL ni API.
- Gradle: alternativa válida y con buena integración; Maven elegido por familiaridad/prolijidad de configuración.
- Microservicios: descartados por coste operativo y falta de independencia de despliegue/escalado en MVP.
- API AWS en runtime: descartada porque Query/Bulk API requieren IAM y añadirían seguridad/latencia; catálogo estático verificable funciona sin credenciales en ejecución.

## Consecuencias

- Hay dos aplicaciones que compilar/testear, aunque el backend siga siendo un deployable.
- Las fronteras de módulo se prueban dentro de un solo backend.
- PostgreSQL tiene coste operativo local, mitigable con Docker Compose en desarrollo.
- Versiones exactas de `@xyflow/react`, TypeScript, Flyway, Mockito, estilos/componentes y Compose se verifican con documentación y prueba de compatibilidad antes de fijarlas.

## Inventario de versiones consultado

Estado de fuentes oficiales consultadas al 28-oct-2026. No constituye validación de integración total:

| Tecnología | Versión propuesta | Evidencia / pendiente |
|---|---:|---|
| JDK | 25 LTS | Oracle indica LTS y roadmap; elegir distribución/proveedor/licencia. [Roadmap](https://www.oracle.com/java/technologies/java-se-support-roadmap.html) |
| Spring Boot | 4.1.2 | Requisitos publicados: Java 17–27, Maven ≥3.6.3 o Gradle 8.14+/9.x. [Requisitos](https://docs.spring.io/spring-boot/system-requirements.html) |
| Maven | 3.10.0 | Maven lo lista como una de sus dos series GA mantenidas; 4.0.0 aún RC en la consulta. [Historial](https://maven.apache.org/docs/history.html) |
| React | 19.3 | Docs oficiales lo identifican como latest; confirmar patch/npm al fijar lockfile. [Versions](https://react.dev/versions) |
| Node | 24.22.1 LTS | Página oficial lo clasifica LTS; Node 26 Current. [Releases](https://nodejs.org/en/about/previous-releases) |
| TypeScript | Pendiente | Confirmar stable exacta y compatibilidad con React/Vite en fuente oficial antes de fijar. [Downloads](https://www.typescriptlang.org/download/) |
| React Flow | Pendiente | Paquete `@xyflow/react`; consultar release/tag y licencia actuales antes de fijar. [Docs](https://reactflow.dev/) · [Releases](https://github.com/xyflow/xyflow/releases) |
| PostgreSQL | 18.6 | Soportada según política hasta 14-nov-2030; mantener minor actual. [Versioning](https://www.postgresql.org/support/versioning/) |
| pgJDBC | 42.7.14 | Publicado como actual por su web; no asumir prueba JDK25 específica. [Downloads](https://jdbc.postgresql.org/download/) |
| JUnit | 6.1.3 | Docs declaran Java 17+; confirmar alineación exacta con BOM de Boot. [Guide](https://docs.junit.org/6.1.3/overview.html) |
| Mockito | Pendiente | Elegir stable compatible y fijar; no se verificó número actual. [Releases](https://github.com/mockito/mockito/releases) |
| Flyway | Pendiente | Documentación consultada verifica PostgreSQL 18; requiere módulo de base de datos PostgreSQL en la línea actual. Confirmar versión exacta/BOM. [Docs](https://documentation.red-gate.com/fd/postgresql-database-277579325.html) |
| Vitest | 5.0.5 | Web oficial; Node ≥22.12, Vite ≥6.4. [Blog/requisitos](https://vitest.dev/blog/vitest-5) |
| ESLint | 10.13.0 | Release publicada 16-oct-2026; ESLint 9 EOL en ago-2026. [Blog](https://eslint.org/blog/) |
| Prettier | 3.9 | Release anunciada por proyecto; recomiendan pin exacto. [Blog](https://prettier.io/blog/) |
| ECharts | 6.1.0 | Changelog oficial lista release 18-may-2026. [Changelog](https://echarts.apache.org/en/changelog.html) |
| Docker Compose | v2, patch pendiente | Usar CLI `docker compose`; fijar/verificar release al definir entorno. [Docs](https://docs.docker.com/compose/) |

## Validación antes del bootstrap

Revisar release notes, compatibilidad entre versión de Spring Boot y starters/plugins, paquetes npm y peer dependencies, licencia/versión de React Flow, hashes y advisories de dependencias, soporte de CI para JDK25 y PostgreSQL18. Preferir dependencias estables; no usar snapshots, RC o `latest` móvil en builds reproducibles.
