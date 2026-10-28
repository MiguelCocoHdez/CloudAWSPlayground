# Estimador de costes y datos AWS

## Principio

El resultado es una estimación educativa, nunca una factura ni garantía de precio. No mostrar cifra como oficial si no se puede rastrear a fuente, SKU/atributos y condiciones. Si el catálogo no tiene tarifa válida, mostrar “sin precio verificado”. Separar catálogo de precios y fórmula de cálculo.

## Estrategia aprobada

Usar dataset oficial AWS versionado y consultable sin credenciales de AWS en tiempo de ejecución. No depender de AWS Pricing Query API desde navegador ni servidor MVP: AWS documenta que las llamadas a Query y Bulk API requieren una identidad IAM con permisos. Explorar la descarga de price list files oficiales (JSON/CSV) desde sus URLs públicas de distribución o una extracción manual verificada; validar el camino de descarga y los términos antes de automatizar. Si API Bulk es usada para localizar/listar el archivo, se requiere IAM. No presentar como verificado un archivo cuya procedencia y descarga no se pueda documentar.

Cada conjunto versionado deberá guardar `catalogVersion`, `sourceUrl`, servicio, producto/SKU, atributos de selección, `regionCode`, moneda, `effectiveDate`, fecha de captura, unidad, precio publicado y hash del archivo original. Registrar reglas de normalización como artefactos reproducibles, no editar silenciosamente datos originales. Refrescar manualmente o mediante proceso de mantenimiento revisado; no actualizar precios durante una simulación sin dejar registrada la versión usada.

AWS indica que sus Price List APIs son informativas y que, en caso de divergencia, prevalece la página de precios del servicio. La Price List Query API no incluye Savings Plans; catálogo no incluye Spot EC2 ni ciertas ofertas Free Tier temporales. [AWS Calling the Price List](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/price-changes.html) · [Bulk API](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/using-the-aws-price-list-bulk-api.html) · [Lectura de price files](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/reading-service-price-list-files.html)

## Unidades de consumo a definir

- **EC2:** tipo de instancia, región, sistema operativo/tenancy/compra según dataset, instancias-hora y almacenamiento EBS explícito.
- **ASG:** no tarifa independiente por grupo en el modelo base; el coste procede de instancias y recursos adicionales indicados.
- **RDS PostgreSQL:** clase, región, horas, almacenamiento y modalidad de disponibilidad/backups/I/O solo si datos y fórmula están cubiertos.
- **ALB:** horas de balanceador y LCU/uso si el dataset y el escenario permiten estimarlo; separar cargos fijos/variables.
- **Route 53:** hosted zones, consultas y health checks solo si el alcance de precio está soportado.

Mostrar conceptos incluidos y excluidos (por ejemplo, tráfico de salida, impuestos, descuentos, Savings Plans/Reserved, Free Tier, IPs, backups o I/O no modelados). No asignar cero a conceptos omitidos: etiquetarlos como excluidos.

## Referencia manual

La [AWS Pricing Calculator](https://calculator.aws/) permite construir y exportar estimaciones, y sirve para contrastar supuestos. Sus resultados dependen de la entrada y excluyen impuestos. Páginas oficiales relevantes: [Route 53 pricing](https://aws.amazon.com/route53/pricing/), [Elastic Load Balancing pricing](https://aws.amazon.com/elasticloadbalancing/pricing/), [EC2 On-Demand pricing](https://aws.amazon.com/ec2/pricing/on-demand/) y [RDS pricing](https://aws.amazon.com/rds/pricing/).

## Fórmula y unidades

Implementación deberá convertir cada término a una unidad explícita antes de sumar. Ejemplo de coste horario de cómputo On-Demand: `precio_por_instancia_hora × instancias × horas_de_uso`, sujeto a condiciones y redondeos del precio oficial aplicable. Mes ilustrativo puede definirse como 730 horas, mostrándolo al usuario; no asumir “mes AWS” universal. Las tarifas multidimensionales (ALB/Route 53/RDS) requieren fórmulas/medidores específicos, con casos de prueba y entradas explícitas. Sin cobertura fiable de un medidor, ese subtotal queda desconocido y el total debe señalar que es parcial.

## Estado inicial

No hay precios seleccionados ni cifras numéricas verificadas para una región/configuración concreta. La selección de región, moneda, modalidades incluidas y cobertura de cargos se debe cerrar antes de poblar el dataset.
