# Refactorización de Sistemas Críticos: Aplicación de Clean Code y Flujos de Trabajo Eficientes

El proyecto original es una lista de tareas en JavaScript vanilla que permite al usuario agregar, completar, eliminar y reactivar tareas.

Para esta tarea, completé una refactorización aplicando principios SOLID y Clean Code para hacer la aplicación más robusta y prevenir bugs en el futuro.

## Code smells identificados

### 1. Variables globales mutables

Ejemplo del código original:
```js
let tasks = [];
let taskId = 1;
let currentFilter = 'all';
```

**Por qué es un problema:** las variables viven en el nivel más alto del archivo y cualquier función puede tocarlas sin pedir permiso — no hay encapsulamiento. El encapsulamiento es una base técnica para los principios SOLID de responsabilidad única y de abierto/cerrado.

**Cómo se resolvió:** `tasks` y `taskId` ahora viven encapsuladas dentro de `taskService.js`, y solo se modifican a través de funciones expuestas (`addTask`, `toggleTask`, `deleteTask`), nunca directamente desde afuera.

### 2. Violación de SRP (Single Responsibility Principle)

Ejemplo del código original: `function addTask()`

Esta función tenía ocho razones para cambiar: si cambia la validación, si cambia cómo se guarda, si cambia cómo se renderiza, si cambia el formato de la tarea…

**Cómo se resolvió:** se crearon tres capas distintas para respetar el principio de SRP, cada una con su propio archivo:
- `taskStorage.js`
- `taskService.js`
- `main.js`

### 3. Duplicación de código

Ejemplo del código original: `localStorage.setItem('tasks', JSON.stringify(tasks))` estaba repetido 3 veces (en `addTask`, `toggleTask` y `deleteTask`).

**Por qué es un problema:** había que recordar cambiar las 3 instancias para prevenir bugs futuros — era ineficiente y riesgoso.

**Cómo se resolvió:** se centralizó en `taskStorage.js` con las funciones `getTasks()` y `saveTasks()`, así solo hay un lugar que sabe cómo se persisten los datos.

### 4. Mezcla de lógica de negocio con DOM

Ejemplo del código original: `taskDiv.innerHTML = \`<span>${task.text}</span> ...\`;`

La función `renderTasks()` decidía qué mostrar (filtrado, guiado por lógica de negocio) y cómo mostrarlo (formato y HTML) al mismo tiempo. Además, usar `innerHTML` con texto de usuario sin sanitizar es un riesgo de seguridad (XSS).

**Cómo se resolvió:** se separó en `taskRenderer.js`, que solo recibe datos ya procesados y los dibuja, usando `textContent` en vez de `innerHTML` para prevenir XSS.

### 5. Manejo de errores pobre

Ejemplo del código original:
```js
if (text == '') {
    alert('Por favor escribe una tarea');
    return;
}
```

**Por qué es un problema:** `alert()` bloquea el navegador entero y no es reutilizable si mañana se quiere mostrar el error de otra forma.

**Cómo se resolvió:** se reemplazó por `throw new Error()` en la capa de lógica de negocio (`taskService.js`), y el `alert()` se movió a la capa de UI (`main.js`), que es su lugar correcto.

### 6. Comparaciones con `==` en vez de `===`

Ejemplo del código original: `if (text == '')`, `if (tasks[i].id == id)`

**Por qué es un problema:** `==` hace conversión de tipos automática antes de comparar, lo que puede dar resultados inesperados. `===` compara sin conversión, minimizando ese riesgo.

**Cómo se resolvió:** se reemplazaron todas las comparaciones por `===` en `taskService.js` y `main.js`.

### 7. Lógica frágil basada en posición

Ejemplo del código original:
```js
if (filter == 'all') {
    buttons[0].classList.add('active');
} else if (filter == 'active') {
    buttons[1].classList.add('active');
}
```

Esto asume que el primer botón siempre es "Todas", el segundo "Activas", etc. — la lógica se puede romper fácilmente si en el futuro alguien reordena los botones en el HTML.

**Cómo se resolvió:** se reemplazó por comparación contra el atributo `data-filter` de cada botón, eliminando la dependencia del orden en el HTML.

## Estructura del proyecto

Se reorganizó el código separando responsabilidades en carpetas, en vez de tener toda la lógica en un solo archivo `main.js`:
# Refactorización de Sistemas Críticos: Aplicación de Clean Code y Flujos de Trabajo Eficientes

El proyecto original es una lista de tareas en JavaScript vanilla que permite al usuario agregar, completar, eliminar y reactivar tareas.

Para esta tarea, completé una refactorización aplicando principios SOLID y Clean Code para hacer la aplicación más robusta y prevenir bugs en el futuro.

## Code smells identificados

### 1. Variables globales mutables

Ejemplo del código original:
```js
let tasks = [];
let taskId = 1;
let currentFilter = 'all';
```

