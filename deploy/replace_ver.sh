#!/bin/sh
if [ -z $CI_COMMIT_TAG ]; then
    export CI_COMMIT_TAG=latest
fi

sed -i 's/$CI_COMMIT_TAG/'"$CI_COMMIT_TAG"'/' openid/openid.yaml usercenter_backend/backend.yaml usercenter_frontend/frontend.yaml