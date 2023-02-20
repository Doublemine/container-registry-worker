### 基于 Cloudflare Worker 的容器镜像加速器
本项目是一个基于 Cloudflare Worker 的容器镜像加速器，它可以加速 Docker 容器镜像的 pull 操作，提高镜像的下载速度。

### 简介
由于由于众所周知的原因，registry.k8s.io 上的镜像下载速度较慢或者直接无法顺利完成下载。由于 Docker Hub 此前的限流策略，同步 registry.k8s.io 的镜像到 Docker Hub 上已经不具备实际意义。因此在使用容器技术时，镜像的下载速度经常成为一个瓶颈。本项目旨在解决这个问题，它利用 Cloudflare Worker 的全球加速能力，将容器镜像代理到离用户更近的位置，从而提高镜像的下载速度。

### 使用方法

要使用本项目提供的容器镜像加速器，只需要在 Docker 命令中指定加速器的地址即可。以下是使用示例：

```bash
$ docker pull alpine:latest
$ docker pull k8s.registry.io/kube-apiserver:v1.26.0
```

使用加速器后：

```bash
$ docker pull mirror-k8s.example.com/kube-apiserver:v1.26.0
$ docker pull mirror-dockerhub.example.com/library/alpine:latest
```

其中，mirror-k8s.example.com/mirror-dockerhub.example.com 是本项目部署在 Cloudflare Worker 上的地址，用户只需要将其替换为自己的地址即可。

### 示例实例

- Docker Hub: [mirror-dockerhub.doublemine.workers.dev](https://mirror-dockerhub.doublemine.workers.dev)
- Kubernetes Registry: [mirror-k8s.doublemine.workers.dev](https://mirror-k8s.doublemine.workers.dev)

### 部署
要部署本项目，您需要先注册一个 Cloudflare 账号，为了避免 Cloudflare Workers 域名的干扰，建议使用自己的域名绑定 worker 别名，参见[Cloudflare 优选 IP](https://github.com/XIU2/CloudflareSpeedTest)，按照以下步骤进行操作：

克隆本项目到本地：

```bash
$ git clone https://github.com/Doublemine/container-registry-worker.git
```

安装依赖：

```bash
$ cd container-registry-worker
$ npm install
```

### 运行项目：

```bash
$ wrangler dev --config wrangler-kubernetes.toml   # registry.k8s.io 镜像 worker
$ wrangler dev --config wrangler-dockerhub.toml    # docker hub 镜像 worker
```
### 部署项目：

```bash
$ wrangler publish --config wrangler-dockerhub.toml 
$ wrangler publish --config wrangler-kubernetes.toml 
```
部署完成后，您将获得一个 Cloudflare Worker 的地址，可以将其用作容器镜像加速器的地址。

### 支持的容器仓库

本项目目前支持以下容器仓库：

Docker Hub：registry-1.docker.io
Kubernetes Registry：registry.k8s.io