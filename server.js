//setup Dependencies
var express = require('express')
    , mongoose = require('mongoose')
    , fs = require('fs')
    , dateFormat = require('dateformat')
    , port = (process.env.PORT || 9091);

//Setup Express
var server = express();
server.set('views', __dirname + '/views');
server.set('view options', { layout: false });
server.use(express.bodyParser());
server.use(express.cookieParser());
server.use(express.session({ secret: Date() }))
server.use(express.static(__dirname + '/static'));
server.listen(port);

//DB connection
mongoose.connect('mongodb://troya-admin:q1w2e3r4@ds053449.mongolab.com:53449/troya');
var models = require('./models');

server.locals = { 
                  title : 'Tienda Troya CMS'
                  ,description: 'CMS para Tienda Troya'
                  ,author: 'mephasto'
                  ,analyticssiteid: 'XXXXXXX'
                  ,blog: false
                  ,gallery: false
                  ,message: null
                }

///////////////////////////////////////////
//              Log In                   //
///////////////////////////////////////////

server.get('/', function(req,res){
  res.render('index.jade', { 
              title : server.locals.title + ' - Log In'
            }
  );
});

server.post('/', function (req, res) {
  var post = req.body;
  if (post.usuario === 'troya-admin' && post.password === 'q1w2e3r4') {
    req.session.user_id = 'troya-admin';
    res.redirect('/banners');
  } else {
    res.send('Bad user/pass');
  }
});

function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    res.redirect('/');
    res.send('You are not authorized to view this page');
  } else {
    next();
  }
}

server.get('/logout', function (req, res) {
  delete req.session.user_id;
  res.redirect('/');
});      

///////////////////////////////////////////
//              Banners                  //
///////////////////////////////////////////

// GET: Banners
server.get('/banners', checkAuth, function(req,res){
  var query = models.Banner.find();
  query.sort('date_to').execFind(function (err, banners) {
    if(err === null){
      res.render('banners.jade', { 
                  title : server.locals.title + ' - Banners',
                  banners : banners,
                  activeNav : 'banners'
                }
      );
    }
  });
});

// POST: Banner
server.post('/banners', function(req,res){
  console.log('POST to Banners');
  //new Banner
  var banner = new models.Banner(req.body);
  // cheking files
  banner.imagen = req.files.imagen.originalFilename;
  // saving files
  fs.readFile(req.files.imagen.path, function (err, data) {
    // ...
    var newPath = __dirname + "/static/images/banners/" + banner.imagen;
    fs.writeFile(newPath, data, function (err) {
      //console.log(err);
    });
  });
  banner.save(function(err){
    if(err === null){
      var query = models.Banner.find();
      query.sort('date_to').execFind(function (err, banners) {
        res.render('banners.jade', 
          { 
            title : server.locals.title + ' - Banners',
            banners : banners,
            activeNav : 'banners',
            message: 'Se creo el Banner con exito.'
        });
      });
    };
  });
});

// POST: Banner - DELETE
server.post('/banners/del', function(req,res){
  console.log('POST to DELETE Banner');
  return models.Banner.findById(req.body.id, function (err, banner) {
    if (!banner){
      return res.render('banners.jade', {message : 'No se pudo borrar!'}); 
    }
    return banner.remove(function (err) {
      if (!err) {
        // removed!
        res.redirect(301, '/banners')
      } else {
        // NOT removed!
        console.log(err);
        res.render('banners.jade', {message : 'Error! - {id: ' + id + '}'});
      }
    });
  });
});

///////////////////////////////////////////
//              Pills                    //
///////////////////////////////////////////

