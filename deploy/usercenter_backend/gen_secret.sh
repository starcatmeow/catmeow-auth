#!/bin/sh
cat > generated_secret.yaml << EOF
apiVersion: v1
kind: Secret
metadata:
  name: secretkeys.backend.usercenter.starcatmeow.cn
type: Opaque
stringData:
  production.yml: |
    email: 
      host: <smtp server>
      port: 465
      secure: true
      auth:
        user: <email address>
        pass: <email password>
    auth:
      client_id: $(openssl rand -hex 16)
      client_secret: $(openssl rand -hex 16)
    jwt:
      tokenkey: $(openssl rand -hex 16)
      challengekey: $(openssl rand -hex 16)
EOF