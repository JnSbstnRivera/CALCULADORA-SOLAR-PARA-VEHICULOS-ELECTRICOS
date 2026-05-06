# CALCULADORA SOLAR PARA VEHÍCULOS ELÉCTRICOS

Herramienta de dimensionamiento solar para carga de vehículos eléctricos de **Windmar Home Puerto Rico**.

---

## ¿Qué hace?

Calcula el número de paneles solares necesarios para cubrir el consumo diario de carga de un vehículo eléctrico. El asesor ingresa el modelo del vehículo, millas conducidas por día y el horario de carga. La herramienta devuelve el sistema solar recomendado calibrado para Puerto Rico (4.5 HSP, paneles de 410 W).

---

## Características

- Selección de modelo de vehículo eléctrico con consumo por milla (kWh/mi)
- Cálculo de paneles solares por consumo de carga diario
- Recomendación de batería de respaldo
- Gráficas de producción vs. consumo (Recharts)
- Formularios validados con React Hook Form + Zod
- Dark / Light mode (theme-color `#1D429B`)
- Exportación PDF de propuesta

---

## Stack Técnico

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS 4 |
| Routing | TanStack Router |
| Data fetching | TanStack Query |
| UI Components | Radix UI (Dialog, Select, Tooltip, etc.) |
| Formularios | React Hook Form + Zod |
| Gráficas | Recharts |
| PDF | pdf-lib + html2canvas |
| Fechas | date-fns |

---

## Variables de entorno

Ninguna requerida para el frontend. Revisar configuración de Cloudflare Workers si se activa el backend.

---

## Instalación local

```bash
npm install
npm run dev
# http://localhost:5173
```

---

## Despliegue

**Producción:** https://calculadora-solar-ev.vercel.app

---

*Desarrollado para Windmar Home Puerto Rico — Call Center Operations*
