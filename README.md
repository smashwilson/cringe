# Scaffold

*Deploy Docker applications with shell scripts*

Scaffold is a rolling deployment system for applications that consist of collections of immutable Docker containers. Prototype your application infrastructure with bash (or your shell of choice), then flip the shebang line to `#!/usr/bin/env scaffold` to ✨magically ✨ perform rolling upgrades.

Scaffold uses the real Docker client under the hood, which is a little terrible, but also means that you don't need to wait for new Docker features to trickle from (for example) the Docker client to docker-py to docker-compose. As soon as Docker ships it, you can use it.
