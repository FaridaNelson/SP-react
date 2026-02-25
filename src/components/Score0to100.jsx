export default function Score0to100({
  label,
  value,
  onChange,
  disabled = false,
}) {
  return (
    <label className="pp__scoreField">
      {label && <span className="pp__scoreLabel">{label}</span>}
      <input
        className="pp__input"
        type="number"
        min={0}
        max={100}
        value={value ?? ""}
        onChange={(e) => {
          const raw = e.target.value;
          onChange(raw === "" ? undefined : Number(raw));
        }}
        disabled={disabled}
      />
    </label>
  );
}
