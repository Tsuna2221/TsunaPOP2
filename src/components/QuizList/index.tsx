// @ts-nocheck 

import { useEffect, useState } from 'react'

import { firebaseConfig } from "../../config/config";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, orderByValue } from "firebase/database";
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";
import { Grid, MainWrapper } from './styles';
import ItemQuiz from '../ItemQuiz';
import Loader from '../Loader';

const app = initializeApp(firebaseConfig);
const storage = getStorage();
const db = getDatabase(app);

const QuizList = () => {
  const [loading, setLoading] = useState(true)
  const [quizList, setQuizList] = useState([])

  useEffect(() => {
    const quizRef = ref(db, `quiz`, orderByValue("createdAt"))

    onValue(quizRef, async (snapshot) => {
      const data = snapshot.val();

      const dataArray = Object.keys(data).map(async (key) => {
        return {
          ...data[key],
          id: key
        }
      })

      const list = await Promise.all(dataArray)
      setLoading(false)

      return setQuizList(list.sort(({ createdAt: a }, { createdAt: b }) => (b || 20) - (a || 20)))
    })
  }, [])

  return (
    <MainWrapper>
      <Grid>
        {loading ? <Loader/> : quizList.map((item, index) => <ItemQuiz index={index} quiz={item}/>)}
      </Grid>
    </MainWrapper>
  )
}
export default QuizList