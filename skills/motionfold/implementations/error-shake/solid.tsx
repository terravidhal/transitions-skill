import { createEffect, createUniqueId } from "solid-js";

type TextFieldProps = {
  label: string;
  value: string;
  onInput: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  duration?: number;
};

export function TextField(props: TextFieldProps) {
  const id = createUniqueId();
  let input!: HTMLInputElement;
  let wasError = false;

  createEffect(() => {
    const error = props.error;
    if (!input) return;
    if (error && !wasError) {
      input.dataset.mfShake = "false";
      void input.offsetWidth;
      input.dataset.mfShake = "true";
      input.focus();
      input.addEventListener(
        "animationend",
        () => {
          input.dataset.mfShake = "false";
        },
        { once: true },
      );
    }
    if (!error) input.dataset.mfShake = "false";
    wasError = Boolean(error);
  });

  const style = () => (props.duration ? `--mf-shake-duration:${props.duration}ms` : "");

  return (
    <div class="mf-field" data-mf-invalid={Boolean(props.error)} style={style()}>
      <label class="mf-field-label" for={id}>
        {props.label}
      </label>
      <input
        ref={input}
        class="mf-input"
        id={id}
        type={props.type ?? "text"}
        value={props.value}
        placeholder={props.placeholder}
        aria-invalid={Boolean(props.error)}
        aria-describedby={props.error ? `${id}-error` : undefined}
        onInput={(event) => props.onInput(event.currentTarget.value)}
      />
      <p class="mf-field-error" id={`${id}-error`} role="alert" hidden={!props.error}>
        {props.error}
      </p>
    </div>
  );
}
