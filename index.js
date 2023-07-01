/// <reference types="../CTAutocomplete" />

/**
 * Filters events based on the file extension.
 * @param {java.nio.file.WatchEvent} event - The event to be filtered.
 * @returns {boolean}
 */
function filter(event) {
  // example - trigger on .js and .txt files
  const extension = event.context().toFile().getName().split(".").pop();
  return ["js", "txt"].includes(extension);
}

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
      if (!filter(event)) continue;
      const fileName = event.context().getFileName();
      if (event.kind() === StandardWatchEventKinds.ENTRY_MODIFY)
        ChatLib.chat(`&cFile ${fileName} &chas been modified.`);
      else if (event.kind() === StandardWatchEventKinds.ENTRY_CREATE)
        ChatLib.chat(`&cFile ${fileName} &chas been created.`);
      go = false;
      ChatTriggers.loadCT();
    }
    key.reset();
  }
}).start();
