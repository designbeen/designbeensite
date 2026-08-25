const app = require('./app');
require('dotenv').config();

const port = Number(process.env.PORT || 5000);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`DesignBeen API listening on port ${port}`);
});
