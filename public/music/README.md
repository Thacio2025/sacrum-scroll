# Músicas Litúrgicas

Esta pasta é para armazenar arquivos de áudio locais que serão usados no SacrumScroll.

## Formatos Suportados

- MP3 (recomendado)
- OGG
- WAV
- M4A

## Como Adicionar Músicas

1. Coloque seus arquivos de áudio nesta pasta (`public/music/`)
2. Edite o arquivo `src/data/music-pool.ts` e adicione as músicas:

```typescript
{
  id: "nome-unico",
  title: "Nome da Música",
  artist: "Artista",
  url: "/music/seu-arquivo.mp3", // Caminho relativo a partir de public/
  category: "gregorian", // ou "polyphonic", "hymn", "meditation", "liturgical"
}
```

## Fontes de Músicas Litúrgicas

- **Archive.org**: Muitas gravações de domínio público de canto gregoriano
- **YouTube**: Use ferramentas de conversão (respeitando direitos autorais)
- **Spotify/SoundCloud**: Links diretos quando disponíveis
- **Sua própria biblioteca**: Arquivos locais nesta pasta

## Nota Legal

Certifique-se de ter os direitos para usar qualquer música que adicionar ao projeto. Prefira músicas de domínio público ou com licenças apropriadas.
