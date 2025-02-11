// @ts-nocheck 
import { Author, Container, CoverImage, Description, ItemWrapper, Link, Title } from "./styles"

interface QuizTypes {
  author: string
  authorHandle: string
  cardBackground: string
  dmcaNotice: boolean
  id: string
  quizDescription: string
  quizName: string
}

const ItemQuiz = ({ quiz, index }) => {
  const { author, authorHandle, cardBackground, dmcaNotice, id, quizDescription, quizName } = quiz
  const date = new Date(quiz.date).toLocaleString().split(",")[0]

  return (
    <ItemWrapper href={`/quiz/${id}`}>
      <Container>
        <Title>Day {index} - {date}</Title>
      </Container>
    </ItemWrapper>
  )
}
export default ItemQuiz
