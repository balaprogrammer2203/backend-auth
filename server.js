const app = require('./app');
const PORT = process.env.PORT || 5000;

// custom console.log
const cLogger = require('./helpers/logger/chalkLogger');

//Start server and console log the used port
const server = app.listen(PORT, function () {
  cLogger.log(
    `Server is up and running on  http://localhost:${server.address().port}`
  );
  
  console.log(
    `Server is up and running on  http://localhost:${server.address().port}`
  );
});

const exitHandler = () => {
    if (server) {
      server.close(() => {
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
};

process.on('unhandledRejection', (err, p)=>{
    cLogger.error(`Error: ${err.message}`);
    cLogger.warn("Possibly Unhandled Rejection at: Promise ", p);
    cLogger.warn('Shutting down the server due to unhandled rejection error');
    exitHandler();
})

process.on('uncaughtException', (err) => {
    cLogger.error(`Error: ${err.message}`);
    cLogger.warn('Shutting down the server due to uncaught exception error');
    exitHandler();
})

process.on('SIGTERM', () => {
    cLogger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});


