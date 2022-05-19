(() => {
   // создаём массив из парных чисел
   function createArr(cards) {
      let arr = [];

      for (let i = 0; cards / 2 > i; ++i) {
         arr.push(i + 1);
      }
      arr = [...arr, ...arr]
      return arr;
   };
   // функция перемешивания массива
   function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
         let j = Math.floor(Math.random() * (i + 1));
         [array[i], array[j]] = [array[j], array[i]];
      }
   };
   // обработчик события на карточке
   function recordStateCard(card, keySessionGame, allCards) {

      if (!(card.classList.contains('card_active') || card.classList.contains('card_wait'))) {
         // получаем элемент который "ждёт"
         const cardsWait = document.querySelectorAll('.card_wait');

         // проверяем есть ли уже открытые проверяемые карточки
         if (cardsWait.length < 2) {

            // проверяем есть ли уже карточка "ждущая пары"
            if (cardsWait.length === 0) {
               // нет - открываем "кликнутую"
               card.classList.add('card_wait');

               recordLocalStorage(keySessionGame);

               // есть -проверяем на одинаковость
            } else if (cardsWait[0].textContent === card.lastChild.textContent) {
               // одинаковы - открываем их как "пару"
               cardsWait.forEach((item) => item.classList.remove('card_wait'));
               cardsWait.forEach((item) => item.classList.add('card_active'));
               card.classList.add('card_active');

               recordLocalStorage(keySessionGame);

            } else {
               // не одинаковы - закрываем их обоих (предватирельно открыв на время)
               card.classList.add('card_wait');

               window.setTimeout(() => {
                  card.classList.remove('card_wait');
                  cardsWait.forEach((item) => item.classList.remove('card_wait'));

                  recordLocalStorage(keySessionGame);
               }, 600);
            };

            // проверяем закончилась ли игра
            checkStateGame(keySessionGame, allCards);
         };


      };

   };
   // запись в LS изменений после каждого клика по карточке
   function recordLocalStorage(keySessionGame) {
      // записываем данные действия в LS
      let arrayLocalStorage = [];
      const allCards = document.querySelectorAll('.contr-cards__card');

      for (card of allCards) {
         let state;

         if (card.classList.contains('card_wait')) {
            state = 'wait';
         } else if (card.classList.contains('card_active')) {
            state = 'active';
         } else {
            state = false;
         };

         // создаём объект с информацией об одной карточке и пушим его в массив
         const cardInfo = {};
         cardInfo.number = card.textContent;
         cardInfo.state = state;
         arrayLocalStorage.push(cardInfo);
      };

      localStorage.setItem(keySessionGame, JSON.stringify(arrayLocalStorage));
   };
   // проверяем закончилась ли игра
   function checkStateGame(keySessionGame, rowAndColumn = 16) {
      const activeCards = document.querySelectorAll('.card_active');

      if (activeCards.length == rowAndColumn) {
         // останавливаем таймер если ещё не остановлен
         let timer = runTimerRestart();
         timer(true);
         bar.stop();

         // создаём кнопку рестарта по завершению игры
         const btnNewStart = createBtnNewGame(keySessionGame);
         const btnRestartContr = document.querySelector('.btn-restart-contr');
         btnRestartContr.append(btnNewStart);
      };
   };

   // создаём кнопку "начать заново"
   function createBtnRestart(keySessionGame) {
      const btnRestartContr = document.createElement('div');
      const btnRestart = document.createElement('button');
      btnRestartContr.classList.add('btn-restart-contr');
      btnRestart.classList.add('btn-restart', 'btn', 'btn-secondary');
      btnRestart.textContent = 'Начать заново';

      btnRestartContr.append(btnRestart);

      btnRestart.addEventListener('click', () => {
         localStorage.removeItem('timer-progress');
         localStorage.removeItem('stopTimer');
         localStorage.removeItem('timer');
         localStorage.removeItem(keySessionGame);
         location.reload();
      });

      return btnRestartContr;
   };
   // создаём кнопку "сыграть ещё раз"
   function createBtnNewGame(keySessionGame) {
      const btnNewStart = document.createElement('button');

      btnNewStart.classList.add('btn-new-game', 'btn', 'btn-primary');
      btnNewStart.textContent = "Сыграть ещё раз";
      btnNewStart.addEventListener('click', () => {
         localStorage.removeItem('timer-progress');
         localStorage.removeItem('stopTimer');
         localStorage.removeItem('timer');
         localStorage.removeItem(keySessionGame);
         location.reload();
      });
      return btnNewStart;
   }
   // создаём сетку карточек
   function createGridCards(arrValueInputs, keySessionGame) {
      // создаём контейнер для всех карт  
      const contrCards = document.createElement('div');
      contrCards.classList.add('contr-cards');

      // получаем кол-во карточек по горизонтали и по вертикали
      let [row, column] = arrValueInputs;
      let cards = row * column;

      for (let i = 0; column > i; ++i) {
         const rowCards = document.createElement('ul');
         rowCards.className = 'contr-cards__row';

         // если колонок больше 4 то уменьшаем ращмер карточек
         if ((column > 4) && (column <= 6)) {
            rowCards.classList.add('contr-cards__row_size1');
         } else if (column > 6) {
            rowCards.classList.add('contr-cards__row_size2');
         };

         for (let i = 0; row > i; ++i) {
            // создаём li и наполняем его 
            const card = document.createElement('li');
            const cardFront = document.createElement('span');
            const cardBack = document.createElement('span');
            card.className = 'contr-cards__card';
            cardFront.className = 'contr-cards__card-front';
            cardBack.className = 'contr-cards__card-back';

            // если колонок больше 4 то уменьшаем ращмер карточек
            if ((column > 4) && (column <= 6)) {
               card.classList.add('contr-cards__card_size1');
            } else if (column > 6) {
               card.classList.add('contr-cards__card_size2');
            }

            // вешаем слушатель на li
            card.addEventListener('click', () => recordStateCard(card, keySessionGame, cards));

            // добавляем созданные li в ul
            card.append(cardBack);
            card.append(cardFront);
            rowCards.append(card);
         };
         // добавляем ul со всеми li в container
         contrCards.append(rowCards);
      };
      return contrCards;
   };

   // создаём контейнер для таймера
   function createContrTimer() {
      const contrTimer = document.createElement('div');
      const timerNumber = document.createElement('span');

      contrTimer.classList.add('contr-timer');
      contrTimer.id = 'container';
      timerNumber.classList.add('contr-timer__number');

      // contrTimer.append(timerText);
      contrTimer.append(timerNumber);

      return contrTimer;
   };
   // функция таймер   
   function runTimerRestart(timeTimer = 300, keySessionGame) {
      const numberTimer = document.querySelector('.contr-timer__number');
      let stateTimer = timeTimer;
      let timerId;

      return function timer(stopTimer) {

         if (stopTimer === true) {
            clearInterval(timerId);
            localStorage.setItem('stopTimer', stopTimer);
            return;
         }

         // проверяем первый ли запуск таймера или нет 
         if (!(localStorage.getItem('timer') === null)) {
            stateTimer = localStorage.getItem('timer');
            numberTimer.textContent = stateTimer;
         } else {
            numberTimer.textContent = stateTimer;
         };

         // запускаем таймер
         timerId = setInterval(() => {
            if (stateTimer == 0) {
               return;
            }

            --stateTimer;
            // завершена ли игра раньше таймера
            const allCards = document.querySelectorAll('.contr-cards__card-front');
            const allCardsActive = document.querySelectorAll('.card_active');

            if (allCards.length === allCardsActive.length) {
               clearInterval(timerId);
               // останавливаем анимацию прогресса
               bar.stop();

               return;
            };

            // меняем значение счётчика и фиксируем его в ЛС
            numberTimer.textContent = stateTimer;
            localStorage.setItem('timer', stateTimer);
            // высчитываем состояние индикатора таймера и фиксируем его в ЛС
            let progress = (1 / timeTimer) * (timeTimer - (stateTimer))
            localStorage.setItem('timer-progress', progress);

            // закончить игру когда таймер равен нулю
            if ((stateTimer) == 0) {
               // setTimeout(() => document.querySelector('.btn-restart').click(), 1000);

               setTimeout(() => {
                  const allCards = document.querySelectorAll('.contr-cards__card');
                  for (let card of allCards) {
                     card.classList.remove('card_wait');
                     card.classList.add('card_active');
                  };
                  const valueStateCards = JSON.parse(localStorage.getItem(keySessionGame));
                  for (let stateCard of valueStateCards) {
                     stateCard.state = 'active';
                  };
                  localStorage.setItem(keySessionGame, JSON.stringify(valueStateCards));
                  // checkStateGame(keySessionGame);

                  const btnNewStart = createBtnNewGame(keySessionGame);
                  const btnRestartContr = document.querySelector('.btn-restart-contr');
                  btnRestartContr.append(btnNewStart);

               }, 1000);
               return;
            };


         }, 1000);
         return stateTimer;
      };
   };
   // таймер индикатор(сторонний плагин)
   function runTimerIndicator(durationValue) {

      var line = new ProgressBar.Line('#container');

      var bar = new ProgressBar.Circle(container, {
         strokeWidth: 10,
         easing: 'linear',
         duration: durationValue * 1000,
         color: 'black',
         trailColor: '#f5d80d',
         trailColor: '#f5de16',
         trailWidth: 10,
         svgStyle: null,
      });
      bar.animate(1.0);


      if (localStorage.getItem('timer-progress') !== null) {

         let progress = localStorage.getItem('timer-progress');
         bar.set(progress);
         bar.animate(1.0);
      };

      window.bar = bar;

      return bar;
   };

   // создаём стартовое меню
   function createStartMenu(keySessionGame = 'game-session', keyValueInputs = 'cards') {
      if ((JSON.parse(localStorage.getItem(keySessionGame)) == null) || (JSON.parse(localStorage.getItem(keySessionGame)) == [])) {

         const container = document.querySelector('.container');
         const startMenu = document.createElement('div');
         startMenu.classList.add('start-menu');

         // создаём контейнера со span и input
         for (let i = 0; i < 3; ++i) {
            const contrInput = document.createElement('label');
            const spanInput1 = document.createElement('span');
            const spanInput2 = document.createElement('span');
            const input = document.createElement('input');

            // добавляем им классы
            contrInput.classList.add('start-menu__contr-input');
            input.classList.add('start-menu__input', 'form-control');
            spanInput1.classList.add('start-menu__text', 'form-text');
            spanInput2.classList.add('start-menu__text', 'form-text', 'start-menu__text_fail');
            if (i < 2) {
               input.classList.add('start-menu__input_layout');
            } else {
               input.classList.add('start-menu__input_timer');
            }

            // добавляем аттрибуты
            if (i === 2) {
               input.type = 'number';
               input.min = '10';
               input.max = '300';
               input.value = '60';
            } else {
               input.type = 'number';
               input.min = '2';
               input.max = '10';
               input.value = '4';
            }

            // вкладываем текстовый контент в span
            if (i === 0) {
               spanInput1.textContent = 'Кол-во карточек по горизонтали';
               spanInput2.textContent = '( пожалуйста, введите чётное число от 2 до 10 )';
            } else if (i === 1) {
               spanInput1.textContent = 'Кол-во карточек по вертикали';
               spanInput2.textContent = '( пожалуйста, введите чётное число от 2 до 10 )';
            } else {
               spanInput1.textContent = 'Время таймера, завершающего игру';
               spanInput2.textContent = '( пожалуйста, введите число от 10 до 300 )';
            };

            // собираем "матрёшку"
            contrInput.append(spanInput1);
            contrInput.append(input);
            contrInput.append(spanInput2);
            startMenu.append(contrInput);
         };
         // создаём кнопку
         const btnStartGame = document.createElement('button');
         btnStartGame.classList.add('start-menu__btn', 'btn', 'btn-success');
         btnStartGame.textContent = 'Начать игру';

         // слушатель спроверкой на правильность введёных данных
         btnStartGame.addEventListener('click', () => {
            const inputs = document.querySelectorAll('.start-menu__input');

            // перебираем полученные input
            for (let input of inputs) {

               if (input.classList.contains('start-menu__input_layout')) {
                  // проверяем поля со значением рядов и колонок
                  if ((2 <= input.value) && (input.value <= 10) && (input.value % 2 === 0)) {
                     // классы для валидного поля
                     input.classList.add('input-valid');
                     input.classList.remove('input-invalid');
                  } else {
                     // классы для невалидного поля
                     input.value = '4';
                     input.classList.add('input-invalid');
                     input.classList.remove('input-valid');
                  };
               } else if (input.classList.contains('start-menu__input_timer')) {
                  // проверяем поле со значение таймера
                  if ((10 <= input.value) && (input.value <= 300)) {
                     // классы для валидного поля
                     input.classList.add('input-valid');
                     input.classList.remove('input-invalid');
                  } else {
                     // классы для невалидного поля
                     input.value = '60';
                     input.classList.add('input-invalid');
                     input.classList.remove('input-valid');
                  };
               }

            };

            // отрисовываем игру если все input валидны   
            const arrInputs = Array.from(inputs)

            if (arrInputs.find((item) => item.classList.contains('input-invalid')) === undefined) {

               // получаем значение о количестве рядов и колонок
               const inputsLayoutValue = document.querySelectorAll('.start-menu__input_layout');
               const arrInputsLayout = Array.from(inputsLayoutValue);
               let valueInputs = [];

               for (let input of arrInputsLayout) {
                  valueInputs.push(input.value);
               };

               // получаем значение таймера
               const inputTimerValue = document.querySelector('.start-menu__input_timer');
               const valueTimer = inputTimerValue.value;


               localStorage.setItem(keyValueInputs, JSON.stringify(valueInputs));
               localStorage.setItem('start-value-timer', JSON.stringify(valueTimer));

               startMenu.classList.add('d-none');
               createGameCards(valueInputs, keySessionGame, valueTimer);
            };
         });
         startMenu.append(btnStartGame);
         container.append(startMenu);

         // если в LS что-то есть то отрисовываем игру   
      } else {
         const valueInputs = JSON.parse(localStorage.getItem(keyValueInputs));
         const valueTimer = JSON.parse(localStorage.getItem('start-value-timer'));
         createGameCards(valueInputs, keySessionGame, valueTimer);
      };
   };

   // отрисовка игры
   function createGameCards(arrValueInputs, keySessionGame, startValueTimer) {
      // получаем контейнер
      const container = document.querySelector('.container');
      // добавляем кнопку рестарта
      const btnRestartContr = createBtnRestart(keySessionGame);
      container.append(btnRestartContr);
      // добавляем таймер
      const contrTimer = createContrTimer();
      btnRestartContr.append(contrTimer);
      const timer = runTimerRestart(startValueTimer, keySessionGame);
      let durationValue;
      // проверяем не остановлен ли таймер
      const stopTimer = localStorage.getItem('stopTimer');

      if (Boolean(stopTimer) !== true) {
         durationValue = timer();
         runTimerIndicator(durationValue);
      } else {
         const numberTimer = document.querySelector('.contr-timer__number');
         numberTimer.textContent = localStorage.getItem('timer');

         const bar = runTimerIndicator();
         const progress = localStorage.getItem('timer-progress');
         bar.set(progress);
      }

      // получаем кол-во карточек по горизонтали и по вертикали
      let [row, column] = arrValueInputs;
      let cards = row * column;

      // вынимаем массив из функции 
      let array = createArr(cards);

      // проверяем пустое ли локальное хранилище
      if ((JSON.parse(localStorage.getItem(keySessionGame)) == null) || (JSON.parse(localStorage.getItem(keySessionGame)) == [])) {
         // создаём массив с данными li, который потом запишем в локальное хранилище
         const arrLocalStorage = [];
         // перемешиваем массив
         shuffle(array);

         // создаём объект с информацией об одной карточке и пушим его в массив
         for (let j = 0; array.length > j; ++j) {
            const cardInfo = {};
            cardInfo.number = array[j];
            cardInfo.state = false;
            arrLocalStorage.push(cardInfo);
         };
         // записываем созданный массив с информацией о сессии в LS 
         localStorage.setItem(keySessionGame, JSON.stringify(arrLocalStorage));

         // создаём нужное количество карточек и вставляем в контейнер
         const contrCards = createGridCards(arrValueInputs, keySessionGame);
         container.append(contrCards);

         // получаем карточки наполняем их
         const cardsAll = document.querySelectorAll('.contr-cards__card');
         for (let i = 0; cards > i; ++i) {
            // присваиваем каждой полученной карточке значение
            let card = cardsAll[i];
            card.lastChild.textContent = array[i];
         };

      } else {
         // получаем массив из LS
         const valueLocalStorage = JSON.parse(localStorage.getItem(keySessionGame));

         // создаём li наполняя их информацией полученной из LS
         // создаём нужное количество карточек и вставляем в контейнер
         const contrCards = createGridCards(arrValueInputs, keySessionGame);
         container.append(contrCards);

         // получаем карточки наполняем их и добавляем статус
         const cardsAll = document.querySelectorAll('.contr-cards__card');
         for (let i = 0; cards > i; ++i) {
            // поочереди вынимаем из массива объект и запис. его значения в переменные
            let itemValueStorage = valueLocalStorage[i];
            let [number, state] = Object.values(itemValueStorage);

            // присваиваем каждой полученной карточке значение и состояние
            let card = cardsAll[i];
            card.lastChild.textContent = number;

            // добавляем карточке класс в зависимости от полученных значений
            if (state === 'wait') {
               card.classList.add('card_wait');
            } else if (state === 'active') {
               card.classList.add('card_active');
            };
         };

      };

      // проверяем закончилась ли игра
      checkStateGame(keySessionGame, cards);
   };

   window.createGameCards = createGameCards;
   window.createStartMenu = createStartMenu;
})();