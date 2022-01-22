import { Provider } from "react-redux";
import TestRenderer from "react-test-renderer";
import store from "../store";
import Game from "./Game";

it("renders", () => {
  const tree = TestRenderer.create(
    <Provider store={store}>
      <Game answer={"HEART"} />
    </Provider>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
