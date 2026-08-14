import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { LogOut, ArrowLeft } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setEmail(session?.user?.email ?? "");
    });
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto w-full max-w-md space-y-4">
        <button onClick={() => navigate("/")} className="tap flex items-center gap-2 text-sm font-bold text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <section className="surface-card p-6 animate-fade-in">
          <h1 className="font-display text-2xl font-extrabold">Profile</h1>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">{email || "Signed in"}</p>
          <button
            onClick={signOut}
            className="tap mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-muted px-5 py-3.5 font-display font-bold text-foreground"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </section>
      </div>
    </main>
  );
};

export default Profile;
