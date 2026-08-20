"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
    { href: "/", label: "Formulario" },
    { href: "/marcas", label: "Marcas" },
];

export default function NavBar() {
    const pathname = usePathname();

    return (
        <nav className="app-nav">
            {LINKS.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={`app-nav-link${pathname === link.href ? " active" : ""}`}
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}