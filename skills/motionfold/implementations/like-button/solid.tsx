type LikeButtonProps = {
  liked: boolean;
  count: number;
  onToggle: () => void;
  duration?: number;
  easing?: string;
};

export function LikeButton(props: LikeButtonProps) {
  return (
    <button class="mf-like" type="button" aria-pressed={props.liked} aria-label={props.liked ? "Unlike" : "Like"} data-mf-liked={props.liked} style={{
      ...(props.duration ? { "--mf-like-duration": props.duration + "ms" } : {}),
      ...(props.easing ? { "--mf-like-ease": props.easing } : {}),
    }} onClick={props.onToggle}>
      <span class="mf-like-heart" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-9.2C5 8.2 7 6.5 9.2 6.5c1.3 0 2.3.6 2.8 1.4.5-.8 1.5-1.4 2.8-1.4C17 6.5 19 8.2 19 10.8 19 15.6 12 20 12 20Z" stroke-linejoin="round" /></svg>
      </span>
      <span class="mf-like-count">{props.count}</span>
    </button>
  );
}
