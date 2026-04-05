import "./StudentDropdownMenu.css";

export default function StudentDropdownMenu({
  studentId,
  onSelectStudent,
  setView,
  view,
  onClearCycle,
}) {
  return (
    <div className="td__studentDropdown">
      <button
        className={`td__studentDropdownItem${view === "snapshot" ? " is-active" : ""}`}
        onClick={() => {
          onClearCycle?.();
          onSelectStudent?.(studentId);
          setView("snapshot");
        }}
      >
        📊 Progress snapshot
      </button>

      <button
        className={`td__studentDropdownItem${view === "history" ? " is-active" : ""}`}
        onClick={() => {
          onSelectStudent?.(studentId);
          setView("history");
        }}
      >
        📈 Progress history
      </button>

      <button
        className={`td__studentDropdownItem${view === "info" ? " is-active" : ""}`}
        onClick={() => {
          onSelectStudent?.(studentId);
          setView("info");
        }}
      >
        👤 Student information
      </button>
    </div>
  );
}
