import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { usuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';

export const usuariosConectados = new usuariosLista();
export const conectarCliente = (cliente: Socket, io: socketIO.Server) =>{
    const usuario = new Usuario(cliente.id);
    usuariosConectados.agregar(usuario);
}

export const desconectar = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('disconnect', () => {          
        let usuario = usuariosConectados.borrarUsuario(cliente.id);
        if(usuario){
            console.log(`Cliente ${usuario.nombre} desconectado a las: ` , eventDataTime());
            io.emit('usuarios-activos', usuariosConectados.getLista());
        } else {
            console.log('Error al desconectar el usuario');
        }    
    });
}

export function eventDataTime(): string {
    return `${ new Date().toLocaleDateString() } / ${ new Date().toLocaleTimeString()} `;
}
// Escuchar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('mensaje', (payload: {de: string, cuerpo: string}) => {
        console.log('Mensaje recibido. ', payload);

        io.emit('mensaje-nuevo', payload);
    });
}
// Configurar usuario
export const usuario = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('configurar-usuario', (payload: { nombre: string }, callback: Function) => {
        console.log('Usuario configurado. ', payload);
        usuariosConectados.actualizarNombre(cliente.id, payload.nombre);
        io.emit('usuarios-activos', usuariosConectados.getLista());
        callback({
            ok: true,
            mensaje: `Usuario ${ payload.nombre} configurado`
        });
    });
}
export const obtenerUsuarios = (cliente:Socket) => {
    cliente.on('obtener-usuarios', () => {
        cliente.emit('usuarios-activos', usuariosConectados.getLista());
    })
};