import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div``;

export const Header = styled.header`
  padding: 32px 0; // em cima 32 e embaixo 0
  background: #28262E;
`;

export const HeaderContent = styled.div`
  max-width: 1120px;
  margin: 0 auto; // alinhar ao centro
  display: flex; // coloca os elementos um ao lado do outro.
  align-items: center; // coloca os elementos alinhado ao centro

  // estilizar somente a imagem de dentro do HeaderContent, utiliza o >
  > img {
    height: 80px;
  }

  button {
    margin-left: auto;
    background: transparent;
    border: 0;

    svg { // todo ícone no React é um svg.
      color: #999591;
      width: 20px;
      height: 20px;
    }
  }
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  margin-left: 80px;

  img{
    width: 56px;
    height: 56px;
    border-radius: 50%;
  }

  div {
    display: flex;
    flex-direction: column;
    margin-left: 16px;
    line-height: 24px;

    span{
      color: #F4ede8;
    }

    a {
      text-decoration: none;
      color:#FF9000;

      &:hover {
        opacity:0.8;
      }
    }
  }
`;

export const Content = styled.main`
  max-width: 1120px;
  margin: 64px auto;
  display: flex; // coloca os elementos um ao lado do outro.

`;

export const Schedule = styled.div`
  flex: 1; // vai ocupar todo o espaço do Content menos o espaco do Calendar
  margin-right: 120px;

  h1 {
    font-size: 36px;
  }
  p {
    display: flex;
    align-items: center;
    margin-top: 8px;
    color: #ff9000;
    font-weight: 500;

    span{
      display: flex;
      align-items: center;
    }

    // vai aplicar estilo a partir do 2 span pra frente
    span + span::before { // before sempre precisa ter um content, senao nao aparece na tela
      content:'';
      width: 1px;
      height: 12px;
      background: #ff9900;
      margin: 0 8px;
    }
  }

`;


export const NextAppointment = styled.div`
  margin-top: 64px;

  > strong { // colocar o símbolo > para pegar apenas o primeiro strong
    color: #999591;
    font-size: 20px;
    font-weight: 400;
  }
  div{
    background: #3e3b47;
    display: flex;
    align-items: center;
    padding: 16px 24px; // 16px em baixo e em cima, esquerda e direita 24px
    border-radius: 10px;
    margin-top: 24px; // distanciar do texto acima
    position: relative; // usado por causa da borda esquerda do card.

    &::before{
      position: absolute;
      height: 80%;
      width: 1px;
      left: 0;
      top:10%;
      content:'';
      background: #ff9900;
    }

    img {
      width: 80px;
      height: 80px;
      border-radius:50%;
    }

    strong {
      margin-left: 24px;
      color: #fff;
    }

    span {
      margin-left: auto;
      display: flex;
      align-items: center; // alinhar o texto com o ícone
      color: #999591;

      svg {
        color:#ff9900;
        margin-right: 8px;
      }
    }
   }
`;

export const Section = styled.section`
  margin-top: 48px;

  > strong {
    color: #999591;
    font-size: 20px;
    line-height: 26px;
    border-bottom: 1px solid #3e3b47;
    display: block; // ocupa todo o tamnho da linha
    padding-bottom: 16px; // distanciar a borda do título
    margin-bottom: 16px;  // distanciar o conteudo da borda
  }
  p {
    color: #999591;
  }
`;

export const Appointment = styled.div`
  display: flex;
  align-items: center;

  // toda div que antes dela tiver um appoitment
  & + div {
    margin-top: 16px;
  }

  span {
    margin-left: auto;
    display: flex;
    align-items: center; // alinhar o texto com o ícone
    color: #F4ede8;
    width: 70px;;

    svg {
      color:#ff9900;
      margin-right: 8px;
    }
  }

  div {
    flex:1;
    background: #3e3b47;
    display: flex;
    align-items: center;
    padding: 16px 24px; // 16px em baixo e em cima, esquerda e direita 24px
    border-radius: 10px;
    margin-left: 24px; // distanciar do texto acima

    img {
      width: 56px;
      height: 56px;
      border-radius:50%;
    }

    strong {
      margin-left: 24px;
      color: #fff;
      font-size: 20px;;
    }
  }

`;
export const Calendar = styled.aside`
  width: 380px; // Ocupa 380pixeis do Content, o restante o Schedule que ocupa flax:1;
  .DayPicker {
    border-radius: 10px;
  }

  .DayPicker-wrapper {
    padding-bottom: 0;
    background: #3e3b47;
    border-radius: 10px;
  }

  .DayPicker,
  .DayPicker-Month {
    width: 100%;
  }

  .DayPicker-NavButton {
    color: #999591 !important;
  }

  .DayPicker-NavButton--prev {
    right: auto;
    left: 1.5em;
    margin-right: 0;
  }

  .DayPicker-Month {
    border-collapse: separate;
    border-spacing: 8px;
    margin: 16px 0 0 0;
    padding: 16px;
    background-color: #28262e;
    border-radius: 0 0 10px 10px;
  }

  .DayPicker-Caption {
    margin-bottom: 1em;
    padding: 0 1em;
    color: #f4ede8;

    > div {
      text-align: center;
    }
  }

  .DayPicker-Day {
    width: 40px;
    height: 40px;
  }

  .DayPicker-Day--available:not(.DayPicker-Day--outside) {
    background: #3e3b47;
    border-radius: 10px;
    color: #fff;
  }

  .DayPicker:not(.DayPicker--interactionDisabled)
    .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
    background: ${shade(0.2, '#3e3b47')};
  }

  .DayPicker-Day--today {
    font-weight: normal;
  }

  .DayPicker-Day--disabled {
    color: #666360 !important;
    background: transparent !important;
  }

  .DayPicker-Day--selected {
    background: #ff9000 !important;
    border-radius: 10px;
    color: #232129 !important;
  }

`;

