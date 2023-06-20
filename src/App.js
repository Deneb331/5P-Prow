import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import WorkspaceCreateForm from "./pages/workspaces/WorkspaceCreateForm";
import BoardCreateForm from "./pages/boards/BoardCreateForm";
import BoardEdit from "./pages/boards/BoardEdit";
import BoardPage from "./pages/boards/BoardPage";
import WorkspaceEdit from "./pages/workspaces/WorkspaceEdit";
import MainPage from "./pages/home/MainPage";
import { CurrentUserProvider } from "./contexts/CurrentUserContext";

function App() {
  return (
    <CurrentUserProvider>
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route exact path="/" render={() => <MainPage/>} />
          <Route exact path="/signin" render={() => <SignInForm />} />
          <Route exact path="/signup" render={() => <SignUpForm />} />
          <Route exact path="/workspaces/create" render={() => <WorkspaceCreateForm/>} />
          <Route exact path="/workspaces/:id" render={() => <WorkspaceEdit/>} />
          <Route exact path="/boards/create" render={() => <BoardCreateForm/>} />
          <Route exact path="/boards/:id" render={() => <BoardPage/>} />
          <Route exact path="/boards/:id/edit" render={() => <BoardEdit/>} />
          <Route render={() => <p>Page not found!</p>} />
        </Switch>
      </Container>
    </div>
    </CurrentUserProvider>
  );
}

export default App;