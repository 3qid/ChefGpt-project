import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

const UserProfile = ({ onClose }) => {
  const { user, dispatch } = useAuthContext();
  const { logout } = useLogout();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [wantedFood, setWantedFood] = useState((user?.wantedFood || []).join(", "));
  const [unwantedFood, setUnwantedFood] = useState((user?.unwantedFood || []).join(", "));
  const [allergies, setAllergies] = useState((user?.allergies || []).join(", "));
  const [saving, setSaving] = useState(false);

  const parseList = (str) => str.split(",").map(s => s.trim()).filter(Boolean);

  const handleSave = async () => {
    if (!user?.token) return;
    setSaving(true);
    try {
      const res = await fetch("http://localhost:3000/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          name,
          wantedFood: parseList(wantedFood),
          unwantedFood: parseList(unwantedFood),
          allergies: parseList(allergies)
        })
      });
      const data = await res.json();
      if (res.ok) {
        const updated = { ...user, name: data.name, wantedFood: data.wantedFood, unwantedFood: data.unwantedFood, allergies: data.allergies };
        localStorage.setItem("user", JSON.stringify(updated));
        dispatch({ type: "LOGIN", payload: updated });
        setEditing(false);
      }
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.4)", zIndex: 999
      }} />
      <div className="profile-panel" style={{
        position: "fixed",
        bottom: "80px",
        left: "10px",
        width: "260px",
        background: "var(--sidebar-bg)",
        border: "1px solid var(--border-color)",
        borderRadius: "14px",
        padding: "20px",
        zIndex: 1000,
        boxShadow: "0 8px 30px rgba(0,0,0,0.2)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <div style={{
            width: "50px", height: "50px",
            borderRadius: "50%",
            background: "var(--accent-color)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: "bold", fontSize: "22px",
            margin: "0 auto 10px"
          }}>
            {(name || user?.email || "U").charAt(0).toUpperCase()}
          </div>

          {editing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <input value={name} onChange={(e) => setName(e.target.value)}
                style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--input-bg)", color: "var(--text-primary)", fontSize: "14px", outline: "none" }}
                autoFocus onKeyDown={(e) => e.key === "Enter" && handleSave()} />
              <input value={wantedFood} onChange={(e) => setWantedFood(e.target.value)}
                placeholder="Favorite foods (comma separated)"
                style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--input-bg)", color: "var(--text-primary)", fontSize: "12px", outline: "none" }} />
              <input value={unwantedFood} onChange={(e) => setUnwantedFood(e.target.value)}
                placeholder="Disliked foods (comma separated)"
                style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--input-bg)", color: "var(--text-primary)", fontSize: "12px", outline: "none" }} />
              <input value={allergies} onChange={(e) => setAllergies(e.target.value)}
                placeholder="Allergies (comma separated)"
                style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--input-bg)", color: "var(--text-primary)", fontSize: "12px", outline: "none" }} />
              <button onClick={handleSave} disabled={saving} style={{
                background: "var(--accent-color)", color: "#fff",
                border: "none", borderRadius: "6px", padding: "6px 12px",
                cursor: "pointer", fontSize: "12px"
              }}>
                {saving ? "..." : "Save"}
              </button>
            </div>
          ) : (
            <div onClick={() => setEditing(true)} style={{
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: "8px", cursor: "pointer"
            }}>
              <span style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>
                {name || user?.email?.split("@")[0] || "User"}
              </span>
              <span style={{ fontSize: "14px", opacity: 0.5 }}>✏️</span>
            </div>
          )}
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
            {user?.email || ""}
          </div>
          {!editing && (
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "8px", textAlign: "left" }}>
              {user?.wantedFood?.length > 0 && <div>❤️ {user.wantedFood.join(", ")}</div>}
              {user?.unwantedFood?.length > 0 && <div>💔 {user.unwantedFood.join(", ")}</div>}
              {user?.allergies?.length > 0 && <div>⚠️ {user.allergies.join(", ")}</div>}
            </div>
          )}
        </div>

        <button onClick={handleLogout} style={{
          width: "100%", padding: "10px", borderRadius: "8px",
          border: "1px solid #ef4444", background: "transparent",
          color: "#ef4444", cursor: "pointer", fontSize: "14px", fontWeight: 500
        }}>
          Log out
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-panel {
            left: 50% !important;
            transform: translateX(-50%) !important;
            bottom: 20px !important;
            width: 280px !important;
          }
        }
        @media (max-width: 480px) {
          .profile-panel {
            width: calc(100% - 32px) !important;
            left: 16px !important;
            transform: none !important;
            bottom: 16px !important;
          }
        }
      `}</style>
    </>
  );
};

export default UserProfile;
