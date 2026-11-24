<script lang="ts">
  let { liked = false, count = 0, duration, easing, ontoggle } = $props();
  const style = $derived(
    (duration ? "--mf-like-duration:" + duration + "ms;" : "") +
    (easing ? "--mf-like-ease:" + easing : "")
  );
</script>

<button class="mf-like" type="button" aria-pressed={liked} aria-label={liked ? "Unlike" : "Like"} data-mf-liked={liked} {style} onclick={ontoggle}>
  <span class="mf-like-heart" aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-9.2C5 8.2 7 6.5 9.2 6.5c1.3 0 2.3.6 2.8 1.4.5-.8 1.5-1.4 2.8-1.4C17 6.5 19 8.2 19 10.8 19 15.6 12 20 12 20Z" stroke-linejoin="round" /></svg>
  </span>
  <span class="mf-like-count">{count}</span>
</button>
