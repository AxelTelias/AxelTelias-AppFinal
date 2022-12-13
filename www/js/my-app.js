// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'My App',
  // App id
  id: 'com.myapp.test',
  // Enable swipe panel
  panel: {
    swipe: 'left',
  },
  // Add default routes
  routes: [
    { path: '/about/', url: 'about.html' },
    { path: '/index/', url: 'index.html' },
    { path: '/registro/', url: 'registro.html' },
    { path: '/login/', url: 'login.html' },
    { path: '/datos-usuarios/', url: 'datos-usuarios.html' },
  ],
  // ... other parameters
});

var mainView = app.views.create('.view-main');

var db = firebase.firestore();
var colUsuario = db.collection('USUARIOS');

var contRegistros = 0;

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
  console.log('Device is ready!');
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
  // Do something here when page loaded and initialized
  console.log(e);
});

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="about"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  alert('Hello');
});

$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized

  $$('.btnr').on('click', function () {
    var emailDelUser = $$('#remail').val();
    var passDelUser = $$('#rpassword').val();
    firebase
      .auth()
      .createUserWithEmailAndPassword(emailDelUser, passDelUser)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        console.log('Bienvenid@!!! ' + emailDelUser);

        claveDeColeccion = emailDelUser;

        nombre = $$('#rnombre').val();

        datos = {
          nombre: nombre,
          rol: 'usuario',
        };

        colUsuario
          .doc(claveDeColeccion)
          .set(datos)
          .then(() => {
            console.log('Document successfully written!');
          })
          .catch((error) => {
            console.error('Error writing document: ', error);
          });
      })
      // ...
      //mainView.router.navigate('/siguientePantallaDeUsuarioOK/');

      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;

        console.error(errorCode);
        console.error(errorMessage);
        if (errorCode == 'auth/email-already-in-use') {
          console.error('el mail ya esta usado');
        }
        // ..
      });
  });
});

$$(document).on('page:init', '.page[data-name="login"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized

  var emailDelUser = '';

  var db = firebase.firestore();
  var colUsuario = db.collection('Usuarios');

  $$('.btnl').on('click', function () {
    var emailDelUser = $$('#lemail').val();
    var passDelUser = $$('#lpassword').val();

    firebase
      .auth()
      .signInWithEmailAndPassword(emailDelUser, passDelUser)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;

        console.log('Bienvenid@!!! ' + emailDelUser);

        claveDeColeccion = emailDelUser;

        var docRef = colUsuario.doc(claveDeColeccion);

        docRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              console.log('Document data:', doc.data());

              console.log(doc.id);
              console.log(doc.data().nombre);
              console.log(doc.data().rol);

              if (doc.data().rol == 'admin') {
                mainView.router.navigate('/panelAdmin/');
              } else {
                mainView.router.navigate('/panelUsuario/');
              }
            } else {
              // doc.data() will be undefined in this case
              console.log('No such document!');
            }
          })
          .catch((error) => {
            console.log('Error getting document:', error);
          });
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;

        console.error(errorCode);
        console.error(errorMessage);
      });
  });
});

$$(document).on('page:init', '.page[data-name="datos-usuarios"]', function (e) {
  colUsuario
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        console.log('data:' + doc.data().nombre);
        console.log('data:' + doc.id);
      });
    })
    .catch(function (error) {
      console.log('Error: ', error);
    });
});
