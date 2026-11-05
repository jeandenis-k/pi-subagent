import { spawnSync } from "node:child_process";
import type { Multiplexer } from "../multiplexer.ts";

export const tmuxMultiplexer: Multiplexer = {
	sessionExists(handle) {
		return spawnSync("tmux", ["has-session", "-t", `pi-subagent-${handle}`], { stdio: "ignore" }).status === 0;
	},
	killSession(handle) {
		spawnSync("tmux", ["kill-session", "-t", `pi-subagent-${handle}`], { stdio: "ignore" });
	},
	launch(handle, command) {
		const result = spawnSync(
			"tmux",
			[
				"new-session",
				"-d",
				"-s",
				`pi-subagent-${handle}`,
				"-x",
				"120",
				"-y",
				"40",
				"-c",
				command.cwd,
				"--",
				"env",
				...Object.entries(command.env).map(([name, value]) => `${name}=${value}`),
				...command.argv,
			],
			{ encoding: "utf8" },
		);
		if (result.status !== 0) throw new Error(result.stderr.trim() || "Failed to create tmux session");
	},
	attachHint(handle) {
		return `tmux attach -t pi-subagent-${handle}`;
	},
};
