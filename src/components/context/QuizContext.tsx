// @ts-nocheck 
import { createContext, Dispatch, useEffect, useState, useRef } from 'react'
import { useImmer } from "use-immer";
import { useParams } from 'react-router-dom';

import { firebaseConfig } from "../../config/config";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";

import { socket } from '../../config/socket';


const app = initializeApp(firebaseConfig);
const storage = getStorage();
const db = getDatabase(app);

interface CreationTypes {
  volume: number
  setVolume: Dispatch<React.SetStateAction<number>>
  quiz: {
    quizItems: Array<{
      guessedBy: string
    }>
  }
  connect: boolean
}

interface Props {
  leaderboard: Array<{
    points: number
    user: string
  }>
}

export const QuizContext = createContext<CreationTypes>({} as CreationTypes)

const QuizProvider: React.FC<Props> = ({ children }) => {
  const { id } = useParams()
  const [volume, setVolume] = useState<number>(75)
  const [leaderboard, setLeaderboard] = useImmer([])
  const [currentPlaying, setCurrent] = useImmer(null)
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [connect, setConnect] = useState(false)

  const join = ({ user }) => {
    setLeaderboard(previous => {
      const userIndex = previous?.findIndex(({ user: name }) => name === user)

      if(userIndex < 0) return [...previous, { user, points: 0 }]
      return previous
    })
  }

  useEffect(() => {
    const starCountRef = ref(db, `quiz/${id}`)

    onValue(starCountRef, async (snapshot) => {
      const data = snapshot.val();
      const { items } = data
      const cache = JSON.parse(window.localStorage.getItem("imageCache") || `{}`)

      const mappedQuiz = await items.map(async (item) => {
        const { audioId, imageId } = item 
        let imageUrl = ""
        let audioUrl = ""

        if(cache[imageId]){
          imageUrl = cache[imageId]
        }else{
          const imageRef = await storageRef(storage, `gs://tsunapop2.firebasestorage.app/${imageId}.png`)
          imageUrl = await getDownloadURL(imageRef)

          cache[imageId] = imageUrl
        }

        if(cache[audioId]){
          audioUrl = cache[audioId]
        }else{
          const audioRef = await storageRef(storage, `gs://tsunapop2.firebasestorage.app/${audioId}.mp3`)
          audioUrl = await getDownloadURL(audioRef)

          cache[audioId] = audioUrl
        }

        window.localStorage.setItem("imageCache", JSON.stringify(cache))

        return {
          ...item,
          imageUrl,
          audioUrl
        }
      })

      setQuiz({
        ...data,
        cardBackground: await "https://firebasestorage.googleapis.com/v0/b/tsunapop2.firebasestorage.app/o/question.png?alt=media",
        quizItems: await Promise.all(mappedQuiz).then(e => {
          setLoading(false)
          return e
        })
      })
    });
  }, [])

  return (
    <QuizContext.Provider
      value={{
        volume, setVolume, loading, setQuiz, quiz, setCurrent, currentPlaying, connect, setConnect
      }}
    >
      {children}
    </QuizContext.Provider>
  )
}


export default QuizProvider