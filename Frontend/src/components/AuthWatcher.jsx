import useAuthCheck from "../hooks/useAuthCheck";

const AuthWatcher = ({ children }) => {
  useAuthCheck(); 
  return children;
};

export default AuthWatcher;