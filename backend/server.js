require('dotenv').config();
const app = require('./app');

const PORT =3000;

app.listen(PORT, () => {
    console.log(`\n Server running on http://localhost:3000\n`);
    console.log(` API Documentation: http://localhost:3000/api\n`);
});