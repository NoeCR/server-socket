import {Router, Request, Response} from 'express';
import Server from '../classes/server';
import { usuariosConectados } from '../sockets/sockets';


export const router = Router();
const server = Server.instance;

router.get('/mensajes', (req: Request, res: Response) => {
    res.json({
        ok: true,
        message: 'GET listo'
    });
});

router.post('/mensajes', (req: Request, res: Response) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const payload = {
        de,
        cuerpo
    }
    server.io.emit('mensaje-nuevo', payload);

    res.json({
        ok: true,
        cuerpo,
        de
    });
});

router.post('/mensajes/:id', (req: Request, res: Response) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    let id = req.params.id;
    const payload = {
        de,
        cuerpo
    }
    

    server.io.in(id).emit('mensaje-privado', payload);

    res.json({
        ok: true,
        cuerpo,
        de,
        id
    });
});
// Servicio para obtener todos los ids de los usuarios
router.get('/usuarios', (req: Request, res: Response) => {
    
    server.io.clients((err: any, clientes: string[]) => {
        if(err) {
            return res.json({
                ok: false,
                err
            });
        }
        res.json({
            clientes
        });
    });
});
// Obtener usuarios y sus nombres
router.get('/usuarios/detalle', (req: Request, res: Response) => {
    res.json({
        ok: true,
        clientes: usuariosConectados.getLista()
    });    
});
export default router;