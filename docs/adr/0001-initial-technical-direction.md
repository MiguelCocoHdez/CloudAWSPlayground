# ADR-0001: Dirección técnica inicial

- Estado: Dirección aprobada; baseline de versiones aprobado para bootstrap (FD-02), integración real pendiente de FD-03.
- Actualizado: 2026-10-28.
- Fecha: 2026-10-28.

## Contexto

Producto de portfolio y aprendizaje, sin infraestructura AWS real. La solución necesita editor interactivo, API, persistencia de proyectos y núcleo determinista. Se busca entrega profesional sin microservicios ni abstracción excesiva.

## Decisiones

- Frontend React + TypeScript separado del backend.
- React Flow vía `@xyflow/react` 12.12.0 como canvas (licencia MIT); React 19.3.0 cumple el peer dependency abierto `react >=17`.
- Backend Java + Spring Boot en un monolito modular, API REST.
- Maven como build.
- PostgreSQL + Flyway como stack aprobado para almacenamiento técnico/fase posterior; los proyectos de usuario del MVP permanecen solo en IndexedDB conforme a ADR-0003.
- Para proyectos en MVP se usa IndexedDB local + exportación/importación JSON, sin cuentas ni sincronización; decisión aprobada en ADR-0003.
- No exponer proyectos en servidor hasta definir identidad, propiedad, aislamiento y autorización.
- Dataset oficial AWS versionado para estimar precios, aislado de las fórmulas.
- Sin despliegue, credenciales, Terraform, CloudFormation, microservicios, Kafka, Kubernetes o IA en el MVP.

## Alternativas consideradas

- Persistencia PostgreSQL con una cuenta desde el primer MVP: da sincronización y almacenamiento servidor, pero obliga a resolver login, recuperación, sesiones, propiedad, autorización y privacidad antes de la primera entrega. Se conserva como fase posterior; IndexedDB local satisface el guardado básico del MVP.
- Gradle: alternativa válida y con buena integración; Maven elegido por familiaridad/prolijidad de configuración.
- Microservicios: descartados por coste operativo y falta de independencia de despliegue/escalado en MVP.
- API AWS en runtime: descartada porque Query/Bulk API requieren IAM y añadirían seguridad/latencia; catálogo estático verificable funciona sin credenciales en ejecución.

## Consecuencias

- Hay dos aplicaciones que compilar/testear, aunque el backend siga siendo un deployable.
- Las fronteras de módulo se prueban dentro de un solo backend.
- PostgreSQL tiene coste operativo local, mitigable con Docker Compose en desarrollo.
- Las versiones baseline documentadas abajo quedan aprobadas para el bootstrap; las pruebas prácticas de build/runtime siguen pendientes y no se afirman como realizadas.

## Baseline aprobado y evidencia consultada

Aprobado por el usuario el 2026-10-28 tras consultar versiones, soporte/requisitos, peer dependencies y licencias en fuentes oficiales. Es un baseline de arranque, no una prueba de integración end-to-end. Las versiones indicadas son pins exactos para dependencias directas; las actualizaciones requieren revisión y CI. No usar rangos `^`/`~`, tags móviles ni snapshots.

