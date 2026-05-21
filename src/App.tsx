import { useState } from "react";
import { useWorkoutStore } from "@/store/workouts";

export default function App() {
  const sessions = useWorkoutStore((s) => s.sessions);
  const createSession = useWorkoutStore((s) => s.createSession);
  const addExercise = useWorkoutStore((s) => s.addExercise);
  const addSet = useWorkoutStore((s) => s.addSet);

  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [newExerciseName, setNewExerciseName] = useState<Record<string, string>>({});
  const [newSet, setNewSet] = useState<Record<string, { reps: string; weight: string }>>({});

  const handleAddExercise = (sessionId: string) => {
    const name = newExerciseName[sessionId]?.trim();
    if (!name) return;
    addExercise(sessionId, name);
    setNewExerciseName((prev) => ({ ...prev, [sessionId]: "" }));
  };

  const handleAddSet = (sessionId: string, exerciseId: string) => {
    const key = `${sessionId}-${exerciseId}`;
    const reps = parseInt(newSet[key]?.reps ?? "");
    const weight = parseFloat(newSet[key]?.weight ?? "");
    if (isNaN(reps) || isNaN(weight)) return;
    addSet(sessionId, exerciseId, { reps, weight });
    setNewSet((prev) => ({ ...prev, [key]: { reps: "", weight: "" } }));
  };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 16px", fontFamily: "var(--font-sans)" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 24 }}>
        <h1 style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>Workouts</h1>
        <button onClick={createSession}>+ New session</button>
      </div>

      {sessions.length === 0 && (
        <p style={{ color: "var(--color-text-secondary)", fontSize: 14 }}>No sessions yet.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sessions.map((session) => {
          const isOpen = expandedSession === session.id;
          const date = new Date(session.date).toLocaleDateString(undefined, {
            weekday: "short", month: "short", day: "numeric",
          });

          return (
            <div
              key={session.id}
              style={{
                border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: "var(--border-radius-lg)",
                background: "var(--color-background-primary)",
                overflow: "hidden",
              }}
            >
              {/* Session header */}
              <button
                onClick={() => setExpandedSession(isOpen ? null : session.id)}
                style={{
                  width: "100%", display: "flex", alignItems: "center",
                  justifyContent: "space-between", padding: "12px 16px",
                  background: "none", border: "none", cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{date}</span>
                  <span style={{ fontSize: 13, color: "var(--color-text-secondary)", marginLeft: 10 }}>
                    {session.exercises.length} exercise{session.exercises.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>

              {/* Expanded body */}
              {isOpen && (
                <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", padding: "12px 16px" }}>

                  {/* Exercise list */}
                  {session.exercises.map((exercise) => {
                    const setKey = `${session.id}-${exercise.id}`;
                    return (
                      <div key={exercise.id} style={{ marginBottom: 16 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 6px" }}>{exercise.name}</p>

                        {exercise.sets.length > 0 && (
                          <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", marginBottom: 8 }}>
                            <thead>
                              <tr style={{ color: "var(--color-text-secondary)" }}>
                                <th style={{ textAlign: "left", fontWeight: 400, paddingBottom: 4 }}>Set</th>
                                <th style={{ textAlign: "right", fontWeight: 400, paddingBottom: 4 }}>Reps</th>
                                <th style={{ textAlign: "right", fontWeight: 400, paddingBottom: 4 }}>Weight (kg)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {exercise.sets.map((s, i) => (
                                <tr key={s.id} style={{ borderTop: "0.5px solid var(--color-border-tertiary)" }}>
                                  <td style={{ padding: "4px 0", color: "var(--color-text-secondary)" }}>{i + 1}</td>
                                  <td style={{ padding: "4px 0", textAlign: "right" }}>{s.reps}</td>
                                  <td style={{ padding: "4px 0", textAlign: "right" }}>{s.weight}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}

                        {/* Add set */}
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <input
                            type="number"
                            placeholder="Reps"
                            value={newSet[setKey]?.reps ?? ""}
                            onChange={(e) =>
                              setNewSet((prev) => ({ ...prev, [setKey]: { ...prev[setKey], reps: e.target.value } }))
                            }
                            style={{ width: 64 }}
                          />
                          <input
                            type="number"
                            placeholder="kg"
                            value={newSet[setKey]?.weight ?? ""}
                            onChange={(e) =>
                              setNewSet((prev) => ({ ...prev, [setKey]: { ...prev[setKey], weight: e.target.value } }))
                            }
                            style={{ width: 64 }}
                          />
                          <button onClick={() => handleAddSet(session.id, exercise.id)}>+ Set</button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add exercise */}
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <input
                      placeholder="Exercise name"
                      value={newExerciseName[session.id] ?? ""}
                      onChange={(e) =>
                        setNewExerciseName((prev) => ({ ...prev, [session.id]: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === "Enter" && handleAddExercise(session.id)}
                      style={{ flex: 1 }}
                    />
                    <button onClick={() => handleAddExercise(session.id)}>+ Exercise</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}