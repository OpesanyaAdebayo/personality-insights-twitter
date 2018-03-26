require("dotenv").config();
const readline = require('readline');
const PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
const personality_insights = new PersonalityInsightsV3({
    username: process.env.PERSONALITY_INSIGHTS_USERNAME,
    password: process.env.PERSONALITY_INSIGHTS_PASSWORD,
    version_date: '2017-10-13'
});
const PersonalityTextSummaries = require('personality-text-summary');
const v3EnglishTextSummaries = new PersonalityTextSummaries({
    locale: 'en',
    version: 'v3'
});

const fetchTweets = require('./fetchTweets');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Please enter a twitter Handle for Watson to analyze...', (handle) => {

    console.log("Your results should show up soon. Thank you.");

    fetchTweets(handle).then((tweets) => {
        let params = {
            // Content items are tweets.
            content_items: tweets,
            consumption_preferences: true,
            raw_scores: true,
            headers: {
                'accept-language': 'en',
                'accept': 'application/json'
            }
        };
        personality_insights.profile(params, function (error, personalityProfile) {
            if (error && error.code == 400) {
                reject(Error("Ouch! You either do not have sufficient tweets, or your language is not supported. Sorry."));
            } else
                console.log(JSON.stringify(personalityProfile, null, 2));

        });

        rl.close();

    }).catch(err => console.error(err));

});

