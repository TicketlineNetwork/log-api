# log-api
A logging api that provides a log command and an interface to a logging queue (Rabbit MQ in the current case)

The log library is a class based implementation that connects to the log queue in the background (if not already connected) and sends logs to the queue. The logger will accept either regular text or JSON object as input for logging.

Because the log connects to the Rabbit log queue and is a nested class, your application will not automatically exit on completion - the log connection to Rabbit is still live. Calling `process.exit()` will force your application to exit, or if your application is in a container it will automatically close the connection when the container stops.

## Usage

The logging call will automatically check whether a connection has already been established or not. 

To install the package use:

```
$ npm install tl-log-api
```

To initialise logging in a file do the following:

CommonJS style:
```
const logApi = require('tl-log-api')
const log = new logApi.logApi(amqp://addressofqueue:portofqueue);
```

ES6 style:
```
import logApi from "tl-log-api"
const log = new logApi(amqp://addressofqueue:portofqueue);
```

You can then use the log as before like so:

```
let logResult = log.logger(message);
```

The logResult can be monitored for failure if needs be. It will report "Log sent" on success, or if there is an error it will handle the exception and return either "Cannot connect to log queue" or "Log failed to send". The system will also log out to the console any failure logs such as failed to connect, or undefined variables.
