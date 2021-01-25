var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var GuestSchema = new Schema(
  {
    first_name: {type: String, required: true, maxlength: 100},
    patronymic: {type: String, required: true, maxlength: 100},
    room: { type: String, required: true, enum: ['Малый зал', 'Средний зал', 'Большой зал'] },
    time_of_reservation: { type: String, required: true, enum: ['Утро', 'Вечер'] },
    date_of_reservation: {type: Date, required: true}
  }
);

// Virtual for author's full name
GuestSchema
.virtual('name')
.get(function () {
  return this.first_name + ' ' + this.patronymic;
});

// Virtual for bookinstance's URL
GuestSchema
.virtual('url')
.get(function () {
  return '/guest/' + this._id;
});

GuestSchema
.virtual('date_of_reservation_formatted')
.get(function () {
  return this.date_of_reservation ? moment(this.date_of_reservation).format('YYYY-MM-DD') : '';
});

//Export model
module.exports = mongoose.model('Guest', GuestSchema);