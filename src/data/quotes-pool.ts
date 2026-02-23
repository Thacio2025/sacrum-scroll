import type { QuoteCard, ContentCategory } from "@/types/content";
import { DESERT_FATHERS_QUOTES } from "./desert-fathers";
import { SCRIPTURE_QUOTES } from "./scripture-quotes";
import { AUGUSTINE_QUOTES } from "./augustine-quotes";
import { THOMAS_AQUINAS_QUOTES } from "./thomas-aquinas-quotes";
import { PASSION_QUOTES } from "./passion-quotes";

/**
 * Quando true, o feed usa APENAS Padres do Deserto; o resto das frases fica no código mas offline.
 * Mude para false para voltar a exibir todas as categorias.
 */
const USE_ONLY_DESERT_FATHERS = true;

/** Primeiras 20 frases do feed: sempre Padres do Deserto (usado quando USE_ONLY_DESERT_FATHERS é false). */
const FIRST_20_DESERT = DESERT_FATHERS_QUOTES.slice(0, 20);

/**
 * Pool de citações para rolagem infinita.
 * Estrutura: [20 Padres do Deserto] + [variado: DF, Escritura, Agostinho, Tomás, liturgia, mística, etc.]
 * Cada índice do feed usa getQuoteAtIndex(i): o texto vem do pool (ciclo),
 * o id é único (q-0, q-1, ...) para imagens diferentes a cada card.
 */
