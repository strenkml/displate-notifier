import Stumper from "stumper";

export default (): void => {
  process.on("SIGINT", () => {
    Stumper.warning("Received SIGINT signal, shutting down...", "common:onSigInt");

    process.exit(0);
  });
};