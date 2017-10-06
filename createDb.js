var mongoose = require('mongoose');
var Category = mongoose.model('Category');
var Article = mongoose.model('Article');

var db = mongoose.connection;

db.on('open', function () {
  console.log('dropDatabase');

  db.dropDatabase(function (err) {
    if (err) {
      throw Error(err);
    }

    new Article({ title: 'article', content: '1' }).save();
    new Article({ title: 'article', content: '2' }).save();
    new Article({ title: 'article', content: '3' }).save();
    new Article({ title: 'article', content: '4' }).save();
    new Article({ title: 'article', content: '5' }).save();
    new Article({ title: 'article', content: '6' }).save();
    new Article({ title: 'article', content: '7' }).save();
    new Article({ title: 'article', content: '8' }).save();
    new Article({ title: 'article', content: '9' }).save();
    new Article({ title: 'article', content: '10' }).save();
    new Article({ title: 'article', content: '11' }).save();
    new Article({ title: 'article', content: '12' }).save();
    new Article({ title: 'article', content: '13' }).save();
    new Article({ title: 'article', content: '14' }).save();
    new Article({ title: 'article', content: '15' }).save();

    var article = new Article({
      title: 'Днепр (город)',
      content: '\
        <p><strong>Днепр</strong> (<strong>Днипро́</strong>[5], укр. <em>Дніпро́</em>; до 1796 и с 1802 по 1926 — <strong>\
          Екатериносла́в</strong>, с 1796 по 1802 — <strong>Новоросси́йск</strong>, с 1926 по 2016 — <strong>\
          Днепропетро́вск</strong>, укр. <em>Дніпропетро́вськ</em>) — город, областной центр Днепропетровской области\
          Украины, центр Днепровской агломерации[6]. Четвёртый город по численности населения на Украине после\
          <a href="#">Киева</a>, <a href="#">Харькова</a> и <a href="#">Одессы</a>.</p>\
          \
        <p>Город был первоначально задуман как третья[7][8][9] столица Российской империи, после Москвы и\
          Санкт-Петербурга, и как центр Новороссии[7]. Один из крупнейших промышленных центров Советской Украины,\
          Днепропетровск был одним из ключевых центров оборонной и космической промышленности Советского Союза.\
          Из-за своей военной промышленности Днепропетровск был закрытым для посещения иностранцами городом\
          вплоть до 1990-х годов. Особенно были развиты чёрная металлургия, металлообрабатывающие цеха,\
          машиностроение и другие тяжёлые отрасли промышленности.</p>\
          \
        <p>По данным на 1 января 2017 года, в городе проживало 976 525 человек наличного населения, в границах\
          горсовета — включая пгт Авиаторское — 978 943 человека[3], на 1 ноября 2015 года — 974 341 постоянный\
          житель и 984 466 человек наличного населения, в границах горсовета — 976 755 постоянных жителей и 986\
          887 человек наличного населения[10]. В 1976—2011 годах численность населения Днепропетровска превышала\
          миллион человек.</p>'
    });

    article.save(function (err) {
      if (err) {
        throw Error(err);
      }

      new Category({ title: 'География' }).save(function (err, category) {
        if (err) {
          throw Error(err);
        }

        category.articles.push(article);
        category.save();
      });

      new Category({ title: 'Искусство' }).save();
      new Category({ title: 'История' }).save();
      new Category({ title: 'Музыка' }).save();
      new Category({ title: 'Наука' }).save();
      new Category({ title: 'Общество' }).save();
      new Category({ title: 'Персоналии' }).save();
      new Category({ title: 'Религия' }).save();
      new Category({ title: 'Спорт' }).save();
      new Category({ title: 'Техника' }).save();
      new Category({ title: 'Философия' }).save();
    });
  });
});