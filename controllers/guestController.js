var Guest = require('../models/guest');
const { body, validationResult } = require('express-validator');

exports.guest_all = function(req, res, next) {
    Guest.find({}, 'first_name patronymic date_of_reservation room time_of_reservation').exec(function (err, list_guests) {
        if (err) { return next(err); }
        res.render('guest_all', {title: 'All guests', guest_list: list_guests });
    })
}

//Создать новую бронь - GET
exports.guest_create_get = function(req, res, next) {
    res.render('guest_form', { title: 'Бронирование зала', rooms: ['Малый зал', 'Средний зал', 'Большой зал'],
    times: ['Утро', 'Вечер'] })
}

//Создать новую бронь - POST
exports.guest_create_post = [
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('Имя - обязательное для заполнения поле!'),
    body('patronymic').trim().isLength({ min: 1 }).escape().withMessage('Отчество - обязательное для заполнения поле!'),
    body('date_of_reservation', 'Недопустимая дата').optional({ checkFalsy: true }).isISO8601().toDate(),

    (req, res, next) => {
        const errors = validationResult(req);

        var guest = new Guest({
            first_name: req.body.first_name,
            patronymic: req.body.patronymic,
            date_of_reservation: req.body.date_of_reservation,
            time_of_reservation: req.body.time,
            room: req.body.room
        })
        
        // Сохраняем с проверкой того, что не один зал не бронируется в один день два раза подряд
        Guest.find({date_of_reservation: guest.date_of_reservation, room: guest.room, time_of_reservation: guest.time_of_reservation}, 
            'date_of_reservation room time_of_reservation')
        .exec(function (err, same_date_room) {
            if (err) { return console.log(err) }
            else {
                if (same_date_room.length === 0 && errors.isEmpty()) {
                    guest.save(function (err) {
                        if (err) { return next(err); }
                        res.redirect(guest.url);
                    })
                } else {
                    res.render('guest_form', { title: 'Бронирование зала', 
                        rooms: ['Малый зал', 'Средний зал', 'Большой зал'],
                        errors: [`К сожалению, выбранный Вами "${guest.room}" зал уже занят в ${guest.time_of_reservation} 
                        ${guest.date_of_reservation_formatted}, попробуйте другой день, время или зал.`], 
                        times: ['Утро', 'Вечер'], 
                        guest: guest })
                }
            }
        })
    }
]

//Показать информацию по конкретной брони - Get
exports.guest_detail = function(req, res, next) {
    Guest.findById(req.params.id).exec(function (err, info) {
        if (err) return res.render('guest_instance', {title: 'Информация о брони', error: `Введённый уникальный номер
        "${req.params.id}" не существует, пожалуйста, попробуйте ещё раз`});
        res.render('guest_instance', {title: 'Информация о брони', guest_info: info, error: `Введённый уникальный номер
        "${req.params.id}" не существует, пожалуйста, попробуйте ещё раз`});
    })}

//Отменить бронь - POST
exports.guest_delete_post = function(req, res, next) {
    Guest.findByIdAndRemove(req.params.id, function deleteGuest(err) {
        if (err) { return next(err); }
        res.render('deleted_guest', {title: 'Отмена брони', mes: `Ваша бронь с уникальным номером ${req.params.id} 
        была отменена`})
    })
}

//Изменить параметры брони - GET
exports.guest_change_get = function(req, res, next) {
    Guest.findById(req.params.id).exec(function (err, guest_info) {
        if (err) { return next(err); }
        res.render('guest_form', {title: 'Изменение брони', guest: guest_info, 
        rooms: ['Малый зал', 'Средний зал', 'Большой зал'], times: ['Утро', 'Вечер'] });
    })

}

//Изменить параметры брони - GET
exports.guest_change_post = [
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('Имя - обязательное для заполнения поле!'),
    body('patronymic').trim().isLength({ min: 1 }).escape().withMessage('Отчество - обязательное для заполнения поле!'),
    body('date_of_reservation', 'Недопустимая дата').optional({ checkFalsy: true }).isISO8601().toDate(),

    (req, res, next) => {
        const errors = validationResult(req);

        var guest = new Guest({
            first_name: req.body.first_name,
            patronymic: req.body.patronymic,
            date_of_reservation: req.body.date_of_reservation,
            room: req.body.room,
            time_of_reservation: req.body.time,
            _id: req.params.id
        })
        
        // Сохраняем с проверкой того, что ни один зал не бронируется в один день два раза подряд
        Guest.find({date_of_reservation: guest.date_of_reservation, room: guest.room, time_of_reservation: guest.time_of_reservation}, 
            'date_of_reservation room time_of_reservation').exec(function (err, same_date_room) {
            if (err) { return console.log(err) }
            else {
                if (same_date_room.length === 0 && errors.isEmpty()) {
                    Guest.findByIdAndUpdate(req.params.id, guest, {}, function(err, theguest) {
                        if (err) { return next(err); }
                        res.redirect(theguest.url)
                    });
                } else {
                    res.render('guest_form', { title: 'Бронирование зала', 
                        rooms: ['Малый зал', 'Средний зал', 'Большой зал'],
                        errors: [`К сожалению, выбранный Вами "${guest.room}" зал уже занят в ${guest.time_of_reservation}
                        ${guest.date_of_reservation_formatted}, попробуйте другой день, время или зал.`], 
                        times: ['Утро', 'Вечер'], guest: guest })
                }
            }
        })
    }
]
