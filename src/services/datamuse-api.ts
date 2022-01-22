import { WordValidator } from "../utilities/types";

type Data = Word[];
type Word = {
  word: string;
  score: number;
  tags?: string[];
  defs?: string[];
};

class DatamuseApi implements WordValidator {
  async isAWord(word: string) {
    const definitions = await this.getDefinitions(word);
    return (definitions?.length ?? 0) > 0;
  }

  async getDefinitions(word: string) {
    const wordsInfo = await this.getWordsInfo({
      max: 5,
      spelledLike: word,
      metadata: {
        definitions: true,
      },
    });
    const matchingWordInfo = wordsInfo.find(
      (wordInfo) => wordInfo.word.toLowerCase() === word.toLowerCase()
    );
    return matchingWordInfo?.defs;
  }

  async getWordsInfo(options: {
    spelledLike?: string;
    max?: number;
    metadata?: Partial<{
      definitions: boolean;
      frequency: boolean;
    }>;
  }) {
    const url = new URL("https://api.datamuse.com/words");

    if (options.spelledLike) {
      url.searchParams.append("sp", options.spelledLike);
    }
    if (options.max) {
      url.searchParams.append("max", options.max.toString());
    }
    if (options.metadata) {
      let metadata = "";
      if (options.metadata.definitions) {
        metadata += "d";
      }
      if (options.metadata.frequency) {
        metadata += "f";
      }
      url.searchParams.append("md", metadata);
    }

    const response = await fetch(url.href);
    const data: Data = await response.json();

    const wordsInfo = data.map((wordInfo) => {
      const frequencyTag = wordInfo.tags?.find((tag) => tag.startsWith("f:"));
      const frequency = parseFloat(frequencyTag?.replace("f:", "") || "");

      return {
        ...wordInfo,
        frequency: isNaN(frequency) ? undefined : frequency,
      };
    });

    return wordsInfo;
  }
}

export const datamuseApi = new DatamuseApi();
