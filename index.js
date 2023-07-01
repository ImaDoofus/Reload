/// <reference types="../CTAutocomplete" />

import onEvent from "./onEvent.js";

const File = java.io.File;
const FileSystems = java.nio.file.FileSystems;
const StandardWatchEventKinds = java.nio.file.StandardWatchEventKinds;

new Thread(() => {
  const watchService = FileSystems.getDefault().newWatchService();
  const file = new File(ChatTriggers.DEFAULT_MODULES_FOLDER);
  function registerRecursive(file) {
    if (file.isDirectory()) {
      file.listFiles().forEach((f) => registerRecursive(f));
      file
        .toPath()
        .register(
          watchService,
          StandardWatchEventKinds.ENTRY_MODIFY,
          StandardWatchEventKinds.ENTRY_CREATE
        );
    }
  }
  registerRecursive(file);

  let go = true;
  register("gameUnload", () => {
    go = false;
  });

  while (go) {
    const key = watchService.take();
    for (let event of key.pollEvents()) {
      onEvent(event);
    }
    key.reset();
  }
}).start();
