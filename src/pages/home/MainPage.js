import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";

function MainPage() {
  const [workspaces, setWorkspaces] = useState([]);
  const currentUser = useContext(CurrentUserContext);

  useEffect(() => {
    const fetchWorkspaces = async (user) => {
      try {
        // Fetch workspaces and boards data
        const { data: workspaceData } = await axiosReq.get("/workspaces/");
        const { data: boardData } = await axiosReq.get("/boards/");

        if (!user) {
          console.log("The user is not collected properly: ", user);
          return;
        }

        // Filter user workspaces
        const userWorkspaces = workspaceData.results.filter(
          (workspace) => workspace.is_owner && workspace.owner === user.username
        );

        // Associate boards with their respective workspaces
        const userWorkspacesWithBoards = userWorkspaces.map((workspace) => {
          const boards = boardData.results.filter(
            (board) => board.workspace === workspace.id
          );
          return {
            ...workspace,
            boards: boards,
          };
        });

        setWorkspaces(userWorkspacesWithBoards);
      } catch (error) {
        console.log(error);
      }
    };

    fetchWorkspaces(currentUser);
  }, [currentUser]);

  const handleDeleteBoard = async (boardId) => {
    try {
      // Make the delete request to delete the current card
      await axiosReq.delete(`/boards/${boardId}`);
    } catch (error) {
      console.log(error);
      // ...handle error deleting the card
    }
  };

  return (
    <Container>
      <h1>My Workspaces</h1>
      {workspaces.map((workspace) => (
        <div key={workspace.id}>
          <h2>{workspace.title}</h2>
          {workspace.boards.length === 0 && <p>No boards assigned yet.</p>}
          <Row>
            {workspace.boards.map((board) => (
              <Col key={board.id} md={4}>
                <Card>
                  <Card.Img variant="top" src={board.image} />
                  <Card.Body>
                    <Card.Text>{board.title}</Card.Text>
                    <Link
                      to={`/boards/${board.id}`}
                      className="btn btn-outline-primary"
                    >
                      View
                    </Link>
                    <div>
                      <Link
                        to={`/boards/${board.id}/edit`}
                        className="btn btn-primary"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteBoard(board.id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </Container>
  );
}

export default MainPage;
