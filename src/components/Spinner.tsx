import spinner from "../assets/spinner.gif";

export const Spinner: React.FC<{ size: number }> = ({ size }) => {
  return (
    <img alt="loading" src={spinner} style={{ width: size, height: size }} />
  );
};
