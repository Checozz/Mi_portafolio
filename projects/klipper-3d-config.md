# Configuraciones Klipper · Flsun T1 & Anycubic Kobra 2 Neo

Klipper es un firmware avanzado para impresoras 3D que mueve el procesamiento del microcontrolador a una Raspberry Pi, permitiendo aceleraciones brutales y *input shaping*. Mis configuraciones están **públicas en GitHub** para que cualquier persona las tome como base.

## Lo que afiné

- **Input shaping** medido con acelerómetro ADXL345
- **Pressure advance** calibrado por tipo de filamento
- Macros personalizadas para *start_print*, *end_print*, *load/unload*
- Web UI vía Mainsail con dashboards customizados

## Resultados

Tiempos de impresión 30–40% más rápidos sin sacrificar calidad. Cero ringing visible en piezas técnicas.

## Stack

`Klipper` · `Mainsail` · `Python` · `Raspberry Pi OS` · `KlipperScreen`
