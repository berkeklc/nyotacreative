"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "../app/page.module.css";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const search = async () => {
            if (query.length < 2) {
                setResults([]);
                setIsOpen(false);
                return;
            }

            setIsLoading(true);
            setIsOpen(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data.results || []);
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(search, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <div className={styles.heroSearch} ref={searchRef} style={{ position: "relative", overflow: "visible" }}>
            <input
                type="text"
                placeholder="Where do you want to explore?"
                className={styles.searchInput}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.length >= 2 && setIsOpen(true)}
            />
            <button className="btn btn-primary">Find</button>

            {isOpen && (
                <div style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "white",
                    borderRadius: "0 0 1rem 1rem",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    zIndex: 1000,
                    marginTop: "2px",
                    maxHeight: "300px",
                    overflowY: "auto",
                    textAlign: "left"
                }}>
                    {isLoading ? (
                        <div style={{ padding: "1rem", color: "#666" }}>Searching...</div>
                    ) : results.length > 0 ? (
                        results.map((res: any, idx: number) => (
                            <Link
                                key={idx}
                                href={res.slug}
                                onClick={() => setIsOpen(false)}
                                style={{
                                    display: "block",
                                    padding: "1rem",
                                    borderBottom: idx === results.length - 1 ? "none" : "1px solid #eee",
                                    textDecoration: "none",
                                    color: "inherit"
                                }}
                            >
                                <div style={{ fontWeight: "bold", color: "var(--color-ocean)" }}>{res.title}</div>
                                <div style={{ fontSize: "0.75rem", color: "#888" }}>{res.type.toUpperCase()}</div>
                            </Link>
                        ))
                    ) : (
                        <div style={{ padding: "1rem", color: "#666" }}>No results found.</div>
                    )}
                </div>
            )}
        </div>
    );
}
