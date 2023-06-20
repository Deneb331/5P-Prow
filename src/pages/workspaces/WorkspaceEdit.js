import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useHistory, useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

function WorkspaceEdit() {
  const [errors, setErrors] = useState({});
  const [workspaceData, setWorkspaceData] = useState("");
  const [initialWorkspaceName, setInitialWorkspaceName] = useState("");
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      try {
        const { data } = await axiosReq.get(`/workspaces/${id}`);
        const { title, is_owner } = data;

        if (is_owner) {
          setWorkspaceData(title);
          setInitialWorkspaceName(title);
        } else {
          history.push("/");
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchWorkspaceData();
  }, [history, id]);

  const handleChange = (event) => {
    setWorkspaceData(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("title", workspaceData);

    try {
      await axiosReq.put(`/workspaces/${id}`, formData);
      history.push(`/`);
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await axiosReq.delete(`/workspaces/${id}`);
      history.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={12} className="d-none d-md-block p-0 p-md-2">
          <h1>Edit {initialWorkspaceName}</h1>
          <Container className={appStyles.Content}>
            <div className="text-center">
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={workspaceData}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors?.title?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
              <Button
                className={`${btnStyles.Button} ${btnStyles.Grey}`}
                onClick={() => history.goBack()}
              >
                cancel
              </Button>
              <Button
                className={`${btnStyles.Button} ${btnStyles.Grey}`}
                type="submit"
              >
                save
              </Button>
              <Button
                className={`${btnStyles.Button} ${btnStyles.Red}`}
                onClick={handleDelete}
              >
                delete
              </Button>
            </div>
          </Container>
        </Col>
      </Row>
    </Form>
  );
}

export default WorkspaceEdit;
