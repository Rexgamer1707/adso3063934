"use server";

import { z } from "zod";
import { PrismaClient } from '@/src/generated/prisma';
import { PrismaNeon } from '@prisma/adapter-neon';
import { revalidatePath } from 'next/cache';
import { writeFile } from "fs/promises";
import path from 'path';

const prisma = new PrismaClient({
    adapter: new PrismaNeon({
        connectionString: process.env.DATABASE_URL!
    })
})

const gameSchema = z.object({
    title: z.string().min(3, "Title required"),
    price: z.coerce.number().positive("Invalid price"),
    console_id: z.coerce.number(),
    description: z.string().min(10, "Description too short"),
});

export async function deleteGameAction(id: number) {
    try {
        await prisma.Games.delete({
            where: { id: id }
        });

        // Esto limpia la caché de la página de juegos para que el juego desaparezca
        revalidatePath('/games');
        return { success: true };
    } catch (error) {
        console.error("Error al eliminar:", error);
        return { success: false, error: "No se pudo eliminar el juego" };
    }
}

export async function updateGameAction(
    id: number,
    data: { title: string; price: number; cover: string },
    formData?: FormData
) {
    try {
        let coverFileName = data.cover;

        // Si viene una nueva imagen, guardarla
        const newCover = formData?.get("newCover") as File | null;
        if (newCover && newCover.size > 0) {
            const bytes = await newCover.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const fileName = `${Date.now()}-${newCover.name}`;
            const filePath = path.join(process.cwd(), "public/uploads", fileName);
            await writeFile(filePath, buffer);
            coverFileName = fileName;
        }

        await prisma.games.update({
            where: { id },
            data: {
                title: data.title,
                price: data.price,
                cover: coverFileName,
                console_id: data.console_id,
            }
        });

        revalidatePath('/games');
        revalidatePath(`/games/${id}`);
        return { success: true };

    } catch (error) {
        console.error(error);
        return { success: false, error: "Error al actualizar el juego" };
    }
}

export async function getGameByIdAction(id: number) {
    try {
        const game = await prisma.games.findUnique({
            where: { id },
            include: { console: true }
        });
        return { success: true, game };
    } catch (error) {
        return { success: false, error: "No se pudo obtener el juego" };
    }
}

export async function createGameAction(formData: FormData) {
    try {
        const data = {
            title: formData.get("title"),
            price: formData.get("price"),
            console_id: formData.get("console_id"),
            description: formData.get("description"),
        };

        const validated = gameSchema.safeParse(data);
        if (!validated.success) {
            return { success: false, errors: validated.error.flatten().fieldErrors };
        }

        const file = formData.get("cover") as File;
        let fileName = "no-cover.jpeg"; // 👈 default

        if (file && file.size > 0) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            fileName = `${Date.now()}-${file.name}`;
            const filePath = path.join(process.cwd(), "public/uploads", fileName);
            await writeFile(filePath, buffer);
        }

        await prisma.games.create({
            data: {
                title: validated.data.title,
                price: validated.data.price,
                console_id: validated.data.console_id,
                description: validated.data.description,
                cover: fileName,
                developer: "Pending",
                releaseDate: new Date(),
                genre: "Action"
            }
        });

        revalidatePath("/games");
        return { success: true };

    } catch (error) {
        console.error("❌ FULL ERROR:", error);
        return { success: false, error: "Server error" };
    }
}

export async function getConsolesAction() {
    try {
        const consoles = await prisma.console.findMany({
            orderBy: { name: 'asc' }
        });
        return { success: true, consoles };
    } catch (error) {
        return { success: false, error: "No se pudieron cargar las consolas" };
    }
}

export async function getGamesAction(page: number = 1, pageSize: number = 12, query: string = "") {
    try {
        const skip = (page - 1) * pageSize;

        const where = query
            ? { title: { contains: query, mode: 'insensitive' as const } }
            : {};

        const [games, total] = await Promise.all([
            prisma.games.findMany({
                where,
                skip,
                take: pageSize,
                include: { console: true },
                orderBy: { id: 'desc' }
            }),
            prisma.games.count({ where })
        ]);

        return {
            success: true,
            games,
            totalPages: Math.ceil(total / pageSize),
            currentPage: page
        };
    } catch (error) {
        console.error("Error en getGamesAction:", error);
        return { success: false, error: "No se pudieron cargar los juegos" };
    }
}