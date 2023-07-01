/// <reference types="../CTAutocomplete" />

const StandardWatchEventKinds = java.nio.file.StandardWatchEventKinds;

/**
 * When a file is modified or created, this function is called.
 * @param {java.nio.file.WatchEvent} event The event that was triggered.
 */
export default function onEvent(event) {
  const extension = event.context().toFile().getName().split(".").pop();
  if (extension !== "js") return;

  const fileName = event.context().getFileName();
  if (event.kind() === StandardWatchEventKinds.ENTRY_MODIFY)
    ChatLib.chat(`&cFile ${fileName} &chas been modified.`);
  else if (event.kind() === StandardWatchEventKinds.ENTRY_CREATE)
    ChatLib.chat(`&cFile ${fileName} &chas been created.`);

  ChatTriggers.loadCT();
}
