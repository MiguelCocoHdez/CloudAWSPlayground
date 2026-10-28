# CloudPlayground

CloudPlayground es un laboratorio visual para diseñar arquitecturas cloud y explorar, mediante simulaciones locales deterministas, su capacidad, fallos, cuellos de botella y costes estimados.

> **Alcance del MVP:** simulación local aproximada. No despliega recursos en AWS, no necesita credenciales AWS y no ejecuta Terraform ni CloudFormation.

## Estado

Scaffold inicial de frontend/backend y CI. Las tareas funcionales del MVP continúan planificándose en Kanvas.

## Stack fijado

- Frontend: React 19.3.0, TypeScript 6.0.3, Vite 8.3.5, React Flow (`@xyflow/react`) 12.12.0.
- Backend: Java 25 (Eclipse Temurin 25.0.5+8), Spring Boot 4.1.2 y Maven Wrapper 3.10.0.
- PostgreSQL 18.6 es opcional para desarrollo e integración futura. Los proyectos del MVP se guardan localmente en IndexedDB; no hay endpoints de persistencia remota.
- Costes: dataset oficial AWS versionado, sin consulta a AWS en runtime.

## Requisitos locales

- Node.js 24.22.1 y npm 10.9.0 (frontend).
- Eclipse Temurin JDK 25.0.5+8.
- Docker Desktop con Compose v2 (solo si se necesita PostgreSQL local).

Usamos el Maven Wrapper, que descarga Maven 3.10.0 y valida el SHA-256 de la distribución. Ejecuta `mvnw.cmd` en Windows o `./mvnw` en macOS/Linux.

## Desarrollo

Frontend, desde `frontend/`:

```bash
npm ci
npm run dev
```

Backend, desde la raíz, en otra terminal:

```bash
./mvnw spring-boot:run
```

En Windows usa `./mvnw.cmd spring-boot:run`. Direcciones: UI en <http://localhost:5173>; salud de API en <http://localhost:8080/api/health>. El frontend todavía no configura proxy al backend.

PostgreSQL es opcional y no inicia en `docker compose up` por defecto. Para el perfil de integración, ejecuta `docker compose --profile integration up -d postgres`; para pararlo sin borrar los datos, `docker compose --profile integration stop postgres`. El puerto solo se enlaza a `127.0.0.1`. La contraseña local por defecto es exclusivamente de desarrollo. Flyway se mantiene desactivado por defecto y no hay almacenamiento de proyectos en la base.

## Checks

```bash
cd frontend
npm ci
npm run lint
npm run format:check
npm run typecheck
npm test
npm run build

cd ..
./mvnw --batch-mode verify
```

GitHub Actions ejecuta lint, formato, typecheck, pruebas y build del frontend, además de `mvnw verify` para backend. CI también verifica el SHA-512 oficial de la distribución Maven descargada por el wrapper. Dependabot actualiza dependencias npm y acciones; los PRs de actualización requieren revisión y CI. No hay auto-merge.

Para crear la imagen Docker, primero empaqueta backend (`./mvnw -B verify`) y ejecuta `docker build -t cloudplayground:local .`. La imagen sirve el backend; los archivos del frontend se incluyen como activos, pero la API de salud es el único endpoint funcional por ahora.

## Documentación

- [Brief de producto](docs/product/brief.md)
- [Arquitectura](docs/architecture/overview.md)
- [Modelo de arquitectura](docs/architecture/model.md)
- [Simulador determinista](docs/simulation/model.md)
- [Fuentes de costes](docs/costs/pricing.md)
- [Registro ADR](docs/adr/README.md)
- [Calidad y pruebas](docs/quality/testing.md)
- [Contribuir](CONTRIBUTING.md)
