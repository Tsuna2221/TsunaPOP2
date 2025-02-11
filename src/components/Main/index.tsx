// @ts-nocheck 

import { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import { socket } from '../../config/socket';

import { Main as MainWrapper, Grid, Count, Container, Title, Description, InputRange, ChannelForm, ChannelInput, ChannelSubmit } from "./styles"
import ItemGuess from "../ItemGuess";

import Loader from '../Loader';
import { QuizContext } from '../context/QuizContext';


const Main = () => {
  const { setVolume, volume, quiz, loading } = useContext(QuizContext)
  const [count, setCount] = useState<number>(0)
  const [time, setTime] = useState(0);

  const addCount = () => setCount(count + 1)

  const minutes = Math.floor((time % 360000) / 6000);
  const seconds = Math.floor((time % 6000) / 100);

  return (
    <MainWrapper>
      <Grid>
        {
          loading ? <Loader/> : 
          <>
            <Container>
              <Count>{count}/{quiz.items.length}</Count>
              <Title>{quiz.quizName}</Title>
              <Description>{quiz.quizDescription} por: {quiz.author}</Description>
              <Count>{minutes.toString().padStart(2, "0")}:
                {seconds.toString().padStart(2, "0")}
              </Count>

            </Container>
            { quiz.quizItems.map((item, index) => <ItemGuess key={item.id} index={index} addCount={addCount} cardBackground={quiz.cardBackground} quizItem={item}/>) }
            <InputRange onChange={({ target: { value } }) => setVolume(parseInt(value))} value={volume} min={0} max={100} type="range" />
          </>
        }
      </Grid>
    </MainWrapper>
  )
}

export default Main
