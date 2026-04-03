interface ToggleControl {
  type: 'toggle';
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

interface SegmentedControl {
  type: 'segmented';
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

interface SelectControl {
  type: 'select';
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

interface TextControl {
  type: 'text';
  label: string;
  value: string;
  onChange: (v: string) => void;
}

export type Control = ToggleControl | SegmentedControl | SelectControl | TextControl;

interface ControlPanelProps {
  controls: Control[];
  title?: string;
}

export function ControlPanel({ controls, title }: ControlPanelProps) {
  return (
    <div className="demo-playground-controls">
      {title && <div className="demo-controls-title">{title}</div>}
      <div className="demo-controls">
        {controls.map((control) => (
          <div className="demo-control" key={control.label}>
            <label className="demo-control-label">{control.label}</label>
            {control.type === 'toggle' && (
              <button
                className="demo-toggle"
                data-on={control.value || undefined}
                onClick={() => control.onChange(!control.value)}
                aria-pressed={control.value}
                type="button"
              />
            )}
            {control.type === 'segmented' && (
              <div className="demo-segmented">
                {control.options.map((opt) => (
                  <button
                    key={opt}
                    data-active={opt === control.value || undefined}
                    onClick={() => control.onChange(opt)}
                    type="button"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            {control.type === 'select' && (
              <select
                className="demo-select"
                value={control.value}
                onChange={(e) => control.onChange(e.target.value)}
              >
                {control.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}
            {control.type === 'text' && (
              <input
                className="demo-input"
                type="text"
                value={control.value}
                onChange={(e) => control.onChange(e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
