import React, { useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import moment from "moment";

function CardComponent({ cardId, lists }) {
  const [card, setCard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cardTitle, setCardTitle] = useState("");
  const [cardContent, setCardContent] = useState("");
  const [cardList, setCardList] = useState("");
  const [cardDueTime, setCardDueTime] = useState("");
  const [cardPriorityColor, setCardPriorityColor] = useState(0);
  const [cardFile, setCardFile] = useState(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await axiosReq.get(`/cards/${cardId}`);
        setCard(response.data);
        setCardTitle(response.data.title);
        setCardContent(response.data.content);
        setCardList(response.data.list);
        setCardDueTime(response.data.due_time);
        setCardPriorityColor(response.data.priority_color);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCard();
  }, [cardId]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleEditClick = () => {
    handleShowModal();
  };

  const handleUpdateCard = async () => {
    const updatedCard = {
      title: cardTitle,
      content: cardContent,
      list: cardList,
      due_time: cardDueTime,
      priority_color: cardPriorityColor,
      file: cardFile,
    };
    const newDate = new Date(cardDueTime).toISOString();
    updatedCard.due_time = newDate;

    try {
      await axiosReq.put(`/cards/${cardId}`, updatedCard);
      // ...handle successful card creation
    } catch (error) {
      console.log(error);
      console.log(error.response.data);
    }

    handleCloseModal();
  };

  const handleFileChange = (e) => {
    setCardFile(e.target.files[0]);
  };

  if (!card) {
    return <div>Loading...</div>;
  }

  const { title, owner, content, priority_color, due_time, file } = card;

  return (
    <Card>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Owner: {owner}
        </Card.Subtitle>
        <Card.Text>{content}</Card.Text>
        <Card.Text>Priority: {priority_color}</Card.Text>
        <Card.Text>Due Time: {due_time}</Card.Text>
        <Card.Text>File: {file}</Card.Text>
        <Button variant="primary" onClick={handleEditClick}>
          Edit
        </Button>
      </Card.Body>

      {/* Modal for editing the card */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="cardTitle">
            <Form.Label>Card Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter card title"
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="cardContent">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter card content"
              value={cardContent}
              onChange={(e) => setCardContent(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="cardList">
            <Form.Label>List</Form.Label>
            <Form.Control
              as="select"
              value={cardList}
              onChange={(e) => setCardList(e.target.value)}
            >
              {lists.map((list) => (
                <option value={list.id} key={list.id}>
                  {list.title}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="cardDueTime">
            <Form.Label>Due Time</Form.Label>
            <Form.Control
              type="date"
              value={cardDueTime ? moment(cardDueTime).format("YYYY-MM-DD") : ""}

              onChange={(e) => setCardDueTime(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="cardPriorityColor">
            <Form.Label>Priority Color</Form.Label>
            <Form.Control
              as="select"
              value={cardPriorityColor}
              onChange={(e) => setCardPriorityColor(e.target.value)}
            >
              <option value={0}>Low</option>
              <option value={1}>Medium</option>
              <option value={2}>High</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="cardFile">
            <Form.Label>Upload File</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateCard}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}

export default CardComponent;
