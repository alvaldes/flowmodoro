# Feature Request: Landing Page con SSR + SEO

**Status**: `documented` (pendiente de repo remoto y `status:approved`)
**Priority**: Low
**Depende de**: Tener un remote de GitHub configurado y deploy en producción

---

## Problemática

Hoy Flowmodoro usa `output: 'static'` en Astro. Esto significa que el HTML que se sirve es un shell vacío que React hidrata después en el cliente. Esto funciona perfecto para la app del timer (que es 99% cliente), pero imposibilita:

- **SEO**: Google no indexa el contenido porque no hay HTML con texto real
- **Meta tags dinámicos**: no podés compartir un link y que se vea bien en Slack/Twitter
- **Landing page**: no hay una página de aterrizaje rica que explique el producto antes de que el usuario entre a la app
- **Contenido dinámico**: blog, changelog, precios, todo requiere SSR

---

## Solución Propuesta

Migrar de `output: 'static'` a `output: 'hybrid'` en Astro, donde:

1. **Landing page** (`/`) → SSR con contenido rico, SEO, meta tags
2. **App del timer** (`/app`) → página estática, prerendered, con el mismo `AppShell client:load`
3. **PWA** → debe seguir funcionando en la ruta `/app`

```
src/
├── pages/
│   ├── index.astro        # ← Landing page (SSR: prerender = false)
│   ├── app.astro          # ← Timer app (static: prerender = true)
│   └── ...
```

---

## Stack Técnico

| Componente | Opción |
|------------|--------|
| Output | `hybrid` en `astro.config.mjs` |
| Adapter | `@astrojs/vercel` (para SSR en Vercel) |
| PWA | `@vite-pwa/astro` con `selfDestroying: true` en SSR |
| Landing UI | Tailwind v4 + framer-motion (para animaciones de entrada) |

---

## Archivos a Modificar / Crear

### Modificar

| Archivo | Cambio |
|---------|--------|
| `astro.config.mjs` | `output: 'hybrid'`, agregar `adapter: vercel()`, configurar PWA para SSR |
| `package.json` | Agregar `@astrojs/vercel` |

### Crear

| Archivo | Descripción |
|---------|-------------|
| `src/pages/index.astro` | Landing page con hero, features, CTA, footer |
| `src/pages/app.astro` | Nueva ruta para la app (mover el `AppShell` actual acá con `prerender: true`) |
| `src/components/landing/Hero.astro` | Sección hero de la landing |
| `src/components/landing/Features.astro` | Grid de features |
| `src/components/landing/CTA.astro` | Call to action |
| `src/components/landing/Footer.astro` | Footer con links |

---

## Riesgos y Mitigaciones

| Riesgo | Severidad | Mitigación |
|--------|-----------|------------|
| `@vite-pwa/astro` con SSR puede generar conflictos con `selfDestroying` | Alta | Probar en entorno de preview antes de mergear a main |
| La ruta `/` SSR puede aumentar latencia si Vercel cold-start | Media | Usar `prerender: true` parcial con ISR si es necesario |
| El service worker de PWA no debe cachear la landing page dinámica | Media | Configurar `navigateFallback` para excluir `/` |
| La navegación bottom nav apunta a `#` (cambia vista via React) — no hay conflicto | Baja | La app sigue siendo SPA, la ruta `/app` no tiene sub-rutas |
| SEO requiere testing con Lighthouse después del deploy | Baja | Hacerlo manualmente después |

---

## Checklist de Implementación

- [ ] Cambiar `output: 'static'` → `output: 'hybrid'` en `astro.config.mjs`
- [ ] Agregar `@astrojs/vercel` como adapter
- [ ] Configurar `@vite-pwa/astro` con `selfDestroying: true`
- [ ] Crear `src/pages/index.astro` con landing page completa
- [ ] Mover `AppShell` a `src/pages/app.astro` con `prerender: true`
- [ ] Redireccionar `/` → `/app` para usuarios existentes (opcional)
- [ ] Testear build híbrido: `bun astro build`
- [ ] Testear PWA offline en `/app`
- [ ] Deploy a Vercel y verificar SSR en `/`
- [ ] Lighthouse SEO audit

---

## Notas Adicionales

- La landing page debe mantener la misma identidad visual (OKLch tokens, tipografía SF Pro)
- No romper la experiencia PWA actual — la app en `/app` debe seguir siendo instalable y funcionar offline
- Idealmente la landing page tiene contenido en español e inglés (i18n future)
- Considerar usar `Astro.glob()` para generar secciones de features desde un archivo de datos
