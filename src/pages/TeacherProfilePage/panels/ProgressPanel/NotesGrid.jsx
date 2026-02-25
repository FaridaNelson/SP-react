export default function NotesGrid({ fields, value, onChange, disabled }) {
  return (
    <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
      {fields.map(([label, key]) => (
        <label key={key} style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
          <textarea
            id={`notes-${key}_input`}
            name={`notes-${key}_input`}
            className="pp__textarea"
            rows={2}
            value={value?.[key] ?? ""}
            onChange={(e) => onChange(key, e.target.value)}
            disabled={disabled}
          />
        </label>
      ))}
    </div>
  );
}