**Por qué es un problema:** las variables viven en el nivel más alto del archivo y cualquier función puede tocarlas sin pedir permiso — no hay encapsulamiento. El encapsulamiento es una base técnica para los principios SOLID de responsabilidad única y de abierto/cerrado.

**Cómo se resolvió:** `tasks` y `taskId` ahora viven encapsuladas dentro de `taskService.js`, y solo se modifican a través de funciones expuestas (`addTask`, `toggleTask`, `deleteTask`), nunca directamente desde afuera.

### 2. Violación de SRP (Single Responsibility Principle)

Ejemplo del código original: `function addTask()`

Esta función tenía ocho razones para cambiar: si cambia la validación, si cambia cómo se guarda, si cambia cómo se renderiza, si cambia el formato de la tarea…

**Cómo se resolvió:** se crearon tres capas distintas para respetar el principio de SRP, cada una con su propio archivo:
- `taskStorage.js`
- `taskService.js`
- `main.js`

### 3. Duplicación de código

Ejemplo del código original: `localStorage.setItem('tasks', JSON.stringify(tasks))` estaba repetido 3 veces (en `addTask`, `toggleTask` y `deleteTask`).

**Por qué es un problema:** había que recordar cambiar las 3 instancias para prevenir bugs futuros — era ineficiente y riesgoso.

**Cómo se resolvió:** se centralizó en `taskStorage.js` con las funciones `getTasks()` y `saveTasks()`, así solo hay un lugar que sabe cómo se persisten los datos.

### 4. Mezcla de lógica de negocio con DOM

Ejemplo del código original: `taskDiv.innerHTML = \`<span>${task.text}</span> ...\`;`

La función `renderTasks()` decidía qué mostrar (filtrado, guiado por lógica de negocio) y cómo mostrarlo (formato y HTML) al mismo tiempo. Además, usar `innerHTML` con texto de usuario sin sanitizar es un riesgo de seguridad (XSS).

**Cómo se resolvió:** se separó en `taskRenderer.js`, que solo recibe datos ya procesados y los dibuja, usando `textContent` en vez de `innerHTML` para prevenir XSS.

### 5. Manejo de errores pobre

Ejemplo del código original:
```js
if (text == '') {
    alert('Por favor escribe una tarea');
    return;
}
```

**Por qué es un problema:** `alert()` bloquea el navegador entero y no es reutilizable si mañana se quiere mostrar el error de otra forma.

**Cómo se resolvió:** se reemplazó por `throw new Error()` en la capa de lógica de negocio (`taskService.js`), y el `alert()` se movió a la capa de UI (`main.js`), que es su lugar correcto.

### 6. Comparaciones con `==` en vez de `===`

Ejemplo del código original: `if (text == '')`, `if (tasks[i].id == id)`

**Por qué es un problema:** `==` hace conversión de tipos automática antes de comparar, lo que puede dar resultados inesperados. `===` compara sin conversión, minimizando ese riesgo.

**Cómo se resolvió:** se reemplazaron todas las comparaciones por `===` en `taskService.js` y `main.js`.

### 7. Lógica frágil basada en posición

Ejemplo del código original:
```js
if (filter == 'all') {
    buttons[0].classList.add('active');
} else if (filter == 'active') {
    buttons[1].classList.add('active');
}
```

Esto asume que el primer botón siempre es "Todas", el segundo "Activas", etc. — la lógica se puede romper fácilmente si en el futuro alguien reordena los botones en el HTML.

**Cómo se resolvió:** se reemplazó por comparación contra el atributo `data-filter` de cada botón, eliminando la dependencia del orden en el HTML.

## Estructura del proyecto

Se reorganizó el código separando responsabilidades en carpetas, en vez de tener toda la lógica en un solo archivo `main.js`:
# Refactorización de Sistemas Críticos: Aplicación de Clean Code y Flujos de Trabajo Eficientes

El proyecto original es una lista de tareas en JavaScript vanilla que permite al usuario agregar, completar, eliminar y reactivar tareas.

Para esta tarea, completé una refactorización aplicando principios SOLID y Clean Code para hacer la aplicación más robusta y prevenir bugs en el futuro.

## Code smells identificados

### 1. Variables globales mutables

Ejemplo del código original:
```js
let tasks = [];
let taskId = 1;
let currentFilter = 'all';
```

**Por qué es un problema:** las variables viven en el nivel más alto del archivo y cualquier función puede tocarlas sin pedir permiso — no hay encapsulamiento. El encapsulamiento es una base técnica para los principios SOLID de responsabilidad única y de abierto/cerrado.

**Cómo se resolvió:** `tasks` y `taskId` ahora viven encapsuladas dentro de `taskService.js`, y solo se modifican a través de funciones expuestas (`addTask`, `toggleTask`, `deleteTask`), nunca directamente desde afuera.

### 2. Violación de SRP (Single Responsibility Principle)

Ejemplo del código original: `function addTask()`

Esta función tenía ocho razones para cambiar: si cambia la validación, si cambia cómo se guarda, si cambia cómo se renderiza, si cambia el formato de la tarea…

