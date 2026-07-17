

export interface Cue {
  text: string;
  start: number;
  end: number;
}

export function generateCues(text: string, startTime: number, duration: number): Cue[] {
  const words = text.split(/\s+/).filter(w => w.trim().length > 0);
  const cards: string[] = [];
  
  let currentCard: string[] = [];
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    currentCard.push(word);
    
    const hasPunctuation = /[.,?]/.test(word);
    const length = currentCard.length;
    
    if ((length >= 6 && hasPunctuation) || length >= 10) {
      cards.push(currentCard.join(" "));
      currentCard = [];
    }
  }
  
  if (currentCard.length > 0) {
    cards.push(currentCard.join(" "));
  }

  const totalWords = words.length;
  let currentTime = startTime;
  
  return cards.map(cardText => {
    const cardWords = cardText.split(/\s+/).length;
    const cardDuration = (cardWords / totalWords) * duration;
    
    const cue: Cue = {
      text: cardText,
      start: currentTime,
      end: currentTime + cardDuration
    };
    
    currentTime += cardDuration;
    return cue;
  });
}

