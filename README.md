# Hiring Tracker Equipo 3

## Ciclo 1

-----------------------------------------------

HTML:
- _**login:**_ Pantalla para ingresar al sistema.
- _**index:**_ Pantalla principal del sistema, donde se muestra la información general de todos los candidatos.
- _**candidate_info:**_ Pantalla con la información específica de un candidato.
  - Se pueden ver las etapas del candidato.
  - Completar las etapas.
  - Ver la información completa del candidato.
  - Porcentaje de progreso de su contratación.
- _**admin_page:**_ Pantalla donde el administrador del sistema puede manejar los usuarios y sus permisos.

CSS:
- _**login_styles:**_ Estilos para la pantalla de inicio (_login.html_).
- _**index_styles:**_ Estilos para la pantalla principal del sistema (_index.html_).
- _**candidate_info:**_ Estilos para la pantalla de información del candidato (_candidate_info.html_).
- _**admin_styles:**_ Estilos para la pantalla del manejo de usuarios (_admin_page.html_).
- _**nav_styles:**_ Estilos para la barra de navegación y las notificaciones.

<br>

## Ciclo 2

-----------------------------------------------

CSS:
- _**Overlay:**_ Estilos para el modal de confirmación, de editar datos y la cubierta de pantalla.

JAVASCRIPT:
- _**adminOverlay:**_ Script para el manejo de la tabla de usuarios (editar, borrar y añadir) y el comportamiento de botones e interfaz (_admin_page.html_).
- _**cardUpdate:**_ Script para la animación del carrusel de tarjetas que representan las etapas de un candidato, asi como su progreso dinamico (_candidate_info.html_).
- _**checkUserType:**_ Script para habilitar ciertos elementos de la interfaz de acuerdo al usuario que inicio sesión.
- _**notifications:**_ Script para desplegar y ocultar las notificaciones de candidatos con poco tiempo para completar la etapa o que exedieron el tiempo limite.
- _**overlay:**_ Script para mostrar y esconder campos para llenar o modificar datos de un candidato, hacer comentarios en la etapa de un candidato o confirmar el input de un usuario.

**Los scripts de saveCandidate e indexTable no se están usando para este Ciclo, pero serán necesarios para la entrega final.**

MISC:
- _**.eslintrc:**_ Script para realizar realizar pruebas estaticas de codigo.
- _**server:**_ Script de prueba de un servidor.
- _**package:**_ Archivo JSON que contiene la configuración de diferentes librerias descargadas de npm como "date-holidays" para reconocer dias de asueto.

<br>


## Ciclo 3

-----------------------------------------------

CLIENT FOLDER:
- Ajustes a los archivos HTML y Javascript, para poder realizar los requests al servidore Node JS

NODE JS:
- _**server.js:**_ Script que inincializa el servidor, y es quien escuchará los requests del client.
- _**config:**_ Configuración de la base de datos dentro del servidor.
- _**controllers:**_ Contiene los archivos que controlan las funciones cuando se realizan los requests.
- _**middleware:**_ Archivos con las funciones intermedias que se ejecutan entre el request y el response (principalmente se utiliza para autenticación).
- _**models:**_ Contiene los modelos de las tablas presentes en la base de datos.
- _**node_modules:**_ Librerías y todos los paquetes necesarios para que el servidor pueda funcionar correctamente.
- _**routes:**_ Archivos que redirigen los requests del cliente, y manda a llamar las funciones correspondientes dentro de controller.
