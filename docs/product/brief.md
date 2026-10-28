# CloudPlayground: visión, alcance y MVP

## Visión

CloudPlayground es un laboratorio visual educativo para diseñar arquitecturas AWS y estudiar su comportamiento aproximado. El flujo principal es editar una arquitectura, configurar carga y fallos, ejecutar una simulación determinista y entender qué limita capacidad y coste.

## Objetivos

1. Un editor visual real, atractivo y usable, con catálogo pequeño y representaciones reconocibles.
2. Resultados simulados reproducibles, explicables y comprobables.
3. Aprendizaje sobre diseño de software, cloud, frontend, Git y colaboración asistida por agentes.

## MVP

- Catálogo: Route 53, Application Load Balancer, EC2 Auto Scaling Group y Amazon RDS con PostgreSQL.
- Canvas: añadir/mover/seleccionar/eliminar nodos, conectar/desconectar, editar propiedades, zoom/pan/centrar y mostrar validación/estado.
- Modelo compartido con versión explícita; conexiones con origen/destino, puertos y relación tipados.
- Validador separado de la UI, con errores que impiden simular y advertencias que permiten continuar.
- Simulación local y determinista de solicitudes, capacidad, latencia estimada, utilización, fallos/rechazos y cuello de botella; reproducción temporal separada del cálculo.
- Escenario parametrizable, pausa/reinicio y eventos iniciales de pico/corte/recuperación y escalado acotado.
- Guardar, cargar y renombrar proyectos; PostgreSQL en servidor está aprobado. La propiedad/acceso sin cuenta y el almacenamiento local alternativo quedan pendientes de diseño antes de implementar o exponer esta función.
- Métricas globales y por nodo, comparación básica de escenarios, costes desglosados de dataset oficial/versionado y recomendaciones por reglas explícitas.

El orden se puede escalonar; el primer incremento vertical recomendado es un flujo de ejemplo validado y simulado de extremo a extremo.

## Límites

No despliega en AWS ni requiere credenciales. No ejecuta Terraform/CloudFormation. No se modela fidelidad exacta del proveedor, todo el catálogo AWS, topología cíclica, colaboración en tiempo real, pagos, autenticación avanzada, Kubernetes, Kafka, microservicios, IA ni recomendaciones generativas.

## Principios de producto

- Una métrica aproximada debe exponer su fórmula, unidad, entradas y simplificaciones.
- Ningún precio se presenta como oficial/verificado sin procedencia y vigencia identificables.
- El editor y análisis tienen prioridad sobre una interfaz CRUD genérica.
- Accesibilidad básica y escritorio como prioridad; diseño adaptable como objetivo.
- La lógica del validador, simulador y cálculo de costes no depende de componentes React.