const REST_POOL: Omit<QuoteCard, "id">[] = [
  // Patrística
  { category: "patristic", author: "Santo Agostinho", source: "Confissões", text: "Inquietum est cor nostrum, donec requiescat in te." },
  { category: "patristic", author: "São João Crisóstomo", source: "Homilias", text: "A oração é a luz da alma, o verdadeiro conhecimento de Deus." },
  { category: "patristic", author: "Santo Agostinho", source: "A Cidade de Deus", text: "Ama e faze o que quiseres." },
  { category: "patristic", author: "São João Crisóstomo", source: "Sobre o Sacerdócio", text: "A mesa do Senhor é o lugar onde os anjos servem e onde Cristo se oferece em alimento." },
  { category: "patristic", author: "Santo Agostinho", source: "Confissões", text: "Tarde te amei, Beleza tão antiga e tão nova." },
  { category: "patristic", author: "São Gregório Magno", source: "Regra Pastoral", text: "O pregador deve fazer primeiro no seu coração o que depois ensina aos outros." },
  { category: "patristic", author: "Santo Agostinho", source: "Sermões", text: "Nós somos os tempos: tal como somos, tais são os tempos." },
  { category: "patristic", author: "São Basílio Magno", source: "Regras", text: "A oração é a fortaleza da alma." },
  { category: "patristic", author: "Santo Ambrósio", source: "Sobre os deveres", text: "Não é a duração da vida que importa, mas a doação da vida." },
  { category: "patristic", author: "São Jerônimo", source: "Cartas", text: "Ignorar as Escrituras é ignorar Cristo." },
  { category: "patristic", author: "Santo Agostinho", source: "Confissões", text: "Fizeste-nos para Ti, Senhor, e inquieto está o nosso coração até que descanse em Ti." },
  { category: "patristic", author: "São João Crisóstomo", source: "Homilias", text: "Não há nada mais frio que um cristão que não se preocupa com a salvação dos outros." },
  { category: "patristic", author: "Santo Irineu", source: "Contra as heresias", text: "A glória de Deus é o homem vivo; e a vida do homem é a visão de Deus." },
  { category: "patristic", author: "São Cipriano", source: "Sobre a unidade", text: "Quem não tem a Igreja por mãe não pode ter Deus por Pai." },
  { category: "patristic", author: "Santo Agostinho", source: "Sermões", text: "A esperança tem duas filhas lindas: a indignação e a coragem." },
  { category: "patristic", author: "São João Damasceno", source: "Fé ortodoxa", text: "Não conheço o que não posso colocar em palavras." },
  { category: "patristic", author: "Tertuliano", source: "Apologético", text: "O sangue dos mártires é semente de cristãos." },
  { category: "patristic", author: "Santo Agostinho", source: "Enchiridion", text: "Crê e terás comido." },
  { category: "patristic", author: "São Gregório de Nissa", source: "Vida de Moisés", text: "A perfeição consiste em nunca parar de crescer no bem." },
  { category: "patristic", author: "São João Crisóstomo", source: "Homilias", text: "A paciência é a rainha das virtudes." },
  // Escolástica
  { category: "scholastic", author: "São Tomás de Aquino", source: "Suma Teológica", text: "A graça não destrói a natureza, mas a aperfeiçoa." },
  { category: "scholastic", author: "São Tomás de Aquino", source: "Suma Teológica", text: "A fé busca o entendimento; a caridade busca o repouso em Deus." },
  { category: "scholastic", author: "São Tomás de Aquino", source: "Suma contra os gentios", text: "O que não é verdadeiro não pode ser de Deus." },
  { category: "scholastic", author: "São Tomás de Aquino", source: "Suma Teológica", text: "A lei é uma ordenação da razão para o bem comum." },
  { category: "scholastic", author: "São Tomás de Aquino", source: "Opúsculos", text: "A verdade é a conformidade do intelecto com a realidade." },
  { category: "scholastic", author: "Santo Anselmo", source: "Proslogion", text: "Fides quaerens intellectum — a fé que busca o entendimento." },
  { category: "scholastic", author: "São Tomás de Aquino", source: "Suma Teológica", text: "A misericórdia sem a justiça é mãe da dissolução; a justiça sem a misericórdia é crueldade." },
  { category: "scholastic", author: "São Boaventura", source: "Itinerário da mente a Deus", text: "Quem não queima não ilumina." },
  { category: "scholastic", author: "São Tomás de Aquino", source: "Suma Teológica", text: "O bem é aquilo que todos desejam." },
  { category: "scholastic", author: "Duns Escoto", source: "Opus Oxoniense", text: "Deus ama primeiro; o nosso amor é resposta." },
  { category: "scholastic", author: "São Tomás de Aquino", source: "Suma Teológica", text: "A paz é a tranquilidade da ordem." },
  { category: "scholastic", author: "Santo Alberto Magno", source: "Comentários", text: "A ciência não diminui a maravilha; a aumenta." },
  { category: "scholastic", author: "São Tomás de Aquino", source: "Suma Teológica", text: "A caridade é a forma de todas as virtudes." },
  { category: "scholastic", author: "São Boaventura", source: "Breviloquium", text: "A humildade é a raiz de toda santidade." },
  { category: "scholastic", author: "São Tomás de Aquino", source: "Suma Teológica", text: "O amor deve ser ordenado: primeiro a Deus, depois ao próximo." },
  { category: "scholastic", author: "Santo Anselmo", source: "Cur Deus homo", text: "Não busco entender para crer; creio para entender." },
  { category: "scholastic", author: "São Tomás de Aquino", source: "Suma Teológica", text: "A contemplação é o fim da vida ativa." },
  { category: "scholastic", author: "São Tomás de Aquino", source: "Opúsculos", text: "A alma é forma do corpo." },
  { category: "scholastic", author: "São Boaventura", source: "Itinerário", text: "O homem é feito para a eternidade." },
  { category: "scholastic", author: "São Tomás de Aquino", source: "Suma Teológica", text: "A felicidade consiste na visão de Deus." },
  // Mística
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "O Castelo Interior", text: "Nada te perturbe, nada te espante; quem a Deus tem nada lhe falta. Só Deus basta." },
  { category: "mystic", author: "São João da Cruz", source: "Subida do Monte Carmelo", text: "Onde não há amor, ponde amor e colhereis amor." },
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "Caminho de Perfeição", text: "A oração mental é um íntimo trato de amizade com Aquele que sabemos que nos ama." },
  { category: "mystic", author: "São João da Cruz", source: "Noite escura", text: "Na noite escura, com ânsias em amores inflamada, oh dichosa ventura!" },
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "O Castelo Interior", text: "O Senhor não olha tanto a grandeza das nossas obras quanto o amor com que as fazemos." },
  { category: "mystic", author: "São João da Cruz", source: "Cântico espiritual", text: "A alma que anda em amor nem cansa nem se cansa." },
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "Vida", text: "Quem a Deus tem nada lhe falta; só Deus basta." },
  { category: "mystic", author: "São João da Cruz", source: "Ditos de luz e amor", text: "No fim do dia serás julgado no amor." },
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "O Castelo Interior", text: "A oração é a porta por onde entram as grandes mercês." },
  { category: "mystic", author: "São João da Cruz", source: "Subida do Monte Carmelo", text: "Para chegar ao que não sabes, tens de ir por onde não sabes." },
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "Caminho de Perfeição", text: "Paciência e que tudo alcance." },
  { category: "mystic", author: "São João da Cruz", source: "Noite escura", text: "Deixai-me já e descanse quem em nada se ocupa." },
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "O Castelo Interior", text: "Deus e a alma são dois amigos que se tratam de amizade." },
  { category: "mystic", author: "São João da Cruz", source: "Cântico espiritual", text: "A solidão do amado é a companhia do Amado." },
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "Vida", text: "A oração é um segredo entre a alma e Deus." },
  { category: "mystic", author: "São João da Cruz", source: "Ditos de luz e amor", text: "O que mais cansa é não amar." },
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "O Castelo Interior", text: "A humildade é a base de todo o edifício espiritual." },
  { category: "mystic", author: "São João da Cruz", source: "Subida do Monte Carmelo", text: "O que não é para a glória de Deus, despreza-o." },
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "Caminho de Perfeição", text: "O Senhor nunca falha aos que O buscam de verdade." },
  { category: "mystic", author: "São João da Cruz", source: "Cântico espiritual", text: "A alma que em Deus está escondida vive em segurança." },
  // Liturgia
  { category: "liturgy", author: "Missal Romano", source: "Oração do Dia", text: "Concedei-nos, ó Deus todo-poderoso, que, celebrando a festa da Virgem Santa Maria, possamos, por sua intercessão, receber a vossa misericórdia." },
  { category: "liturgy", author: "Liturgia das Horas", source: "Laudes", text: "Ó Deus, vinde em meu auxílio; Senhor, apressai-vos em socorrer-me." },
  { category: "liturgy", author: "Missal Romano", source: "Prefácio", text: "Verdadeiramente é justo e necessário dar-Vos graças, Senhor, santo Pai." },
  { category: "liturgy", author: "Liturgia das Horas", source: "Completas", text: "Protegei-nos, Senhor, enquanto velamos; guardai-nos enquanto dormimos." },
  { category: "liturgy", author: "Missal Romano", source: "Oração Eucarística", text: "Tomai e comei: isto é o meu Corpo. Tomai e bebei: este é o Cálice do meu Sangue." },
  { category: "liturgy", author: "Liturgia das Horas", source: "Vésperas", text: "Ó luz que na aurora refulge, verdadeiro esplendor do Pai." },
  { category: "liturgy", author: "Missal Romano", source: "Rito da Paz", text: "A paz do Senhor esteja sempre convosco." },
  { category: "liturgy", author: "Liturgia das Horas", source: "Invitatório", text: "Senhor, abri os meus lábios e a minha boca anunciará o vosso louvor." },
  { category: "liturgy", author: "Missal Romano", source: "Ato Penitencial", text: "Confesso a Deus todo-poderoso e a vós, irmãos, que pequei muitas vezes." },
  { category: "liturgy", author: "Liturgia das Horas", source: "Hino", text: "Cristo é a luz das nações; glória do povo de Israel." },
  { category: "liturgy", author: "Missal Romano", source: "Oração dos Fiéis", text: "Ouvi, Senhor, a oração do vosso povo." },
  { category: "liturgy", author: "Liturgia das Horas", source: "Antífona", text: "Maria guardava todas estas coisas, meditando-as em seu coração." },
  { category: "liturgy", author: "Missal Romano", source: "Doxologia", text: "Por Cristo, com Cristo e em Cristo, a Vós, Deus Pai todo-poderoso." },
  { category: "liturgy", author: "Liturgia das Horas", source: "Benedictus", text: "Bendito o Senhor, Deus de Israel, que a seu povo visitou e redimiu." },
  { category: "liturgy", author: "Missal Romano", source: "Consagração", text: "Fazei isto em memória de mim." },
  { category: "liturgy", author: "Liturgia das Horas", source: "Magnificat", text: "A minha alma glorifica o Senhor e o meu espírito se alegra em Deus, meu Salvador." },
  { category: "liturgy", author: "Missal Romano", source: "Oração do Dia", text: "Ó Deus, que na vossa misericórdia incansável olhais as fragilidades humanas, fortalecei-nos." },
  { category: "liturgy", author: "Liturgia das Horas", source: "Nunc dimittis", text: "Agora, Senhor, segundo a vossa palavra, deixai o vosso servo ir em paz." },
  { category: "liturgy", author: "Missal Romano", source: "Rito da Comunhão", text: "Cordeiro de Deus, que tirais o pecado do mundo, tende piedade de nós." },
  { category: "liturgy", author: "Liturgia das Horas", source: "Salmo", text: "O Senhor é meu pastor; nada me faltará." },
  // Mais Patrística
  { category: "patristic", author: "Santo Agostinho", source: "Confissões", text: "Dai-me castidade e continência, mas não ainda." },
  { category: "patristic", author: "São João Crisóstomo", source: "Homilias", text: "A esmola é a rainha que faz as virtudes acompanharem-na." },
  { category: "patristic", author: "Santo Agostinho", source: "Sermões", text: "Cantai com a voz, cantai com o coração, cantai com a vida." },
  { category: "patristic", author: "São Gregório Magno", source: "Diálogos", text: "Não deixes que a tristeza te vença; a alegria do Senhor é a nossa força." },
  { category: "patristic", author: "Santo Agostinho", source: "A Trindade", text: "Ama e faz o que quiseres." },
  { category: "patristic", author: "São Basílio Magno", source: "Hexaêmeron", text: "O mundo é uma escola da alma." },
  { category: "patristic", author: "Santo Ambrósio", source: "Sobre a virgindade", text: "A virgem é a flor da Igreja." },
  { category: "patristic", author: "São Jerônimo", source: "Cartas", text: "O ignorante das Escrituras é ignorante de Cristo." },
  { category: "patristic", author: "Santo Agostinho", source: "Confissões", text: "Tu nos fizeste para Ti, Senhor, e o nosso coração está inquieto até repousar em Ti." },
  { category: "patristic", author: "São João Crisóstomo", source: "Homilias sobre Mateus", text: "A oração é a raiz, a fonte e a mãe de mil bens." },
  { category: "patristic", author: "Santo Irineu", source: "Contra as heresias", text: "O que não foi assumido não foi curado." },
  { category: "patristic", author: "São Cipriano", source: "Cartas", text: "Não pode ter Deus por Pai quem não tem a Igreja por Mãe." },
  { category: "patristic", author: "Santo Agostinho", source: "Comentário ao Evangelho de João", text: "Ama e faz o que quiseres: se calas, calarás por amor; se falas, falarás por amor." },
  { category: "patristic", author: "São Gregório de Nissa", source: "A vida de Moisés", text: "A contemplação de Deus é o fim de todos os nossos desejos." },
  { category: "patristic", author: "São João Damasceno", source: "Exposição da fé ortodoxa", text: "Não podemos nomear a essência de Deus; podemos nomear o que não é." },
  { category: "patristic", author: "Tertuliano", source: "Do batismo", text: "Nascemos na água para viver na água." },
  { category: "patristic", author: "Santo Agostinho", source: "Enchiridion", text: "Crê e terás comido; a fé é o princípio do banquete." },
  { category: "patristic", author: "São Gregório de Nissa", source: "Homilias", text: "A oração é a conversa da alma com Deus." },
  { category: "patristic", author: "São João Crisóstomo", source: "Homilias", text: "A paciência é a raiz de todas as virtudes." },
  { category: "patristic", author: "Santo Agostinho", source: "Sermões", text: "O que somos é o que damos; o que guardamos perdemos." },
  // Mais Escolástica
  { category: "scholastic", author: "São Tomás de Aquino", source: "Suma Teológica", text: "A caridade é a forma de todas as virtudes." },
  { category: "scholastic", author: "Santo Anselmo", source: "Proslogion", text: "Creio para entender; não entendo para crer." },
  { category: "scholastic", author: "São Tomás de Aquino", source: "Suma Teológica", text: "A contemplação é o repouso na verdade." },
  { category: "scholastic", author: "São Boaventura", source: "Itinerário", text: "Quem não arde não ilumina." },
  { category: "scholastic", author: "São Tomás de Aquino", source: "Suma contra os gentios", text: "O que é verdadeiro vem de Deus." },
  { category: "scholastic", author: "Duns Escoto", source: "Opus Oxoniense", text: "O amor de Deus é anterior ao nosso." },
  { category: "scholastic", author: "São Tomás de Aquino", source: "Suma Teológica", text: "A paz é o efeito da caridade." },
  { category: "scholastic", author: "Santo Alberto Magno", source: "Comentários", text: "A maravilha é o princípio da filosofia." },
  { category: "scholastic", author: "São Tomás de Aquino", source: "Suma Teológica", text: "A humildade é a base do edifício espiritual." },
  { category: "scholastic", author: "São Boaventura", source: "Breviloquium", text: "A humildade é a raiz de toda perfeição." },
  { category: "scholastic", author: "São Tomás de Aquino", source: "Suma Teológica", text: "O amor ordena todas as coisas." },
  { category: "scholastic", author: "Santo Anselmo", source: "Cur Deus homo", text: "Creio para poder entender." },
  { category: "scholastic", author: "São Tomás de Aquino", source: "Suma Teológica", text: "A vida ativa serve à contemplativa." },
  { category: "scholastic", author: "São Tomás de Aquino", source: "Opúsculos", text: "A alma informa o corpo." },
  { category: "scholastic", author: "São Boaventura", source: "Itinerário", text: "O homem é feito para ver a Deus." },
  { category: "scholastic", author: "São Tomás de Aquino", source: "Suma Teológica", text: "A beatitude consiste na visão de Deus." },
  { category: "scholastic", author: "São Tomás de Aquino", source: "Suma Teológica", text: "A lei eterna é a razão divina." },
  { category: "scholastic", author: "São Tomás de Aquino", source: "Suma Teológica", text: "A graça supõe a natureza." },
  { category: "scholastic", author: "São Boaventura", source: "Comentários", text: "Toda verdade vem do Espírito Santo." },
  { category: "scholastic", author: "São Tomás de Aquino", source: "Suma Teológica", text: "O bem se comunica." },
  // Mais Mística
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "O Castelo Interior", text: "O Senhor não olha a grandeza das obras, mas o amor com que se fazem." },
  { category: "mystic", author: "São João da Cruz", source: "Cântico espiritual", text: "Quem a Deus tem nada lhe falta." },
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "Vida", text: "A oração é um íntimo trato de amizade." },
  { category: "mystic", author: "São João da Cruz", source: "Noite escura", text: "Na noite escura, com ânsias de amor inflamada." },
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "Caminho de Perfeição", text: "Paciência e alcançar tudo." },
  { category: "mystic", author: "São João da Cruz", source: "Ditos de luz e amor", text: "No fim serás julgado no amor." },
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "O Castelo Interior", text: "A oração é a porta das mercês." },
  { category: "mystic", author: "São João da Cruz", source: "Subida do Monte Carmelo", text: "Para chegar ao que não sabes, vai por onde não sabes." },
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "Vida", text: "Só Deus basta." },
  { category: "mystic", author: "São João da Cruz", source: "Cântico espiritual", text: "A alma que anda em amor nem cansa nem se cansa." },
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "O Castelo Interior", text: "Deus e a alma são dois amigos." },
  { category: "mystic", author: "São João da Cruz", source: "Noite escura", text: "Deixai-me já e descanse quem em nada se ocupa." },
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "Caminho de Perfeição", text: "O Senhor nunca falha a quem O busca." },
  { category: "mystic", author: "São João da Cruz", source: "Ditos de luz e amor", text: "O que mais cansa é não amar." },
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "O Castelo Interior", text: "A humildade é a base de todo o castelo." },
  { category: "mystic", author: "São João da Cruz", source: "Subida do Monte Carmelo", text: "Despreza o que não é para a glória de Deus." },
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "Vida", text: "A oração mental é trato de amizade com Deus." },
  { category: "mystic", author: "São João da Cruz", source: "Cântico espiritual", text: "A solidão do amado é a companhia do Amado." },
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "Caminho de Perfeição", text: "Quem a Deus tem nada lhe falta. Só Deus basta." },
  { category: "mystic", author: "São João da Cruz", source: "Ditos de luz e amor", text: "Onde não há amor, ponde amor." },
  // Mais Liturgia
  { category: "liturgy", author: "Missal Romano", source: "Oração Eucarística", text: "Em memória de mim." },
  { category: "liturgy", author: "Liturgia das Horas", source: "Laudes", text: "Senhor, abri os meus lábios." },
  { category: "liturgy", author: "Missal Romano", source: "Prefácio", text: "É verdadeiramente justo e necessário dar-Vos graças." },
  { category: "liturgy", author: "Liturgia das Horas", source: "Completas", text: "Protegei-nos, Senhor, enquanto velamos." },
  { category: "liturgy", author: "Missal Romano", source: "Rito da Paz", text: "A paz do Senhor esteja sempre convosco." },
  { category: "liturgy", author: "Liturgia das Horas", source: "Vésperas", text: "Ó luz que na aurora refulge." },
  { category: "liturgy", author: "Missal Romano", source: "Ato Penitencial", text: "Confesso a Deus todo-poderoso que pequei." },
  { category: "liturgy", author: "Liturgia das Horas", source: "Benedictus", text: "Bendito o Senhor, Deus de Israel." },
  { category: "liturgy", author: "Missal Romano", source: "Oração do Dia", text: "Ó Deus, fortalecei-nos na vossa misericórdia." },
  { category: "liturgy", author: "Liturgia das Horas", source: "Magnificat", text: "A minha alma glorifica o Senhor." },
  { category: "liturgy", author: "Missal Romano", source: "Rito da Comunhão", text: "Cordeiro de Deus, tende piedade de nós." },
  { category: "liturgy", author: "Liturgia das Horas", source: "Nunc dimittis", text: "Agora, Senhor, deixai o vosso servo ir em paz." },
  { category: "liturgy", author: "Missal Romano", source: "Doxologia", text: "Por Cristo, com Cristo e em Cristo." },
  { category: "liturgy", author: "Liturgia das Horas", source: "Salmo", text: "O Senhor é meu pastor." },
  { category: "liturgy", author: "Missal Romano", source: "Oração dos Fiéis", text: "Ouvi, Senhor, a oração do vosso povo." },
  { category: "liturgy", author: "Liturgia das Horas", source: "Antífona", text: "Maria guardava todas estas coisas em seu coração." },
  { category: "liturgy", author: "Missal Romano", source: "Consagração", text: "Isto é o meu Corpo; este é o Cálice do meu Sangue." },
  { category: "liturgy", author: "Liturgia das Horas", source: "Invitatório", text: "A minha boca anunciará o vosso louvor." },
  { category: "liturgy", author: "Missal Romano", source: "Oração do Dia", text: "Concedei-nos, ó Deus, a vossa misericórdia." },
  { category: "liturgy", author: "Liturgia das Horas", source: "Hino", text: "Cristo é a luz das nações." },
];

