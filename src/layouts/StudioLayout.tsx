import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { NAV } from "../data/nav";

export default function StudioLayout() {
    const [open, setOpen] = useState(false);

    return (
        <div className="shell">
            <aside className={open ? "sidebar open" : "sidebar"}>
                <div className="brand">
                    <span className="brand-mark">Studio</span>
                    <span className="brand-name">AI Content Studio</span>
                </div>

                <nav className="nav">
                    {NAV.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={"end" in item ? item.end : false}
                            onClick={() => setOpen(false)}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <p className="sidebar-foot">Week 1 shell · no AI calls yet</p>
            </aside>

            <main className="main">
                <div className="topbar">
                    <strong>AI Content Studio</strong>
                    <button className="menu-btn" type="button" onClick={() => setOpen((v) => !v)}>
                        {open ? "Close" : "Menu"}
                    </button>
                </div>
                <Outlet />
            </main>
        </div>
    );
}