# Configure the Docker provider
provider "docker" {
  host = "unix:///var/run/docker.sock"
}

data "docker_registry_image" "couchbase" {
  name = "couchbase:latest"
}

# Create a container
resource "docker_container" "couchbase" {
  image = docker_image.couchbase.latest
  name  = "couchbase"
}

resource "docker_image" "couchbase" {
  name = data.docker_registry_image.couchbase.name
  pull_triggers = [data.docker_registry_image.couchbase.sha256_digest]
}