const { v4 } = require('uuid')
const fs = require('fs');
const gamePath = "./audiozips"
const { audioToSlice } = require('audio-slicer')
const { initializeApp } = require("firebase/app")
const { getStorage, ref, uploadBytes } = require("firebase/storage")
const db = require("firebase/database")

const MAX_ITEMS = 10

const firebaseConfig = {
  apiKey: "AIzaSyAqRWGxi3UNVQizcMzFKlDHgokP6SbFBOo",
  authDomain: "tsunapop2.firebaseapp.com",
  projectId: "tsunapop2",
  storageBucket: "tsunapop2.firebasestorage.app",
  messagingSenderId: "753012739168",
  appId: "1:753012739168:web:31ac8c5df0d7c0513ec705"
};

const app = initializeApp(firebaseConfig);
const database = db.getDatabase(app);
const storage = getStorage();

const gameList = fs.readdirSync(gamePath)
const toUpload = []

const randomMusic = [...Array(MAX_ITEMS)].map((_, index) => {
  const gameFolder = gameList[Math.floor(Math.random() * gameList.length)]
  const musicList = fs.readdirSync(`${gamePath}/${gameFolder}`).filter(x => x.includes(".mp3"))
  const randomMP3 = musicList[Math.floor(Math.random() * musicList.length)]

  const data = JSON.parse(fs.readFileSync(`${gamePath}/${gameFolder}/data.json`))

  return {
    id: v4(),
    relativeGame: `${gameFolder}/${randomMP3}`,
    audioPath: `${gamePath}/${gameFolder}/${randomMP3}`,
    imagePath: `${gamePath}/${gameFolder}/${fs.readdirSync(`${gamePath}/${gameFolder}`).find(x => x.toLowerCase().includes(".png") || x.toLowerCase().includes(".jpg"))}`,
    audioFile: randomMP3,
    data: {
      ...data
    }
  }
})

const processAudios = async (index) => {
  const audio = randomMusic[index]
  const media = fs.readFileSync(audio.audioPath)
  const [buffer] = await audioToSlice(media, 30, false)

  return fs.appendFile(`./temp/${audio.id}.mp3`, buffer, () => {
    toUpload.push(audio)

    if (index < MAX_ITEMS - 1){
      processAudios(index + 1)
    }else{
      return saveQuiz()
    }
  });
}

const saveQuiz = async () => {
  const quizId = v4()

  toUpload.forEach(async (data, index) => {
    const imageRef = ref(storage, `cards/${quizId}_${index}.png`);
    const audioRef = ref(storage, `audio/${quizId}_${index}.mp3`);

    const imageBuffer = fs.readFileSync(data.imagePath)
    const audioBuffer = fs.readFileSync(`./temp/${data.id}.mp3`)

    const imageBlob = new Blob([imageBuffer], { type: "image/png" });
    const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" });

    await uploadBytes(imageRef, imageBlob)
    await uploadBytes(audioRef, audioBlob)
  })

  return db.set(db.ref(database, `quiz/${quizId}`), {
    gameId: v4(),
    date: +new Date(),
    items: toUpload.map((item, index) => ({
      ...item.data,
      audioId: `audio/${quizId}_${index}`,
      imageId: `cards/${quizId}_${index}`,
    }))
  })
}

processAudios(0)