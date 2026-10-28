# Arquitectura propuesta

## Estilo

Frontend separado y backend como monolito modular. Es suficiente para un único producto con un solo equipo y permite límites de dominio sin asumir coste operacional de microservicios. Modularizar con paquetes y pruebas; extraer procesos solo cuando una necesidad real (escalado, despliegue, aislamiento o propiedad organizativa) lo justifique.

## Responsabilidades

- **Frontend React/TypeScript:** canvas y componentes, estado efímero de interacción, formularios, validación inmediata opcional, visualización de resultados y reproducción/animación. No es autoridad para cálculos de persistencia o costes.
- **Backend Spring Boot REST:** API, persistencia, validación autoritativa, cálculo determinista, datos de precios y resultados con procedencia.
- **PostgreSQL:** metadatos de proyecto relacionales y documento de arquitectura `JSONB` versionado.

## Módulos lógicos (un proyecto Maven inicialmente)

- `architecture`: tipos, puertos, configuración y serialización/versionado.
- `validation`: compatibilidad de puertos, campos, ruta entrada-destino y detección de ciclo.
- `simulation`: recorrido, capacidad y métricas puras deterministas.
- `events`: fallos, recuperación, escalado y orden temporal explícito.
- `cost`: carga/consulta de dataset y cálculo por unidades de consumo.
- `projects`: casos de uso de crear, listar, recuperar, renombrar y guardar.
- `persistence`: adaptadores PostgreSQL/Flyway.
- `api`: controladores REST, DTOs, versionado de API y mapeo de errores.

## Límites de dependencia

El dominio no depende de Spring, React ni PostgreSQL. Casos de uso reciben dependencias mediante interfaces solo donde una frontera externa lo justifica: por ejemplo, `ProjectRepository`, `PriceCatalog` y `SimulationEngine`. API traduce DTOs a modelos de aplicación. Persistencia implementa repositorios. Evitar abstracciones/puertos sin un motivo de cambio o prueba.

## API conceptual

- `POST /api/projects` crear proyecto.
- `GET /api/projects` listar proyectos visibles al usuario/instalación.
- `GET /api/projects/{id}` cargar.
- `PUT /api/projects/{id}` guardar arquitectura/configuración con control de versión de documento.
- `PATCH /api/projects/{id}` renombrar.
- `POST /api/architectures/validate` validar sin guardar.
- `POST /api/simulations` validar y calcular escenario/eventos; devolver resumen, series y métricas por nodo.
- `GET /api/prices/catalog?region=...&currency=...` consultar dataset disponible y procedencia.
- `POST /api/cost-estimates` calcular estimación con referencias/versiones de tarifas.

Son contratos de trabajo, no API implementada. Para concurrencia optimista, incluir `ETag`/`If-Match` o versión en el proyecto antes de multiusuario.

## Identidad y persistencia

PostgreSQL está aprobado para persistencia del servidor. La persistencia sin cuenta no está aún especificada. Una primera experiencia sin cuenta puede usar persistencia local (IndexedDB), pero eso no cumple guardado/recuperación en PostgreSQL entre dispositivos; para persistencia remota hay que decidir identidad/propiedad, aislamiento, recuperación y privacidad antes de publicar. No prometer experiencia anónima, privacidad o sincronización hasta tomar esa decisión.

## Pruebas y extensibilidad

Un registro de definiciones de servicios ofrece propiedades, puertos y capacidad/coste admitidos. Al incorporar un servicio se añaden definición, validación, comportamiento de simulación si aplica, metadatos de precio y pruebas. No crear jerarquías generales de proveedor hasta ver el segundo proveedor/servicio que las necesite.
