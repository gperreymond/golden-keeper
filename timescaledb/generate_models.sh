#!/bin/bash

npx sequelize \
    model:generate \
    --name AwsEc2Instances \
    --attributes \
    time:date,instanceId:string,instanceType:string,region:string
