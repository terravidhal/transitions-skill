import { useEffect, useId, useRef, type CSSProperties } from "react";

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  duration?: number;
};

export function TextField({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  duration,
}: TextFieldProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const wasError = useRef(false);

  useEffect(() => {
    const field = fieldRef.current;
    const input = inputRef.current;
    if (!field || !input) return;
    field.dataset.mfInvalid = String(Boolean(error));
    input.setAttribute("aria-invalid", String(Boolean(error)));
    if (error && !wasError.current) {
      field.dataset.mfShake = "false";
      void input.offsetWidth;
      field.dataset.mfShake = "true";
      input.focus();
      const done = () => {
        field.dataset.mfShake = "false";
        input.removeEventListener("animationend", done);
      };
      input.addEventListener("animationend", done);
    }
    if (!error) field.dataset.mfShake = "false";
    wasError.current = Boolean(error);
  }, [error]);

  const style = {
    ...(duration ? { "--mf-shake-duration": `${duration}ms` } : {}),
  } as CSSProperties;

  return (
    <div className="mf-field" ref={fieldRef} data-mf-invalid={Boolean(error)} style={style}>
      <label className="mf-field-label" htmlFor={id}>
        {label}
      </label>
      <input
        ref={inputRef}
        className="mf-input"
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      <p className="mf-field-error" id={`${id}-error`} role="alert" hidden={!error}>
        {error}
      </p>
    </div>
  );
}
