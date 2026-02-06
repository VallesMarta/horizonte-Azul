# GUÍA DE CONTRIBUCIÓN - PROYECTO HORIZONTE AZUL ✈️

¡Hola! Gracias por querer ayudar en este proyecto. Para que todos hablemos el mismo idioma y el código no se vuelva un caos, por favor sigue estas reglas:

---

1. ARQUITECTURA Y COMPONENTES

---

- Uso de "use client": Solo úsalo si el componente tiene interacción (onClick, useState, useEffect). Si es solo para mostrar texto, intenta que sea un Server Component.
- Tipado (TypeScript): No uses "any". Usa siempre las interfaces definidas en "@/models/types".
- Componentes Reutilizables: Si vas a crear un botón o una card que se repite, ponlo en la carpeta de componentes comunes.

---

2. ESTILOS Y DISEÑO (Tailwind CSS)

---

- Colores de marca: Usa siempre las variables configuradas:
  - Primario: 'text-primario' / 'bg-primario' (para botones y detalles).
  - Secundario: 'text-secundario' (para títulos oscuros).
- Responsividad: Diseña pensando en móviles primero. Revisa que el Grid se vea bien en 'sm', 'md' y 'lg'.

---

3. FETCHING Y DATOS

---

- API: Importa siempre 'API_URL' desde '@/lib/api'. Nunca escribas la URL a mano en los componentes.
- Robustez: Siempre valida los datos que llegan de la API. Usa el patrón de "datosLimpios" que tenemos en el Grid para evitar errores si la API devuelve un objeto en vez de un array.

---

4. BUENAS PRÁCTICAS EN COMMITS

---

Intenta que tus mensajes de commit sean claros:

- feat: (si añades algo nuevo, como un filtro de búsqueda).
- fix: (si arreglas un bug, como el error de la 'key' en el map).
- style: (si solo retocas CSS o Tailwind).
- refactor: (si mejoras el código pero hace lo mismo).

---

5. ANTES DE ENVIAR TU CAMBIO (Checklist)

---

- [ ] ¿He borrado los console.log de prueba?
- [ ] ¿El componente tiene una 'key' única y válida?
- [ ] ¿Se ve bien en móvil y en escritorio?
- [ ] ¿He respetado los tipos de TypeScript?

¡Gracias por ayudar a que este proyecto vuele alto! 🌍