**Cómo se resolvió:** se crearon tres capas distintas para respetar el principio de SRP, cada una con su propio archivo:
- `taskStorage.js`
- `taskService.js`
- `main.js`

### 3. Duplicación de código

Ejemplo del código original: `localStorage.setItem('tasks', JSON.stringify(tasks))` estaba repetido 3 veces (en `addTask`, `toggleTask` y `deleteTask`).

**Por qué es un problema:** había que recordar cambiar las 3 instancias para prevenir bugs futuros — era ineficiente y riesgoso.

**Cómo se resolvió:** se centralizó en `taskStorage.js` con las funciones `getTasks()` y `saveTasks()`, así solo hay un lugar que sabe cómo se persisten los datos.

### 4. Mezcla de lógica de negocio con DOM

Ejemplo del código original: `taskDiv.innerHTML = \`<span>${task.text}</span> ...\`;`

La función `renderTasks()` decidía qué mostrar (filtrado, guiado por lógica de negocio) y cómo mostrarlo (formato y HTML) al mismo tiempo. Además, usar `innerHTML` con texto de usuario sin sanitizar es un riesgo de seguridad (XSS).

**Cómo se resolvió:** se separó en `taskRenderer.js`, que solo recibe datos ya procesados y los dibuja, usando `textContent` en vez de `innerHTML` para prevenir XSS.

### 5. Manejo de errores pobre

Ejemplo del código original:
```js
if (text == '') {
    alert('Por favor escribe una tarea');
    return;
}
```

**Por qué es un problema:** `alert()` bloquea el navegador entero y no es reutilizable si mañana se quiere mostrar el error de otra forma.

**Cómo se resolvió:** se reemplazó por `throw new Error()` en la capa de lógica de negocio (`taskService.js`), y el `alert()` se movió a la capa de UI (`main.js`), que es su lugar correcto.

### 6. Comparaciones con `==` en vez de `===`

Ejemplo del código original: `if (text == '')`, `if (tasks[i].id == id)`

**Por qué es un problema:** `==` hace conversión de tipos automática antes de comparar, lo que puede dar resultados inesperados. `===` compara sin conversión, minimizando ese riesgo.

**Cómo se resolvió:** se reemplazaron todas las comparaciones por `===` en `taskService.js` y `main.js`.

### 7. Lógica frágil basada en posición

Ejemplo del código original:
```js
if (filter == 'all') {
    buttons[0].classList.add('active');
} else if (filter == 'active') {
    buttons[1].classList.add('active');
}
```

Esto asume que el primer botón siempre es "Todas", el segundo "Activas", etc. — la lógica se puede romper fácilmente si en el futuro alguien reordena los botones en el HTML.

**Cómo se resolvió:** se reemplazó por comparación contra el atributo `data-filter` de cada botón, eliminando la dependencia del orden en el HTML.

## Estructura del proyecto

Se reorganizó el código separando responsabilidades en carpetas, en vez de tener toda la lógica en un solo archivo `main.js`:
src/
storage/
taskStorage/
services/
taskService.js
ui/
taskRenderer.js
main.js

Cada capa tiene una única responsabilidad y no conoce los detalles internos de las otras. Por ejemplo, `taskService.js` no sabe que los datos se guardan en `localStorage` — solo llama a `saveTasks()`. Esto facilita cambiar la forma de persistencia (por ejemplo, a una API) sin tocar la lógica de negocio ni la UI.

## Principios aplicados

| Principio | Cómo se aplicó |
|---|---|
| **SRP** (Responsabilidad Única) | Cada archivo/función tiene una sola razón para cambiar: `taskStorage.js` solo persiste datos, `taskService.js` solo maneja lógica de negocio, `taskRenderer.js` solo dibuja el DOM. |
| **DIP** (Inversión de Dependencias) | `taskRenderer.js` no depende de una implementación específica de "qué pasa al hacer clic" — recibe callbacks (`onToggle`, `onDelete`) desde afuera, en vez de llamar directamente a funciones concretas. |
| **Encapsulamiento** | Las variables `tasks` y `nextId`, antes globales y mutables desde cualquier parte del archivo, ahora viven dentro de `taskService.js` y solo se modifican a través de funciones expuestas. |
| **Clean Code** | Nombres descriptivos (`handleAddTask` en vez de funciones anónimas sueltas), uso consistente de `===`, funciones pequeñas con un solo propósito, manejo de errores con `throw new Error()` en vez de `alert()` directo en la lógica de negocio. |


## Cómo correr el proyecto

```bash
npm install
npm run dev
```

Esto levanta un servidor local (por defecto en `http://localhost:5173`) con hot-reload.

## Repositorio original

Este proyecto es un fork de [Kodigo-academic/vanilla-to-do-list](https://github.com/Kodigo-academic/vanilla-to-do-list), usado como base para practicar refactorización aplicando SOLID y Clean Code.
