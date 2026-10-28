# Instrucciones para agentes de CloudPlayground

## Fuente de verdad

- Alcance funcional: [docs/product/brief.md](docs/product/brief.md).
- Decisiones y alternativas: [docs/adr/](docs/adr/).
- Arquitectura y límites: [docs/architecture/overview.md](docs/architecture/overview.md).
- Contrato del modelo: [docs/architecture/model.md](docs/architecture/model.md).
- Reglas del simulador: [docs/simulation/model.md](docs/simulation/model.md).
- Fuentes y supuestos de costes: [docs/costs/pricing.md](docs/costs/pricing.md).
- Proceso Git y PR: [CONTRIBUTING.md](CONTRIBUTING.md).

Si los documentos discrepan, no inventes una resolución: informa del conflicto y solicita una decisión. Actualiza el documento fuente apropiado cuando una decisión cambie.

## Límites operativos

- La planificación, documentación y comunicación del repositorio se hacen en español.
- No ampliar alcance ni empezar otra tarea no aprobada. Presentar objetivo, cambios previstos y criterios antes de implementar.
- No desplegar infraestructura AWS, pedir/us ar credenciales reales, ni añadir Terraform, CloudFormation, Kafka, Kubernetes o IA al MVP.
- No instalar dependencias o herramientas sin aprobación específica.
- No borrar, mover ni sobrescribir trabajo existente; inspeccionar Git antes de escribir.
- No hacer push directo a `main`, no auto-mergear y no cambiar protecciones remotas.
- No declarar pruebas, CI, rama protegida, acceso remoto o funcionalidades disponibles sin evidencia.
- Mantener los cambios acotados y no editar áreas asignadas a otra tarea/agente.
- El implementador debe añadir pruebas y revisar su diff, pero no puede ser la única revisión. El usuario mantiene la aprobación final de integración.

## Evidencias para cerrar una tarea

Reportar archivos/cambios, rama y estado Git, comandos ejecutados con resultados, pruebas omitidas y motivos, riesgos y revisión independiente pendiente o completada. No ocultar tests fallidos ni reducir controles para obtener un verde artificial.
