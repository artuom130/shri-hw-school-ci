# Домашка по воркерам

## Детали по запуску проекта описаны в корневом [readme](../README.md)

## About (описание моих решений)

### Как работает сборка

В дев режиме параллельно с CRA запускается компиляция в watch mode файла src/serviceWorker/sw.ts в папку public  
Для него указан отдельный tsconfig, чтобы нормально подтягивать типы и компилировать.  
С помощью react-app-rewired модифицирован конфиг вебпака.  
В режиме сборки он компилируется в папку temp, workbox-webpack-plugin
вставляет массив со всеми полученными в результате сборки файлами в этот файл и копирует его в build.
Для инициализации SW используется исходный serviceWorker.ts файл, модифицированный для возможности запуска SW в дев режиме.

### Стратегии кэширования

Я хотел попробовать написать все вручную, но выходит довольно много кода, который уже написан))  
Не используя плагин для webpack, можно было после билда пройтись по всем файлам в папочке билд, получить их хэш если его нет в названии, сохранить этот список в sw и дальше с ним работать.
Поэтому я использовал workbox.

Для статики используется механизм workbox-precache, который сохраняет сгенерированный вебпаком список файлов в кэш и при последующих загрузках грузит их оттуда.
Тут получается стратегия Cache Only, т.е. он всегда будет отдавать из кэша, пока не появится SW с новым списком файлов.  
Это позволяет моментально загружать приложение и при обновлении стилей или js их хэш изменится и список файлов в воркере обновится, что повлечет за собой обновление воркера и загрузку новой версии приложения.

Так же отдельно добавил кэширование шрифтов, стратегия CacheFirst (CacheOnly with fallback to Network), сохраняет на год только успешно загруженные шрифты. Тут все довольно просто, экономим трафик юзера сохранив шрифты локально.

И для запросов апи стратегии:  
/settings - NetworkFirst  
/builds - NetworkFirst  
/builds/:buildId - NetworkFirst  
В данном случае NetworkFirs стратегия использована для того, чтобы в случае
когда юзер зайдет на страницу в оффлайн режиме ему отобразились ранее загруженные данные.  
Для данных логов билда такая стратегия, потому что они не изменяются
/builds/:buildsId/logs - CacheFirst

### Что можно улучшить (эти пункты я буду выполнять после дедлайна)

1. Добавить в клиент нотификацию об упавшем запросе и о том, что приложение в онлайн режиме.
2. Написать стратегию кэшированию апи запросов вручную, для более тонкого управления. (Например, при запросе за списком билдов, можно также в кэш сохранять данные по каждому из билдов в отдельности, чтобы в случае перезагрузки на странице с билдом показать его).
3. Добавить тесты SW.
4. Выполнить доп задание по пушам.