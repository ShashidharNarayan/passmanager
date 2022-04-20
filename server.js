(async () => {
    const port = 8080
    const db = await require('./connection');
    const app = require('./app')(db);

  app.listen(process.env.PORT || port, () => {
    console.log(`Server listening on port ${port}`);
  });
})();