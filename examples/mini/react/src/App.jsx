import { useState } from "react";
import { Modal } from "../../../../skills/motionfold/implementations/modal/react.tsx";
import { Tabs } from "../../../../skills/motionfold/implementations/tabs/react.tsx";
import { Switch } from "../../../../skills/motionfold/implementations/switch/react.tsx";
import { Toast } from "../../../../skills/motionfold/implementations/toast/react.tsx";
import { SuccessCheck } from "../../../../skills/motionfold/implementations/success-check/react.tsx";

const tabs = [
  { id: "overview", label: "Overview", panel: <p className="mini-panel">A shared measured indicator slides between peer views.</p> },
  { id: "activity", label: "Activity", panel: <p className="mini-panel">Recent activity appears without a page change.</p> },
  { id: "settings", label: "Settings", panel: <p className="mini-panel">Settings for the same object.</p> },
];

export default function App() {
  const [modal, setModal] = useState(false);
  const [tab, setTab] = useState("overview");
  const [notify, setNotify] = useState(true);
  const [toast, setToast] = useState(false);
  const [saved, setSaved] = useState(false);

  function replaySaved() {
    setSaved(false);
    setTimeout(() => setSaved(true), 30);
  }

  return (
    <main className="mini">
      <header>
        <h1>motionfold mini · React</h1>
        <p>
          Five recipes imported from <code>skills/motionfold</code>: modal, tabs, switch, toast, and success
          check. This is an example app; the shipped skill still has no runtime dependency.
        </p>
      </header>

      <div className="mini-grid">
        <section className="mini-card" data-mini="modal">
          <h2>Modal</h2>
          <p className="mini-panel">A native dialog with focus trap, Escape, and top layer.</p>
          <button className="mini-btn primary" type="button" onClick={() => setModal(true)}>Rename project</button>
        </section>

        <section className="mini-card" data-mini="tabs">
          <h2>Tabs</h2>
          <Tabs items={tabs} value={tab} onValueChange={setTab} />
        </section>

        <section className="mini-card" data-mini="switch">
          <h2>Switch</h2>
          <Switch checked={notify} onChange={setNotify} label="Email notifications" />
        </section>

        <section className="mini-card" data-mini="toast">
          <h2>Toast</h2>
          <p className="mini-panel">A live-region confirmation that pauses on hover.</p>
          <button className="mini-btn" type="button" onClick={() => setToast(true)}>Save draft</button>
        </section>

        <section className="mini-card" data-mini="success-check">
          <h2>Success check</h2>
          <div className="mini-success-row">
            <SuccessCheck show={saved} label="Saved" />
            <button className="mini-btn" type="button" onClick={replaySaved}>Replay</button>
          </div>
        </section>
      </div>

      <Modal open={modal} onOpenChange={setModal} title="Rename project">
        <p>Focus is trapped, Escape closes, and focus returns to the trigger.</p>
        <input className="mf-input" defaultValue="Atlas" aria-label="Project name" />
      </Modal>

      <div className="mini-toast-region">
        <Toast open={toast} onClose={() => setToast(false)} title="Saved">
          Draft updated just now.
        </Toast>
      </div>
    </main>
  );
}
