# SHRI School CI Server

### Node.js version 12.16.1

[Документация API](https://documenter.getpostman.com/view/10695911/SzS2yooe?version=latest)

## Getting started

```bash
cd server
npm install
```

Сервер использует конфиг заданный в .env, поэтому перед стартом нужно его создать.  
В корне server создайте файл .env с полями

```conf
STORAGE_API_KEY=API_KEY # API_KEY - apiKey от вашего хранилища, Обязательное поле
# Так же можно указать опциональные поля.
# По умолчанию установлены следующие значения
# PORT=3001 # PORT на котором запускается сервер
# STORAGE_URL=https://hw.shri.yandex/api/ # URL вашего хранилища
```

Токен можно получить здесь -> https://hw.shri.yandex/  
Нужно будет войти через гитхаб

Для разработки используется nodemon

```bash
npm run start // запуск nodemon
npm run start:debug // запуск nodemon в дебаг режиме
npm run prod // запуск сервера в прод режиме (обязательно нужно сбилдить клиент, перед запуском этой команды)
npm run lint // запуск линтера
```

Для запуска юнит тестов сервера

```bash
cd server
# для тестирования работы с гитом используется отдельный репозиторий https://github.com/artuom130/school-ci-test-repo.git
# который должен быть склонирован в папку src/__tests__/testRepo
# для этого запустите команду (находясь в папке сервер).
npm run test:pre
# затем можно
npm run test
```

## About (Описание моих решений)

Текущая версия АПИ:  
Может работать только с публичными репозиториями.
Для всех запросов на билд делает buildInit для заданного хэша.

### Working with Git

Для работы с гитом используется класс GitService. Под капотом использует метод exec.
Выбрал exec, потому что объем информации получаемой от гита в текущей ситуации довольно
небольшой и при этом через exec удобно задавать нужные команды.

### Endpoint settings

При обновлении настроек репозиторий клонируется в рабочую папку repo.
При обновлении репозитория предыдущий удаляется и в repo записывается новый репозиторий.  
Обработка ошибок по репозиторию происходит при сохранении настроек репозитория.
Во время сохранения он пытается его склонировать и затем вытащить последний коммит из указанной ветки.
Если последний коммит еще не был сбилжен и его нет в текущей очереди, он его добавит в очередь.
Если неправильная ветка или имя репозитория вернется ошибка.

Решил в домашке ждать пока склонируется репозиторий во время запроса на сохранение настроек.
В реальном проекте мне кажется можно проверять это все на этой же ручке,
только уже через API Github, чтобы ускорить этот процесс + добавить
возможность работать с приватными репозиториями.

### Endpoint builds

Ручка `/api/builds/:commitHash POST` всегда добавляет в очередь переданный коммит,
вне зависимости от того был ли он уже добавлен в очередь или собран.

### Error handling

Для создания кастомных ошибок используется класс HttpError в src/utils/customErrors.js,
был создан для наличия у кастомных ошибок определенных полей, которые могут обрабатываться на клиенте. На данный момент это поле errorCode, которое express прокидывает в ответ в случае ошибки.

### Задание со звездочкой

Добавил node-cron таску, которая использует SettingService для добавления коммита в очередь.  
Логика такая же как и при обновлении настроек, сейчас берет только последний коммит.
В случае обновления настроек cron таск:

- пересоздается, если в новых настройках указан не нулевой период
- останавливается, если указан нулевой период
