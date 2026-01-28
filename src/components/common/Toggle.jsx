import './Toggle.css';

const Toggle = ({ checked, onChange, disabled = false }) => {
    return (
        <label className={`toggle ${disabled ? 'disabled' : ''}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
            />
            <span className="toggle-slider"></span>
        </label>
    );
};

export default Toggle;
