import { tmuxMultiplexer } from "./multiplexers/tmux.ts";

export interface LaunchCommand {
	cwd: string;
	env: Record<string, string>;
	argv: string[];
}

export interface Multiplexer {
	sessionExists(handle: string): boolean;
	killSession(handle: string): void;
	launch(handle: string, command: LaunchCommand): void;
}

export const multiplexer: Multiplexer = tmuxMultiplexer;
