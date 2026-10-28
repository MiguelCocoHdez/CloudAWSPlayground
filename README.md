# CloudPlayground

CloudPlayground es un laboratorio visual para diseñar arquitecturas AWS y explorar, mediante simulaciones locales deterministas, su capacidad, fallos, cuellos de botella y costes estimados.

> **Alcance del MVP:** simulación local aproximada. El producto no despliega recursos en AWS, no necesita credenciales AWS y no ejecuta Terraform ni CloudFormation.

## Estado

En fase inicial de definición y preparación. Stack y arquitectura propuestos y aprobados para iniciar la planificación; versiones y compatibilidades pendientes se comprobarán antes de fijarlas en el proyecto.

## Documentación

- [Visión, alcance y MVP](docs/product/brief.md)
- [Arquitectura propuesta](docs/architecture/overview.md)
- [Modelo de arquitectura y validación](docs/architecture/model.md)
- [Simulador determinista](docs/simulation/model.md)
- [Estimador de costes y fuentes](docs/costs/pricing.md)
- [Registro de decisiones (ADR)](docs/adr/README.md)
- [Calidad y pruebas](docs/quality/testing.md)
- [Contribución y flujo Git](CONTRIBUTING.md)
- [Instrucciones para agentes](AGENTS.md)

## Stack acordado para iniciar

- Frontend: React + TypeScript + React Flow (`@xyflow/react`), con verificación de versión/licencia antes de fijar dependencias.
- Backend: Java + Spring Boot, API REST y monolito modular.
- Build: Maven.
- Persistencia de servidor: PostgreSQL con migraciones Flyway.
- Costes: dataset oficial AWS versionado, con procedencia y supuestos visibles.

El inventario de versiones, fuentes y cuestiones por verificar está en [ADR-0001](docs/adr/0001-initial-technical-direction.md). No instalar dependencias ni inferir que las políticas remotas de GitHub están activas hasta que se comprueben.

## Inicio

Todavía no hay código ejecutable ni guía de instalación local. La implementación comenzará mediante cambios pequeños, aprobados y revisados con Pull Requests.

