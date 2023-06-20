import React, {  useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import styles from "../../styles/WorkspaceCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import { useHistory } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

function WorkspaceCreateForm() {
  const [errors, setErrors] = useState({});

  const [workspaceData, setWorkspaceData] = useState({
    title: "",
  });

  const { title } = workspaceData;

  const history = useHistory();

  const handleChange = (event) => {
    setWorkspaceData({
      ...workspaceData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("title", title);

    try {
      await axiosReq.post("/workspaces/", formData);
      history.push(`/`);
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  const textFields = (
    <div className="text-center">
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={title}
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
      <Button className={`${btnStyles.Button} ${btnStyles.Grey} `} type="submit">
        create
      </Button>
    </div>
  );

  return (
    <Row>
      <Col className="my-auto py-2 p-md-2" md={12}>
        <h1 className={styles.Header}>Create Workspace</h1>
        <Form onSubmit={handleSubmit}>
          <Container className={appStyles.Content}>{textFields}</Container>
        </Form>
      </Col>
    </Row>
  );
}

export default WorkspaceCreateForm;
