import "./StudentDropdownMenu.css";

export default function StudentDropdownMenu({
  studentId,
  onSelectStudent,
  setView,
}) {
  return (
    <div className="td__studentDropdown">
      <button
        className="td__studentDropdownItem"
        onClick={() => {
          onSelectStudent?.(studentId);
          setView("snapshot");
        }}
      >
        📊 Progress snapshot
      </button>

      <button
        className="td__studentDropdownItem"
        onClick={() => {
          onSelectStudent?.(studentId);
          setView("history");
        }}
      >
        📈 Progress history
      </button>

      <button
        className="td__studentDropdownItem"
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