| Área | Pin baseline | Justificación y evidencia |
|---|---|---|
| Node.js | 24.22.1 LTS | Rama 24 está en LTS; Vite 8 y su plugin React requieren Node `^20.19.0 || >=22.12.0`. Fijar versión en `.nvmrc`/`.node-version` y CI. [Releases](https://nodejs.org/en/about/previous-releases) · [Vite](https://registry.npmjs.org/vite/8.3.5) · [plugin React](https://registry.npmjs.org/%40vitejs%2fplugin-react/6.1.2) |
| React + React DOM | 19.3.0 | Mismo pin en ambos paquetes. [Versions](https://react.dev/versions) · [React](https://registry.npmjs.org/react/19.3.0) · [React DOM](https://registry.npmjs.org/react-dom/19.3.0) |
| TypeScript | 6.0.3 | Release estable anunciada por Microsoft; `@types/react` 19.3.0 requiere TS >=5.6. [Anuncio](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/) · [@types/react](https://registry.npmjs.org/%40types%2freact/19.3.0) |
| Vite + plugin oficial React | 8.3.5 + `@vitejs/plugin-react` 6.1.2 | Node compatible; el plugin declara peer Vite `^8.0.0`. [Vite](https://registry.npmjs.org/vite/8.3.5) · [Plugin](https://registry.npmjs.org/%40vitejs%2fplugin-react/6.1.2) |
| Canvas | `@xyflow/react` 12.12.0 | MIT; peers React, React DOM y tipos >=17, compatible declarativamente con React 19.3.0. [Paquete](https://registry.npmjs.org/%40xyflow%2freact/12.12.0) · [Licencia](https://raw.githubusercontent.com/xyflow/xyflow/main/LICENSE) |
| JDK | Eclipse Temurin 25.0.5+8 | Java 25 LTS. Se elige Temurin (OpenJDK de Eclipse Adoptium); fijar runtime/toolchain. [Roadmap](https://www.oracle.com/java/technologies/java-se-support-roadmap.html) · [Release](https://github.com/adoptium/temurin25-binaries/releases/tag/jdk-25.0.5%2B8) |
| Spring Boot | 4.1.2 | Requiere Java 17–27 y Maven >=3.6.3; el BOM gestiona JUnit 6.0.3 y Mockito 5.23.0. [Requisitos](https://docs.spring.io/spring-boot/system-requirements.html) · [BOM](https://repo.maven.apache.org/maven2/org/springframework/boot/spring-boot-dependencies/4.1.2/spring-boot-dependencies-4.1.2.pom) |
| Maven | 3.10.0 mediante Maven Wrapper | Serie GA mantenida; el wrapper debe fijar distribución y checksum SHA-256. [Historial](https://maven.apache.org/docs/history.html) · [Wrapper/checksum](https://maven.apache.org/tools/wrapper/) |
| PostgreSQL | 18.6 | Rama soportada; usar minor vigente y tag exacto/digest de imagen. [Política](https://www.postgresql.org/support/versioning/) |
| Flyway | 12.4.0 (`flyway-core` + `flyway-database-postgresql`) | Versiones gestionadas por BOM de Spring Boot; soporte PostgreSQL separado en su módulo. [BOM](https://repo.maven.apache.org/maven2/org/springframework/boot/spring-boot-dependencies/4.1.2/spring-boot-dependencies-4.1.2.pom) · [Módulo PostgreSQL](https://repo.maven.apache.org/maven2/org/flywaydb/flyway-database-postgresql/12.4.0/flyway-database-postgresql-12.4.0.pom) |
| pgJDBC | 42.7.14 | Versión actual consultada y gestionada por BOM. [Descargas](https://jdbc.postgresql.org/download/) · [BOM](https://repo.maven.apache.org/maven2/org/springframework/boot/spring-boot-dependencies/4.1.2/spring-boot-dependencies-4.1.2.pom) |
| Pruebas backend | JUnit Jupiter 6.0.3 + Mockito 5.23.0 | Usar versiones gestionadas por BOM, sin versión explícita para estas dependencias. [BOM](https://repo.maven.apache.org/maven2/org/springframework/boot/spring-boot-dependencies/4.1.2/spring-boot-dependencies-4.1.2.pom) |
| Vitest | 5.0.5 | Node `^22.12.0 || ^24.0.0 || >=26.0.0`, Vite peer `^6.4.0 || ^7 || ^8`; rangos compatibles con Node 24/Vite 8. [Release y requisitos](https://vitest.dev/blog/vitest-5) |
| ESLint | 10.13.0 | Node `^20.19 || ^22.13 || >=24`; ESLint 9 EOL en la fecha consultada. [Releases](https://eslint.org/blog/) · [Metadata](https://registry.npmjs.org/eslint/10.13.0) |
| Prettier | 3.9.10 | El proyecto recomienda fijar versión exacta. [Blog](https://prettier.io/blog/) · [Metadata](https://registry.npmjs.org/prettier/latest) |
| ECharts | 6.1.0 | Changelog oficial; licencia Apache-2.0. [Changelog](https://echarts.apache.org/en/changelog.html) · [Metadata](https://registry.npmjs.org/echarts/6.1.0) |
| Docker Compose (opcional) | 5.6.1 | Release estable consultada. Fijar/instalar por plataforma si se incorpora al entorno; no usar `latest`. [Release](https://github.com/docker/compose/releases/tag/v5.6.1) |

### Límites y estrategia de reproducibilidad

- Se comprobaron requisitos publicados, peers y licencias consultadas, pero no se ejecutaron instalación, build ni tests. Integración React 19 + XYFlow 12, TypeScript 6 con el tooling y Spring Boot 4.1 sobre JDK 25 debe probarse en FD-03 antes de declararse validada.
- Mantener versiones directas exactas en `package.json`, lockfile `package-lock.json` en control de versiones y `npm ci` en CI. No se generó lockfile en FD-02.
- Fijar Node exacto en `.nvmrc`/`.node-version`; Java/Maven con Maven Wrapper y checksum, JDK 25 y `maven.compiler.release=25`. Versionar plugins Maven.
- PostgreSQL debe usar tag exacto y, cuando CI lo permita, digest. Actualizar minors revisando advisories y release notes. El dataset de precios AWS se versiona aparte.
- Revisar licencias transitivas/SBOM y advisories cuando se materialice el lockfile.

## Validación antes del bootstrap

El usuario aprobó este baseline para guiar el bootstrap. FD-02 no incluye instalación, build, lockfiles ni cambios en configuración de dependencias. FD-03 debe generar lockfiles/wrapper/checksums y compilar/testear en CI con las versiones documentadas; validar peers, vulnerabilidades y licencias antes de afirmar compatibilidad real. No desplegar AWS ni usar versiones snapshot, RC o tags móviles.
