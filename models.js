var mongoose = require('mongoose');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var pillSchema = new Schema({
    nombre		: String
  , pill_type : String
  , titulo_a  : String
  , titulo_b  : String
  , texto_boton : String
  , date_from : Date
  , date_to   : Date
  , url       : String
  , url_type  : String
  , video_html  : String
  , video_titulo : String
  , video_a_texto : String
  , imagen    : String
  , columna   : Number
  , destacado : Boolean
  , estado    : Number
});

var bannerSchema = new Schema({
    nombre    : String
  , date_from : String
  , date_to   : String
  , imagen    : String
  , link      : String
});

var creadorSchema = new Schema({
    nombre    : String
  , subtitulo : String
  , mage_id   : Number
  , imagen_avatar  : String
  , descripcion : String
  , url       : String
  , texto_boton_video : String
  , video_html : String
  , video_url : String
  , video_url_type  : String
  , video_titulo : String
  , video_a_texto : String
  , destacado : Boolean
  , estado    : Number
});

var globalesSchema = new Schema({
    prox_apertura_date          : Date
  , prox_apertura_hora_desde    : String
  , prox_apertura_hora_hasta    : String
});

exports.Creador = mongoose.model('Creador', creadorSchema);
exports.Pill = mongoose.model('Pill', pillSchema);
exports.Banner = mongoose.model('Banner', bannerSchema);
exports.Globales = mongoose.model('Globales', globalesSchema);