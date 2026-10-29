# Hidden Frequency — frontend

Hidden Frequency es una tienda de vinilos, pedales e instrumentos musicales. Este repositorio contiene la versión de la Entrega 3: el mismo catálogo y la misma identidad visual de la Entrega 1, reconstruidos con Next.js, TypeScript y Tailwind. El catálogo, el inicio de sesión y las reservas se conectan con la API y PostgreSQL.

## Enlaces del proyecto

- Sitio de producción: [https://hidden-frequency.vercel.app](https://hidden-frequency.vercel.app)
- API de producción: [https://hidden-frequency-back.onrender.com](https://hidden-frequency-back.onrender.com)
- Estado de la API: [https://hidden-frequency-back.onrender.com/health](https://hidden-frequency-back.onrender.com/health)
- Repositorio del frontend: [hidden-frequency-front](https://github.com/JuanTafur10/hidden-frequency-front)
- Repositorio del backend: [hidden-frequency-back](https://github.com/JuanTafur10/hidden-frequency-back)

El dominio del sitio sigue siendo `hidden-frequency.vercel.app`, el usado para la Entrega 1.

## Cómo ejecutarlo en local

Necesitas Node.js 20.19 o superior y el backend ejecutándose con PostgreSQL disponible.

En PowerShell, desde la carpeta de este repositorio:

```powershell
npm install
Copy-Item .env.example .env.local
```

Abre `.env.local` y configura la dirección de la API. Para trabajar con el backend local:

```env
NEXT_PUBLIC_API_HOST=http://localhost:3001
```

Si vas a probar contra el backend desplegado, usa:

```env
NEXT_PUBLIC_API_HOST=https://hidden-frequency-back.onrender.com
```

Luego inicia el sitio:

```powershell
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Para detenerlo, vuelve a PowerShell y pulsa `Ctrl+C`. Para compilar y servir una versión local de producción, ejecuta `npm run build` y después `npm start`.

No subas `.env.local` a GitHub. En Vercel, configura `NEXT_PUBLIC_API_HOST` con la URL pública del backend, sin `/api` al final, para el entorno **Production**. Después de cambiarla, crea un nuevo despliegue. En Render, `FRONTEND_URL` debe coincidir exactamente con `https://hidden-frequency.vercel.app`.

## Cuentas de prueba

Estas cuentas son exclusivamente para la evaluación. Las contraseñas se crean con hash en el backend. El seed debe ejecutarse en la base de datos de demostración después de configurar en Render las mismas credenciales mediante `SEED_ADMIN_*` y `SEED_USER_*`.

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Administrador | `admin@hidden-frequency.test` | `HF-Admin-Demo-2026!` |
| Usuario | `usuario@hidden-frequency.test` | `HF-Usuario-Demo-2026!` |

Antes de entregar, verifica que estas sean las credenciales configuradas en Render y que puedas iniciar sesión con ambas. No reutilices estas contraseñas en otros servicios.

## Organización del frontend

- `app/` contiene las rutas de Next.js; sus páginas montan los componentes de cada vista.
- `src/features/common/` reúne la configuración de API, el cliente HTTP, la navegación, los controles y la paginación compartidos.
- `src/features/auth/` contiene los tipos, servicios, hooks y formularios de registro e inicio de sesión.
- `src/features/products/` contiene el catálogo, sus filtros, tarjetas y administración.
- `src/features/reservations/` contiene los tipos, servicios, formulario y consulta de reservas.
- `src/features/storefront/` compone la portada y conecta el catálogo con el formulario.

Las páginas usan componentes y hooks. Los hooks llaman a servicios, y los servicios hacen las solicitudes mediante el cliente HTTP compartido; así los componentes no implementan llamadas a la API por su cuenta.

## Decisiones técnicas

### Qué ocurre al iniciar sesión

1. La persona completa el formulario de acceso y el frontend valida los campos.
2. El servicio de autenticación envía `POST /api/auth/login` al endpoint del mismo dominio. La ruta de Next reenvía la solicitud al backend de Render.
3. El backend busca el correo, compara la contraseña con el hash bcrypt y, si coincide, responde con el JWT y los datos públicos del usuario. El token contiene el identificador y el rol, y vence según la configuración del backend.
4. La ruta de Next guarda el token en la cookie `hf_session` y el perfil público en `hf_user`. Al refrescar, la aplicación recupera el perfil de la sesión.
5. En las llamadas protegidas, el cliente HTTP añade `Authorization: Bearer <token>`; la ruta de Next reenvía el token a la API. El proxy de Next revisa las rutas privadas y el backend vuelve a comprobar la firma, el vencimiento y los permisos antes de responder.
6. Si la API devuelve `401` en una solicitud protegida, el cliente cierra la sesión y redirige a `/login`. Si la persona no tiene el rol requerido, el backend responde `403`.

### Dónde se guarda el token y qué riesgo tiene

El JWT se guarda en la cookie `hf_session`, que sobrevive al refrescar. En producción se configura como `Secure` y `SameSite=Lax`, pero **no** como `HttpOnly`: el navegador necesita leerla para que el cliente HTTP agregue el encabezado `Authorization`. Esto permite inspeccionar la petición protegida en Network, pero también significa que un ataque XSS podría leer el token mientras siga vigente. Por eso no se debe insertar HTML no confiable, y el backend vuelve a verificar cada solicitud. No publiques el valor del token ni lo incluyas en una captura.

### Cuándo se responde `401` y cuándo `403`

- `401 Unauthorized`: falta un token válido o venció. En este proyecto, consultar `GET /api/reservations/mias` sin sesión debe responder `401`.
- `403 Forbidden`: el token identifica a una sesión válida, pero el rol no puede realizar esa acción. Por ejemplo, un usuario normal que intenta `DELETE /api/products/1` debe recibir `403`; esa operación es exclusiva de administrador.

### Uso de IA

Usé IA como apoyo para organizar la migración por features, conectar los servicios con la API, redactar documentación y revisar errores de compilación y tipos. Contrasté las rutas, los datos del catálogo y los nombres de campos con el backend real, y corregí instrucciones que no coincidían con la implementación. La IA fue una herramienta de apoyo; revisé el resultado y tomé las decisiones finales del proyecto.

## Evidencia de una petición protegida en Network

La captura debe mostrar una solicitud protegida —por ejemplo `GET /api/reservations/mias`— y el encabezado `Authorization: Bearer …` en **Request Headers**. Oculta el valor completo del token antes de guardar o compartir la imagen.

Para tomarla: inicia sesión como usuario, abre las herramientas del navegador con `F12`, selecciona **Network/Red**, entra a **Mis reservas**, abre la solicitud `reservations/mias` y revisa **Headers → Request Headers**. Guarda la captura en `docs/captura-network.png` y añádela al repositorio. **La imagen debe anexarse desde una sesión real de evaluación; no se incluye una captura inventada ni una que revele el token.**

Cuando exista el archivo, se mostrará aquí:

```markdown
![Petición protegida con Authorization en Network](docs/captura-network.png)
```
