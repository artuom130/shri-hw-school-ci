const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const config = require('./src/config');
const routes = require('./src/routes');
const syncCommitsCron = require('./src/tasks/sync-commits-cron');
const buildQueueCron = require('./src/tasks/process-queue');

async function bootstrap() {
  const server = express();
  const isProd = config.nodeEnv === 'production';

  if (!isProd) server.use(cors());
  server.use(bodyParser.json());
  server.use(morgan(isProd ? 'common' : 'dev'));
  routes.init(server);

  syncCommitsCron.init();
  buildQueueCron.init();

  server.listen(config.port, () => console.log(`Server listening on port ${config.port}!`));
}

bootstrap();
