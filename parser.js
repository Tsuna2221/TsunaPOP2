const fs = require('fs');
const txtPath = `./txts`

const gameFolders = fs.readdirSync(txtPath)

function parseGameData(text) {
    const gameData = {};

    // Regex patterns to extract relevant information
    const patterns = {
        gameName: /Game name:\s*(.*)/,
        system: /System:\s*(.*)/,
        musicAuthor: /Music author:\s*(.*)/,
        gameDeveloper: /Game developer:\s*(.*)/,
        gamePublisher: /Game publisher:\s*(.*)/,
        releaseDate: /Game release date:\s*(.*)/,
    };

    // Extract the values using regex
    const gameNameMatch = text.match(patterns.gameName);
    if (gameNameMatch) gameData["Game name"] = gameNameMatch[1].trim();

    const systemMatch = text.match(patterns.system);
    if (systemMatch) gameData["System"] = systemMatch[1].trim();

    const musicAuthorMatch = text.match(patterns.musicAuthor);
    if (musicAuthorMatch) gameData["Music author"] = musicAuthorMatch[1].trim();

    const gameDeveloperMatch = text.match(patterns.gameDeveloper);
    if (gameDeveloperMatch) gameData["Game developer"] = gameDeveloperMatch[1].trim();

    const gamePublisherMatch = text.match(patterns.gamePublisher);
    if (gamePublisherMatch) gameData["Game publisher"] = gamePublisherMatch[1].trim();

    const releaseDateMatch = text.match(patterns.releaseDate);
    if (releaseDateMatch) gameData["Game release date"] = releaseDateMatch[1].trim();

    return gameData;
}

gameFolders.forEach((gameName, index) => {
  const inputText = fs.readFileSync(`${txtPath}/${gameName}/data.json`, 'utf8');

  console.log(JSON.parse(inputText)["Game name"])
  // // const parsedData = parseGameData(inputText);

  // fs.writeFileSync(`${txtPath}/${gameName}/data.json`, JSON.stringify(parsedData, null, 2), 'utf-8');
  // console.log(`${index + 1}/${gameFolders.length}`);
})

