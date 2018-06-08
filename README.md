# Pitchgrader
Project for the Personal Interaction Studio course of Spring 2018 at EPFL.

EPFL | Media & Design Lab | Personal Interaction Studio 2018

Course Tutors:
- Immanuel Koh 
- Jeffrey Huang  

## Directory Structure
The two main folders of the application contain:
- The [Python code](python/) responsible of preprocessing the data
- The [web app](nodejs/) written in [React](https://reactjs.org) for the [front-end](nodejs/client) and [Express](https://expressjs.com) for the [back-end](nodejs/).

## Steps to run
In order to run the project there are a few steps needed to follow:

- Download the [images](https://drive.switch.ch/index.php/s/xrYX8Q9cmwlNPW5) and put the whole folder `field/` as a child of `nodejs/res/`
- Install [Mongodb](https://www.mongodb.com) and pymongo, start an instance and run the script `init_db.sh`
- Install [Yarn](https://yarnpkg.com), go to each of `nodejs/` and `nodejs/client/` and run `yarn add` to install all javascript dependencies 
- go to `nodejs/` and run `yarn dev`

I might setup a docker image that does all that...

## Demo
Check out this [video](https://youtu.be/QSX4Bnhs0CI)
