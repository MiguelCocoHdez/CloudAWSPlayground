# ADR-0002: Modelo determinista y scope del simulador inicial

- Estado: Aprobado para planificación.
- Nota: el comportamiento de enrutamiento HTTP/DNS continúa pendiente de diseño detallado antes de implementar; el ejemplo conceptual debe leerse junto al contrato actualizado del modelo.
- Fecha: 2026-10-28.

## Contexto

Los resultados deben ser educativos, reproducibles, comprobables y explicables; no se pretende emular AWS fielmente.

## Decisión

La primera versión acepta un camino acíclico lineal. Un escenario es entrada explícita y el motor genera resultados deterministas por tick, usando capacidades configurables, salud de componentes, eventos ordenados y latencias base. UI reproduce snapshots, sin conducir la lógica de negocio. Route 53 se modela como resolución DNS separada del caudal HTTP sostenido. Se rechazan ciclos y branching sin soporte.

## Alternativas

- Simulación probabilística/eventos discretos: más expresiva, pero difícil de explicar/probar y no necesaria para verificar el núcleo.
- Fórmula estática de un solo cálculo: fácil, pero limitada para eventos de caída/escalado a lo largo del tiempo.
- DAG con bifurcación desde inicio: aumenta el valor visual, pero requiere reglas explícitas de routing, distribución, convergencia y conservación de flujo.

## Consecuencias y trabajo pendiente

- Primera prueba vertical puede calcular carga y cuello de botella sin representar colas complejas.
- Latencia v1 es suma de latencias base; saturación/rechazos se comunican como métricas separadas, sin elevar latencia por una fórmula aproximada de cola.
- Cualquier curva de latencia futura requiere decisión y tests; no atribuir precisión que el modelo no respalda.
- Ampliar a branches exige nuevo ADR/especificación y tests de conservación de solicitudes.
- Especificación normativa y fórmulas en [modelo de simulación](../simulation/model.md).
