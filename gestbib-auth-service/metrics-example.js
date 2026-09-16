// Exemple d'intégration de prom-client dans Express (auth-service)
const express = require('express');
const client = require('prom-client');

const app = express();

// Activer la collecte automatique des métriques par défaut (CPU, Mémoire, Event Loop)
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// Création de métriques personnalisées (ex: compteur de requêtes HTTP)
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Nombre total de requêtes HTTP reçues',
  labelNames: ['method', 'route', 'status']
});

// Middleware pour compter les requêtes
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});

// Endpoint /metrics pour Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});
