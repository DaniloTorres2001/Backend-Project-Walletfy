const express = require('express');
const { query, validationResult, param, body } = require('express-validator');

const app = express();

app.use(express.json());

const PORT = 3030;

// Middleware de logging propio
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} query=${JSON.stringify(req.query)}`);
    next();
});

let eventos = [
    {
        id: 1,
        nombre: 'Sueldo diciembre',
        descripcion: 'Pago mensual',
        cantidad: 1500,
        fecha: '2024-12-05',
        tipo: 'ingreso'
    },
    {
        id: 2,
        nombre: 'Renta',
        descripcion: 'Departamento',
        cantidad: 600,
        fecha: '2024-12-01',
        tipo: 'egreso'
    }
];
let nextId = 3;

// Health
app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

// Entity: events
//Get all events
app.get('/api/events/all', (req, res) => {
    console.log('GET /api/events/all called all:', eventos);
    return res.status(200).json({ code: 'OK', message: 'All events retrieved successfully!', data: { events: eventos, total: eventos.length } });
});

// GET /api/events?tipo=ingreso|egreso&mes=YYYY-MM&page=1&limit=10
app.get('/api/events',
    [
        query('tipo').optional().isIn(['ingreso', 'egreso']).withMessage('Tipo must be "ingreso" or "egreso"'),
        query('mes').optional().matches(/^\d{4}-\d{2}$/).withMessage('Mes must be in YYYY-MM format'),
        query('page').optional().isInt({ min: 1 }).toInt(),
        query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors (GET /api/events):', errors.array());
            return res.status(400).json({ code: 'BR', message: 'Invalid Data', errors: errors.array() });
        }

        const { tipo, mes } = req.query;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;

        let data = [...eventos];
        if (tipo) data = data.filter((e) => e.tipo === tipo);
        if (mes) data = data.filter((e) => typeof e.fecha === 'string' && e.fecha.slice(0, 7) === mes);

        const total = data.length;
        const start = (page - 1) * limit;
        const end = start + limit;
        const items = data.slice(start, end);

        return res.status(200).json({
            code: 'OK',
            message: 'Events retrieved successfully!',
            data: { events: items, page, limit, total },
        });
    }
);

// GET /api/events/query?id=1

app.get('/api/events/query', query('id').notEmpty(), (req, res) => {

    const errors = validationResult(req);
    console.log('Validation results (GET /api/events/query):', errors.array());

    if (!errors.isEmpty()) {
        return res.json({ code: 'PF', message: 'Event ID is required!' });
    }

    const id = req.query.id;

    const event = eventos.find((e) => e.id == id);

    console.log(`Lookup event by id=${id} ->`, event ? 'FOUND' : 'NOT FOUND');
    console.log('Event details:', event);

    if (!event) {
        return res.status(404).json({ code: 'NF', message: 'Event not found!' });
    }
    return res.status(200).json({ code: 'OK', message: 'Event found!', data: { event } });
});

//POST /api/events
app.post('/api/events',
    [
        body('nombre').notEmpty().withMessage('Name is required'),
        body('cantidad').notEmpty().withMessage('Amount is required').isFloat({ gt: 0 }).withMessage('Amount must be > 0'),
        body('fecha').notEmpty().withMessage('Date is required').isISO8601().withMessage('Date must be ISO (YYYY-MM-DD)'),
        body('tipo').notEmpty().withMessage('Type is required').isIn(['ingreso', 'egreso']).withMessage('Invalid type'),
        body('descripcion').optional().isString(),
        body('adjunto').optional().isString()
    ],
    (req, res) => {
        const errors = validationResult(req);
        console.log('POST /events:', req.body);
        if (!errors.isEmpty()) {
            console.log('Validation errors (POST /api/events):', errors.array());
            return res.status(400).json({ code: 'BR', message: 'Invalid Data', errors: errors.array() });
        }
        const { nombre, descripcion, cantidad, fecha, tipo, adjunto } = req.body;
        const nextId = eventos.length > 0 ? Math.max(...eventos.map(event => event.id)) + 1 : 1;

        const nextEvent = {
            id: nextId,
            nombre,
            descripcion,
            cantidad: Number(cantidad),
            fecha,
            tipo,
            adjunto
        };
        eventos.push(nextEvent);
        console.log('Event created:', nextEvent);
        return res.status(201).json({ code: 'OK', message: 'Event created successfully!', data: { event: nextEvent } });
    }
);

app.put('/api/events/:id',

    [
        param('id').notEmpty().withMessage('Event ID is required!'),
        body('nombre').optional().isString().withMessage('Name must be a string!'),
        body('descripcion').optional().isString().withMessage('Description must be a string!'),
        body('cantidad').optional().isFloat({ gt: 0 }).withMessage('Amount must be > 0'),
        body('fecha').optional().isISO8601().withMessage('Date must be ISO (YYYY-MM-DD)'),
        body('tipo').optional().isIn(['ingreso', 'egreso']).withMessage('Invalid type'),
        body('adjunto').optional().isString()
    ],
    (req, res) => {
        const errors = validationResult(req);
        console.log('PUT /events/:id', req.params.id, req.body);
        if (!errors.isEmpty()) {
            return res.status(400).json({ code: 'BR', message: 'Invalid Data', errors: errors.array() });
        }

        const id = req.params.id;
        const event = eventos.find((e) => e.id == id);

        if (!event) {
            return res.status(404).json({ code: 'NF', message: 'Event not found!' });
        }
        
        const { nombre, descripcion, cantidad, fecha, tipo, adjunto } = req.body;

        if (nombre !== undefined) event.nombre = nombre;
        if (descripcion !== undefined) event.descripcion = descripcion;
        if (cantidad !== undefined) event.cantidad = Number(cantidad);
        if (fecha !== undefined) event.fecha = fecha;
        if (tipo !== undefined) event.tipo = tipo;
        if (adjunto !== undefined) event.adjunto = adjunto;

        return res.json({ code: 'OK', message: 'Event updated successfully!', data: { event } });
        console.log('Event updated:', event);
    }
);

app.delete('/api/events/:id', (req, res) => {
    const id = req.params.id;
    console.log('DELETE /events/:id:', id);
    const event = eventos.find(e => e.id == id);
    if (event) {
        eventos = eventos.filter(e => e.id != id);
        return res.json({ code: 'OK', message: 'Event deleted successfully!', data: { event } })
    }
    res.status(404).json({ code: 'PF', message: 'Event not found!' });
    console.log('Event deleted:', event);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});