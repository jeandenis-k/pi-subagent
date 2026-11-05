import { strict as assert } from "node:assert";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, realpathSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, test } from "node:test";

let root: string;
let env: NodeJS.ProcessEnv;

beforeEach(() => {
	root = realpathSync(mkdtempSync(join(tmpdir(), "pi-subagent-test-")));
	env = {
		PATH: process.env.PATH,
		// Subagent metadata goes under root instead of the user's ~/.pi/agent/subagents.
		PI_CODING_AGENT_DIR: root,
		// tmux starts its own server with a socket under root, instead of joining the user's server.
		TMUX_TMPDIR: root,
		// Defaults for spawn, so that tests need not pass --provider and --model.
		PI_PROVIDER: "p",
		PI_MODEL: "m",
	};
});

afterEach(() => {
	spawnSync("tmux", ["kill-server"], { env });
	rmSync(root, { recursive: true, force: true });
});

test("spawn launches pi as a subagent in a tmux session", async () => {
	spawnSync("node", ["subagent.ts", "spawn", "--cwd", "test/fixtures", "--prompt", "Hi"], { env });

	const [handle] = readdirSync(join(root, "subagents"));
	// The fake pi marks its run directory, received through PI_SUBAGENT_RUN_DIR, once tmux has started it.
	while (!existsSync(join(root, "subagents", handle, "launched"))) await new Promise((resolve) => setTimeout(resolve, 50));
	assert.equal(spawnSync("tmux", ["has-session", "-t", `pi-subagent-${handle}`], { env }).status, 0);
});

test("stop kills the subagent's tmux session", () => {
	spawnSync("node", ["subagent.ts", "spawn", "--cwd", "test/fixtures", "--prompt", "Hi"], { env });
	const [handle] = readdirSync(join(root, "subagents"));

	spawnSync("node", ["subagent.ts", "stop", handle], { env });

	assert.notEqual(spawnSync("tmux", ["has-session", "-t", `pi-subagent-${handle}`], { env }).status, 0);
});
