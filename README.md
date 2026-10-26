# Hidden Frequency

link al sitio en vercel: https://hidden-frequency.vercel.app/

---

## Descrioción del proyecto:

**Qué es:** Hidden Frequency es una plataforma web (tienda en linea) tipo catalogo electrónico enfocada en la venta y reserva de equipo musical (como vinilos, intrumentos, pedales) de una amplia variedad

**Para quien es:** Esta pagina es diseñada para musicos, coleccionestas, guitarristas y aficionados de la musica y al sonido analogico que estan buscando explorar equipo especializado de una forma rapida y directa

**Que problema resuelve:** El problema que resuelve hidden frequency, es que centraliza la visualizacion de productos y el contacto / reserva de forma limpia, rapida y rigera, esto sin la pesadez de frameworks o tiendas que son sobrecargadas, ofreciendo una experiencia de navegacion agil tanto en celulares como en computadores

---

## Capturas de pantalla

### Vista desde un computador

<img width="1920" height="991" alt="image" src="https://github.com/user-attachments/assets/ad64c341-7394-407e-b3c6-1505ffc40696" />

<img width="1920" height="804" alt="image" src="https://github.com/user-attachments/assets/1be4d1c1-451a-44d1-b0cd-1f462d5eb4c9" />

<img width="1920" height="991" alt="image" src="https://github.com/user-attachments/assets/54671578-de2d-4b68-be00-d3c469605ffa" />

<img width="1920" height="991" alt="image" src="https://github.com/user-attachments/assets/64542b7b-cc5b-4568-bcbf-f3ee5449738c" />

<img width="1920" height="996" alt="image" src="https://github.com/user-attachments/assets/35c10b2c-ff21-41ad-8c95-a5212e9c7d50" />

<img width="1920" height="874" alt="image" src="https://github.com/user-attachments/assets/bee1a113-d4a5-4fe9-9769-13f384330834" />

### Vista desde un celular

<img width="1179" height="2556" alt="image" src="https://github.com/user-attachments/assets/266af4b0-9732-49a6-a04c-a8c8c57b4609" />

<img width="1179" height="2556" alt="WhatsApp Image 2026-09-13 at 7 30 00 PM (1)" src="https://github.com/user-attachments/assets/e1c898e1-7ca8-49dc-80bc-22b07d38dbb4" />

<img width="1179" height="2556" alt="WhatsApp Image 2026-09-13 at 7 30 00 PM (2)" src="https://github.com/user-attachments/assets/6ae91816-a1b0-4a23-b6b8-ca667bf8210c" />

<img width="1179" height="2556" alt="WhatsApp Image 2026-09-13 at 7 30 01 PM" src="https://github.com/user-attachments/assets/e853cfcc-0fa8-4824-b741-32c09b0e87c9" />

<img width="1179" height="2556" alt="WhatsApp Image 2026-09-13 at 7 30 01 PM (1)" src="https://github.com/user-attachments/assets/623feca8-aae4-4089-b90a-06ce55fc6091" />

<img width="1179" height="2556" alt="WhatsApp Image 2026-09-13 at 7 30 01 PM (2)" src="https://github.com/user-attachments/assets/287aaff4-de8d-43bb-83c0-83771cb183ad" />

<img width="1179" height="2556" alt="WhatsApp Image 2026-09-13 at 7 30 01 PM (3)" src="https://github.com/user-attachments/assets/d3088ad3-e52c-4ebf-a0e2-d47a9cfb3824" />

<img width="1179" height="2556" alt="WhatsApp Image 2026-09-13 at 7 30 01 PM (4)" src="https://github.com/user-attachments/assets/eae5cd6d-3569-41f2-9594-7ce6290a1cd7" />

<img width="1179" height="2556" alt="WhatsApp Image 2026-09-13 at 7 30 01 PM (5)" src="https://github.com/user-attachments/assets/9dbffec4-ac82-4b3e-aa82-ed67c11fff42" />

<img width="1179" height="2556" alt="WhatsApp Image 2026-09-13 at 7 30 01 PM (6)" src="https://github.com/user-attachments/assets/a78cc88f-956b-4141-a3f4-7bc417af298b" />

<img width="1179" height="2556" alt="WhatsApp Image 2026-09-13 at 7 30 01 PM (7)" src="https://github.com/user-attachments/assets/9b4d500f-0c5c-437b-8fda-45dd88ee5438" />

<img width="1179" height="2556" alt="WhatsApp Image 2026-09-13 at 7 30 01 PM (8)" src="https://github.com/user-attachments/assets/6b204330-f512-4427-a683-60d7454903f8" />

<img width="1179" height="2556" alt="WhatsApp Image 2026-09-13 at 7 30 01 PM (9)" src="https://github.com/user-attachments/assets/dc7071cb-94b5-4842-88d6-e206aea0a490" />

---

## Decisiones tecnicas

### ¿Dónde usé Flexbox y dónde Grid, y por qué en cada caso?

* **Flexbox** lo utilicé en elementos unidimensionales como: la barra de navegación del `header`, los botones de filtro por categorías y la distribución interna de las tarjetas de producto. Estos mismo me permitieron alinear elementos en fila o columna de manera flexible y limpia.
* **CSS Grid** lo utilicé específicamente para el contenedor principal del catálogo (`#catalog-grid`). Al usar algunas propiedades como `grid-template-columns: repeat(auto-fit, minmax(...))`, logré que la cuadrícula de productos se reorganizara sola de forma responsiva sin necesidad de escribir logica de codigo compleja para cada número de columnas.

### Uso de Inteligencia Artificial (IA)

* Utilicé la IA como herramienta de consulta y asistencia para resolver dudas puntuales de sintaxis en JavaScript (como el filtrado de arrays) y para refinar buenas prácticas de accesibilidad y semántica en CSS. Todo el código resultante fue revisado, adaptado, integrado y probado línea por línea de forma manual para asegurar el dominio total de la lógica implementada.

### Lo más difícil y cómo lo resolví

* Lo más complejo del codigo y el proyecto en general fue mantener la sincronización visual y de datos al momento de filtrar dinámicamente las tarjetas del catálogo sin que perdieran los estilos ni generaran saltos bruscos en el diseño. Lo resolví separando la fuente de datos (`products.js`) de la función de renderizado: cada vez que el usuario hace clic en un filtro, la función limpia el contenedor y vuelve a inyectar únicamente los elementos filtrados del array original.

---

## Tecnologías utilizadas

* **HTML5** (Semántico)
* **CSS3** (Variables CSS / Custom Properties, Flexbox, CSS Grid, Media Queries)
* **JavaScript (Vanilla)** (ES6+, DOM Manipulation, Event Listeners)
* **Vercel** (Despliegue continuo conectado a GitHub)
* **Github** (Versionamiento)
