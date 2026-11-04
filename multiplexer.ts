import { tmuxMultiplexer } from "./multiplexers/tmux.ts";

export interface Multiplexer {
	sessionExists(handle: string): boolean;
}

export const multiplexer: Multiplexer = tmuxMultiplexer;
