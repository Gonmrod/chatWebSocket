import express from 'express';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded ({extended: true}));
app.use(express.static((`${__dirname}/public`)));
app.use('/', viewsRouter);

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

const server = app.listen(8080, ()=> console.log('Listening on Port 8080'));

const io = new Server(server);

const messages = [];

io.on('connection', socket => {
    console.log('Nuevo usuario conectado.')

    socket.on('message', data =>{
        messages.push(data);
        io.emit('messageLogs', messages);
    });

    socket.on('authenticated', data =>{
        socket.emit('messageLogs', messages);
        socket.broadcast.emit('newUserConnected', data);
    });
});