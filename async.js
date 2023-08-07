const NUMBERS_API_BASE_URL = 'http://numbersapi.com';
const FAVORITE_NUM = 7;

/**
 * Accept a number.
 * Calls numbersapi.com with number to retrieve a fact.
 * Returns a random fact about that number as a string
 */
async function getFactAboutNum(num) {
  const resp = await axios.get(`${NUMBERS_API_BASE_URL}/${num}?json`);
  return resp.data.text;
}

async function displayFact() {
  const fact = await getFactAboutNum(FAVORITE_NUM);
  $('body').append($('<p>').text(fact));
}

displayFact();