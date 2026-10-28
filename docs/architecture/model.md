# Modelo de arquitectura y validación

## Formato v1 propuesto

Contrato conceptual para discusión/implementación; este documento no declara que exista parser, validador ni API funcional.

```json
{
  "schemaVersion": 1,
  "nodes": [
    {
      "id": "uuid",
      "serviceType": "EC2_AUTO_SCALING_GROUP",
      "displayName": "Application tier",
      "position": { "x": 420, "y": 180 },
      "properties": { "minInstances": 2, "maxInstances": 6, "desiredInstances": 2, "requestsPerSecondPerInstance": 400 }
    }
  ],
  "connections": [
    {
      "id": "uuid",
      "sourceNodeId": "uuid",
      "sourcePort": "http-out",
      "targetNodeId": "uuid",
      "targetPort": "http-in",
      "relationshipType": "REQUEST_FLOW"
    }
  ],
  "scenarioDefaults": { "requestsPerSecond": 500, "durationSeconds": 60 }
}
```

Cada tipo de servicio valida `properties` contra su propio esquema. Mantener identificadores estables y posición visual fuera de parámetros de simulación. Los identificadores del ejemplo son ilustrativos.

## Tipos iniciales y puertos conceptuales

- `ROUTE53`: `dns-query-in` → `dns-answer-out` (resolución/control; no procesador HTTP).
- `APPLICATION_LOAD_BALANCER`: `http-in` → `http-out` (reenvío HTTP a targets saludables).
- `EC2_AUTO_SCALING_GROUP`: `http-in` → `http-out` (capacidad de aplicación; propiedades de instancias, escalado y salud).
- `RDS_POSTGRESQL`: `db-connection-in` (destino de operaciones DB).

Para el camino simplificado de peticiones web, el tramo de throughput HTTP es ALB → ASG → RDS; Route 53 se representa como resolución de entrada previa, no se incluye su capacidad DNS en requests/s HTTP. Relaciones DNS y relaciones de flujo de solicitudes son distintas. Esta representación evita modelar una respuesta DNS como si pasara por el procesamiento del ALB.

## Validación

Errores bloqueantes: id repetido; endpoint inexistente; tipos/puertos incompatibles; referencia a nodo inexistente; propiedades obligatorias o rangos inválidos (`min ≤ desired ≤ max`); falta de un origen Route 53 o de un destino de aplicación/db según el perfil; ausencia de un camino válido; ciclos en `REQUEST_FLOW`; ramas/relaciones no soportadas por el motor elegido.

Advertencias: nombres duplicados, nodo desconectado que no sea requerido, configuración de escalado inactiva o ruta que no modela una dimensión de AWS. Los mensajes indican nodo/conexión, motivo y acción sugerida. Distinguir error de advertencia en contrato y UI.

## Evolución del esquema

`schemaVersion` aumenta ante cambios incompatibles. Migradores puros secuenciales `vN → vN+1`; pruebas con fixtures de versiones antiguas. Lectura de versión futura desconocida se rechaza sin sobrescribir el original. Una actualización conserva IDs, propiedades desconocidas solo si el formato/documentación define una política clara, y no cambia silenciosamente semántica de simulación.

## Persistencia inicial

`Project`: UUID, nombre, creación, modificación, schemaVersion, JSONB architecture, opcionalmente versión/etag. Índices/metadatos en columnas; contenido editable como documento completo para MVP. Revisar tamaño/límites y acceso antes de exponer API pública.
