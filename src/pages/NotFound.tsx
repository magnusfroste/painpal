import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
    <div className="surface-card p-8 max-w-sm w-full animate-pop-in">
      <div className="text-6xl mb-4" aria-hidden>🧭</div>
      <h1 className="font-display text-3xl font-extrabold">Page not found</h1>
      <p className="mt-2 text-muted-foreground font-semibold">
        This page took a little detour. Let's get you back home.
      </p>
      <Link
        to="/"
        className="tap mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-primary px-5 py-3.5 font-display font-bold text-primary-foreground shadow-glow"
      >
        Back to PainPal
      </Link>
    </div>
  </main>
);

export default NotFound;
