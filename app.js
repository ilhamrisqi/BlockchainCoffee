const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

//-------------------------
// set up connect databasee
//-------------------------

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const { name, role } = req.body;
    // Logika pendaftaran dan setup pengguna
    // Simpan data pengguna ke database atau lakukan proses lainnya
    res.redirect('/');
});

app.get('/orders', (req, res) => {
    res.render('orders');
});

app.post('/orders', (req, res) => {
    const { order } = req.body;
    // Logika pembuatan pesanan
    // Simpan pesanan ke database atau lakukan proses lainnya
    res.redirect('/orders');
});

app.get('/shipment', (req, res) => {
    res.render('shipment');
});

app.get('/receipt', (req, res) => {
    res.render('receipt');
});

app.post('/receipt', (req, res) => {
    const { receipt } = req.body;
    // Logika verifikasi penerimaan barang
    // Simpan status verifikasi ke database atau lakukan proses lainnya
    res.redirect('/receipt');
});

app.get('/audit', (req, res) => {
    res.render('audit');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