/** Resto variado: Padres do Deserto (21+) + Escritura + Agostinho + Tomás + Paixão + outros. (Offline quando USE_ONLY_DESERT_FATHERS.) */
const VARIED_POOL: Omit<QuoteCard, "id">[] = [
  ...DESERT_FATHERS_QUOTES.slice(20),
  ...SCRIPTURE_QUOTES,
  ...AUGUSTINE_QUOTES,
  ...THOMAS_AQUINAS_QUOTES,
  ...PASSION_QUOTES,
  ...REST_POOL,
];

/** Pool completo quando USE_ONLY_DESERT_FATHERS é false: primeiras 20 Padres do Deserto + pool variado */
const FULL_POOL: Omit<QuoteCard, "id">[] = [
  ...FIRST_20_DESERT,
  ...VARIED_POOL,
];

/** Pool ativo no feed: só Padres do Deserto ou pool completo, conforme a flag. */
const POOL: Omit<QuoteCard, "id">[] = USE_ONLY_DESERT_FATHERS
  ? [...DESERT_FATHERS_QUOTES]
  : FULL_POOL;

// Exportar REST_POOL para uso em authors.ts
export { REST_POOL };

export const POOL_SIZE = POOL.length;

export function getQuoteAtIndex(index: number): QuoteCard {
  const entry = POOL[index % POOL_SIZE]!;
  return {
    ...entry,
    id: `q-${index}`,
  };
}

/** Índices no POOL por categoria (para filtro). */
const FILTERED_INDICES: Record<ContentCategory, number[]> = (() => {
  const out: Record<string, number[]> = {
    patristic: [],
    scholastic: [],
    mystic: [],
    liturgy: [],
    scripture: [],
  };
  POOL.forEach((entry, i) => {
    const arr = out[entry.category];
    if (arr) arr.push(i);
  });
  return out as Record<ContentCategory, number[]>;
})();

/** Tipo de filtro do feed: categorias + "all". */
export type FilterCategory = ContentCategory | "all";

/**
 * Retorna a citação na posição index do feed filtrado por categoria.
 * Se category === "all", equivale a getQuoteAtIndex(index).
 */
export function getFilteredQuoteAtIndex(
  category: FilterCategory,
  index: number
): QuoteCard {
  if (category === "all") return getQuoteAtIndex(index);
  const indices = FILTERED_INDICES[category];
  if (!indices.length) return getQuoteAtIndex(index);
  const poolIndex = indices[index % indices.length]!;
  const entry = POOL[poolIndex]!;
  return {
    ...entry,
    id: `q-${category}-${index}`,
  };
}
