/*Patrial Quote Array taken from: http://codepen.io/AdventureBear/pen/vEoVMw */
var quotes = ["There are two types of people in this world.  Those that enter a room and say 'Here I am!' and those that enter a room and say 'There you are!'.-Unknown","Because it's there.-George Mallory on climbing mountains","Footsteps always follow us, whenever it is snowing.  They always show us where we've been, but never where we're going.-Winnie the Pooh's A-Z",
"For I know the plans that I have for you.-The Lord, Jer 29:11",
"The only way to climb properly is to realize that just getting up a route is nothing, the way it is done is everything.-Royal Robbins",
"Small minds discuss people.  Average minds discuss events.  Great minds discuss ideas.-Unkown",
"The significant problems we face cannot be solved at the same level of thinking we were at when we created them.-Albert Einstein",
"We must not cease from exploration and the end of all our exploring will be to arrive where we began and to know the place for the first time.-T S Eliot",
"One man asked another on the death of a mutual friend, 'How much did he leave?' His friend responded, 'He left it all.'-Proverb",
"It is more noble to give yourself completely to one individual than to labor diligently for the salvation of the masses.-Dag Hammarskjold, Sec. Gen. of the UN",
"Maps are a way of organizing wonder.-Edward Tufte","I have decided to make my life my argument.-Albert Schweitzer",
"Now it's a sqirt mecca for mystery artist, but back then it was just magic.-Jim Snyder on Kayaking"];

$(document).ready(function() {
  generateQuote();
});
$("#quote-btn").on("click", function() {
  generateQuote();
});

var generateQuote = function() {
   var randQuote = quotes[Math.floor(Math.random()*quotes.length)].split("-");
   var quoteAuthor = randQuote[1];
   var quoteSaying = randQuote[0];

   $("#quote").text(quoteSaying);
   $("#author").text(quoteAuthor);
};
