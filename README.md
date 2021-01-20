# log-api
A logging api that provides a log command and an interface to a logging queue (Rabbit MQ in the current case)

The log library is a class based implementation that connects to the log queue in the background (if not already connected) and sends logs to the queue. Whilst the consumers have set formats they look for, the log producers can in theory send any type of log data to the queue - a consumer would just have to be implemented to consume that format.

## Usage

The logging call will automatically check whether a connection has already been established or not. 

To initialise logging in a file do the following:

CommonJS style:
```
const logApi = require('./log-api/index')

const log = new logApi.logApi(amqp://addressofqueue:portofqueue);
```

ES6 style:
```
import logApi from "./log-api/index"

const log = new logApi(amqp://addressofqueue:portofqueue);
```

You can then use the log as before like so:

```
let logResult = log.logger(message);
```

The logResult can be monitored for failure if needs be. If there is an error in the connection, the object should handle the exception and return either "Cannot connect to log queue" or "Log failed to send". The system should also output to the console any failure logs such as failed to connect, or undefined variables.

These instructions will be updated once the log-api is pushed to the npm repository. At that point instead of referencing the index, you will simply do `import logApi from "log-api"` or `const logApi = require('log-api')`
