const Joi = require('joi');
const findIndex = require('lodash/findIndex');
Joi.objectId = require('joi-objectid')(Joi);

const schema = Joi.objectId();
const duplicatedProjectIds = [
  // I tried to keep these in the order of the new front end certification.

  /*** HTML ***/

  // Cat Photo App

  // Survey Form
  '587d78af367417b2b2512b03',

  /*** CSS ***/

  // Cafe Menu
  '5f33071498eb2472b87ddee4',
  '5f3313e74582ad9d063e3a38',
  '5f331e55dfab7a896e53c3a1',
  '5f3326b143638ee1a09ff1e3',
  '5f33294a6af5e9188dbdb8f3',
  '5f332a88dc25a0fd25c7687a',
  '5f332b23c2045fb843337579',
  '5f344fc1520b6719f2e35605',
  '5f344fbc22624a2976425065',
  '5f344fad8bf01691e71a30eb',
  '5f344f9c805cd193c33d829c',
  '5f3477ae9675db8bb7655b30',
  '5f3477ae34c1239cafe128be',
  '5f3477aefa51bfc29327200b',
  '5f3477ae8466a9a3d2cc953c',
  '5f3477cb2e27333b1ab2b955',
  '5f3477cbcb6ba47918c1da92',
  '5f3477cb303c5cb61b43aa9b',
  '5f34a1fd611d003edeafd681',
  '5f356ed6cf6eab5f15f5cfe6',
  '5f356ed63c7807a4f1e6d054',
  '5f356ed60a5decd94ab66986',
  '5f356ed63e0fa262326eef05',
  '5f356ed60785e1f3e9850b6e',
  '5f356ed656a336993abd9f7c',
  '5f356ed6199b0cdef1d2be8f',
  '5f356ed69db0a491745e2bb6',
  '5f35e5c44359872a137bd98f',
  '5f35e5c4321f818cdc4bed30',
  '5f3c866daec9a49519871816',
  '5f3c866d5414453fc2d7b480',
  '5f3c866d28d7ad0de6470505',
  '5f769541be494f25449b292f',
  '5f76967fad478126d6552b0d',
  '5f769702e6e33127d14aa120',
  '5f3c866de7a5b784048f94b1',
  '5f3c866dbf362f99b9a0c6d0',
  '5f3c866d0fc037f7311b4ac8',
  '5f3c866dd0d0275f01d4d847',
  '5f3cade9fa77275d9f4efe62',

  // Colored Markers

  // Registration Form

  // Rothko Painting

  // Flexbox Photo Gallery

  // Nutrition Label

  // Accessibility Quiz

  // Tribute Page
  'bd7158d8c442eddfaeb5bd18',

  // Balance Sheet

  // Cat Painting

  // Responsive Piano

  // Technical Documentation Page
  '587d78b0367417b2b2512b05',

  // City Skyline

  // Magazine

  // Product Landing Page
  '587d78af367417b2b2512b04',

  // Ferris Wheel

  // Penguin

  // Personal Portfolio
  'bd7158d8c242eddfaeb5bd13',

  /*** JavaScript ***/

  // Rock, Paper, Scissors Game

  // Palindrome Checker
  'aaa48de84e1ecc7c742e1124',

  // Date Formatter

  // Decimal to Binary Converter

  // Number Sorter Project

  // Quick Sort Algorithm
  '587d825a367417b2b2512c89',
  // Roman Numeral Converter
  'a7f4d8f2483413a6ce226cac',

  // Dice Game Project

  // Telephone Number Validator
  'aff0395860f5d3034dc0bfc9',

  // Cash Register
  'aa2e6f85cab2ab736c9a9b24',

  // Shopping Cart

  // Stacks

  // Linked Lists

  // Hash Tables

  // Depth-first Search

  // Nth Fibonacci Number

  // FCC Authors Page

  // Weather App

  // Forum Leaderboard

  // Pokemon Search
  '6555c1d3e11a1574434cf8b5',

  /*** Front End Libraries ***/

  // 25+5 Clock
  'bd7158d8c442eddfaeb5bd0f',

  /*** Relational Database ***/

  // Build a Boilerplate
  '5ea8adfab628f68d805bfc5e',

  // Mario Database
  '5f2c289f164c29556da632fd',

  // Celestial Bodies Database
  '5f1a4ef5d5d6b5ab580fc6ae',

  // Build Five Programs
  '5f5904ac738bc2fa9efecf5a',

  // Student Database: Part 1
  '602da0c222201c65d2a019f5',

  // Student Database: Part 2
  '618590adb0730ca724e37672',

  // World Cup Database
  '5f9771307d4d22b9d2b75a94',

  // Kitty Ipsum Translator
  '602da0de22201c65d2a019f6',

  // Bike Rental Shop
  '5f5b969a05380d2179fe6e18',

  // Salon Appointment Scheduler
  '5f87ac112ae598023a42df1a',

  // Nano Castle
  '5f32db63eb37f7e17323f459',

  // Git SQL Reference Object
  '5fa323cdaf6a73463d590659',

  // Periodic Table Database
  '602d9ff222201c65d2a019f2',

  // Number Guessing Game
  '602da04c22201c65d2a019f4',

  /*** Back End JavaScript ***/

  // Managing Packages with NPM
  '587d7fb3367417b2b2512bfb',
  '587d7fb3367417b2b2512bfc',
  '587d7fb4367417b2b2512bfd',
  '587d7fb4367417b2b2512bfe',
  '587d7fb4367417b2b2512bff',
  '587d7fb4367417b2b2512c00',
  '587d7fb5367417b2b2512c01',
  '587d7fb5367417b2b2512c02',
  '587d7fb5367417b2b2512c03',
  '587d7fb5367417b2b2512c04',

  // Basic Node and Express
  '5a8b073d06fa14fcfde687aa',
  '587d7fb0367417b2b2512bed',
  '587d7fb0367417b2b2512bee',
  '587d7fb0367417b2b2512bef',
  '587d7fb0367417b2b2512bf0',
  '587d7fb1367417b2b2512bf1',
  '587d7fb1367417b2b2512bf2',
  '587d7fb1367417b2b2512bf3',
  '587d7fb1367417b2b2512bf4',
  '587d7fb2367417b2b2512bf5',
  '587d7fb2367417b2b2512bf6',
  '587d7fb2367417b2b2512bf7',
  '587d7fb2367417b2b2512bf8',

  // Timestamp Microservice
  'bd7158d8c443edefaeb5bdef',

  // Request Header Parser Microservice
  'bd7158d8c443edefaeb5bdff',

  // URL Shortener Microservice
  'bd7158d8c443edefaeb5bd0e',

  // Exercise Tracker
  '5a8b073d06fa14fcfde687aa',

  // File Metadata Microservice
  'bd7158d8c443edefaeb5bd0f',

  /*** Legacy Only ***/

  // Caesars Cipher
  '56533eb9ac21ba0edf2244e2'
];

class MongoIds {
  constructor() {
    this.knownIds = [];
  }
  check(id, title) {
    try {
      schema.validate(id);
    } catch {
      return `Expected a valid ObjectId for ${title}, but got ${id}`;
    }

    const idIndex = findIndex(this.knownIds, existing => id === existing);
    if (idIndex !== -1 && !duplicatedProjectIds.includes(id)) {
      return `The id for challenge ${title} appears more than once. With the exception of duplicatedProjectIds this should not happen.`;
    }
    this.knownIds = [...this.knownIds, id];
    return null;
  }
}

module.exports = MongoIds;
