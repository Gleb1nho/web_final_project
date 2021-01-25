var express = require('express');
var router = express.Router();

var guest_controller = require('../controllers/guestController');

// Отрендерить начальную страницу
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Toybastar' });
});

router.get('/guest_all', guest_controller.guest_all)

//Создание брони
router.get('/guest/create', guest_controller.guest_create_get);

router.post('/guest/create', guest_controller.guest_create_post);

//Показать информацию по конкретной брони
router.get('/guest/:id', guest_controller.guest_detail);

//Изменить параметры брони
router.get('/guest/:id/update', guest_controller.guest_change_get);

router.post('/guest/:id/update', guest_controller.guest_change_post);

// Удалить бронь
router.post('/guest/:id/delete', guest_controller.guest_delete_post);


module.exports = router;
