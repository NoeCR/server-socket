import { Usuario } from './usuario';


export class usuariosLista {
    private lista: Usuario[] = [];


    constructor(){

    }
    // Agregar un usuario
    public agregar(usuario: Usuario){
        this.lista.push(usuario);
        console.log(this.lista);
        return usuario;
    }

    public actualizarNombre(id: string, nombre: string){
        for(let usuario of this.lista){
            if(usuario.id === id){
                usuario.nombre = nombre;
                break;
            }
        }
        console.log('====Actualizando usuario=========');
        console.log(this.lista);
    }
    // Obtener lista de usuarios
    public getLista(){
        return this.lista.filter(usuario => usuario.nombre !== 'anonimo')
    }

    public getUsuario(id: string){
        return this.lista.find(usuario => usuario.id === id );
    }

    public getUsuariosSala(sala: string){
        return this.lista.filter( usuario => usuario.sala === sala)
    }

    public borrarUsuario(id: string){
        const tempUsuario = this.getUsuario(id);
        
        this.lista = this.lista.filter( usuario => usuario.id !== id );
        
        return tempUsuario;
    }
}