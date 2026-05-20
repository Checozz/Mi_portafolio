# Sable de Luz · Arduino Nano

Para una convención de cosplay construí un **sable de luz funcional** con efectos de sonido sincronizados con movimiento. Todo gobernado por un Arduino Nano dentro del mango.

## Componentes

- Arduino Nano
- Tira LED WS2812B (128 leds) corriendo por la hoja de policarbonato
- Módulo DFPlayer Mini para sonido (ignición, swing, clash, off)
- Acelerómetro MPU-6050 para detectar movimiento
- Bocina de 3W + amplificador clase D
- Batería 18650 con módulo de carga TP4056

## Lo divertido

Programar la curva de **ignición progresiva** (los leds encienden uno a uno desde la base hasta la punta) y sincronizarla con el sonido del *hum* de fondo. Cuando el acelerómetro detecta un movimiento brusco, dispara un *swing* aleatorio del banco de sonidos.

## Stack

`Arduino C++` · `FastLED` · `DFPlayer Mini` · `MPU-6050` · `Electrónica analógica`
