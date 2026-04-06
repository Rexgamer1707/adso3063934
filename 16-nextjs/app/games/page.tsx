import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import SideBar from "@/component/SideBar";
import GamesInfo from "@/component/GamesInfo";

// Definimos los tipos para los parámetros de búsqueda
interface PageProps {
    searchParams: Promise<{ page?: string }>;
}

export default async function GamesPage({ searchParams }: PageProps) {
    const user = await stackServerApp.getUser();

    // Protección de ruta
    if (!user) {
        redirect('/');
    }

    // 1. Desembocamos searchParams (Obligatorio en Next.js 15)
    const params = await searchParams;

    // 2. Extraemos el número de página (por defecto 1)
    const currentPage = parseInt(params.page || "1");

    const searchQuery = params.search || "";

    return (
        <SideBar currentPath={"/games"}>
            <GamesInfo currentPage={currentPage} searchQuery={searchQuery} />
        </SideBar>
    );
}