const Toggle = ({ checked, onChange, disabled = false }) => {
  return (
    <label
      className={`relative inline-flex items-center ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-success peer-focus:ring-2 peer-focus:ring-success/30 transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
    </label>
  );
};

export default Toggle;
