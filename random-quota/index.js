const quotes = [
    {
        quote:"One morning I shot an elephant in my pajamas. How he got in my pajamas, I don't know",
        author:'Animal Crackers'
    },
    {
        quote:"Forget it, Jake, it's Chinatown.",
        author:'Chinatown'
    },
    {
        quote:"When you do the common things in life in an uncommon way, you will command the attention of the world.",
        author:'George Washington Carver'
    },
    {
        quote:"Keep your friends close, but your enemies closer.",
        author:'The Godfather II'
    },
    {
        quote:"Only two things are infinite, the universe and human stupidity, and I'm not sure about the former.",
        author:'Albert Einstein'
    },
    {
        quote:"If a man does his best, what else is there?",
        author:'General George S. Patton'
    },
    {
        quote:"I have come to believe that the whole world is an enigma, a harmless enigma that is made terrible by our own mad attempt to interpret it as though it had an underlying truth.",
        author:'Umberto Eco'
    },
    {
        quote:"Well, here's another nice mess you've gotten me into!",
        author:'Sons of the Desert'
    },
    {
        quote:"A boy's best friend is his mother.",
        author:'Psycho'
    },
    {
        quote:"E.T. phone home.",
        author:'E.T. The Extra-Terrestrial'
    },
]

$('.get-quote').on('click',function(){
    let randomQuote = randomQuoteIndex()
    $('.quote-ct').removeClass('in').addClass('out').on('animationend',function(){
        $('.quote').text(randomQuote.quote)
        $('.author').text(randomQuote.author)
        $(this).removeClass('out').addClass('in').off('animationend')
    })
})

function randomQuoteIndex(){
    return quotes[Math.floor(Math.random()*quotes.length)]
}