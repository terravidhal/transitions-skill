<script>
  import Modal from "../../../../skills/motionfold/implementations/modal/svelte.svelte";
  import Tabs from "../../../../skills/motionfold/implementations/tabs/svelte.svelte";
  import Switch from "../../../../skills/motionfold/implementations/switch/svelte.svelte";
  import Toast from "../../../../skills/motionfold/implementations/toast/svelte.svelte";
  import SuccessCheck from "../../../../skills/motionfold/implementations/success-check/svelte.svelte";

  let modal = $state(false);
  let tab = $state("overview");
  let notify = $state(true);
  let toast = $state(false);
  let saved = $state(false);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "activity", label: "Activity" },
    { id: "settings", label: "Settings" },
  ];

  const panels = {
    overview: "A shared measured indicator slides between peer views.",
    activity: "Recent activity appears without a page change.",
    settings: "Settings for the same object.",
  };

  function replaySaved() {
    saved = false;
    setTimeout(() => (saved = true), 30);
  }
</script>

<main class="mini">
  <header>
    <h1>motionfold mini · Svelte</h1>
    <p>
      Five recipes imported from <code>skills/motionfold</code>: modal, tabs, switch, toast, and success
      check. This is an example app; the shipped skill still has no runtime dependency.
    </p>
  </header>

  <div class="mini-grid">
    <section class="mini-card" data-mini="modal">
      <h2>Modal</h2>
      <p class="mini-panel">A native dialog with focus trap, Escape, and top layer.</p>
      <button class="mini-btn primary" type="button" onclick={() => (modal = true)}>Rename project</button>
    </section>

    <section class="mini-card" data-mini="tabs">
      <h2>Tabs</h2>
      <Tabs items={tabs} bind:value={tab}>
        {#snippet children(item)}
          <p class="mini-panel">{panels[item.id]}</p>
        {/snippet}
      </Tabs>
    </section>

    <section class="mini-card" data-mini="switch">
      <h2>Switch</h2>
      <Switch bind:checked={notify} label="Email notifications" />
    </section>

    <section class="mini-card" data-mini="toast">
      <h2>Toast</h2>
      <p class="mini-panel">A live-region confirmation that pauses on hover.</p>
      <button class="mini-btn" type="button" onclick={() => (toast = true)}>Save draft</button>
    </section>

    <section class="mini-card" data-mini="success-check">
      <h2>Success check</h2>
      <div class="mini-success-row">
        <SuccessCheck show={saved} label="Saved" />
        <button class="mini-btn" type="button" onclick={replaySaved}>Replay</button>
      </div>
    </section>
  </div>

  <Modal bind:open={modal} title="Rename project">
    <p>Focus is trapped, Escape closes, and focus returns to the trigger.</p>
    <input class="mf-input" value="Atlas" aria-label="Project name" />
  </Modal>

  <div class="mini-toast-region">
    <Toast bind:open={toast} title="Saved">Draft updated just now.</Toast>
  </div>
</main>
