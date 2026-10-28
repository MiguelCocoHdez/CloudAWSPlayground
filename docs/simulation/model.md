# Modelo del simulador (propuesta v1)

## Alcance y contrato

Las fórmulas numéricas de este documento son propuesta conceptual pendiente de formalizar en criterios de implementación y tests; este primer PR no implementa simulación ni demuestra el comportamiento en código.

El motor es determinista y sin estado global: recibe arquitectura válida, escenario y eventos ordenados por tick; devuelve resumen y snapshots reproducibles. Para la primera versión solo se aceptan caminos acíclicos lineales de carga HTTP (ALB → ASG → RDS). Route 53 es resolución DNS previa y se muestra como componente de entrada, fuera del caudal sostenido de peticiones HTTP. Bifurcaciones, balanceo de varios caminos y ciclos producen validación explicativa, no resultados parciales engañosos.

El tiempo simulado se divide en ticks configurables (por ejemplo, 1 s). UI puede reproducir esos resultados a velocidad variable; pausar/reanudar animación no altera los cálculos. Un fallo o cambio de tráfico se aplica al comienzo de un tick. No se usa aleatoriedad en v1.

Unidad canónica para métricas del usuario: solicitudes HTTP/s. Cada etapa conserva entradas/salidas en su propia unidad; las conexiones DB se convierten explícitamente a solicitudes equivalentes antes de informar éxitos o errores de extremo a extremo. No se suman rechazos de requests/s y ops/s.

## Carga y capacidad

En cada tick `t`, la oferta `λ₀(t)` es el requests/s configurado o el valor del perfil de carga. Para el tramo HTTP en serie, cada nodo recibe la salida procesada del anterior. ALB entrega el flujo a targets ASG; ASG también expone una cantidad de trabajo hacia la base de datos. La carga DB de cada solicitud debe ser un parámetro explícito (`dbOperationsPerRequest`) y convertirse desde requests/s a ops/s antes de aplicar capacidad RDS. Para las fórmulas siguientes, se expresa cada `inᵢ` en la unidad de trabajo correspondiente al nodo (requests/s en ALB/ASG, ops/s en RDS); no comparar capacidades con unidades distintas. Con capacidad de nodo `Cᵢ(t)`:

```text
inᵢ(t) = outᵢ₋₁(t) en la unidad del nodo; RDS convierte requests/s a ops/s
processedᵢ(t) = min(inᵢ(t), Cᵢ(t)) si está saludable; 0 si está caído
rejectedᵢ(t) = inᵢ(t) - processedᵢ(t) (unidad local del nodo)
outᵢ(t) = processedᵢ(t)
utilizationᵢ(t) = inᵢ(t) / Cᵢ(t), si Cᵢ(t)>0
requestsProcessedEndToEnd = out_RDS(t) / dbOperationsPerRequest, si dbOperationsPerRequest > 0
requestsProcessedEndToEnd = out_ASG(t), si dbOperationsPerRequest = 0
requestsFailedEndToEnd = offeredRequests(t) - requestsProcessedEndToEnd
```

Capacidad efectiva de ASG = instancias saludables × req/s aproximados por instancia. El flujo hacia RDS se transforma: `ops ofrecidas/s = solicitudes procesadas por ASG/s × dbOperationsPerRequest`. Para RDS se declaran dos límites: throughput de operaciones y conexiones simultáneas. Concurrencia aproximada por Little: `conexiones requeridas = ops ofrecidas/s × segundos de conexión por operación`; capacidad DB efectiva en ops/s = mínimo entre throughput configurado y `maxConnections / segundosDeConexión`. Al saturar, convertir la salida de RDS de nuevo a requests/s mediante `dbOperationsPerRequest` para reportar end-to-end. Mantener explícita la unidad y el motivo de saturación en cada métrica. Si `dbOperationsPerRequest = 0`, RDS no limita este flujo; la fórmula de requests procesadas end-to-end se define por la ruta HTTP previa (ASG) y no divide por cero.

Latencia v1 = suma de latencias base configuradas para las etapas atravesadas, sin añadir una cola calculada a partir de utilización. Si una etapa está saturada, se conserva la latencia base y se presenta por separado el estado de saturación y los rechazos. No se afirma un p95 ni una latencia predictiva. Una fórmula de cola como `latenciaBase / (1 - ρ)` sería una extensión futura que requerirá supuestos, contrato y tests propios.

Requests recibidos/procesados se cuentan en el borde del sistema y errores/rechazos por etapa. Una solicitud que fracasa en un nodo no se suma a solicitudes exitosas posteriores. El total end-to-end procesado es la salida del último nodo. Cuello de botella: nodo con menor margen `Cᵢ - inᵢ`, señalando además nodos caídos y saturación.

## Ejemplo aritmético

Supuestos de una muestra de 1 s:

- Oferta: 800 solicitudes/s.
- ALB: 1.000 req/s.
- ASG: 3 instancias sanas × 400 req/s = 1.200 req/s.
- `dbOperationsPerRequest = 1` y duración media de conexión por operación = 1 s.
- RDS: throughput 900 ops/s y máximo 700 conexiones.

ALB recibe 800 req/s. ASG los procesa: 800 req/s, por debajo de 1.200 req/s de capacidad. RDS recibe 800 ops/s, pero su límite por conexiones es `700 / 1 = 700 ops/s`; procesa 700 ops/s, equivalentes a 700 solicitudes/s, y se rechazan 100 solicitudes/s por conversión de límite. Utilización ASG `800/1.200 = 66,7%`, RDS throughput `800/900 = 88,9%`, y conexión demandada `800 × 1 = 800` frente a 700 disponibles (114,3%). Se reporta saturación por conexiones. No es una cotización ni benchmark de AWS; las capacidades son entradas educativas.

Si una instancia ASG cae antes del siguiente tick: capacidad baja a `2 × 400 = 800 req/s`. Con 1.000 req/s de oferta, ALB pasa 1.000, ASG procesa 800 y rechaza 200; el cuello está en ASG. Al recuperar una instancia, vuelve a 1.200 req/s, excepto que otra etapa siga limitando.

## Eventos de v1

Eventos fechados por tick: `TRAFFIC_CHANGE`, `INSTANCE_FAILURE`, `INSTANCE_RECOVERY`, `RDS_SATURATION` (factor/capacidad reducida) y `SCALE_OUT`/`SCALE_IN`. Un controlador simplificado puede evaluar el umbral al cierre del tick; si supera umbral durante `detectionTicks`, solicita una instancia, que entra tras `provisioningTicks`. Nunca excede min/max. No modelar auto-recuperación del proveedor sin evento/regla explícitos. Documentar que health checks, AZ, colas, retries, redes y latencias distribuidas quedan fuera.

## Verificación

Pruebas para conservación por etapa (`in = processed + rejected`), caudal monótono en serie, límites cero/caído, orden de eventos, límite min/max de escalado, repetibilidad y ejemplo anterior. Cualquier aleatoriedad futura requiere semilla persistida y test determinista.
