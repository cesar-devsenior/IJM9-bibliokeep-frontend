# Documento de Diseño Técnico: Gestor de Libros Pro (BiblioKeep)

## 1. Descripción del Proyecto

**BiblioKeep** es una plataforma integral de gestión de inventario diseñada para coleccionistas de libros que buscan una experiencia moderna, visual y altamente automatizada. A diferencia de un simple CRUD, el proyecto se enfoca en la eficiencia mediante la integración de APIs externas, el escaneo de códigos de barras y la gamificación de la lectura.

### Propósito General

Permitir a los usuarios organizar su biblioteca personal, realizar un seguimiento de sus hábitos de lectura, gestionar préstamos a terceros y descubrir información técnica de sus ejemplares de forma instantánea. Todo esto bajo una arquitectura de alto rendimiento y una interfaz de usuario limpia construida con Tailwind CSS.

### Valor Diferencial

- **Automatización**: Ingesta de datos mediante ISBN consumiendo Google Books API.
- **Rendimiento**: Sistema de caché híbrido para búsquedas ultra-rápidas.
- **Interactividad**: Dashboard dinámico con estadísticas de lectura y metas anuales.
- **UX Premium**: Diseño responsivo y minimalista sin depender de librerías de componentes pesadas.

## 2. Stack Tecnológico y Arquitectura

- **Backend**: Java 21+, Spring Boot 3.5+, Spring Security (JWT), Spring Data JPA, Redis (Cache), PostgreSQL.
- **Frontend**: Angular 21, Signals para estado, Tailwind CSS para UI, Lucide Angular para iconos.
- **Infraestructura**: Docker Compose (Postgres, Redis), MailHog (para testing de correos).

## 3. Modelos de Datos (Contrato de Entidades)

### `User` Entity

- `id`: `UUID` (Primary Key)
- `email`: `String` (Unique, Indexed)
- `password`: `String` (BCrypt encoded)
- `preferences`: `Set<String>` (Géneros favoritos)
- `annualGoal`: `Integer` (Default: 12)

### `Book` Entity

- `id`: `Long` (Auto-increment)
- `ownerId`: `UUID` (Relación con `User`)
- `isbn`: `String` (10 o 13 dígitos)
- `title`: `String`
- `authors`: `List<String>`
- `description`: `String`
- `thumbnail`: `String` (URL de imagen)
- `status`: `Enum` (DESEADO, COMPRADO, LEYENDO, LEIDO, ABANDONADO)
- `rating`: `Integer` (1-5)
- `isLent`: `Boolean` (Default: false)

### `Loan` Entity

- `id`: Long
- `bookId`: Long (Foreign Key)
- `contactName`: String
- `loanDate`: LocalDate
- `dueDate`: LocalDate
- `returned`: Boolean

## 4. Especificaciones de la API REST (Endpoints)

| Método | Path | Descripción | Seguridad |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Registro con preferencias iniciales | Público |
| POST | `/api/auth/login` | Devuelve JWT y Refresh Token | Público |
| GET | `/api/books/search?q={query}` | Búsqueda híbrida (Local -> Redis -> Google) | Usuario |
| POST | `/api/books` | Persiste un libro en la colección del usuario | Usuario |
| PATCH | `/api/books/{id}/status` | Actualiza estado de lectura | Usuario |
| POST | `/api/loans` | Crea un préstamo y marca libro como isLent=true | Usuario |
| GET | `/api/stats/dashboard` | Devuelve objeto con métricas anuales | Usuario |

## 5. Lógica de Negocio Crítica (Prompts Ready)

### Búsqueda Híbrida (Service Pattern)

1. El `SearchService` recibe un término.
2. Si es un ISBN (numérico):
    - Verifica en `BookRepository` del usuario actual.
    - Si no existe, verifica en `RedisTemplate` con clave `isbn:{number}`.
    - Si no existe, llama a `GoogleBooksClient` (OpenFeign o WebClient).
    - Al encontrarlo fuera, lo guarda en Redis con un TTL de 24 horas.

### Sistema de Notificaciones Asíncronas

- Clase `@Component` con método `@Scheduled(cron = "0 0 8 * * *")` (diario a las 8 AM).
- Busca en `LoanRepository` donde `dueDate` < hoy y `returned` == `false`.
- Por cada registro, obtiene el email del dueño y envía un correo usando `JavaMailSender`.

## 6. Requisitos de Frontend (UI/UX)

### Gestión de Estado (Signals)

- `BookStore`: Signal que almacena la lista actual de libros.
- `LoadingState`: Signal booleana para mostrar skeletons de Tailwind mientras `HttpClient` está activo.
- `FilterSignal`: Objeto computado (`computed`) que filtra la lista local sin peticiones extra al servidor.

### Diseño con Tailwind CSS

- **Layout**: Sidebar colapsable, Header con perfil de usuario y Body con scroll independiente.
- **Componentes Atómicos**:
  - **ButtonComponent**: Basado en clases dinámicas (`primary`, `secondary`, `danger`).
  - **BookCard**: Efectos de `hover:scale-105` y `shadow-md` para mostrar portadas.
  - **StatsWidget**: Gradientes de Tailwind para las tarjetas del dashboard.

### 7. Configuración de Entorno (Docker)

Deberá existir un docker-compose.yml que levante:

- **postgres:18-alpine** (Puerto 5432)
- **redis:alpine** (Puerto 6379)
- **mailhog/mailhog** (Puerto 1025 para SMTP, 8025 para UI)

### 8. Criterios de Aceptación para Prompts

Para cada tarea pedida a la IA, se debe exigir:

1. **Código Limpio**: Uso de DTOs en lugar de entidades en los controladores.
2. **Validación**: Uso de `@Valid` y `BindingResult` en el backend; `Validators` en el frontend.
3. **Manejo de Errores**: Global Exception Handler en Spring que devuelva JSON estructurado con códigos de error.
4. **Testing**: Al menos un test unitario para la lógica de búsqueda y un test de integración para el login.
