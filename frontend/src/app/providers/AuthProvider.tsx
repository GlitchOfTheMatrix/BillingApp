import { AuthContextProvider } from "../../contexts/AuthContext";

interface Props {
  readonly children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}
