import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http';
import * as socket from '../sockets/sockets';

export default class Server {
    private static _instance: Server;
    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;

    private constructor(){
        this.app = express();
        this.port = SERVER_PORT;
        // Configuración servidor para funcionar con socket.io
        this.httpServer = new http.Server(this.app);
        this.io = socketIO(this.httpServer);

        this.escucharSockets();
    }
    // Patrón Singleton
    public static get instance(){
        return this._instance || (this._instance = new this());
    }

    private escucharSockets(){
        console.log('Escuchando conexones - sockets');
        this.io.on('connection', cliente => {
            //console.log('Cliente Conectado', socket.eventDataTime());
            // Conectar cliente
            socket.conectarCliente(cliente);
            // Configurar usuario
            socket.usuario(cliente, this.io);
            // Desconectar
            socket.desconectar(cliente);
            // Escuchar mensajes
            socket.mensaje(cliente, this.io);
           
        });
    }

    start(callback: Function){
        this.httpServer.listen(this.port, callback);
    }
}