# Catmeow Auth Service
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fstarcatmeow%2Fcatmeow-auth.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fstarcatmeow%2Fcatmeow-auth?ref=badge_shield)


这是一个 Typescript + Kubernetes 测试项目，其实现了最基本的 OpenID Connect 协议，并提供了一个简单的用户中心/管理页面。

## Pics

![user center home page](https://i.imgur.com/UQQzTX7.png)
![user register page](https://i.imgur.com/C5qjU15.png)
![user login page](https://i.imgur.com/jAenXsc.png)
![user authorize page](https://i.imgur.com/FaKIrzX.png)
![user profile page](https://i.imgur.com/cLk3jce.png)
![openid application manage](https://i.imgur.com/Du0YFZj.png)

## 目录结构

- `deploy` -- 部署相关文件
- `openid` -- 认证模块
- `usercenter_backend` -- 用户中心后端
- `usercenter_frontend` -- 用户中心前端

## 部署

0. `export CI_COMMIT_TAG=0.3.4-alpha` 设置部署版本

1. 执行 `deploy/gen_all_secret.sh` 以生成各种密钥

2. 修改 `deploy` 目录中各 `yaml` 文件内域名信息

3. 在 `kubectl` 已配置支持 `Ingress` 的集群信息的情况下，执行 `deploy/deploy_all.sh`

4. 等待启动完毕即可使用，注册的第一个用户自动成为管理员。

## 演示站点

[点此进入](https://usercenter.starcatmeow.cn/)

## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fstarcatmeow%2Fcatmeow-auth.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fstarcatmeow%2Fcatmeow-auth?ref=badge_large)
