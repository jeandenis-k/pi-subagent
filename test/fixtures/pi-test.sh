#!/bin/sh
# Fake pi, picked up by launchRun from the working directory: a real pi would call a language model.
touch "$PI_SUBAGENT_RUN_DIR/launched"
exec sleep 60
