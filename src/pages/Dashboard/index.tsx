// -----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react';
import { isToday, format, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar,
} from './styles';
import logoImg from '../../assets/logo.svg';
import { FiClock, FiPower } from 'react-icons/fi';
import { useAuth } from '../../hooks/auth';
import { useCallback } from 'react';
import api from '../../services/api';
import { useMemo } from 'react';
import { parseISO } from 'date-fns/esm';
import { Link } from 'react-router-dom';

// -----------------------------------------------------------------------------
interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  }
}
// NOTA REACT
// vai executar alguma coisa assim que o valor de algo mudar.
// todos os Hooks são baseado nessa regra a diferença está na ação:
// useEffect - vai executar a função
// useCallback - vai retornar uma função
// useMemo - vai retornar um valor.

// -----------------------------------------------------------------------------
const Dashboard: React.FC = () => {

  const { signOut, user } = useAuth(); // useAuth()-  busca os dados do usuário logado.

  // estado para armazenar o dia selecionado.
  const [selectedDate, setSelectedDate] = useState(new Date());

  // estado para armazenar o mês selecionado.
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // estado para armazenar o resposta da chamada da api.
  const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);

  // estado para armazenar os agendamentos retornados da chamada da api.
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  /* lembrete:
  // utilizar useCallback sempre que for fazer uma função dentro de um componente
  // Armazena o dia selecionado.
  // Como não está sendo passado o parametro para a função ,[]); esta informação
  // vai ser carregada apenas uma unica vez.
  */
  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  // armazena o mês selecionado.
  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  /* Lembrete:
  //useEffect() - permite disparar uma função toda vez que
  // uma variável é alterada. Para isso utilizar esta variável passando-a
  // como parâmetro. A função no caso é ir até a API e buscar a disponibilidade dos dias
  // do mês selecionado [currentMonth].*/

  useEffect(() => {
    api.get(`/providers/${user.id}/month-availability`, {
      params: {
        year: currentMonth.getFullYear(),
        month: currentMonth.getMonth() + 1,
      }
    }).then(response => {
      setMonthAvailability(response.data);
    });
  }, [currentMonth, user.id]);

  // criar um useEffect para carregar os agendamentos
  // toda vez que o usuario selecionar um dia no calendario
  useEffect(() => {
    api.get<Appointment[]>('/appointments/me', {
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate(),
      }
    }).then(response => {
      const appointmentsFormatted = response.data.map(appointment => {
        return {
          ...appointment,
          hourFormatted: format(parseISO(appointment.date), 'HH:mm'),
        }
      });
      setAppointments(appointmentsFormatted);
    });
  }, [selectedDate]);

  /* NOTA IMPORTANTE DENTRO DO REACT
  // Nunca vamos criar varíaveis ou manipular valores, como uma variável normal
  // em tempo de renderização, nunca vou formatar valores ou criar novas variáveis
  // dentro do return por exemplo.
  // O REACT toda vez que ele tem uma alteração, um estado alterado,
  // um contexto alterado, qualquer coisa alterada dentro dele (REACT)
  // ele provoca uma nova RENDERIZAÇÃO. Esse fluxo de renderização vai carregar
  // novamente tudo que existe dentro do componente, entao tudo que está dentro
  // do return, ele vai ser carregado do zero, e por fim se tiver qualquer tipo
  // de calculo dentro do return, vai ser recalculado do zero.
  // Para isso o REACT nos fornece as funções chamadas Hooks, que começam com
  // o prefixo use (useCallback) isso serve exatamente para que alguma coisa seja
  // recarregada de forma desnecessária.
  // Para criar uma variável que não seja recarregada, utilizar o useMemo.
  // useMemo() - Serve para memoriazar um valor específico, uma formatação, alguma coisa assim
  // e eu possa informar quando esse valor possa ser recarregado.
  */

  /*  Calcular os dias desabilitados a partir de 2 variaveis, o MES e ANO atual
  passsa as variaveis [currentMonth, monthAvailability] como parâmetro
  somente quando alguma dessas variaveis alterarem seu valor,
  aí sim dispara a função para recarregar os dias desabilitados.
  */
  const disableDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => monthDay.available === false)
      .map(monthDay => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        return new Date(year, month, monthDay.day);
      });

    return dates;

  }, [currentMonth, monthAvailability]);

  // variável selectDateAsText armazena o texto do dia e mes selecionado.
  // ex: Dia 28 de julho
  // recalcular toda ves que a variavel selectedDate mudar
  const selectDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBR,
    });
  }, [selectedDate]);

  // variavel selectWeekDay armazena o texo do dia da semana selecionado
  // ex: quarta-feira
  // recalcular toda ves que a variavel selectedDate mudar.
  const selectWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', {
      locale: ptBR,
    });
  }, [selectedDate]);

  // manipular a informação retornada pela API, criar os agendamentos da manha
  // deve ser recalculado toda vez que a variável appointments mudar o valor.
  const morningAppointment = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12;
    })
  }, [appointments]);

  // manipular a informação retornada pela API, criar os agendamentos da tarde
  // deve ser recalculado toda vez que a variável appointments mudar o valor.
  const afternoonAppointment = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12;
    })
  }, [appointments]);

  // proximo agendamento
  const nextAppointment = useMemo(() => {
    return appointments.find(appointment =>
      isAfter(parseISO(appointment.date), new Date()),
    );
  }, [appointments]);


  return (
    <Container>

      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />
          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem vindo,</span>
              <Link to="/profile"><strong>{user.name}</strong></Link>
            </div>
          </Profile>
          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectDateAsText}</span>
            <span>{selectWeekDay}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir</strong>
              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name} />
                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointment>
          )}


          <Section>
            <strong>Manhã</strong>
            {morningAppointment.length === 0 && (
              <p>Nenhum agendamento neste período.</p>
            )}
            {morningAppointment.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>
                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name} />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
            <strong>Tarde</strong>
            {afternoonAppointment.length === 0 && (
              <p>Nenhum agendamento neste período.</p>
            )}
            {afternoonAppointment.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>
                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name} />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>


        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disableDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onMonthChange={handleMonthChange}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro'
            ]}
          />
        </Calendar>
      </Content>


    </Container >
  );
};

export default Dashboard;
