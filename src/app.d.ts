/// <reference types="vite-plugin-pwa/svelte" />
/// <reference types="vite-plugin-pwa/info" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
  // interface Locals {}
  // interface PageData {}
  // interface Error {}
  // interface Platform {}
}

declare type Item = import("svelte-dnd-action").Item;
declare type DndEvent<ItemType = Item> = import("svelte-dnd-action").DndEvent<ItemType>;
declare namespace svelteHTML {
  interface HTMLAttributes<T> {
    "on:consider"?: (event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }) => void;
    "on:finalize"?: (event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }) => void;
  }
}
