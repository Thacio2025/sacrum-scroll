/**
 * Trechos curtos sobre a Paixão de Cristo.
 * Padres da Igreja, místicos, santos e liturgia.
 */

import type { QuoteCard } from "@/types/content";

export const PASSION_QUOTES: Omit<QuoteCard, "id">[] = [
  // Padres e doutores
  { category: "patristic", author: "Santo Agostinho", source: "Sermões", text: "Na Cruz, Cristo mostrou quanto nos amou: deu a vida por nós." },
  { category: "patristic", author: "Santo Agostinho", source: "Comentário ao Evangelho de João", text: "O Senhor criou o universo; na Cruz redimiu o que havia caído." },
  { category: "patristic", author: "São João Crisóstomo", source: "Homilias sobre a Cruz", text: "A Cruz é a glória de Cristo e a prova do seu amor sem medida." },
  { category: "patristic", author: "São João Crisóstomo", source: "Homilias", text: "Não há maior amor que dar a vida pelos amigos; e Ele a deu na Cruz." },
  { category: "patristic", author: "Santo Agostinho", source: "Sermões", text: "Pelo madeiro da Cruz fomos curados do madeiro do paraíso." },
  { category: "patristic", author: "São Gregório Magno", source: "Homilias sobre os Evangelhos", text: "O Redentor sofreu para que nós não pereçamos; morreu para nos dar a vida." },
  { category: "patristic", author: "Santo Ambrósio", source: "Sobre a fé", text: "A Cruz é o troféu da vitória sobre a morte." },
  { category: "patristic", author: "São Leão Magno", source: "Sermões", text: "Quem não toma a sua cruz e não segue Cristo não é digno d'Ele." },
  { category: "patristic", author: "Santo Agostinho", source: "Sermões", text: "Na Paixão, Cristo carregou o que era nosso para nos dar o que era seu." },
  { category: "patristic", author: "São João Damasceno", source: "Fé ortodoxa", text: "Pela Cruz a morte foi morta e a vida nos foi devolvida." },
  // Escolástica
  { category: "scholastic", author: "São Tomás de Aquino", source: "Suma Teológica", text: "Cristo sofreu por nós para nos dar o exemplo e para nos resgatar do pecado." },
  { category: "scholastic", author: "São Boaventura", source: "A árvore da vida", text: "Contempla o que sofreu por ti na Cruz; e não queiras outra recompensa que não seja amá-Lo." },
  { category: "scholastic", author: "Santo Anselmo", source: "Cur Deus homo", text: "Deus fez-se homem para que o Homem pudesse ser salvo pela Paixão do Filho." },
  { category: "scholastic", author: "São Tomás de Aquino", source: "Opúsculos", text: "O sofrimento de Cristo na Cruz foi o preço da nossa redenção." },
  { category: "scholastic", author: "São Boaventura", source: "Lignum vitae", text: "Quem medita na Paixão aprende a sofrer com paciência e a amar sem medida." },
  // Mística
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "Caminho de Perfeição", text: "Considerai o que sofreu por nós na Cruz; e vereis que nenhum trabalho é demais." },
  { category: "mystic", author: "São João da Cruz", source: "Ditos de luz e amor", text: "Quem não busca a Cruz de Cristo não busca a glória de Cristo." },
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "Vida", text: "Quando penso no que o Senhor padeceu por nós, todo o sofrimento me parece pouco." },
  { category: "mystic", author: "São João da Cruz", source: "Subida do Monte Carmelo", text: "A alma que ama a Cruz encontra nela descanso e luz." },
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "O Castelo Interior", text: "Olhai para Jesus crucificado; d'Ele virá a força para não desanimar." },
  { category: "mystic", author: "Santa Ângela de Foligno", source: "Memorial", text: "Na Paixão de Cristo está o amor mais puro; quem a medita é transformado." },
  { category: "mystic", author: "São João da Cruz", source: "Cântico espiritual", text: "O Amado entregou-se na Cruz para que a alma pudesse unir-se a Ele." },
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "Caminho de Perfeição", text: "A Cruz é a escada pela qual subimos ao céu." },
  { category: "mystic", author: "São João da Cruz", source: "Ditos de luz e amor", text: "Amar a Cruz é amar a Cristo; rejeitá-la é rejeitar o caminho da vida." },
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "Vida", text: "Nada há que console mais a alma que considerar a Paixão do Senhor." },
  // Santos e doutores (Paixão / Via-Sacra)
  { category: "patristic", author: "Santo Afonso Maria de Ligório", source: "Considerações sobre a Paixão", text: "Jesus sofreu na Cruz para nos mostrar que o amor vence a dor." },
  { category: "patristic", author: "Santo Afonso Maria de Ligório", source: "Considerações sobre a Paixão", text: "Cada gota de sangue de Cristo foi derramada por amor a cada alma." },
  { category: "patristic", author: "São Bernardo de Claraval", source: "Sermões", text: "Na Cruz, o Amor foi crucificado; e na Cruz nos foi dado o perdão." },
  { category: "patristic", author: "São Bernardo de Claraval", source: "Sermões sobre o Cântico", text: "Quem contempla a Paixão aprende a sofrer e a amar como Cristo." },
  { category: "scholastic", author: "São Boaventura", source: "A árvore da vida", text: "O Coração de Jesus foi trespassado na Cruz para que entrássemos no seu amor." },
  { category: "patristic", author: "Santo Afonso Maria de Ligório", source: "Via-Sacra", text: "Jesus carregou a Cruz para nos ensinar a carregar a nossa com paciência." },
  { category: "patristic", author: "São Francisco de Sales", source: "Tratado do amor de Deus", text: "A Cruz é o trono do amor; quem a abraça encontra a paz." },
  { category: "patristic", author: "Santo Inácio de Loyola", source: "Exercícios Espirituais", text: "Contemplar Cristo na Paixão é o caminho para unir a nossa vontade à sua." },
  { category: "patristic", author: "São Francisco de Assis", source: "Escritos", text: "Nada desejo senão seguir as pegadas do Senhor crucificado." },
  { category: "patristic", author: "Santa Catarina de Sena", source: "Diálogo", text: "O sangue de Cristo é a chave que abriu o céu para nós." },
  // Liturgia e oração
  { category: "liturgy", author: "Missal Romano", source: "Sexta-feira Santa", text: "Eis o madeiro da Cruz, do qual pendeu a salvação do mundo." },
  { category: "liturgy", author: "Liturgia das Horas", source: "Sexta-feira Santa", text: "Por sua santa Cruz remiu o mundo." },
  { category: "liturgy", author: "Missal Romano", source: "Via-Sacra", text: "Nós Vos adoramos, ó Cristo, e Vos bendizemos, porque pela vossa santa Cruz remistes o mundo." },
  { category: "liturgy", author: "Liturgia das Horas", source: "Salmos", text: "Perfuraram as minhas mãos e os meus pés; contaram todos os meus ossos." },
  { category: "liturgy", author: "Missal Romano", source: "Oração Eucarística", text: "Este é o Cálice do meu Sangue, derramado por vós e por todos para o perdão dos pecados." },
  { category: "liturgy", author: "Liturgia das Horas", source: "Antífona", text: "Cristo obedeceu até à morte, e morte de Cruz; por isso Deus O exaltou." },
  { category: "liturgy", author: "Missal Romano", source: "Sexta-feira Santa", text: "Povo meu, que te fiz eu? Em que te contristei? Responde-me." },
  { category: "liturgy", author: "Liturgia das Horas", source: "Sexta-feira Santa", text: "Santa Cruz, em ti está a vida; em ti está a vitória sobre a morte." },
  { category: "liturgy", author: "Missal Romano", source: "Prefácio da Paixão", text: "Pelo mistério da santa Cruz, o poder do inimigo foi vencido e a humanidade recebeu a salvação." },
  { category: "liturgy", author: "Liturgia das Horas", source: "Hino", text: "Cruz fiel, árvore única em nobreza; nenhuma floresta produziu igual." },
  // Mais Padres e místicos
  { category: "patristic", author: "Santo Agostinho", source: "Sermões", text: "Na Cruz, Cristo venceu o pecado e a morte; nela está a nossa esperança." },
  { category: "patristic", author: "São Gregório de Nissa", source: "Homilias", text: "A Paixão é o preço pago para nos libertar da escravidão do mal." },
  { category: "patristic", author: "São Basílio Magno", source: "Homilias", text: "Quem não toma a cruz e segue o Senhor não pode ser seu discípulo." },
  { category: "patristic", author: "São Cipriano", source: "Cartas", text: "O martírio imita a Paixão de Cristo; por isso a Igreja honra os mártires." },
  { category: "mystic", author: "Santa Teresa d'Ávila", source: "O Castelo Interior", text: "A alma que medita na Paixão encontra forças para todas as provações." },
  { category: "mystic", author: "São João da Cruz", source: "Subida do Monte Carmelo", text: "A Cruz não é fim em si; é o caminho para a luz." },
  { category: "patristic", author: "Santo Agostinho", source: "Enchiridion", text: "A morte de Cristo na Cruz é o sacrifício que nos reconciliou com o Pai." },
  { category: "patristic", author: "São João Crisóstomo", source: "Homilias", text: "Não há salvação senão pela Cruz; não há vida senão pela morte de Cristo." },
  { category: "scholastic", author: "São Tomás de Aquino", source: "Suma Teológica", text: "Na Paixão, Cristo satisfez por nossos pecados e nos mereceu a graça." },
  { category: "liturgy", author: "Missal Romano", source: "Sexta-feira Santa", text: "A Cruz é o sinal do amor infinito; nela o Senhor entregou a vida por nós." },
];
