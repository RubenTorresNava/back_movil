import Pedido from '../database/models/pedido.js';
import Producto from '../database/models/producto.js';
import Mesa from '../database/models/mesa.js';
import { notifyNewPedido, notifyPedidoStatusChange, notifyPedidoReady } from '../service/socketService.js';

export const createPedido = async (req, res) => {
    const { numeroMesa, productos } = req.body; // Eliminamos 'estado' del destructuring
    const clienteId = req.clienteId;

    try {
        // Validación básica
        if (!numeroMesa || !productos?.length) {
            return res.status(400).json({ error: 'Número de mesa y productos son requeridos' });
        }

        // 1. Buscar mesa
        const mesa = await Mesa.findOne({ numero: numeroMesa });
        if (!mesa || mesa.estado !== 'disponible') {
            return res.status(400).json({ error: 'Mesa no disponible' });
        }

        // 2. Procesar productos
        const productosConPrecio = await Promise.all(
            productos.map(async (item) => {
                if (!item.nombreProducto || !item.cantidad) {
                    throw new Error('Datos de producto incompletos');
                }

                const producto = await Producto.findOne({ 
                    nombre: item.nombreProducto 
                });
                
                if (!producto) {
                    throw new Error(`Producto "${item.nombreProducto}" no encontrado`);
                }
                if (!producto.disponible) {
                    throw new Error(`Producto "${item.nombreProducto}" no disponible`);
                }

                return {
                    producto: producto._id,
                    nombreProducto: producto.nombre,
                    cantidad: item.cantidad,
                    precioUnitario: producto.precio
                };
            })
        );

        // 3. Crear pedido (sin especificar estado)
        const newPedido = new Pedido({
            cliente: clienteId,
            mesa: mesa._id,
            productos: productosConPrecio,
            total: productosConPrecio.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0)
            // El estado 'recibido' se asignará automáticamente por el default del schema
        });

        // 4. Actualizar mesa y guardar en transacción
        mesa.estado = 'ocupada';
        await Promise.all([newPedido.save(), mesa.save()]);

        // 5. Preparar respuesta
        const response = {
            ...newPedido.toObject(),
            mesa: numeroMesa,
            productos: productosConPrecio.map(p => ({
                nombre: p.nombreProducto,
                cantidad: p.cantidad,
                precio: p.precioUnitario
            }))
        };

        // Notificar (WebSocket/Socket.io)
        notifyNewPedido(response);

        res.status(201).json({
            success: true,
            pedido: response
        });

    } catch (error) {
        console.error('Error al crear pedido:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Error al crear pedido'
        });
    }
};

//funcion para traer los pedidos con el estado recibido, en preparación y listo
export const getPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find()
            //.populate('cliente', 'nombre email')
            .populate('mesa', 'numero estado')
            .populate('productos.producto', 'nombre precio disponible');

        res.status(200).json(pedidos);
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({ error: 'Error al obtener pedidos' });
    }
};

// Función para actualizar el estado de un pedido
export const updatePedido = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const updatedPedido = await Pedido.findByIdAndUpdate(id, { estado }, { new: true })
            .populate('cliente')
            .populate('mesa')
            .populate('productos.producto');
            
        if (!updatedPedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        // Notificar cambio de estado a través de WebSocket
        notifyPedidoStatusChange(updatedPedido);
        
        // Si el estado es "listo", enviar notificación especial
        if (estado === 'listo') {
            notifyPedidoReady(updatedPedido);
        }
        
        res.status(200).json({ message: 'Estado del pedido actualizado exitosamente', pedido: updatedPedido });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el pedido' });
    }
}

// pedidosController.js
export const getPedidosByUser = async (req, res) => {
    try {
        const pedidos = await Pedido.find({ cliente: req.clienteId }) // Filtra por ID del usuario
            .populate('mesa', 'numero capacidad')
            .populate('productos.producto', 'nombre precio')
            .sort({ fechaCreacion: -1 }); // Ordena por fecha descendente

        // Formatear la respuesta para mostrar información clara
        const pedidosFormateados = pedidos.map(pedido => ({
            _id: pedido._id,
            fecha: pedido.fechaCreacion,
            estado: pedido.estado,
            total: pedido.total,
            mesa: pedido.mesa.numero,
            productos: pedido.productos.map(item => ({
                nombre: item.producto.nombre,
                cantidad: item.cantidad,
                precio: item.precioUnitario
            }))
        }));

        res.status(200).json({
            success: true,
            pedidos: pedidosFormateados
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al obtener pedidos',
            details: error.message
        });
    }
};