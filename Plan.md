

# Rediseño visual: Calculadora de Carros Eléctricos

## Resumen de la decisión
Aplicamos la **Opción A — "Electric Dark"** (glassmorphism + acentos neón), reemplazamos el slider de millas por un **slider tipo "carga de batería en carretera"** con íconos de rayo en puntos clave que el usuario puede pulsar o arrastrar.

## El nuevo slider de millas (la pieza central)

Diseño visual de la "carretera eléctrica":

```text
   ⚡        ⚡        ⚡        ⚡        ⚡
   25       50        100      200      300+ mi/día
═══════════●─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
   ↑ relleno con gradiente cian→violeta (estilo carga)
   ↑ línea discontinua blanca = marcas de carretera
   ↑ thumb = pastilla con ícono de rayo brillando
```

Comportamiento:
- Slider horizontal con apariencia de carretera (fondo oscuro, líneas blancas discontinuas centradas).
- Relleno (`Range`) con gradiente eléctrico animado (cian → violeta → verde neón) que simula nivel de carga.
- 5 puntos de paso (25 / 50 / 100 / 200 / 300 mi) marcados con ícono `Zap` de Lucide encima de la pista.
  - Click en un rayo → el slider salta a ese valor con animación.
  - Hover → el rayo brilla (`drop-shadow` neón) y muestra tooltip con la cifra.
  - El rayo del valor activo queda iluminado, los demás atenuados.
- Thumb personalizado: pastilla redondeada con ícono de rayo dentro, halo neón, escala al arrastrar.
- Debajo, número editable grande (`text-5xl font-bold`) con unidad pequeña (`mi/día`).
- Permite también arrastrar libremente entre los puntos (no solo valores fijos).

Componente nuevo: `src/components/calculator/RoadSlider.tsx` (basado en `@radix-ui/react-slider`, sin tocar el `Slider` base de shadcn).

## Resto del rediseño (Opción A — Electric Dark)

### Paleta y tokens (`src/styles.css`)
- Fondo base `oklch(0.15 0.02 260)` con halos radiales cian/violeta.
- `--primary` → cian eléctrico `oklch(0.78 0.18 220)`.
- `--accent` → verde neón `oklch(0.85 0.20 145)`.
- `--secondary` → violeta `oklch(0.65 0.22 290)`.
- Modo oscuro por defecto (clase `dark` en `<html>` desde `__root.tsx`).

### Tipografía
- **Space Grotesk** para titulares y cifras grandes.
- **Inter** para UI/cuerpo.
- Cargadas vía Google Fonts en `__root.tsx` (`<link>` en `head()`).

### Estructura de la página (`src/routes/index.tsx`)
1. **Hero**
   - Título XL: "Calcula cuánto ahorras con un eléctrico"
   - Subtítulo + CTA "Calcular ahora" que hace scroll a la calculadora.
   - Fondo con gradiente radial + grid sutil + silueta de auto.

2. **Calculadora** (sección principal, layout 2 columnas en desktop)
   - **Izquierda — Inputs (card glassmorphism):**
     - `RoadSlider` para millas/día (la pieza nueva).
     - Slider estándar tuneado para precio gasolina ($/gal).
     - Slider estándar tuneado para precio electricidad ($/kWh).
     - `CarSelector`: 4 cards con modelos reales (Tesla Model 3, Nissan Leaf, BYD Dolphin, Chevy Bolt) con su consumo kWh/100mi.
   - **Derecha — Resultados (card sticky):**
     - 3 KPIs grandes con conteo animado: Ahorro mensual / Ahorro anual / CO₂ evitado (kg/año).
     - Mini gráfico Recharts (área) de ahorro acumulado a 5 años.
     - Barras horizontales comparando costo Gasolina vs Eléctrico.

3. **"¿Cómo lo calculamos?"** — Acordeón con las fórmulas.

4. **Beneficios** — Grid 3 columnas con íconos Lucide (`Zap`, `Leaf`, `DollarSign`, `Wrench`).

5. **FAQ** — Acordeón con 4–5 preguntas.

6. **Footer** simple.

### Microinteracciones
- Conteo animado de cifras (hook custom `useCountUp`, sin nueva dependencia).
- `animate-fade-in` y `hover-scale` en cards.
- Transiciones suaves al cambiar inputs (números cambian con tween).
- Persistencia de inputs en `localStorage`.

### Responsive
- Mobile: layout en stack, `RoadSlider` full width, panel de resultados se vuelve sticky bottom-sheet con resumen colapsado (toca para expandir).

## Archivos que se crean/modifican

Nuevos:
- `src/components/calculator/RoadSlider.tsx` — slider carretera con rayos.
- `src/components/calculator/CarSelector.tsx` — cards de modelos.
- `src/components/calculator/ResultPanel.tsx` — KPIs + gráfico + barras.
- `src/components/calculator/SavingsChart.tsx` — área Recharts 5 años.
- `src/components/calculator/Calculator.tsx` — orquestador (estado + cálculo + persistencia).
- `src/components/sections/Hero.tsx`
- `src/components/sections/Benefits.tsx`
- `src/components/sections/HowItWorks.tsx`
- `src/components/sections/FAQ.tsx`
- `src/hooks/use-count-up.ts`
- `src/lib/calculator.ts` — fórmulas puras + datos de modelos.

Modificados:
- `src/routes/index.tsx` — reemplaza placeholder, compone las secciones.
- `src/routes/__root.tsx` — agrega Google Fonts, fuerza `class="dark"`, meta tags SEO.
- `src/styles.css` — nueva paleta oklch, fuentes, fondos radiales.

## Lógica de cálculo (en `lib/calculator.ts`)
```text
miles_year   = miles_day * 365
gas_cost     = (miles_year / mpg_gasoline) * gas_price_per_gal
elec_cost    = (miles_year * kwh_per_mi) * elec_price_per_kwh
savings_year = gas_cost - elec_cost
co2_saved_kg = (miles_year / mpg_gasoline) * 8.89   // kg CO2 por galón
```
Modelos incluidos: Tesla Model 3 (0.25 kWh/mi), Nissan Leaf (0.30), BYD Dolphin (0.27), Chevy Bolt (0.28). Comparativo vs auto promedio 28 mpg.

## Notas técnicas
- Todo en cliente, sin servidor ni base de datos.
- Solo dependencias ya instaladas (`@radix-ui/react-slider`, `recharts`, `lucide-react`, `tw-animate-css`). No se añaden paquetes nuevos.
- Sin emojis en UI; los rayos son íconos SVG `Zap` de Lucide.
- Accesible: el `RoadSlider` mantiene el comportamiento de teclado nativo de Radix (flechas, Home/End).

