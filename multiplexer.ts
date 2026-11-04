import { tmuxMultiplexer } from "./multiplexers/tmux.ts";

export interface Multiplexer {
	sessionExists(handle: string): boolean;
	killSession(handle: string): void;
}

export const multiplexer: Multiplexer = tmuxMultiplexer;
