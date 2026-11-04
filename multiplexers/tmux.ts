import { spawnSync } from "node:child_process";
import type { Multiplexer } from "../multiplexer.ts";

export const tmuxMultiplexer: Multiplexer = {
	sessionExists(handle) {
		return spawnSync("tmux", ["has-session", "-t", `pi-subagent-${handle}`], { stdio: "ignore" }).status === 0;
	},
};
