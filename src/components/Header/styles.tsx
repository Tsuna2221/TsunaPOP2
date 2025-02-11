import styled from "styled-components"

export const MainHeader = styled.header`
  width: 100%;
  height: 80px;
  padding: 0 75px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #48485e;
  margin-bottom: 50px;

  h1{
    color: #fff;
  }
`

export const Anchor = styled.a`
  font-size: 16px;
  color: #fff;
  text-decoration: none;
  margin-left: 32px;

  &:hover{
    text-decoration: underline;
  }
`

