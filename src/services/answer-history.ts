export class AnswerHistory {
  answers: string[];
  key = "PREV_ANSWERS";
  maxLength = 100;

  constructor() {
    this.answers = this.load();
  }

  isAPrevAnswer(answer: string) {
    return this.answers.includes(answer);
  }

  addAnswer(answer: string) {
    this.answers.push(answer);
    this.answers = this.limitToMaxLength(this.answers);
    this.save(this.answers);
  }

  private limitToMaxLength(answers: string[]) {
    return answers.slice(Math.max(0, answers.length - this.maxLength));
  }

  private load() {
    try {
      const str_answers = window.sessionStorage.getItem(this.key);
      const answers = str_answers && JSON.parse(str_answers);
      if (Array.isArray(answers)) {
        return answers;
      }
    } catch (error) {
      console.log(error);
    }
    return [];
  }
  private save(answers: string[]) {
    window.sessionStorage.setItem(this.key, JSON.stringify(answers));
  }
}
