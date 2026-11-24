import { createSignal } from "solid-js";
import { Modal } from "../../../../skills/motionfold/implementations/modal/solid.tsx";
import { Tabs } from "../../../../skills/motionfold/implementations/tabs/solid.tsx";
import { Switch } from "../../../../skills/motionfold/implementations/switch/solid.tsx";
import { Toast } from "../../../../skills/motionfold/implementations/toast/solid.tsx";
import { SuccessCheck } from "../../../../skills/motionfold/implementations/success-check/solid.tsx";

export default function App() {
  const [modal, setModal] = createSignal(false);
  const [tab, setTab] = createSignal("overview");
  const [notify, setNotify] = createSignal(true);
  const [toast, setToast] = createSignal(false);
  const [saved, setSaved] = createSignal(false);

  const tabs = [
    { id: "overview", label: "Overview", panel: <p class="mini-panel">A shared measured indicator slides between peer views.</p> },
    { id: "activity", label: "Activity", panel: <p class="mini-panel">Recent activity appears without a page change.</p> },
    { id: "settings", label: "Settings", panel: <p class="mini-panel">Settings for the same object.</p> },
  ];

  function replaySaved() {
    setSaved(false);
    setTimeout(() => setSaved(true), 30);
  }

  return (
    <main class="mini">
      <header>
        <h1>motionfold mini · Solid</h1>
        <p>
          Five recipes imported from <code>skills/motionfold</code>: modal, tabs, switch, toast, and success
          check. This is an example app; the shipped skill still has no runtime dependency.
        </p>
      </header>

      <div class="mini-grid">
        <section class="mini-card" data-mini="modal">
          <h2>Modal</h2>
          <p class="mini-panel">A native dialog with focus trap, Escape, and top layer.</p>
          <button class="mini-btn primary" type="button" onClick={() => setModal(true)}>Rename project</button>
        </section>

        <section class="mini-card" data-mini="tabs">
          <h2>Tabs</h2>
          <Tabs items={tabs} value={tab()} onValueChange={setTab} />
        </section>

        <section class="mini-card" data-mini="switch">
          <h2>Switch</h2>
          <Switch checked={notify()} onChange={setNotify} label="Email notifications" />
        </section>

        <section class="mini-card" data-mini="toast">
          <h2>Toast</h2>
          <p class="mini-panel">A live-region confirmation that pauses on hover.</p>
          <button class="mini-btn" type="button" onClick={() => setToast(true)}>Save draft</button>
        </section>

        <section class="mini-card" data-mini="success-check">
          <h2>Success check</h2>
          <div class="mini-success-row">
            <SuccessCheck show={saved} label="Saved" />
            <button class="mini-btn" type="button" onClick={replaySaved}>Replay</button>
          </div>
        </section>
      </div>

      <Modal open={modal()} onOpenChange={setModal} title="Rename project">
        <p>Focus is trapped, Escape closes, and focus returns to the trigger.</p>
        <input class="mf-input" value="Atlas" aria-label="Project name" />
      </Modal>

      <div class="mini-toast-region">
        <Toast open={toast} onClose={() => setToast(false)} title="Saved">
          Draft updated just now.
        </Toast>
      </div>
    </main>
  );
}