// GET: Pills
// checkAuth, 
server.get('/pills', function(req,res){
  return models.Pill.findById(req.query.id, function (err, pill_edit) {
    // FEEDBACK Messages
    var message = ''; var messageType = '';
    if (req.cookies.message != 'undefined') {
      message = req.cookies.message;
      messageType = req.cookies.messageType;
    }

    var query = models.Pill.find();
    query.sort({destacado: -1}).execFind(function (err, pills) {
      if(err === null){
        if(pill_edit === undefined || pill_edit === null) pill_edit = '';
        res.render('pills.jade', {
            title     : server.locals.title + ' - Pildoras',
            pills     : pills,
            pilledit : pill_edit,
            message : message,
            messageType : messageType,
            activeNav : 'pills'
        });
      }
    });
  });
});
// POST: Pills
server.post('/pills', function(req,res){
  console.log(req.body);
  if (req.body.action == "update") {
    models.Pill.findById(req.body.id, function(err, pill){
      if(!err){
        pill.nombre = req.body.nombre;
        pill.pill_type = req.body.pill_type;
        pill.titulo_a = req.body.titulo_a;
        pill.titulo_b = req.body.titulo_b;
        pill.texto_boton = req.body.texto_boton;
        pill.date_from = req.body.date_from;
        pill.date_to = req.body.date_to;
        pill.video_html = req.body.video_html;
        pill.url = req.body.url;
        pill.url_type = req.body.url_type;
        // Imagen mas abajo ...
        pill.columna = req.body.columna;
        pill.destacado = req.body.destacado;
        pill.estado = req.body.estado;
        checkImage(pill);
        save(pill, 'Se guardaron los cambios en "'+pill.nombre+'".', 'success');
      }
    });

  }else{
    var pill = new models.Pill(req.body);
    checkImage(pill);
    save(pill, 'Se creó con exito la pildora "'+pill.nombre+'".', 'success');
  }

  function checkImage (pill) {
    if(req.files.imagen.originalFilename) {
      console.log('Viene imagen ! true')
      pill.imagen = req.files.imagen.originalFilename;
      fs.readFile(req.files.imagen.path, function (err, data) {
        var newPath = __dirname + "/static/images/pills/" + pill.imagen;
        fs.writeFile(newPath, data, function (err) {
          //console.log('Error File Write:' + err);
        });
      });
    }
  }
  function save (pill, message, messageType) {
    pill.save(function(err){
      if(err === null){
        //console.log('Pill.Save error:' + err);
        res.cookie('message', message, { expires: new Date(Date.now() + 5000), httpOnly: true });
        res.cookie('messageType', messageType, { expires: new Date(Date.now() + 5000), httpOnly: true });
        res.redirect(301, '/pills');
      };
    });
  }
});


// POST: Pills - DELETE
server.post('/pills/del', function(req,res){
  console.log('POST to DELETE Pills');
  return models.Pill.findById(req.body.id, function (err, pill) {
    if (!pill){
      return res.render('pills.jade', {message : 'No se pudo borrar!'}); 
    }
    return pill.remove(function (err) {
      if (!err) {
        // removed!
        res.cookie('message', 'Se borro la pildora.', { expires: new Date(Date.now() + 5000), httpOnly: true });
        res.cookie('messageType', 'warning', { expires: new Date(Date.now() + 5000), httpOnly: true });
        res.redirect(301, '/pills')
      } else {
        // NOT removed!
        console.log(err);
        res.render('pills.jade', {message : 'Error! - {id: ' + id + '}'});
      }
    });
  });
});

///////////////////////////////////////////
//              Globales                 //
///////////////////////////////////////////

// GET: Globales
server.get('/globales', checkAuth, function(req,res){
  var query = models.Globales.findById('53d69a5aaf127b5345000002');
  query.execFind(function (err, globales) {
    console.log(globales);
    if(err === null){
      res.render('globales.jade', { 
                  title : server.locals.title + ' - Variables globales',
                  globales : globales,
                  activeNav : 'globales'
                }
      );
    }
  });
});
// POST: Globales
server.post('/globales', function(req,res){
  models.Globales.findById('53d69a5aaf127b5345000002', function(err, globales){
    globales.prox_apertura_date = req.body.prox_apertura_date;
    globales.prox_apertura_hora_desde = req.body.prox_apertura_hora_desde;
    globales.prox_apertura_hora_hasta = req.body.prox_apertura_hora_hasta;
    globales.save(function(err){
      if(err === null){
        res.cookie('message', 'Se guardaron los cambios.', { expires: new Date(Date.now() + 5000), httpOnly: true });
        res.cookie('messageType', 'success', { expires: new Date(Date.now() + 5000), httpOnly: true });
        res.redirect(301, '/globales')
      };
    });
  });
});

///////////////////////////////////////////
//                APIS                   //
///////////////////////////////////////////

server.get('/getBanners', function(req,res){
  var query = models.Banner.find();
  query.sort('date_to').execFind(function (err, banners) {
    if(err === null){
      res.send(req.query.callback + "(" + JSON.stringify(banners) + ");");
    }
  });
});

server.get('/getPills', function(req,res){
  var query = models.Pill.find();
  query.sort('destacado').execFind(function (err, pills) {
    if(err === null){
      res.send(req.query.callback + "(" + JSON.stringify(pills) + ");");
    }
  });
});

//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res){
    throw new NotFound;
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

console.log('Listening on http://0.0.0.0:' + port );