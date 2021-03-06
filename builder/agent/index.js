const express = require('express');
const config = require('./src/config');
const { BuilderService } = require('./src/services/builderService');

async function bootstrap() {
  const server = express();
  server.use(express.json());

  const { serverHost, serverPort, port } = config;
  const serverUrl = `http://${serverHost}:${serverPort}`;

  const builderService = new BuilderService(serverUrl, port);

  server.get('/build', (req, res) => {
    const { isBuilding } = builderService;
    res.status(200).send(isBuilding);
  });

  server.post('/build', (req, res) => {
    builderService.startBuild(req.body);
    res.status(201).end();
  });

  server.listen(config.port, () => console.log(`Server listening on port ${config.port}!`));
  builderService.init();
}

bootstrap();
