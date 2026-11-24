<script setup>
import { ref } from "vue";
import Modal from "../../../../skills/motionfold/implementations/modal/vue.vue";
import Tabs from "../../../../skills/motionfold/implementations/tabs/vue.vue";
import Switch from "../../../../skills/motionfold/implementations/switch/vue.vue";
import Toast from "../../../../skills/motionfold/implementations/toast/vue.vue";
import SuccessCheck from "../../../../skills/motionfold/implementations/success-check/vue.vue";

const modal = ref(false);
const tab = ref("overview");
const notify = ref(true);
const toast = ref(false);
const saved = ref(false);

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
  saved.value = false;
  setTimeout(() => (saved.value = true), 30);
}
</script>

<template>
  <main class="mini">
    <header>
      <h1>motionfold mini · Vue</h1>
      <p>
        Five recipes imported from <code>skills/motionfold</code>: modal, tabs, switch, toast, and success
        check. This is an example app; the shipped skill still has no runtime dependency.
      </p>
    </header>

    <div class="mini-grid">
      <section class="mini-card" data-mini="modal">
        <h2>Modal</h2>
        <p class="mini-panel">A native dialog with focus trap, Escape, and top layer.</p>
        <button class="mini-btn primary" type="button" @click="modal = true">Rename project</button>
      </section>

      <section class="mini-card" data-mini="tabs">
        <h2>Tabs</h2>
        <Tabs v-model:value="tab" :items="tabs">
          <template #panel="{ item }">
            <p class="mini-panel">{{ panels[item.id] }}</p>
          </template>
        </Tabs>
      </section>

      <section class="mini-card" data-mini="switch">
        <h2>Switch</h2>
        <Switch v-model="notify" label="Email notifications" />
      </section>

      <section class="mini-card" data-mini="toast">
        <h2>Toast</h2>
        <p class="mini-panel">A live-region confirmation that pauses on hover.</p>
        <button class="mini-btn" type="button" @click="toast = true">Save draft</button>
      </section>

      <section class="mini-card" data-mini="success-check">
        <h2>Success check</h2>
        <div class="mini-success-row">
          <SuccessCheck :show="saved" label="Saved" />
          <button class="mini-btn" type="button" @click="replaySaved">Replay</button>
        </div>
      </section>
    </div>

    <Modal v-model:open="modal" title="Rename project">
      <p>Focus is trapped, Escape closes, and focus returns to the trigger.</p>
      <input class="mf-input" value="Atlas" aria-label="Project name" />
    </Modal>

    <div class="mini-toast-region">
      <Toast :open="toast" title="Saved" @close="toast = false">Draft updated just now.</Toast>
    </div>
  </main>
</template>
