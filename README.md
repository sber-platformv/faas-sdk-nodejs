# FAAS-SDK для тестирования и локальной отладки Node.js функций

FAAS-SDK позволяет локально тестировать функции [Platform V Functions](https://developers.sber.ru/portal/products/platform-v-functions) без необходимости писать HTTP сервер и логику обработки запросов.

SDK для Node.js устанавливается как обычный пакет.

## Пререквизиты

* NodeJS 16.x;
* npm;

## Установка и использование

1. Создайте новый проект NodeJS с файлом `package.json`. Например, через команду `npm init -y` в директории, в которой нужно расположить проект для тестирования, например `test-function`.

2. Подготовьте функцию Functions, которая будет тестироваться. Если у вас нет готовой функции — вы можете экспортировать новую функцию с примером из Functions, либо создать в директории проекта для тестирования файл `function/handlers/handler.js` с функцией:
   
	```js
    	exports.handler = (req, res) => {
  	    	console.log(`Request received: ${JSON.stringify(req.body)}\nMethod: ${req.method}`);
    		res.status(200).send(`Hello from NodeJS function!\nYou said: ${JSON.stringify(req.body)}`);
		};
	```
    
    >Вы также можете экспортировать готовую функцию Functions. 

3. Установите SDK командой CLI `npm install faas-sdk-nodejs`. Установку следует производить в директории проекта для тестирования, в данном примере — `test-function`.

4. Добавьте скрипт `start` в файл `package.json` в корне проекта:
    
    ```json
      "scripts": {
        "start": "faas-sdk-nodejs --source=./function/handlers/handler.js"
      }
    ```
   , где. `--source=./function/handlers/handler.js` — путь к файлу функции с обработчиком запросов.
   
5. Запустите проект для тестирования командой `npm start`:
    
    ```sh
        npm start
        ...
        Function: handler
        🚀 Function ready at http://localhost:8082
    ```
    
6. Отправьте запрос используя `curl`, браузер или другие инструменты:
    
    ```sh
        curl localhost:8082
        # Hello from NodeJS function!
        # You said:
    ```

## Конфигурация

Запуск SDK конфигурируется с помощью флагов командной строки или переменных среды:

| Флаг        | Переменная среды  | Значение по умолчанию | Описание                                                                 |
| ------------| ------------------|-----------------------| -------------------------------------------------------------------------|
| `--port`    | `PORT`            | 8082                  | Порт, на котором будет работать слушатель запросов faas-sdk-nodejs       |
| `--target`  | `FUNCTION_TARGET` | handler               | Имя экспортируемой функции, которая будет вызываться при запросах        |
| `--source`  | `FUNCTION_SOURCE` | handlers/handler.js   | Путь к файлу функции                                                     |

Необходимые флаги можно добавить в скрипт `start` файла `package.json` вашего проекта для тестирования, например:

```json
  "scripts": {
    "start": "faas-sdk-nodejs --target=your_function_name --source=./function/handlers/handler.js"
  }
```

Если флаги не указаны, значения для параметров запуска SDK будут подтянуты из переменных среды Node.js.

## Unit-тестирование

Вы можете добавить unit-тесты в тестируемую локально функцию так же, как и в любой NodeJS проект. Для этого добавьте инструмент тестирования, например `jest`, в зависимости функции.

Обратите внимание, что добавлять unit-тесты нужно в проект функции, а не в проект для локального тестирования.

Например, чтобы добавить простой unit-тест в `hello, world` пример в новой функции:

1. В `package.json` добавьте следующие строки:
    
    ```json
     ...
      "scripts": {
          "test": "jest",
          "prepare-function": "npm run test"
      },
      "devDependencies": {
          "jest": "^27.5.1",
          "sinon": "^13.0.2"
      }
    ...
    ```
    
2. Если работа ведется локально, то установите `jest` и `sinon` в папку проекта. Например, можно воспользоваться командами терминала:
    
    ```shell
    npm install jest@27.5.1
    npm install sinon@13.0.2
    ```
    
3. Создайте в корневой директории функции директорию **test** и добавьте в нее файл `handler.test.js` со следующим содержанием:
    
    ```json
    const sinon = require("sinon");
    const assert = require("assert");
    const {handler} = require("../handlers/handler");

    test("Function test", () => {
        // Mock ExpressJS 'req' and 'res' parameters
        const req = {
            body: "Hi from function!"
        };
        const res = {
            send: sinon.stub(),
            status: function (s) {
                this.statusCode = s;
                return this;
            }
        };

        // Call function
        handler(req, res);

        const expectedResponse = `Hello from NodeJS function!\nYou said: ${JSON.stringify(req.body)}`;

        assert.ok(res.send.calledOnce);
        assert.deepStrictEqual(res.send.firstCall.firstArg, expectedResponse);
    });
    ```
    
4. Запустите сборку функции. Логи unit-теста будут отображены в терминале.
