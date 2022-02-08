import { getRandomGenerator } from "./random";

// Copy the global Math object in order to reset it
const mathCopy = Object.create(global.Math);
const resetMockRandom = () => {
  global.Math = mathCopy;
};

// Through a copy of the global Math object we mock the random method
const mockRandom = (randomMock: () => number) => {
  const mockMath = Object.create(global.Math);
  mockMath.random = randomMock;
  global.Math = mockMath;
};

// When mockRandomWith is called it create the mock beforeEach and reset it after
export const mockRandomForEach = (seed: string) => {
  const getRand = getRandomGenerator(seed);

  beforeEach(() => {
    mockRandom(getRand);
  });
  afterEach(() => {
    resetMockRandom();
  });
};
