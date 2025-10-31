import { Router } from "express";
import { getDb } from "./mongo";
import { ObjectId } from "mongodb";

const router = Router();
const coleccion = () => getDb().collection("libros");

// Listar todos los libros
router.get("/", async (req, res) => {
    try {
        const libros = await coleccion().find().toArray();
        res.json(libros);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Crear un libro nuevo
router.post("/", async (req, res) => {
    const { title, author, pages } = req.body;

    if (typeof title !== 'string' || typeof author !== 'string' ||typeof pages !== 'number'){
        return res.status(400).json({ error: `El tipo de dato no es correcto` });
    }
    
    const now = new Date();
    const nuevoLibro = { title, author, pages, createdAt: now, updatedAt: now };

    try {
        const result = await coleccion().insertOne(nuevoLibro);
        return res.status(201).json({ _id: result.insertedId, ...nuevoLibro });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Actualizar
router.put("/:id", async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ message: "Not found" });
    }
    const { title, author, pages } = req.body ?? {};
    const actualizarCampo: any = {};

    if (title !== undefined) actualizarCampo.title = title;
    if (author !== undefined) actualizarCampo.author = author;
    if (pages !== undefined) actualizarCampo.pages = pages;

    if (Object.keys(actualizarCampo).length === 0) {
        return res.status(400).json({ message: "No fields to update" });
    }
    actualizarCampo.updatedAt = new Date();

    try {
        const result = await coleccion().updateOne(
            { _id: new ObjectId(id) },
            { $set: actualizarCampo }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Not found" });
        }

        const libroActualizado = await coleccion().findOne({ _id: new ObjectId(id) });
        return res.json(libroActualizado);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Eliminar
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(404).json({ message: "Not found" });

    try {
        const result = await coleccion().deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).json({ message: "Not found" });
        return res.status(200).json({message: "Libro eliminado correctamente"});
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;