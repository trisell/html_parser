# smart people already figured out how to install node
FROM mhart/alpine-node:11.13.0 

# create a work directory inside the container
RUN mkdir /app
WORKDIR /app

# install utilities. I currently like yarn
RUN npm install -g yarn nodemon typescript
# install dependencies
RUN yarn