# Cuaderno de las Fincas

App de gestión de las fincas de papa de Agropecuaria Santo Domingo (El Baho, El Mostrenco y Hoyo El Barro, Santo Domingo, Mérida).

- Funciona sin señal: guarda en el teléfono y sincroniza con Firebase cuando vuelve el internet.
- Se instala en el teléfono desde el navegador (Safari: Compartir > Agregar a pantalla de inicio).
- Usuarios: administrador, encargado (solo su finca), familia y analista (solo ver). Los permisos están en `firestore.rules`.

## Desarrollo

```
npm install
./build.sh
NODE_PATH=$(npm root -g) node test/run.js   # prueba con una base de datos simulada
```

`config.js` tiene la conexión a Firebase y los correos administradores. Las reglas de `firestore.rules` se pegan en la consola de Firebase (Firestore > Reglas).
