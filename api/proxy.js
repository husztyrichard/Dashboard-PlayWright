const https = require('https');
const http = require('http');

module.exports = async function handler(req, res) {
  const targetPath = req.query.path || '';
  const baseUrl = process.env.REACT_APP_API_BASE_URL || process.env.API_BASE_URL || '';

  if (!baseUrl) {
    res.status(500).json({ message: 'API_BASE_URL is not configured' });
    return;
  }

  const target = new URL(`${baseUrl.replace(/\/$/, '')}/${targetPath}`);
  const client = target.protocol === 'https:' ? https : http;

  const request = client.request(
    {
      hostname: target.hostname,
      port: target.port,
      path: `${target.pathname}${target.search}`,
      method: req.method,
      headers: {
        ...req.headers,
        host: target.host,
      },
    },
    response => {
      res.statusCode = response.statusCode;
      response.headers && Object.entries(response.headers).forEach(([key, value]) => {
        if (value) {
          res.setHeader(key, Array.isArray(value) ? value.join(',') : value);
        }
      });
      response.pipe(res);
    }
  );

  req.pipe(request);
};
