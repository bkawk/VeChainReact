# VeChain React
A simple react app in TypeScript and Sass that allows the user to request funds by entering the amount of funds and the address to send the funds to.

[![<ORG_NAME>](https://circleci.com/gh/bkawk/VeChainReact.svg?style=svg)](<LINK>)

## TODO
* Change the favicon
* Add meta for social
* Add countdown / noise to show when the funds arrive
* Add routes and change page to show balance
* Expand tests for coverage
* Tidy up sass files and stucture

## Install

```ssh
npm install
```

## Start

```ssh
npm run start
```

## Docker

```ssh
npm run docker
```

## Lint

```ssh
tslint --project .
```


## Deploy

* Setup a domain Route 53
* Setup a Certificate in Certificate manager
* Create a remote repository in AWS ECR
* Push docker image to ECR
* Create a new VPC
* Create 2 Subnets for private and 2 Subnets for public
* Attach an Internet gateway to VPC
* Create 2 route tables one for public and one for private
* On the public route table connect the Internet Gateway and NAT Gateway
* On the private route table setup a route for the NAT Gateway
* Associate the coresponding subnets to the 2 route tables
* Create an ECS Cluster powered by Fargate in a new VPC
* Create a Fargate ECS Task Definition and link the docker image in ECR
* Create an application load balancer and target group for the public subnet
* Create a Fargate service in the Cluster, connect the load balancer and configure the security group
* Alias the domain to the load balancer
* Setup AWS Code Deploy linking it to GitHub

![Network diagram](https://i.imgur.com/dNK55T8.png)