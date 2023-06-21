import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { axiosReq } from "../api/axiosDefaults";

function List({ list }) {
  const [showModal, setShowModal] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCreateCard = async () => {
    try {
      const response = await axiosReq.post("/cards/", {
        title: newCardTitle,
        list: list.id,
      });
      console.log("New card created:", response.data);
      // You can handle updating the card state here
      handleCloseModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className="list-card">
      <Card.Body>
        <Card.Title>{list.title}</Card.Title>
        {/* Render the cards here */}
      </Card.Body>
      <Card.Footer>
        <Button variant="primary" onClick={handleShowModal}>
          Add Card
        </Button>
      </Card.Footer>

      {/* Modal for creating a new card */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="cardTitle">
            <Form.Label>Card Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter card title"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateCard}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}

export default List;
