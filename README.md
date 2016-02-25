# Scaffold

*Orchestrate rolling deployments of Docker containers like it's 2005*

Scaffold is an orchestration system for applications that consist of collections of immutable Docker containers. Prototype your application infrastructure with bash (or your shell of choice), then flip the shebang line to `#!/usr/bin/env scaffold` to ✨magically ✨ perform rolling upgrades instead.

## Installation

Install scaffold from [npm](https://docs.npmjs.com/getting-started/installing-node):

```bash
npm install -g scaffold
```

## Usage

Write a shell script that launches and configures your application's containers in your shell of choice. Use as much of the `docker` command-line interface as you wish. Scaffold will use the `--name` parameter to determine what a container's lifespan is intended to be, but all other arguments and commands are passed through to the `docker` CLI on your `${PATH}` as given.

```bash
# Because Docker will automatically name this container, a new container will be launched each time
# you run scaffold.
docker run -d smashwilson/minimal-sinatra

# Similarly, the DNAME in this container's name will be replaced with the current (randomly-named)
# deployment. A new container will be launched each time that you run scaffold, but each will
# have a name like "foo-b35b988c8fa08d75".
docker run -d --name foo-DNAME smashwilson/minimal-sinatra

# Because this container has an explicit, untemplated name, the "frontdoor" container will be
# created if it doesn't exist, but left alone on subsequent deployments. This is useful for
# containers like load balancers or data volume containers.
docker run -d -P --name frontdoor my-nginx

# This is a bash script. You can do anything in here that you can do in bash: variable
# substitution, for loops, functions, whatever.
docker run -d -p ${PUBLIC_PORT}:${CONTAINER_PORT:-8080} ${DOCKER_USERNAME}/${DOCKER_IMAGE_NAME}
```

To run a deployment with scaffold:

* If your shell script is called `scaffold.sh`, running `scaffold` in that directory will use your script automatically.
* Run your shell script through scaffold explicitly by passing it as an argument: `scaffold my-script.sh`
* Give your shell script a shebang line of `#!/usr/bin/env scaffold` and mark it executable with `chmod +x` to use scaffold when you run it directly as `./my-script.sh`.

If you're sneaky, you can even set the `SHELL` environment variable to any interpreter to use something that's not a shell, like `SHELL=python scaffold my-script.py`. As long as `my-script.py` shells out to the Docker client (rather than do something sane like use an SDK) it should work fine.

## What the hell, man

Why would anyone in their right minds ever use this? Okay, okay, realistically, you should probably be using something "official" and "maintained" with "actual effort" like [docker-compose](https://docs.docker.com/compose/) or [Kubernetes](http://kubernetes.io/).

* Scaffold lets you specify your application's topology with the same Docker CLI that you use when you're *prototyping* your application's topology. You don't have to map back and forth between CLI arguments and some YAML format.
* Scaffold sacrifices intelligence for control. If you want service A to launch before service B, it's up to you to launch service A before service B. That makes it less scalable, but it does make it more predictable.
* Docker features aren't supported across the entire ecosystem simultaneously. It takes a little time after something ships in the Docker client for it to make its way through the SDKs and into Compose or whatever. Scaffold has 100% feature parity with whatever Docker version you have on your path at the moment, because it *is* whatever Docker version you have on your path.
