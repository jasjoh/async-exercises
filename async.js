const NUMBERS_API_BASE_URL = 'http://numbersapi.com';
const FAVORITE_NUM = 7;
const FAVORITE_NUMS = [1,2,3,4,5];

const DECK_API_BASE_URL = 'https://deckofcardsapi.com/api/deck/'

/**
 * Accept a number.
 * Calls numbersapi.com with number to retrieve a fact.
 * Returns a random fact about that number as a string
 */
async function getFactAboutNum(num) {
  const resp = await axios.get(`${NUMBERS_API_BASE_URL}/${num}?json`);
  return resp.data.text;
}

/**
 * Displays any facts.
 */
async function displayFacts() {
  const fact = await getFactAboutNum(FAVORITE_NUM);
  $('body').append($('<p>').text(fact));

  let facts = await getFactsAboutNums(FAVORITE_NUMS);

  for (let fact in facts) {
    $('body').append($('<p>').text(facts[fact]));
  }

  facts = await getFourFacts(FAVORITE_NUM);

  for (let fact of facts) {
    $('body').append($('<p>').text(fact));
  }

}

/**
 * Accept a array of numbers.
 * Calls numbersapi.com to retrieve facts about each number.
 * Returns an object where each number is a key and its value is the fact.
 */
async function getFactsAboutNums(nums) {

  const numsAsStr = nums.join(',');
  const resp = await axios.get(`${NUMBERS_API_BASE_URL}/${numsAsStr}`);
  return resp.data;
}

/**
 * Accept a single number.
 * Calls the numbersapi.com to retrieve four facts about that number.
 * Returns an array of strings with those facts.
 */
async function getFourFacts(num) {
  const facts = [];

  const factPromises = [];


  let i = 0;
  while (i < 4) {
    // const resp = await axios.get(`${NUMBERS_API_BASE_URL}/${num}?json`);
    const p = axios.get(`${NUMBERS_API_BASE_URL}/${num}?json`);
    factPromises.push(p);
    // facts.push(resp.data.text);
    i++;
  }

  const resolvedPromises = await Promise.allSettled(factPromises);
  return facts;
}

// displayFacts();

/**
 * Leverages the deck of cards API.
 * Shuffles a new deck of cards then retrieves and returns a card.
 */
async function shuffleAndGetCard() {
  let axiosResponse = await axios.get(
    `${DECK_API_BASE_URL}/new/shuffle/?deck_count=1`
    );
  const deckId = axiosResponse.data.deck_id;

  axiosResponse = await axios.get(
    `${DECK_API_BASE_URL}/${deckId}/draw/?count=1`
  );
  const cardValue = axiosResponse.data.cards[0].value;
  const cardSuit = axiosResponse.data.cards[0].suit;
  console.log(cardValue + " of " + cardSuit);
}

/**
 * Leverages the deck of cards API.
 * Shuffles a new deck of cards then retrieves and returns two cards.
 */
async function shuffleAndGetTwoCards() {
  let axiosResponse = await axios.get(
    `${DECK_API_BASE_URL}/new/shuffle/?deck_count=1`
    );
  const deckId = axiosResponse.data.deck_id;

  let arrayOfPromises = [];
  let i = 1;
  while (i <= 2) {
    let axiosResponsePromise = axios.get(
      `${DECK_API_BASE_URL}/${deckId}/draw/?count=1`
    );
    arrayOfPromises.push(axiosResponsePromise);
    i++;
  }
  const promises = await Promise.allSettled(arrayOfPromises);

  for (let promise of promises) {
    const cardValue = promise.value.data.cards[0].value;
    const cardSuit = promise.value.data.cards[0].suit;
    promises.pop();
    console.log(cardValue + " of " + cardSuit);
  }
}

shuffleAndGetCard();
shuffleAndGetTwoCards()